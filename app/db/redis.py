import logging

import redis.asyncio as redis
from app.core.config import config 

logger = logging.getLogger(__name__)

redis_client: redis.Redis = redis.Redis(
    host = config.redis_host,
    port = config.redis_port,
    db=2,
    decode_responses=True
)

async def connect_redis() -> None:
    logger.info("Connecting to Redis...")
    await redis_client.ping()
    logger.info("Successfully connected to Redis.")


async def close_redis() -> None:
    await redis_client.aclose()
    logger.info("Redis connection closed.")