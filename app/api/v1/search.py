import json
import logging
import uuid
from datetime import datetime
from typing import AsyncGenerator
from bson import ObjectId

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from app.schemas.paper import PaperSearchRequest, PaperSearchContinueRequest
from app.services.search_service import search_service
from app.api.dependency import CurrentUserDependency, GuestOrUserDependency
from app.db.mongo import mongo_db
from app.db.redis import redis_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/search", tags=["search"])

GUEST_MAX_RESULTS   = 20
RATE_LIMIT_REQUESTS = 20
RATE_LIMIT_WINDOW   = 3600


def _saved_searches():
    return mongo_db.collections["saved_searches"]  # type: ignore


async def _check_rate_limit(user_id: str) -> None:
    key = f"rate_limit:search:{user_id}"
    count = await redis_client.incr(key)
    if count == 1:
        await redis_client.expire(key, RATE_LIMIT_WINDOW)
    if count > RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Max {RATE_LIMIT_REQUESTS} searches per hour."
        )


def _serialize(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Unable to serialize unknown type: {type(obj)}")


async def _as_sse(
    generator: AsyncGenerator[dict, None]
) -> AsyncGenerator[str, None]:
    async for event in generator:
        yield f"data: {json.dumps(event, default=_serialize)}\n\n"


def _sse_response(generator: AsyncGenerator[str, None]) -> StreamingResponse:
    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        }
    )


@router.post("/papers")
async def search_papers(
    request: PaperSearchRequest,
    current_user: GuestOrUserDependency,
) -> StreamingResponse:
    is_admin         = current_user and current_user.role.value == "admin"
    is_authenticated = current_user is not None

    if is_authenticated and not is_admin:
        await _check_rate_limit(str(current_user.id))

    if not is_authenticated:
        request.limit = min(request.limit, GUEST_MAX_RESULTS)

    if is_authenticated:
        await _saved_searches().insert_one({
            "user_id": str(current_user.id),
            "query": request.query,
            "filters": request.model_dump(exclude={"query"}),
            "created_at": datetime.utcnow(),
        })

    cursor_key = f"search_cursor:{uuid.uuid4()}"

    async def stream() -> AsyncGenerator[str, None]:
        async for chunk in _as_sse(
            search_service.search_stream(request, cursor_key=cursor_key)
        ):
            yield chunk

    return _sse_response(stream())


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
    cursor = _saved_searches().find(
        {"user_id": current_user.id},
        sort=[("created_at", -1)]
    )
    searches = await cursor.to_list(length=50)
    for s in searches:
        s["id"] = str(s.pop("_id"))
    return searches


@router.delete("/history/{search_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_search_history(
    search_id: str,
    current_user: CurrentUserDependency,
) -> None:
    result = await _saved_searches().delete_one({
        "_id": ObjectId(search_id),
        "user_id": current_user.id,
    })
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Search not found."
        )


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
async def clear_search_history(current_user: CurrentUserDependency) -> None:
    await _saved_searches().delete_many({"user_id": current_user.id})