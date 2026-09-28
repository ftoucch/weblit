import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select, func

from app.api.dependency import CurrentUserDependency
from app.db.postgres import AsyncSessionLocal
from app.models.orm import Paper, User, FulltextChunk
from app.services.ingestion_service import ingestion_service
from app.services.fulltext_ingestion_service import fulltext_ingestion_service
from app.services.sources.openalex import openalex_source

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])


def _require_admin(current_user):
    if not current_user or current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )


class IngestTopicRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=200)
    limit: int = Field(default=100, ge=10, le=500)


class IngestTopicResponse(BaseModel):
    topic: str
    limit: int
    message: str


async def _ingest_topic(topic: str, limit: int) -> None:
    try:
        papers = await openalex_source.fetch(query=topic, limit=limit)
        stored = await ingestion_service.ingest(papers)
        fulltext_rows = [p for p in stored if p.has_full_text]
        if fulltext_rows:
            await fulltext_ingestion_service.index_batch(fulltext_rows)
        logger.info(f"Ingested {len(stored)} papers for topic '{topic}'.")
    except Exception as e:
        logger.error(f"Ingestion for topic '{topic}' failed: {e}")


@router.post("/ingest-topic", response_model=IngestTopicResponse)
async def ingest_topic(
    request: IngestTopicRequest,
    current_user: CurrentUserDependency,
    background_tasks: BackgroundTasks,
):
    _require_admin(current_user)

    background_tasks.add_task(_ingest_topic, request.topic, request.limit)

    logger.info(f"Admin {current_user.id} triggered ingestion for topic '{request.topic}' limit={request.limit}")

    return IngestTopicResponse(
        topic=request.topic,
        limit=request.limit,
        message=f"Ingestion started for '{request.topic}' — check /admin/stats shortly for progress.",
    )


@router.get("/stats")
async def stats(current_user: CurrentUserDependency):
    _require_admin(current_user)

    async with AsyncSessionLocal() as session:
        papers_total = await session.scalar(select(func.count()).select_from(Paper))
        papers_fulltext = await session.scalar(
            select(func.count()).select_from(Paper).where(Paper.fulltext_indexed.is_(True))
        )
        users_total = await session.scalar(select(func.count()).select_from(User))
        chunks_total = await session.scalar(select(func.count()).select_from(FulltextChunk))

    return {
        "papers": {
            "total": papers_total,
            "fulltext_indexed": papers_fulltext,
        },
        "users": {
            "total": users_total,
        },
        "vectors": {
            "abstract_embeddings": papers_total,
            "fulltext_chunks": chunks_total,
        },
    }
