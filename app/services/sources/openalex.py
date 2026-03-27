import logging
from math import ceil
from typing import AsyncGenerator

import httpx

from app.models.paper import PaperDocument, AuthorDocument
from app.services.sources.base import BaseSource
from app.core.config import config

logger = logging.getLogger(__name__)

OPENALEX_BASE_URL = "https://api.openalex.org"
PAGE_SIZE = 50


class OpenAlexSource(BaseSource):

    @property
    def source_name(self) -> str:
        return "openalex"

    def _build_params(
        self,
        query: str,
        page: int,
        year_from: int | None,
        year_to: int | None,
        field_of_study: str | None,
    ) -> dict:
        params: dict = {
            "search": query,
            "per-page": PAGE_SIZE,
            "page": page,
            "select": ",".join([
                "id",
                "title",
                "abstract_inverted_index",
                "authorships",
                "publication_year",
                "primary_topic",
                "doi",
                "primary_location",
                "cited_by_count",
                "open_access",
            ]),
            "sort": "relevance_score:desc",
        }

        if config.openalex_email:
            params["mailto"] = config.openalex_email

        filters = []

        if year_from and year_to:
            filters.append(f"publication_year:{year_from}-{year_to}")
        elif year_from:
            filters.append(f"publication_year:{year_from}-")
        elif year_to:
            filters.append(f"publication_year:-{year_to}")

        if field_of_study:
            filters.append(f"primary_topic.field.display_name.search:{field_of_study}")

        if filters:
            params["filter"] = ",".join(filters)

        return params

    def _reconstruct_abstract(self, inverted_index: dict | None) -> str | None:
        if not inverted_index:
            return None
        try:
            positions: dict[int, str] = {}
            for word, indices in inverted_index.items():
                for idx in indices:
                    positions[idx] = word
            return " ".join(positions[i] for i in sorted(positions))
        except Exception:
            return None

    def _parse_authors(self, authorships: list) -> list[AuthorDocument]:
        authors = []
        for authorship in authorships:
            author = authorship.get("author", {})
            name = author.get("display_name")
            if not name:
                continue
            institutions = authorship.get("institutions", [])
            institution = institutions[0].get("display_name") if institutions else None
            authors.append(AuthorDocument(name=name, institution=institution))
        return authors

    def _parse_doi(self, raw_doi: str | None) -> str | None:
        if not raw_doi:
            return None
        return raw_doi.replace("https://doi.org/", "").strip()

    def _to_document(self, raw: dict) -> PaperDocument | None:
        try:
            title = raw.get("title")
            if not title:
                return None

            primary_location = raw.get("primary_location") or {}
            landing_page = primary_location.get("landing_page_url")
            source_url = landing_page or raw.get("id")

            open_access = raw.get("open_access", {})
            oa_url = open_access.get("oa_url")
            has_full_text = bool(oa_url)

            return PaperDocument(
                title=title,
                abstract=self._reconstruct_abstract(raw.get("abstract_inverted_index")),
                authors=self._parse_authors(raw.get("authorships", [])),
                year=raw.get("publication_year"),
                field_of_study=(
                    (raw.get("primary_topic") or {})
                    .get("field", {})
                    .get("display_name")
                ),
                doi=self._parse_doi(raw.get("doi")),
                source_url=source_url,
                citation_count=raw.get("cited_by_count"),
                source=self.source_name,
                source_id=raw["id"],
                has_full_text=has_full_text,
                full_text_source="core" if has_full_text else None,
                oa_url=oa_url if has_full_text else None,
            )
        except Exception as e:
            logger.warning(f"Failed to parse OpenAlex result: {e}")
            return None

    async def _fetch_page(
        self,
        client: httpx.AsyncClient,
        query: str,
        page: int,
        year_from: int | None,
        year_to: int | None,
        field_of_study: str | None,
    ) -> tuple[list[PaperDocument], int]:
        params = self._build_params(query, page, year_from, year_to, field_of_study)
        try:
            response = await client.get(f"{OPENALEX_BASE_URL}/works", params=params)
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPError as e:
            logger.error(f"OpenAlex page {page} fetch failed: {e}")
            return [], 0

        total_count = data.get("meta", {}).get("count", 0)
        results = data.get("results", [])
        papers = [self._to_document(r) for r in results]
        valid = [p for p in papers if p is not None]

        return valid, total_count

    async def fetch_pages(
        self,
        query: str,
        max_results: int,
        year_from: int | None = None,
        year_to: int | None = None,
        field_of_study: str | None = None,
    ) -> AsyncGenerator[list[PaperDocument], None]:
        async with httpx.AsyncClient(timeout=30) as client:
            first_page, total_count = await self._fetch_page(
                client, query, 1, year_from, year_to, field_of_study
            )

            if not first_page:
                return

            yield first_page

            remaining = min(max_results, total_count) - len(first_page)
            if remaining <= 0:
                return

            total_pages = min(ceil(max_results / PAGE_SIZE), ceil(total_count / PAGE_SIZE))

            for page in range(2, total_pages + 1):
                papers, _ = await self._fetch_page(
                    client, query, page, year_from, year_to, field_of_study
                )
                if not papers:
                    break
                yield papers
                logger.info(f"OpenAlex page {page}/{total_pages} — {len(papers)} papers")

    async def fetch(
        self,
        query: str,
        limit: int,
        year_from: int | None = None,
        year_to: int | None = None,
        field_of_study: str | None = None,
    ) -> list[PaperDocument]:
        papers: list[PaperDocument] = []
        async for page in self.fetch_pages(
            query=query,
            max_results=limit,
            year_from=year_from,
            year_to=year_to,
            field_of_study=field_of_study,
        ):
            papers.extend(page)
            if len(papers) >= limit:
                break
        return papers[:limit]


openalex_source = OpenAlexSource()