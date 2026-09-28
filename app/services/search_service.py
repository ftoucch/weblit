import json
import logging
import asyncio
import base64
import uuid
from typing import AsyncGenerator

from sqlalchemy import select

from app.db.postgres import AsyncSessionLocal
from app.models.orm import Paper
from app.core.config import config
from app.models.paper import FetchedPaper
from app.schemas.paper import (
    PaperSearchRequest,
    PaperSearchContinueRequest,
    PaperSearchResult,
    PaperSource,
    AuthorResponse,
)
from app.services.embedding_service import embedding_service
from app.services.ingestion_service import ingestion_service
from app.services.fulltext_ingestion_service import fulltext_ingestion_service
from app.services.sources.openalex import openalex_source
from app.services.sources.base import BaseSource

logger = logging.getLogger(__name__)

PAGE_SIZE = 20

SOURCES: dict[PaperSource, BaseSource] = {
    PaperSource.OPENALEX: openalex_source,
}


async def ingest_and_index(papers: list[FetchedPaper]) -> None:
    try:
        stored = await ingestion_service.ingest(papers)
        fulltext_rows = [p for p in stored if p.has_full_text]
        if fulltext_rows:
            indexed = await fulltext_ingestion_service.index_batch(fulltext_rows)
            logger.info(f"Fulltext indexed {indexed} papers in background.")
    except Exception as e:
        logger.error(f"Background ingest failed: {e}")


def _encode_cursor(state: dict) -> str:
    return base64.urlsafe_b64encode(json.dumps(state).encode()).decode()


def _decode_cursor(token: str) -> dict:
    return json.loads(base64.urlsafe_b64decode(token.encode()).decode())


class SearchService:

    def _to_result(
        self,
        paper: Paper,
        similarity_score: float,
        meets_inclusion: bool | None = None,
        meets_exclusion: bool | None = None,
    ) -> PaperSearchResult:
        return PaperSearchResult(
            id=str(paper.id),
            title=paper.title,
            abstract=paper.abstract,
            authors=[
                AuthorResponse(name=a.get("name", ""), institution=a.get("institution"))
                for a in (paper.authors or [])
            ],
            year=paper.year,
            field_of_study=paper.field_of_study,
            source=PaperSource(paper.source or PaperSource.OPENALEX.value),
            source_url=paper.source_url,
            doi=paper.doi,
            citation_count=paper.citation_count,
            has_full_text=paper.has_full_text,
            similarity_score=round(similarity_score, 4),
            meets_inclusion=meets_inclusion,
            meets_exclusion=meets_exclusion,
        )

    async def _embed_criteria(
        self,
        inclusion_criteria: str | None,
        exclusion_criteria: str | None,
    ) -> dict[str, list[float]]:
        criteria_vectors: dict[str, list[float]] = {}
        texts, keys = [], []

        if inclusion_criteria:
            texts.append(inclusion_criteria)
            keys.append("inclusion")
        if exclusion_criteria:
            texts.append(exclusion_criteria)
            keys.append("exclusion")

        if texts:
            vectors = await embedding_service.embed_batch(texts)
            criteria_vectors = dict(zip(keys, vectors))

        return criteria_vectors

    def _check_criteria(
        self,
        paper_vector: list[float],
        criteria_vectors: dict[str, list[float]],
        inclusion_criteria: str | None,
        exclusion_criteria: str | None,
    ) -> tuple[bool | None, bool | None]:
        meets_inclusion = None
        meets_exclusion = None

        if inclusion_criteria and "inclusion" in criteria_vectors:
            score = sum(a * b for a, b in zip(paper_vector, criteria_vectors["inclusion"]))
            meets_inclusion = score >= 0.4

        if exclusion_criteria and "exclusion" in criteria_vectors:
            score = sum(a * b for a, b in zip(paper_vector, criteria_vectors["exclusion"]))
            meets_exclusion = score >= 0.4

        return meets_inclusion, meets_exclusion

    async def _search_cache(
        self,
        query_vector: list[float],
        request: PaperSearchRequest,
        offset: int = 0,
    ) -> tuple[list[tuple[Paper, float]], int]:
        max_distance = 1 - request.min_similarity

        async with AsyncSessionLocal() as session:
            distance_expr = Paper.abstract_embedding.cosine_distance(query_vector)
            stmt = (
                select(Paper, distance_expr.label("distance"))
                .where(Paper.abstract_embedding.is_not(None))
                .where(distance_expr <= max_distance)
            )
            if request.year_from:
                stmt = stmt.where(Paper.year >= request.year_from)
            if request.year_to:
                stmt = stmt.where(Paper.year <= request.year_to)

            stmt = stmt.order_by(distance_expr).limit(PAGE_SIZE).offset(offset)

            result = await session.execute(stmt)
            rows = result.all()

        results = [(paper, 1 - distance) for paper, distance in rows]
        next_offset = offset + len(rows)
        return results, next_offset

    async def search_stream(
        self,
        request: PaperSearchRequest,
        on_new_papers=None,
    ) -> AsyncGenerator[dict, None]:
        total = 0
        cached_count = 0
        new_count = 0

        try:
            query_vector, criteria_vectors = await asyncio.gather(
                embedding_service.embed(request.query),
                self._embed_criteria(
                    request.inclusion_criteria,
                    request.exclusion_criteria,
                ),
            )

            cached_results, next_offset = await self._search_cache(query_vector, request, offset=0)

            for paper, score in cached_results:
                meets_inclusion, meets_exclusion = self._check_criteria(
                    paper.abstract_embedding, criteria_vectors,
                    request.inclusion_criteria, request.exclusion_criteria,
                )
                result = self._to_result(paper, score, meets_inclusion, meets_exclusion)
                yield {"type": "result", "paper": result.model_dump(), "cached": True}
                total += 1
                cached_count += 1

            seen_dois = {paper.doi for paper, _ in cached_results if paper.doi}
            seen_source_ids = {f"{paper.source}:{paper.source_id}" for paper, _ in cached_results}

            new_to_ingest: list[FetchedPaper] = []

            for source in request.sources:
                connector = SOURCES.get(source)
                if not connector:
                    logger.warning(f"Source '{source}' not registered — skipping.")
                    continue

                async for page in connector.fetch_pages(
                    query=request.query,
                    max_results=request.limit,
                    year_from=request.year_from,
                    year_to=request.year_to,
                    field_of_study=request.field_of_study,
                ):
                    for paper in page:
                        if total >= request.limit:
                            break
                        if paper.doi and paper.doi in seen_dois:
                            continue
                        key = f"{paper.source}:{paper.source_id}"
                        if key in seen_source_ids:
                            continue

                        paper_text = f"{paper.title}. {paper.abstract}" if paper.abstract else paper.title
                        paper_vector = await embedding_service.embed(paper_text)
                        score = sum(a * b for a, b in zip(query_vector, paper_vector))

                        if score < request.min_similarity:
                            continue

                        meets_inclusion, meets_exclusion = self._check_criteria(
                            paper_vector, criteria_vectors,
                            request.inclusion_criteria, request.exclusion_criteria,
                        )

                        paper.id = str(uuid.uuid4())

                        result = PaperSearchResult(
                            id=paper.id,
                            title=paper.title,
                            abstract=paper.abstract,
                            authors=[
                                AuthorResponse(name=a.name, institution=a.institution)
                                for a in paper.authors
                            ],
                            year=paper.year,
                            field_of_study=paper.field_of_study,
                            source=PaperSource(paper.source),
                            source_url=paper.source_url,
                            doi=paper.doi,
                            citation_count=paper.citation_count,
                            has_full_text=paper.has_full_text,
                            similarity_score=round(score, 4),
                            meets_inclusion=meets_inclusion,
                            meets_exclusion=meets_exclusion,
                        )

                        yield {"type": "result", "paper": result.model_dump(), "cached": False}
                        total += 1
                        new_count += 1

                        new_to_ingest.append(paper)
                        if paper.doi:
                            seen_dois.add(paper.doi)
                        seen_source_ids.add(key)

                    if total >= request.limit:
                        break

            if new_to_ingest:
                if on_new_papers is not None:
                    on_new_papers(new_to_ingest)
                else:
                    await ingest_and_index(new_to_ingest)

            if next_offset > 0:
                state = {
                    "query": request.query,
                    "query_vector": query_vector,
                    "offset": next_offset,
                    "year_from": request.year_from,
                    "year_to": request.year_to,
                    "field_of_study": request.field_of_study,
                    "sources": [s.value for s in request.sources],
                    "min_similarity": request.min_similarity,
                    "limit": request.limit,
                }
                cursor_token = _encode_cursor(state)
            else:
                cursor_token = None

            yield {
                "type": "done",
                "total": total,
                "cached": cached_count,
                "new": new_count,
                "cursor": cursor_token,
                "has_more": next_offset > 0 and total >= request.limit,
            }

        except Exception as e:
            logger.error(f"Search stream error: {e}")
            yield {"type": "error", "message": str(e)}

    async def continue_stream(
        self,
        request: PaperSearchContinueRequest,
    ) -> AsyncGenerator[dict, None]:
        total = 0

        try:
            try:
                state = _decode_cursor(request.cursor)
            except Exception:
                yield {"type": "error", "message": "Cursor expired or invalid. Please search again."}
                return

            criteria_vectors = await self._embed_criteria(
                request.inclusion_criteria,
                request.exclusion_criteria,
            )

            query_vector = state["query_vector"]
            offset = state["offset"]

            search_req = PaperSearchRequest(
                query=state["query"],
                year_from=state.get("year_from"),
                year_to=state.get("year_to"),
                field_of_study=state.get("field_of_study"),
                sources=[PaperSource(s) for s in state.get("sources", ["openalex"])],
                min_similarity=state.get("min_similarity", 0.5),
                limit=state.get("limit", 20),
            )

            cached_results, next_offset = await self._search_cache(
                query_vector, search_req, offset=offset
            )

            for paper, score in cached_results:
                meets_inclusion, meets_exclusion = self._check_criteria(
                    paper.abstract_embedding, criteria_vectors,
                    request.inclusion_criteria, request.exclusion_criteria,
                )
                result = self._to_result(paper, score, meets_inclusion, meets_exclusion)
                yield {"type": "result", "paper": result.model_dump(), "cached": True}
                total += 1

            if next_offset > offset:
                state["offset"] = next_offset
                cursor_token = _encode_cursor(state)
            else:
                cursor_token = None

            yield {
                "type": "done",
                "total": total,
                "cursor": cursor_token,
                "has_more": cursor_token is not None and total >= state.get("limit", PAGE_SIZE),
            }

        except Exception as e:
            logger.error(f"Continue stream error: {e}")
            yield {"type": "error", "message": str(e)}


search_service = SearchService()
