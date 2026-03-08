import logging
import httpx

from app.models.paper import PaperDocument, AuthorDocument
from app.services.sources.base import BaseSource
from app.core.config import config

logger = logging.getLogger(__name__)

OPENALEX_BASE_URL = "https://api.openalex.org"

class OpenAlexSource(BaseSource):

    @property
    def source_name(self) -> str:
        return "openalex"
    
    def _build_params(
        self,
        query: str,
        limit: int,
        year_from: int | None,
        year_to: int | None,
        field_of_study: str | None,
    )-> dict:
        params: dict = {
            "search": query,
            "per-page": min(limit, 50),
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

        if year_from and year_to:
            params["filter"] = f"publication_year: {year_from} -- {year_to} "
        elif year_from:
            params["filter"] = f"publication_year:{year_from}-"
        elif year_to:
            params["filter"] = f"publication_year:-{year_to}"

        if field_of_study:
            field_filter = f"primary_topic.field.display_name.search:{field_of_study}"
            if "filter" in params:
                params["filter"] += f",{field_filter}"
            else:
                params["filter"] = field_filter

        return params
    
    def _reconstruct_abstract(self, inverted_index: dict | None) -> str | None:
         """
        OpenAlex stores abstracts as an inverted index:
        { "word": [position1, position2], ... }
        We reconstruct the original abstract from it.
        """
         
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
        
    def _parse_authors(self, authorships: list)->list[AuthorDocument]:
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
        """Strip the URL prefix from DOI if present."""
        if not raw_doi:
            return None
        return raw_doi.replace("https://doi.org/", "").strip()


    def _to_document(self, raw: dict) -> PaperDocument | None:
        """Convert a raw OpenAlex API result to a PaperDocument."""
        try:
            title = raw.get("title")
            if not title:
                return None

            source_url = None
            primary_location = raw.get("primary_location") or {}
            landing_page = primary_location.get("landing_page_url")
            source_url = landing_page or raw.get("id") 

            # check if full text is available via open access
            open_access = raw.get("open_access", {})
            oa_url = open_access.get("oa_url")
            has_full_text = bool(oa_url)

            return PaperDocument(
                title=title,
                abstract=self._reconstruct_abstract(
                    raw.get("abstract_inverted_index")
                ),
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
            )
        except Exception as e:
            logger.warning(f"Failed to parse OpenAlex result: {e}")
            return None


    async def fetch(
        self,
        query: str,
        limit: int,
        year_from: int | None = None,
        year_to: int | None = None,
        field_of_study: str | None = None,
    ) -> list[PaperDocument]:

        params = self._build_params(query, limit, year_from, year_to, field_of_study)

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.get(
                    f"{OPENALEX_BASE_URL}/works",
                    params=params
                )
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as e:
            logger.error(f"OpenAlex fetch failed: {e}")
            return []

        results = data.get("results", [])
        papers = [self._to_document(r) for r in results]

        valid = [p for p in papers if p is not None]

        logger.info(f"OpenAlex returned {len(valid)} papers for query: '{query}'")
        return valid


openalex_source = OpenAlexSource() 