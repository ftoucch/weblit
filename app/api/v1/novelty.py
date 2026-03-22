import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from bson import ObjectId

from app.schemas.novelty import NoveltyCheckRequest
from app.services.novelty_service import novelty_service
from app.services.auth_service import AuthService
from app.api.dependency import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/novelty", tags=["novelty"])

def _serialize(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Unable to serialize unknown type: {type(obj)}")

@router.websocket("/check")
async def novelty_check(websocket: WebSocket, token: str | None = Query(default=None)):
    await websocket.accept()

    try:
        service = AuthService()
        current_user = await get_current_user(token=token, service=service)

        raw = await websocket.receive_text()
        data = json.loads(raw)

        try:
            request = NoveltyCheckRequest(**data)
        except Exception as e:
            await websocket.send_text(json.dumps({
                "type" : "error",
                "message" : f"Invalid request: {e}"
            }))

            await websocket.close()
            return
        
        user_id = str(current_user.id) if current_user else None

        async for event in novelty_service.check_stream(request, user_id=user_id):
            await websocket.send_text(json.dumps(event, default = _serialize))

        await websocket.close()

    except WebSocketDisconnect:
        logger.info("Novelty check WebSocket disconnected.")
    except Exception as e:
        logger.error(f"Novelty WebSocket error: {e}")
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": str(e)
            }))
            await websocket.close()

        except Exception:
            pass