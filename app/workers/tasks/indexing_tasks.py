import logging
import asyncio
import threading
from bson import ObjectId

from app.workers.celery_app import celery_app
from app.models.paper import PaperDocument
from app.services.ingestion_service import ingestion_service # type: ignore
from app.services.fulltext_ingestion_service import fulltext_ingestion_service
from app.services.sources.openalex import openalex_source
from app.db.mongo import mongo_db, connect_mongo
from app.db.qdrant import _qdrant, connect_qdrant

logger = logging.getLogger(__name__)

_loop: asyncio.AbstractEventLoop | None = None
_lock = threading.Lock()


def _get_loop() -> asyncio.AbstractEventLoop:
    global _loop
    with _lock:
        if _loop is None or _loop.is_closed():
            _loop = asyncio.new_event_loop()
            asyncio.set_event_loop(_loop)
        return _loop


def _run_async(coro):
    return _get_loop().run_until_complete(coro)


async def _ensure_connections():
    if mongo_db.collections is None:
        await connect_mongo()
    if _qdrant.client is None:
        await connect_qdrant()


async def _ingest_papers(paper_dicts: list[dict]) -> int:
    await _ensure_connections()

    for d in paper_dicts:
        if "_id" in d and isinstance(d["_id"], str):
            d["_id"] = ObjectId(d["_id"])

    papers = [PaperDocument.model_validate(d) for d in paper_dicts]
    stored = await ingestion_service.ingest(papers)

    fulltext_papers = [p for p in papers if p.has_full_text]
    if fulltext_papers:
        indexed = await fulltext_ingestion_service.index_batch(fulltext_papers)
        logger.info(f"Fulltext indexed {indexed} papers in background.")

    return stored


async def _ingest_topic(topic: str, limit: int) -> int:
    await _ensure_connections()
    papers = await openalex_source.fetch(query=topic, limit=limit)
    stored = await ingestion_service.ingest(papers)

    fulltext_papers = [p for p in papers if p.has_full_text]
    if fulltext_papers:
        indexed = await fulltext_ingestion_service.index_batch(fulltext_papers)
        logger.info(f"Fulltext indexed {indexed} papers for topic '{topic}'.")

    return stored


async def _index_fulltext(paper_dicts: list[dict]) -> int:
    await _ensure_connections()

    for d in paper_dicts:
        if "_id" in d and isinstance(d["_id"], str):
            d["_id"] = ObjectId(d["_id"])

    papers = [PaperDocument.model_validate(d) for d in paper_dicts]
    return await fulltext_ingestion_service.index_batch(papers)


@celery_app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    name="tasks.ingest_papers"
)
def ingest_papers_task(self, paper_dicts: list[dict]) -> dict:
    try:
        stored = _run_async(_ingest_papers(paper_dicts))
        logger.info(f"ingest_papers_task: indexed {stored} new papers.")
        return {"stored": stored}
    except Exception as e:
        logger.error(f"ingest_papers_task failed: {e}")
        raise


@celery_app.task(
    bind=True,
    max_retries=2,
    default_retry_delay=120,
    name="tasks.ingest_topic"
)
def ingest_topic_task(self, topic: str, limit: int = 100) -> dict:
    try:
        stored = _run_async(_ingest_topic(topic, limit))
        logger.info(f"ingest_topic_task: indexed {stored} papers for topic '{topic}'.")
        return {"topic": topic, "stored": stored}
    except Exception as e:
        logger.error(f"ingest_topic_task failed for topic '{topic}': {e}")
        raise


@celery_app.task(
    bind=True,
    max_retries=2,
    default_retry_delay=120,
    name="tasks.index_fulltext"
)
def index_fulltext_task(self, paper_dicts: list[dict]) -> dict:
    try:
        indexed = _run_async(_index_fulltext(paper_dicts))
        logger.info(f"index_fulltext_task: indexed {indexed} papers.")
        return {"indexed": indexed}
    except Exception as e:
        logger.error(f"index_fulltext_task failed: {e}")
        raise