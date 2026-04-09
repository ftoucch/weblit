import logging
import redis.asyncio as redis
from app.core.config import config

logger = logging.getLogger(__name__)

redis_client: redis.Redis | None = None

async def connect_redis() -> None:
    global redis_client
    logger.info("Connecting to Redis...")

    if config.redis_url:
        redis_client = redis.from_url(
            config.redis_url,
            decode_responses=True,
        )
    else:
        redis_client = redis.Redis(
            host=config.redis_host,
            port=config.redis_port,
            db=2,
            decode_responses=True,
        )

    await redis_client.ping()
    logger.info("Successfully connected to Redis.")

async def close_redis() -> None:
    if redis_client:
        await redis_client.aclose()
        logger.info("Redis connection closed.")

def get_redis() -> redis.Redis:
    if redis_client is None:
        raise RuntimeError("Redis not initialised.")
    return redis_client