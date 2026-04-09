import logging
import redis.asyncio as redis
from app.core.config import config

logger = logging.getLogger(__name__)


class _RedisProxy:
    """Proxy that forwards all attribute access to the real redis client."""
    _client: redis.Redis | None = None

    def __getattr__(self, name):
        if self._client is None:
            raise RuntimeError("Redis not initialised.")
        return getattr(self._client, name)


redis_client = _RedisProxy()


async def connect_redis() -> None:
    global redis_client
    logger.info("Connecting to Redis...")

    if config.redis_url:
        redis_client._client = redis.from_url(
            config.redis_url,
            decode_responses=True,
        )
    else:
        redis_client._client = redis.Redis(
            host=config.redis_host,
            port=config.redis_port,
            db=2,
            decode_responses=True,
        )

    await redis_client.ping()
    logger.info("Successfully connected to Redis.")


async def close_redis() -> None:
    if redis_client._client:
        await redis_client._client.aclose()
        logger.info("Redis connection closed.")