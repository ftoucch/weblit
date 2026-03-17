import json
import logging
import asyncio
import base64
from typing import AsyncGenerator
from bson import ObjectId
from qdrant_client.models import Filter, FieldCondition, Range

from app.db.mongo import mongo_db
from app.db.qdrant import get_qdrant
from app.db.redis import redis_client
from app.core.config import config
from app.models.paper import PaperDocument
from app.schemas.paper import (
    PaperSearchRequest,
    PaperSearchContinueRequest,
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

CURSOR_TTL    = 3600
PAGE_SIZE     = 20

SOURCES: dict[PaperSource, BaseSource] = {
    PaperSource.OPENALEX: openalex_source,
}


def _serialize_for_celery(p: PaperDocument) -> dict:
    d = p.model_dump(by_alias=True)
    d["_id"] = str(d["_id"])
    return d


def _encode_cursor(data: dict) -> str:
    return base64.urlsafe_b64encode(json.dumps(data).encode()).decode()


def _decode_cursor(token: str) -> dict:
    return json.loads(base64.urlsafe_b64decode(token.encode()).decode())


class SearchService:

    @property
    def papers(self):
        return mongo_db.collections["papers"]  # type: ignore

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
    ) -> tuple[list[tuple[dict, float, list[float]]], int]:
        qdrant = get_qdrant()

        qdrant_filter = None
        if request.year_from or request.year_to:
            conditions = []
            if request.year_from:
                conditions.append(FieldCondition(key="year", range=Range(gte=request.year_from)))
            if request.year_to:
                conditions.append(FieldCondition(key="year", range=Range(lte=request.year_to)))
            qdrant_filter = Filter(must=conditions)

        response = await qdrant.query_points(
            collection_name=config.qdrant_collection,
            query=query_vector,
            limit=PAGE_SIZE,
            offset=offset,
            score_threshold=request.min_similarity,
            query_filter=qdrant_filter,
            with_payload=True,
        )
        hits = response.points

        if not hits:
            return [], offset

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
        vector_map = {
            hit.payload["mongo_id"]: hit.payload.get("vector", [])
            for hit in hits
            if hit.payload and hit.payload.get("mongo_id")
        }

        cursor = self.papers.find({"_id": {"$in": mongo_ids}})
        docs = await cursor.to_list(length=PAGE_SIZE)

        results = [
            (doc, score_map[str(doc["_id"])], vector_map.get(str(doc["_id"]), []))
            for doc in docs
        ]

        next_offset = offset + len(hits)
        return results, next_offset

    async def _save_cursor(self, cursor_key: str, state: dict) -> str:
        token = _encode_cursor({"key": cursor_key})
        await redis_client.setex(cursor_key, CURSOR_TTL, json.dumps(state))
        return token

    async def _load_cursor(self, token: str) -> dict | None:
        try:
            data = _decode_cursor(token)
            raw = await redis_client.get(data["key"])
            if not raw:
                return None
            return json.loads(raw)
        except Exception:
            return None

    async def search_stream(
        self,
        request: PaperSearchRequest,
        cursor_key: str | None = None,
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

            # cached results — vector read from Qdrant payload, no re-embedding
            cached_results, next_offset = await self._search_cache(query_vector, request, offset=0)

            for doc, score, paper_vector in cached_results:
                meets_inclusion, meets_exclusion = self._check_criteria(
                    paper_vector, criteria_vectors,
                    request.inclusion_criteria, request.exclusion_criteria,
                )
                result = self._to_result(doc, score, meets_inclusion, meets_exclusion)
                yield {"type": "result", "paper": result.model_dump(), "cached": True}
                total += 1
                cached_count += 1

            seen_dois = {doc.get("doi") for doc, _, _ in cached_results if doc.get("doi")}
            seen_source_ids = {
                f"{doc.get('source')}:{doc.get('source_id')}"
                for doc, _, _ in cached_results
            }

            new_to_ingest: list[PaperDocument] = []

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

                    if total >= request.limit:
                        break

            if new_to_ingest:
                try:
                    paper_dicts = [_serialize_for_celery(p) for p in new_to_ingest]
                    ingest_papers_task.delay(paper_dicts)  # type: ignore
                    logger.info(f"Fired background ingestion for {len(new_to_ingest)} papers.")
                except Exception as e:
                    logger.error(f"Failed to fire ingest task: {e}")
                    await ingestion_service.ingest(new_to_ingest)

            # save cursor state for load more
            if cursor_key and next_offset > 0:
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
                cursor_token = await self._save_cursor(cursor_key, state)
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
            state = await self._load_cursor(request.cursor)
            if not state:
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

            for doc, score, paper_vector in cached_results:
                meets_inclusion, meets_exclusion = self._check_criteria(
                    paper_vector, criteria_vectors,
                    request.inclusion_criteria, request.exclusion_criteria,
                )
                result = self._to_result(doc, score, meets_inclusion, meets_exclusion)
                yield {"type": "result", "paper": result.model_dump(), "cached": True}
                total += 1

            # update cursor state with new offset
            data = _decode_cursor(request.cursor)
            cursor_key = data["key"]
            if next_offset > offset:
                state["offset"] = next_offset
                cursor_token = await self._save_cursor(cursor_key, state)
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