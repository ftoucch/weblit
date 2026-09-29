import logging
import re
import uuid
from datetime import datetime

from app.db.postgres import AsyncSessionLocal
from app.models.orm import Paper, FulltextChunk
from app.services.embedding_service import embedding_service
from app.services.fulltext_fetcher import fetch_fulltext

logger = logging.getLogger(__name__)

MAX_CHUNKS   = 200
MIN_PARA_LEN = 50
MAX_PARA_LEN = 3000


def _paragraph_chunks(text: str) -> list[tuple[str, int, int]]:
    """
    Split text into semantic paragraphs, handling both HTML and PDF extracted text.

    Strategy:
    1. Join single-line wraps (PDF line breaks mid-sentence)
    2. Split on double newlines OR sentence-ending single newlines
    3. Skip short segments (headers, page numbers, captions)
    4. Track char offsets for frontend highlighting
    """

    # Step 1 — join wrapped lines (single \n not after sentence end)
    # e.g. "This is a long\nsentence" → "This is a long sentence"
    normalized = re.sub(r'(?<![.!?:"])\n(?!\n)', ' ', text)

    # Step 2 — split on paragraph boundaries:
    # - two or more newlines
    # - single newline after sentence-ending punctuation
    raw_paras = re.split(r'\n{2,}|(?<=[.!?])\n', normalized)

    chunks: list[tuple[str, int, int]] = []
    cursor = 0

    for para in raw_paras:
        para = para.strip()

        if not para:
            cursor = text.find('\n', cursor)
            if cursor == -1:
                break
            cursor += 1
            continue

        # find this paragraph in the original text
        start_char = text.find(para[:40], cursor)
        if start_char == -1:
            # fallback — try shorter prefix
            start_char = text.find(para[:20], cursor)
        if start_char == -1:
            continue

        end_char = start_char + len(para)

        # skip short segments — likely headers, page numbers, captions
        if len(para) < MIN_PARA_LEN:
            cursor = end_char
            continue

        # if paragraph is very long, split at sentence boundaries
        if len(para) > MAX_PARA_LEN:
            sentences = re.split(r'(?<=[.!?])\s+', para)
            sub_cursor = start_char
            current = ''

            for sentence in sentences:
                if len(current) + len(sentence) > MAX_PARA_LEN and current:
                    sub_start = text.find(current[:40], sub_cursor)
                    if sub_start != -1:
                        chunks.append((current.strip(), sub_start, sub_start + len(current.strip())))
                    sub_cursor = sub_start + len(current) if sub_start != -1 else sub_cursor
                    current = sentence
                else:
                    current = current + ' ' + sentence if current else sentence

            if current.strip() and len(current.strip()) >= MIN_PARA_LEN:
                sub_start = text.find(current[:40], sub_cursor)
                if sub_start != -1:
                    chunks.append((current.strip(), sub_start, sub_start + len(current.strip())))
        else:
            chunks.append((para, start_char, end_char))

        cursor = end_char

    return chunks[:MAX_CHUNKS]


# alias so fulltext_service.py import still works
_sliding_window_chunks = _paragraph_chunks


class FullTextIngestionService:

    async def _get_pdf_url(self, paper: Paper) -> str | None:
        if paper.doi:
            try:
                import httpx
                from app.core.config import config
                email = getattr(config, "openalex_email", "research@weblit.ai")
                async with httpx.AsyncClient(timeout=10) as client:
                    r = await client.get(
                        f"https://api.unpaywall.org/v2/{paper.doi}",
                        params={"email": email}
                    )
                    if r.status_code == 200:
                        data = r.json()
                        best = data.get("best_oa_location") or {}
                        pdf_url = best.get("url_for_pdf")
                        if pdf_url:
                            return pdf_url
            except Exception as e:
                logger.debug(f"Unpaywall lookup failed for {paper.doi}: {e}")

        return paper.oa_url or paper.source_url

    async def _fetch_and_store_text(self, session, paper: Paper) -> str | None:
        if paper.full_text:
            return paper.full_text

        oa_url = await self._get_pdf_url(paper)
        if not oa_url:
            return None

        text = await fetch_fulltext(oa_url)
        if not text:
            return None

        paper.full_text = text
        paper.full_text_source = "fetched"
        paper.updated_at = datetime.utcnow()
        await session.commit()
        logger.info(f"Stored full text for paper {paper.id} ({len(text)} chars)")
        return text

    async def index_paper(self, paper_id: uuid.UUID) -> bool:
        # Any single paper can fail for reasons outside our control (a bad PDF,
        # a flaky publisher host, a Postgres constraint) — never let one paper
        # abort indexing for the rest of the batch.
        try:
            async with AsyncSessionLocal() as session:
                paper = await session.get(Paper, paper_id)
                if not paper:
                    return False

                if paper.fulltext_indexed:
                    logger.info(f"Paper {paper.id} already fulltext indexed — skipping.")
                    return False

                full_text = await self._fetch_and_store_text(session, paper)
                if not full_text:
                    logger.warning(f"No full text available for paper {paper.id}")
                    return False

                chunks = _paragraph_chunks(full_text)
                if not chunks:
                    return False

                chunk_texts = [c[0] for c in chunks]
                vectors = await embedding_service.embed_batch(chunk_texts)

                rows = [
                    FulltextChunk(
                        id=uuid.uuid4(),
                        paper_id=paper.id,
                        chunk_text=chunk_text,
                        start_char=start_char,
                        end_char=end_char,
                        chunk_embedding=vector,
                    )
                    for (chunk_text, start_char, end_char), vector in zip(chunks, vectors)
                ]
                session.add_all(rows)

                paper.fulltext_indexed = True
                paper.indexed_at = datetime.utcnow()
                paper.updated_at = datetime.utcnow()

                await session.commit()

                logger.info(f"Fulltext indexed: '{paper.title}' — {len(chunks)} chunks")
                return True
        except Exception as e:
            logger.error(f"Fulltext indexing failed for paper {paper_id}: {e}")
            return False

    async def index_batch(self, papers: list[Paper]) -> int:
        count = 0
        for paper in papers:
            if paper.has_full_text:
                success = await self.index_paper(paper.id)
                if success:
                    count += 1
        return count


fulltext_ingestion_service = FullTextIngestionService()
