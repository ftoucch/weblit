import logging
import asyncio
from app.workers.celery_app import celery_app
from app.models.paper import PaperDocument
from app.services.ingestion_service import ingestion_service
from app.services.sources.openalex import openalex_source
from app.services.ingestion_service import ingestion_service

logger = logging.getLogger(__name__)


def _run_async(coro):
    """Run an async coroutine from a sync Celery task."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    name="tasks.ingest_papers"
)
def ingest_papers_task(self, paper_dicts: list[dict]) -> dict:
    """
    Background task — ingests a batch of papers into Qdrant and MongoDB.
    Fired by search_service after streaming results to the user.

    paper_dicts: list of PaperDocument serialized as JSON-safe dicts
                 (Pydantic models can't be passed directly to Celery)
    """
    try:
        # deserialize back to PaperDocument
        papers = [PaperDocument.model_validate(d) for d in paper_dicts]

        stored = _run_async(ingestion_service.ingest(papers))
        logger.info(f"ingest_papers_task: indexed {stored} new papers.")
        return {"stored": stored}

    except Exception as e:
        logger.error(f"ingest_papers_task failed: {e}")
        raise self.retry(exc=e)


@celery_app.task(
    bind=True,
    max_retries=2,
    default_retry_delay=120,
    name="tasks.ingest_topic"
)
def ingest_topic_task(self, topic: str, limit: int = 100) -> dict:
    """
    Admin-triggered bulk ingestion task.
    Pre-indexes a topic so users get cached results immediately.

    Only callable by admins via the admin route — not exposed to regular users.
    """
    try:
        papers = _run_async(openalex_source.fetch(query=topic, limit=limit))
        stored = _run_async(ingestion_service.ingest(papers))

        logger.info(f"ingest_topic_task: indexed {stored} papers for topic '{topic}'.")
        return {"topic": topic, "stored": stored}

    except Exception as e:
        logger.error(f"ingest_topic_task failed for topic '{topic}': {e}")
        raise self.retry(exc=e)