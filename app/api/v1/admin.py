import logging
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from celery.result import AsyncResult

from app.api.dependency import CurrentUserDependency
from app.workers.tasks.indexing_tasks import ingest_topic_task
from app.workers.celery_app import celery_app

from app.db.mongo import mongo_db
from app.db.qdrant import get_qdrant, FULLTEXT_COLLECTION
from app.core.config import config

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
    task_id: str
    topic: str
    limit: int
    message: str


class TaskStatusResponse(BaseModel):
    task_id: str
    status: str
    result: Optional[dict] = None


@router.post("/ingest-topic", response_model=IngestTopicResponse)
async def ingest_topic(
    request: IngestTopicRequest,
    current_user: CurrentUserDependency,
):
    _require_admin(current_user)

    task = ingest_topic_task.delay(request.topic, request.limit) #type: ignore

    logger.info(f"Admin {current_user.id} triggered ingestion for topic '{request.topic}' limit={request.limit}")

    return IngestTopicResponse(
        task_id=task.id,
        topic=request.topic,
        limit=request.limit,
        message=f"Ingestion started for '{request.topic}'. Check status with task_id.",
    )


@router.get("/ingest-status/{task_id}", response_model=TaskStatusResponse)
async def ingest_status(
    task_id: str,
    current_user: CurrentUserDependency,
):
    _require_admin(current_user)

    result = AsyncResult(task_id, app=celery_app)

    return TaskStatusResponse(
        task_id=task_id,
        status=result.status,
        result=result.result if result.ready() else None,
    )


@router.get("/stats")
async def stats(current_user: CurrentUserDependency):
    _require_admin(current_user)

    papers_total = await mongo_db.collections["papers"].count_documents({}) #type: ignore
    papers_fulltext = await mongo_db.collections["papers"].count_documents({"fulltext_indexed": True}) #type: ignore
    users_total = await mongo_db.collections["users"].count_documents({}) #type: ignore

    qdrant = get_qdrant()
    abstracts_info = await qdrant.get_collection(config.qdrant_collection)
    fulltext_info = await qdrant.get_collection(FULLTEXT_COLLECTION)

    return {
        "papers": {
            "total": papers_total,
            "fulltext_indexed": papers_fulltext,
        },
        "users": {
            "total": users_total,
        },
        "qdrant": {
            "abstracts_vectors": abstracts_info.points_count,
            "fulltext_vectors": fulltext_info.points_count,
        },
    }