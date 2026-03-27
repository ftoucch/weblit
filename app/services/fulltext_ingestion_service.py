import logging
import uuid
from datetime import datetime
from bson import ObjectId
from qdrant_client.models import PointStruct

from app.db.mongo import mongo_db
from app.db.qdrant import get_qdrant, FULLTEXT_COLLECTION
from app.models.paper import PaperDocument
from app.services.embedding_service import embedding_service
from app.services.fulltext_fetcher import fetch_fulltext

logger = logging.getLogger(__name__)

CHUNK_SIZE   = 300
CHUNK_STRIDE = 150
MAX_CHUNKS   = 200


def _sliding_window_chunks(text: str) -> list[tuple[str, int, int]]:
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
        end = min(start + CHUNK_SIZE, len(words))
        chunk_text = " ".join(words[start:end])

        if len(chunk_text.strip()) > 50:
            start_char = word_positions[start]
            end_char = word_positions[end - 1] + len(words[end - 1])
            chunks.append((chunk_text, start_char, end_char))

        if end == len(words):
            break
        start += CHUNK_SIZE - CHUNK_STRIDE

    return chunks[:MAX_CHUNKS]


class FullTextIngestionService:

    @property
    def papers(self):
        return mongo_db.collections["papers"]  # type: ignore

    async def _is_indexed(self, paper_id: ObjectId) -> bool:
        doc = await self.papers.find_one(
            {"_id": paper_id},
            {"fulltext_indexed": 1}
        )
        return bool(doc and doc.get("fulltext_indexed"))

    async def _get_pdf_url(self, paper: PaperDocument) -> str | None:
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

    async def _fetch_and_store_text(self, paper: PaperDocument) -> str | None:
        if paper.full_text:
            return paper.full_text

        oa_url = await self._get_pdf_url(paper)
        if not oa_url:
            return None

        text = await fetch_fulltext(oa_url)
        if not text:
            return None

        await self.papers.update_one(
            {"_id": paper.id},
            {"$set": {
                "full_text": text,
                "full_text_source": "fetched",
                "updated_at": datetime.utcnow(),
            }}
        )
        logger.info(f"Stored full text for paper {paper.id} ({len(text)} chars)")
        return text

    async def index_paper(self, paper: PaperDocument) -> bool:
        if await self._is_indexed(paper.id):
            logger.info(f"Paper {paper.id} already fulltext indexed — skipping.")
            return False

        full_text = await self._fetch_and_store_text(paper)
        if not full_text:
            logger.warning(f"No full text available for paper {paper.id}")
            return False

        chunks = _sliding_window_chunks(full_text)
        if not chunks:
            return False

        chunk_texts = [c[0] for c in chunks]
        vectors = await embedding_service.embed_batch(chunk_texts)

        qdrant = get_qdrant()
        points = []
        qdrant_ids = []

        for (chunk_text, start_char, end_char), vector in zip(chunks, vectors):
            qdrant_id = str(uuid.uuid4())
            qdrant_ids.append(qdrant_id)

            points.append(PointStruct(
                id=qdrant_id,
                vector=vector,
                payload={
                    "paper_id": str(paper.id),
                    "title": paper.title,
                    "year": paper.year,
                    "doi": paper.doi,
                    "source_url": paper.source_url,
                    "chunk_text": chunk_text,
                    "start_char": start_char,
                    "end_char": end_char,
                }
            ))

        try:
            await qdrant.upsert(
                collection_name=FULLTEXT_COLLECTION,
                points=points,
            )
        except Exception as e:
            logger.error(f"Qdrant fulltext upsert failed for paper {paper.id}: {e}")
            return False

        await self.papers.update_one(
            {"_id": paper.id},
            {"$set": {
                "qdrant_fulltext_ids": qdrant_ids,
                "fulltext_indexed": True,
                "indexed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }}
        )

        logger.info(f"Fulltext indexed {len(chunks)} chunks for paper {paper.id}")
        return True

    async def index_batch(self, papers: list[PaperDocument]) -> int:
        count = 0
        for paper in papers:
            if paper.has_full_text:
                success = await self.index_paper(paper)
                if success:
                    count += 1
        return count


fulltext_ingestion_service = FullTextIngestionService()