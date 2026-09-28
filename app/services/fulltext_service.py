import logging
import base64
import io
import re
import uuid
import pypdf
from typing import AsyncGenerator

from sqlalchemy import select, func

from app.db.postgres import AsyncSessionLocal
from app.models.orm import Paper, FulltextChunk, FullTextCheck
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

    async def _has_fulltext_chunks(self, session) -> bool:
        count = await session.scalar(select(func.count()).select_from(FulltextChunk))
        return bool(count)

    async def _search_similar(
        self,
        session,
        vector: list[float],
        request: FullTextCheckRequest,
        use_fulltext: bool,
    ) -> list[ChunkMatch]:
        if use_fulltext:
            distance_expr = FulltextChunk.chunk_embedding.cosine_distance(vector)
            stmt = (
                select(FulltextChunk, Paper, distance_expr.label("distance"))
                .join(Paper, Paper.id == FulltextChunk.paper_id)
                .where(distance_expr <= (1 - request.min_similarity))
            )
            if request.year_from:
                stmt = stmt.where(Paper.year >= request.year_from)
            if request.year_to:
                stmt = stmt.where(Paper.year <= request.year_to)
            stmt = stmt.order_by(distance_expr).limit(TOP_K)

            rows = (await session.execute(stmt)).all()
            return [
                ChunkMatch(
                    paper_id=str(paper.id),
                    title=paper.title,
                    year=paper.year,
                    doi=paper.doi,
                    source_url=paper.source_url,
                    similarity=round(1 - distance, 4),
                    matched_text=chunk.chunk_text,
                )
                for chunk, paper, distance in rows
            ]

        distance_expr = Paper.abstract_embedding.cosine_distance(vector)
        stmt = (
            select(Paper, distance_expr.label("distance"))
            .where(Paper.abstract_embedding.is_not(None))
            .where(distance_expr <= (1 - request.min_similarity))
        )
        if request.year_from:
            stmt = stmt.where(Paper.year >= request.year_from)
        if request.year_to:
            stmt = stmt.where(Paper.year <= request.year_to)
        stmt = stmt.order_by(distance_expr).limit(TOP_K)

        rows = (await session.execute(stmt)).all()
        return [
            ChunkMatch(
                paper_id=str(paper.id),
                title=paper.title,
                year=paper.year,
                doi=paper.doi,
                source_url=paper.source_url,
                similarity=round(1 - distance, 4),
                matched_text=paper.abstract,
            )
            for paper, distance in rows
        ]

    async def _save_check(
        self,
        request: FullTextCheckRequest,
        result: FullTextResult,
        user_id: str | None,
        input_text: str,
    ) -> None:
        try:
            async with AsyncSessionLocal() as session:
                session.add(FullTextCheck(
                    id=uuid.uuid4(),
                    user_id=uuid.UUID(user_id) if user_id else None,
                    input_preview=input_text[:500],
                    field_of_study=request.field_of_study,
                    year_from=request.year_from,
                    year_to=request.year_to,
                    overall_similarity=result.overall_similarity,
                    total_chunks=result.total_chunks,
                    high_similarity_chunks=result.high_similarity_chunks,
                    medium_similarity_chunks=result.medium_similarity_chunks,
                    low_similarity_chunks=result.low_similarity_chunks,
                    chunks=[c.model_dump() for c in result.chunks],
                ))
                await session.commit()
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

            async with AsyncSessionLocal() as session:
                use_fulltext = await self._has_fulltext_chunks(session)
                logger.info(f"Using {'fulltext' if use_fulltext else 'abstracts'} for similarity search")

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
                    matches = await self._search_similar(session, chunk_vector, request, use_fulltext)

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
