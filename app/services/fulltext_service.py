import logging
import base64
import io
from typing import AsyncGenerator
from bson import ObjectId
from qdrant_client.models import Filter, FieldCondition, Range

from app.db.mongo import mongo_db
from app.db.qdrant import get_qdrant
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

logger = logging.getLogger(__name__)

CHUNK_SIZE   = 300
CHUNK_STRIDE = 150
MAX_CHUNKS   = 100
TOP_K        = 5


def _extract_text_from_pdf(pdf_base64: str) -> str:
    try:
        import pypdf
        pdf_bytes = base64.b64decode(pdf_base64)
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n\n".join(pages)
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {e}")


def _sliding_window_chunks(text: str, chunk_size: int, stride: int) -> list[tuple[str, int, int]]:
    """
    Returns list of (chunk_text, start_char, end_char) tuples.
    Tracks character offsets so frontend can highlight exact positions.
    """
    words = text.split()
    if not words:
        return []

    word_positions: list[int] = []
    pos = 0
    for word in words:
        idx = text.find(word, pos)
        word_positions.append(idx)
        pos = idx + len(word)

    chunks = []
    start = 0

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk_text = " ".join(words[start:end])

        if len(chunk_text.strip()) > 50:
            start_char = word_positions[start]
            end_char = word_positions[end - 1] + len(words[end - 1])
            chunks.append((chunk_text, start_char, end_char))

        if end == len(words):
            break
        start += stride

    return chunks[:MAX_CHUNKS]


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

    async def _search_similar(
        self,
        vector: list[float],
        request: FullTextCheckRequest,
    ) -> list[tuple[dict, float]]:
        qdrant = get_qdrant()

        conditions = []
        if request.year_from:
            conditions.append(FieldCondition(key="year", range=Range(gte=request.year_from)))
        if request.year_to:
            conditions.append(FieldCondition(key="year", range=Range(lte=request.year_to)))
        qdrant_filter = Filter(must=conditions) if conditions else None

        response = await qdrant.query_points(
            collection_name=config.qdrant_collection,
            query=vector,
            limit=TOP_K,
            score_threshold=request.min_similarity,
            query_filter=qdrant_filter,
            with_payload=True,
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
        docs = await cursor.to_list(length=TOP_K)

        return [(doc, score_map[str(doc["_id"])]) for doc in docs]

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

            chunks = _sliding_window_chunks(input_text, CHUNK_SIZE, CHUNK_STRIDE)
            total = len(chunks)

            if total == 0:
                yield {"type": "error", "message": "Text is too short to analyse."}
                return

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
                similar_docs = await self._search_similar(chunk_vector, request)

                chunk_sim = similar_docs[0][1] if similar_docs else 0.0
                similarities.append(chunk_sim)

                matches = [
                    ChunkMatch(
                        paper_id=str(doc.get("_id", "")),
                        title=doc.get("title", ""),
                        year=doc.get("year"),
                        doi=doc.get("doi"),
                        source_url=doc.get("source_url"),
                        similarity=round(score, 4),
                    )
                    for doc, score in similar_docs
                ]

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