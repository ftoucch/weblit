import logging
import uuid
from datetime import datetime

from sqlalchemy import select, or_, and_

from app.db.postgres import AsyncSessionLocal
from app.models.orm import Paper
from app.models.paper import FetchedPaper
from app.services.embedding_service import embedding_service

logger = logging.getLogger(__name__)


class IngestionService:

    async def _filter_new(self, session, papers: list[FetchedPaper]) -> list[FetchedPaper]:
        if not papers:
            return []

        dois = [p.doi for p in papers if p.doi]
        source_pairs = [(p.source, p.source_id) for p in papers]

        conditions = []
        if dois:
            conditions.append(Paper.doi.in_(dois))
        conditions.append(
            or_(*[and_(Paper.source == s, Paper.source_id == sid) for s, sid in source_pairs])
        )

        existing = await session.execute(select(Paper.doi, Paper.source, Paper.source_id).where(or_(*conditions)))
        existing_dois = set()
        existing_source_pairs = set()
        for doi, source, source_id in existing.all():
            if doi:
                existing_dois.add(doi)
            existing_source_pairs.add((source, source_id))

        new_papers = [
            p for p in papers
            if not (p.doi and p.doi in existing_dois)
            and (p.source, p.source_id) not in existing_source_pairs
        ]
        logger.info(f"{len(new_papers)} new papers out of {len(papers)} fetched.")
        return new_papers

    async def _embed_papers(
        self, papers: list[FetchedPaper]
    ) -> list[tuple[FetchedPaper, list[float]]]:
        texts = [
            f"{p.title}. {p.abstract}" if p.abstract else p.title
            for p in papers
        ]
        vectors = await embedding_service.embed_batch(texts)
        return list(zip(papers, vectors))

    async def ingest(self, papers: list[FetchedPaper]) -> list[Paper]:
        if not papers:
            return []

        async with AsyncSessionLocal() as session:
            new_papers = await self._filter_new(session, papers)
            if not new_papers:
                return []

            papers_with_vectors = await self._embed_papers(new_papers)

            rows = []
            for paper, vector in papers_with_vectors:
                rows.append(Paper(
                    id=uuid.UUID(paper.id) if paper.id else uuid.uuid4(),
                    title=paper.title,
                    abstract=paper.abstract,
                    authors=[a.model_dump() for a in paper.authors],
                    year=paper.year,
                    field_of_study=paper.field_of_study,
                    doi=paper.doi,
                    source_url=paper.source_url,
                    citation_count=paper.citation_count,
                    source=paper.source,
                    source_id=paper.source_id,
                    full_text_source=paper.full_text_source,
                    has_full_text=paper.has_full_text,
                    oa_url=paper.oa_url,
                    abstract_embedding=vector,
                    updated_at=datetime.utcnow(),
                ))

            session.add_all(rows)
            try:
                await session.commit()
            except Exception as e:
                logger.error(f"Postgres insert failed: {e}")
                await session.rollback()
                return []

            for row in rows:
                await session.refresh(row)

            logger.info(f"Stored {len(rows)} papers in Postgres.")
            return rows


ingestion_service = IngestionService()
