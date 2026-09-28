import json
import logging
import uuid
from datetime import datetime
from typing import AsyncGenerator

from sqlalchemy import select, delete

from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from fastapi.responses import StreamingResponse

from app.schemas.paper import PaperSearchRequest, PaperSearchContinueRequest
from app.services.search_service import search_service, ingest_and_index
from app.api.dependency import CurrentUserDependency, GuestOrUserDependency
from app.core.rate_limit import check_rate_limit
from app.db.postgres import AsyncSessionLocal
from app.models.orm import SavedSearch

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/search", tags=["search"])

GUEST_MAX_RESULTS   = 20
RATE_LIMIT_REQUESTS = 20
RATE_LIMIT_WINDOW   = 3600


async def _check_rate_limit(user_id: str) -> None:
    allowed = await check_rate_limit(f"search:{user_id}", RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Max {RATE_LIMIT_REQUESTS} searches per hour."
        )


def _serialize(obj):
    if isinstance(obj, uuid.UUID):
        return str(obj)
    raise TypeError(f"Unable to serialize unknown type: {type(obj)}")


async def _as_sse(
    generator: AsyncGenerator[dict, None]
) -> AsyncGenerator[str, None]:
    async for event in generator:
        yield f"data: {json.dumps(event, default=_serialize)}\n\n"


def _sse_response(generator: AsyncGenerator[str, None], background_tasks: BackgroundTasks | None = None) -> StreamingResponse:
    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
        background=background_tasks,
    )


@router.post("/papers")
async def search_papers(
    request: PaperSearchRequest,
    current_user: GuestOrUserDependency,
    background_tasks: BackgroundTasks,
) -> StreamingResponse:
    is_admin         = current_user and current_user.role.value == "admin"
    is_authenticated = current_user is not None

    if is_authenticated and not is_admin:
        await _check_rate_limit(str(current_user.id))

    if not is_authenticated:
        request.limit = min(request.limit, GUEST_MAX_RESULTS)

    if is_authenticated:
        async with AsyncSessionLocal() as session:
            session.add(SavedSearch(
                id=uuid.uuid4(),
                user_id=uuid.UUID(current_user.id),
                query=request.query,
                filters=request.model_dump(exclude={"query"}, mode="json"),
            ))
            await session.commit()

    def on_new_papers(papers):
        background_tasks.add_task(ingest_and_index, papers)

    async def stream() -> AsyncGenerator[str, None]:
        async for chunk in _as_sse(
            search_service.search_stream(request, on_new_papers=on_new_papers)
        ):
            yield chunk

    return _sse_response(stream(), background_tasks)


@router.post("/papers/continue")
async def continue_search(
    request: PaperSearchContinueRequest,
    current_user: GuestOrUserDependency,
) -> StreamingResponse:
    is_admin         = current_user and current_user.role.value == "admin"
    is_authenticated = current_user is not None

    if is_authenticated and not is_admin:
        await _check_rate_limit(str(current_user.id))

    async def stream() -> AsyncGenerator[str, None]:
        async for chunk in _as_sse(
            search_service.continue_stream(request)
        ):
            yield chunk

    return _sse_response(stream())


@router.get("/history", status_code=status.HTTP_200_OK)
async def get_search_history(current_user: CurrentUserDependency) -> list[dict]:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(SavedSearch)
            .where(SavedSearch.user_id == uuid.UUID(current_user.id))
            .order_by(SavedSearch.created_at.desc())
            .limit(50)
        )
        searches = result.scalars().all()

    return [
        {
            "id": str(s.id),
            "user_id": str(s.user_id),
            "query": s.query,
            "filters": s.filters,
            "created_at": s.created_at,
        }
        for s in searches
    ]


@router.delete("/history/{search_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_search_history(
    search_id: str,
    current_user: CurrentUserDependency,
) -> None:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            delete(SavedSearch).where(
                SavedSearch.id == uuid.UUID(search_id),
                SavedSearch.user_id == uuid.UUID(current_user.id),
            )
        )
        await session.commit()

    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Search not found."
        )


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
async def clear_search_history(current_user: CurrentUserDependency) -> None:
    async with AsyncSessionLocal() as session:
        await session.execute(
            delete(SavedSearch).where(SavedSearch.user_id == uuid.UUID(current_user.id))
        )
        await session.commit()
