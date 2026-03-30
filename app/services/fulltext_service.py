import logging
import base64
import io
import re
import pypdf
from typing import AsyncGenerator
from bson import ObjectId
from qdrant_client.models import Filter, FieldCondition, Range

from app.db.mongo import mongo_db
from app.db.qdrant import get_qdrant, FULLTEXT_COLLECTION
from app.core.config import config
from app.models.fulltext import (
    FullTextCheckDocument,
    ChunkResultDocument,
    ChunkMatchDocument,
)
from app.schemas.fulltext import (
    FullTextCheckRequest,
    FullTextResult,
    ChunkResult,
    ChunkMatch,
)
from app.services.embedding_service import embedding_service
from app.services.fulltext_ingestion_service import _sliding_window_chunks

logger = logging.getLogger(__name__)

MAX_CHUNKS = 100
TOP_K      = 5


def _extract_text_from_pdf(pdf_base64: str) -> str:
    try:
        pdf_bytes = base64.b64decode(pdf_base64)
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n\n".join(pages)
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {e}")


def _similarity_level(similarity: float) -> str:
    if similarity >= 0.75:
        return "high"
    if similarity >= 0.5:
        return "medium"
    return "low"


class FullTextService:

    @property
    def papers(self):
        return mongo_db.collections["papers"]  # type: ignore

    @property
    def fulltext_checks(self):
        return mongo_db.collections["fulltext_checks"]  # type: ignore

    async def _get_collection(self) -> str:
        """Check once which collection to use — fulltext if available, else abstracts."""
        try:
            qdrant = get_qdrant()
            info = await qdrant.get_collection(FULLTEXT_COLLECTION)
            if (info.points_count or 0) > 0:
                logger.info(f"Using fulltext collection ({info.points_count} vectors)")
                return FULLTEXT_COLLECTION
        except Exception as e:
            logger.warning(f"Could not check fulltext collection: {e}")
        logger.info("Falling back to abstracts collection")
        return config.qdrant_collection

    async def _search_similar(
        self,
        vector: list[float],
        request: FullTextCheckRequest,
        collection: str,
    ) -> list[ChunkMatch]:
        qdrant = get_qdrant()

        conditions = []
        if request.year_from:
            conditions.append(FieldCondition(key="year", range=Range(gte=request.year_from)))
        if request.year_to:
            conditions.append(FieldCondition(key="year", range=Range(lte=request.year_to)))
        qdrant_filter = Filter(must=conditions) if conditions else None

        response = await qdrant.query_points(
            collection_name=collection,
            query=vector,
            limit=TOP_K,
            score_threshold=request.min_similarity,
            query_filter=qdrant_filter,
            with_payload=True,
        )

        hits = response.points
        if not hits:
            return []

        matches = []
        use_fulltext = collection == FULLTEXT_COLLECTION

        for hit in hits:
            if not hit.payload:
                continue

            if use_fulltext:
                matches.append(ChunkMatch(
                    paper_id=hit.payload.get("paper_id", ""),
                    title=hit.payload.get("title", ""),
                    year=hit.payload.get("year"),
                    doi=hit.payload.get("doi"),
                    source_url=hit.payload.get("source_url"),
                    similarity=round(hit.score, 4),
                    matched_text=hit.payload.get("chunk_text"),
                ))
            else:
                mongo_id = hit.payload.get("mongo_id")
                if not mongo_id:
                    continue
                doc = await self.papers.find_one({"_id": ObjectId(mongo_id)})
                if doc:
                    matches.append(ChunkMatch(
                        paper_id=str(doc["_id"]),
                        title=doc.get("title", ""),
                        year=doc.get("year"),
                        doi=doc.get("doi"),
                        source_url=doc.get("source_url"),
                        similarity=round(hit.score, 4),
                        matched_text=doc.get("abstract"),
                    ))

        return matches

    async def _save_check(
        self,
        request: FullTextCheckRequest,
        result: FullTextResult,
        user_id: str | None,
        input_text: str,
    ) -> None:
        try:
            doc = FullTextCheckDocument(
                user_id=ObjectId(user_id) if user_id else None,
                input_preview=input_text[:500],
                field_of_study=request.field_of_study,
                year_from=request.year_from,
                year_to=request.year_to,
                overall_similarity=result.overall_similarity,
                total_chunks=result.total_chunks,
                high_similarity_chunks=result.high_similarity_chunks,
                medium_similarity_chunks=result.medium_similarity_chunks,
                low_similarity_chunks=result.low_similarity_chunks,
                chunks=[
                    ChunkResultDocument(
                        chunk_index=c.chunk_index,
                        text=c.text,
                        start_char=c.start_char,
                        end_char=c.end_char,
                        similarity=c.similarity,
                        similarity_level=c.similarity_level,
                        matches=[ChunkMatchDocument(**m.model_dump()) for m in c.matches],
                    )
                    for c in result.chunks
                ],
            )
            await self.fulltext_checks.insert_one(doc.model_dump(by_alias=True))
        except Exception as e:
            logger.error(f"Failed to save fulltext check: {e}")

    async def check_stream(
        self,
        request: FullTextCheckRequest,
        user_id: str | None = None,
    ) -> AsyncGenerator[dict, None]:
        try:
            yield {"type": "progress", "message": "Preparing text…", "progress": 5}

            if request.pdf_base64:
                input_text = _extract_text_from_pdf(request.pdf_base64)
            else:
                input_text = request.text or ""

            if not input_text.strip():
                yield {"type": "error", "message": "No text could be extracted."}
                return

            chunks = _sliding_window_chunks(input_text)
            chunks = chunks[:MAX_CHUNKS]
            total = len(chunks)

            if total == 0:
                # fallback — if paragraph chunker produced nothing, try sentence splitting
                sentences = re.split(r'(?<=[.!?])\s+', input_text)
                sentences = [s.strip() for s in sentences if len(s.strip()) > 50]
                if not sentences:
                    yield {"type": "error", "message": "Text is too short to analyse."}
                    return
                # build fake chunks from sentences grouped in threes
                grouped = [' '.join(sentences[i:i+3]) for i in range(0, len(sentences), 3)]
                chunks = []
                cursor = 0
                for g in grouped:
                    start = input_text.find(g[:30], cursor)
                    if start == -1:
                        continue
                    end = start + len(g)
                    chunks.append((g, start, end))
                    cursor = end
                chunks = chunks[:MAX_CHUNKS]
                total = len(chunks)
                if total == 0:
                    yield {"type": "error", "message": "Text is too short to analyse."}
                    return

            # determine collection once — not per chunk
            collection = await self._get_collection()

            yield {"type": "text", "content": input_text}
            yield {
                "type": "progress",
                "message": f"Analysing {total} sections…",
                "progress": 10,
            }

            chunk_results: list[ChunkResult] = []
            similarities: list[float] = []

            for i, (chunk_text, start_char, end_char) in enumerate(chunks):
                chunk_vector = await embedding_service.embed(chunk_text)
                matches = await self._search_similar(chunk_vector, request, collection)

                chunk_sim = matches[0].similarity if matches else 0.0
                similarities.append(chunk_sim)

                chunk_result = ChunkResult(
                    chunk_index=i,
                    text=chunk_text,
                    start_char=start_char,
                    end_char=end_char,
                    similarity=round(chunk_sim, 4),
                    similarity_level=_similarity_level(chunk_sim),
                    matches=matches,
                )
                chunk_results.append(chunk_result)

                progress = 10 + int((i + 1) / total * 85)
                yield {
                    "type": "chunk_result",
                    "chunk_index": i,
                    "text": chunk_text,
                    "start_char": start_char,
                    "end_char": end_char,
                    "similarity": round(chunk_sim, 4),
                    "similarity_level": _similarity_level(chunk_sim),
                    "matches": [m.model_dump() for m in matches],
                    "progress": progress,
                }

            overall = round(sum(similarities) / len(similarities), 4) if similarities else 0.0
            high   = sum(1 for s in similarities if s >= 0.75)
            medium = sum(1 for s in similarities if 0.5 <= s < 0.75)
            low    = sum(1 for s in similarities if s < 0.5)

            result = FullTextResult(
                overall_similarity=overall,
                total_chunks=total,
                high_similarity_chunks=high,
                medium_similarity_chunks=medium,
                low_similarity_chunks=low,
                chunks=chunk_results,
            )

            await self._save_check(request, result, user_id, input_text)

            yield {
                "type": "result",
                "overall_similarity": overall,
                "total_chunks": total,
                "high_similarity_chunks": high,
                "medium_similarity_chunks": medium,
                "low_similarity_chunks": low,
            }

        except Exception as e:
            logger.error(f"Full text check error: {e}")
            yield {"type": "error", "message": str(e)}


fulltext_service = FullTextService()