import logging
import uuid
from datetime import datetime

from qdrant_client.models import PointStruct

from app.db.mongo import mongo_db
from app.db.qdrant import get_qdrant
from app.models.paper import PaperDocument
from app.services.embedding_service import embedding_service
from app.core.config import config

logger = logging.getLogger(__name__)


class IngestionService:

    @property
    def papers(self):
        return mongo_db.collections["papers"] #type: ignore

    async def _exists(self, paper: PaperDocument) -> bool:
        if paper.doi:
            exists = await self.papers.find_one({"doi": paper.doi})
        else:
            exists = await self.papers.find_one({
                "source": paper.source,
                "source_id": paper.source_id,
            })
        return exists is not None

    async def _filter_new(self, papers: list[PaperDocument]) -> list[PaperDocument]:
        new_papers = []
        for paper in papers:
            if not await self._exists(paper):
                new_papers.append(paper)
        logger.info(f"{len(new_papers)} new papers out of {len(papers)} fetched.")
        return new_papers

    async def _embed_papers(
        self, papers: list[PaperDocument]
    ) -> list[tuple[PaperDocument, list[float]]]:
        texts = [
            f"{p.title}. {p.abstract}" if p.abstract else p.title
            for p in papers
        ]
        vectors = await embedding_service.embed_batch(texts)
        return list(zip(papers, vectors))

    async def _store(
        self, papers_with_vectors: list[tuple[PaperDocument, list[float]]]
    ) -> int:
        if not papers_with_vectors:
            return 0

        qdrant = get_qdrant()
        points = []
        docs_to_insert = []

        for paper, vector in papers_with_vectors:
            qdrant_id = str(uuid.uuid4())

            points.append(PointStruct(
                id=qdrant_id,
                vector=vector,
                payload={
                    "mongo_id": str(paper.id),
                    "title": paper.title,
                    "source": paper.source,
                    "year": paper.year,
                    "doi": paper.doi,
                    "has_full_text": paper.has_full_text,
                    "vector": vector,
                }
            ))

            paper.qdrant_abstract_id = qdrant_id
            paper.abstract_indexed = True
            paper.updated_at = datetime.utcnow()

            docs_to_insert.append(paper.model_dump(by_alias=True))

        try:
            await qdrant.upsert(
                collection_name=config.qdrant_collection,
                points=points
            )
        except Exception as e:
            logger.error(f"Qdrant upsert failed: {e}")
            return 0

        try:
            if docs_to_insert:
                await self.papers.insert_many(docs_to_insert, ordered=False)
        except Exception as e:
            logger.warning(f"MongoDB insert_many partial error: {e}")

        stored = len(docs_to_insert)
        logger.info(f"Stored {stored} papers in Qdrant and MongoDB.")
        return stored

    async def ingest(self, papers: list[PaperDocument]) -> int:
        if not papers:
            return 0
        new_papers = await self._filter_new(papers)
        if not new_papers:
            return 0
        papers_with_vectors = await self._embed_papers(new_papers)
        return await self._store(papers_with_vectors)


ingestion_service = IngestionService()