import logging
import asyncio
from typing import AsyncGenerator
from bson import ObjectId
from qdrant_client.models import Filter, FieldCondition, Range

from app.db.mongo import mongo_db
from app.db.qdrant import get_qdrant
from app.core.config import config
from app.models.paper import PaperDocument
from app.schemas.paper import (
    PaperSearchRequest,
    PaperSearchResult,
    PaperSource,
    AuthorResponse,
)
from app.services.embedding_service import embedding_service
from app.services.ingestion_service import ingestion_service
from app.services.sources.openalex import openalex_source
from app.services.sources.base import BaseSource
from app.workers.tasks.indexing_tasks import ingest_papers_task

logger = logging.getLogger(__name__)

SOURCES: dict[PaperSource, BaseSource] = {
    PaperSource.OPENALEX: openalex_source,
}


class SearchService:

    @property
    def papers(self):
        return mongo_db.collections["papers"] #type: ignore

    def _to_result(
        self,
        doc: dict,
        similarity_score: float,
        meets_inclusion: bool | None = None,
        meets_exclusion: bool | None = None,
    ) -> PaperSearchResult:
        return PaperSearchResult(
            id=str(doc.get("_id", "")),
            title=doc.get("title", ""),
            abstract=doc.get("abstract"),
            authors=[
                AuthorResponse(
                    name=a.get("name", ""),
                    institution=a.get("institution")
                )
                for a in doc.get("authors", [])
            ],
            year=doc.get("year"),
            field_of_study=doc.get("field_of_study"),
            source=PaperSource(doc.get("source", PaperSource.OPENALEX.value)),
            source_url=doc.get("source_url"),
            doi=doc.get("doi"),
            citation_count=doc.get("citation_count"),
            has_full_text=doc.get("has_full_text", False),
            similarity_score=round(similarity_score, 4),
            meets_inclusion=meets_inclusion,
            meets_exclusion=meets_exclusion,
        )


    async def _check_criteria(
        self,
        paper_vector: list[float],
        inclusion_criteria: str | None,
        exclusion_criteria: str | None,
    ) -> tuple[bool | None, bool | None]:
        meets_inclusion = None
        meets_exclusion = None

        if inclusion_criteria:
            inclusion_vector = await embedding_service.embed(inclusion_criteria)
            score = sum(a * b for a, b in zip(paper_vector, inclusion_vector))
            meets_inclusion = score >= 0.4

        if exclusion_criteria:
            exclusion_vector = await embedding_service.embed(exclusion_criteria)
            score = sum(a * b for a, b in zip(paper_vector, exclusion_vector))
            meets_exclusion = score >= 0.4

        return meets_inclusion, meets_exclusion

    # Qdrant cache

    async def _search_cache(
        self,
        query_vector: list[float],
        request: PaperSearchRequest,
    ) -> list[tuple[dict, float]]:
        qdrant = get_qdrant()

        qdrant_filter = None
        if request.year_from or request.year_to:
            conditions = []
            if request.year_from:
                conditions.append(
                    FieldCondition(key="year", range=Range(gte=request.year_from))
                )
            if request.year_to:
                conditions.append(
                    FieldCondition(key="year", range=Range(lte=request.year_to))
                )
            qdrant_filter = Filter(must=conditions)

        response = await qdrant.query_points(
            collection_name=config.qdrant_collection,
            query=query_vector,
            limit=request.limit,
            score_threshold=request.min_similarity,
            query_filter=qdrant_filter,
        )
        hits = response.points

        if not hits:
            return []

        mongo_ids = [
            ObjectId(hit.payload["mongo_id"])
            for hit in hits
            if hit.payload and hit.payload.get("mongo_id")
        ]
        score_map = {
            hit.payload["mongo_id"]: hit.score
            for hit in hits
            if hit.payload and hit.payload.get("mongo_id")
        }

        cursor = self.papers.find({"_id": {"$in": mongo_ids}})
        docs = await cursor.to_list(length=request.limit)

        return [(doc, score_map[str(doc["_id"])]) for doc in docs]

    # Fresh fetch from sources

    async def _fetch_from_sources(
        self,
        request: PaperSearchRequest,
    ) -> list[PaperDocument]:
        tasks = []
        for source in request.sources:
            connector = SOURCES.get(source)
            if not connector:
                logger.warning(f"Source '{source}' not registered — skipping.")
                continue
            tasks.append(connector.fetch(
                query=request.query,
                limit=request.limit,
                year_from=request.year_from,
                year_to=request.year_to,
                field_of_study=request.field_of_study,
            ))

        if not tasks:
            return []

        results = await asyncio.gather(*tasks, return_exceptions=True)

        papers: list[PaperDocument] = []
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Source fetch failed: {result}")
                continue
            if isinstance(result, list):
                papers.extend(result)

        return papers

    # Main streaming method

    async def search_stream(
        self,
        request: PaperSearchRequest,
    ) -> AsyncGenerator[dict, None]:
        """
        Yields events as results become available:
            { "type": "result", "paper": {...}, "cached": bool }
            { "type": "done",   "total": int, "cached": int, "new": int }
            { "type": "error",  "message": str }
        """
        total = 0
        cached_count = 0
        new_count = 0

        try:
            query_vector = await embedding_service.embed(request.query)

            cached_results = await self._search_cache(query_vector, request)

            for doc, score in cached_results:
                paper_text = f"{doc.get('title', '')}. {doc.get('abstract', '')}"
                paper_vector = await embedding_service.embed(paper_text)

                meets_inclusion, meets_exclusion = await self._check_criteria(
                    paper_vector,
                    request.inclusion_criteria,
                    request.exclusion_criteria,
                )

                result = self._to_result(doc, score, meets_inclusion, meets_exclusion)
                yield {"type": "result", "paper": result.model_dump(), "cached": True}
                total += 1
                cached_count += 1

            fresh_papers = await self._fetch_from_sources(request)

            seen_dois = {
                doc.get("doi") for doc, _ in cached_results if doc.get("doi")
            }
            seen_source_ids = {
                f"{doc.get('source')}:{doc.get('source_id')}"
                for doc, _ in cached_results
            }

            new_to_ingest: list[PaperDocument] = []

            for paper in fresh_papers:
                if total >= request.limit:
                    break
                if paper.doi and paper.doi in seen_dois:
                    continue
                key = f"{paper.source}:{paper.source_id}"
                if key in seen_source_ids:
                    continue

                # embed and score against query
                paper_text = f"{paper.title}. {paper.abstract}" if paper.abstract else paper.title
                paper_vector = await embedding_service.embed(paper_text)
                score = sum(a * b for a, b in zip(query_vector, paper_vector))

                if score < request.min_similarity:
                    continue

                meets_inclusion, meets_exclusion = await self._check_criteria(
                    paper_vector,
                    request.inclusion_criteria,
                    request.exclusion_criteria,
                )

                result = PaperSearchResult(
                    id=str(paper.id),
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

            # background ingestion
            if new_to_ingest:
                try:
                    paper_dicts = [
                        p.model_dump(by_alias=True, mode="json")
                        for p in new_to_ingest
                    ]
                    ingest_papers_task.delay(paper_dicts)  # type: ignore
                    logger.info(f"Fired background ingestion for {len(new_to_ingest)} papers.")
                except ImportError:
                    # fallback — ingest directly if worker not available
                    await ingestion_service.ingest(new_to_ingest)
            yield {
                "type": "done",
                "total": total,
                "cached": cached_count,
                "new": new_count,
            }

        except Exception as e:
            logger.error(f"Search stream error: {e}")
            yield {"type": "error", "message": str(e)}


search_service = SearchService()