from qdrant_client import AsyncQdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    HnswConfigDiff,
    OptimizersConfigDiff,
)

from app.core.config import config
import logging

logger = logging.getLogger(__name__)

FULLTEXT_COLLECTION = "papers_fulltext"


class _Qdrant:
    client: AsyncQdrantClient | None = None


_qdrant = _Qdrant


async def connect_qdrant() -> None:
    logger.info("Connecting to Qdrant...")
    _qdrant.client = AsyncQdrantClient(
        host=config.qdrant_host,
        port=config.qdrant_port,
        timeout=30,
        check_compatibility=False,
    )
    logger.info("Successfully connected to Qdrant")

    collections = await _qdrant.client.get_collections()
    existing_names = [c.name for c in collections.collections]

    if config.qdrant_collection not in existing_names:
        await _qdrant.client.create_collection(
            collection_name=config.qdrant_collection,
            vectors_config=VectorParams(size=config.vector_size, distance=Distance.COSINE),
            hnsw_config=HnswConfigDiff(m=16, ef_construct=100, full_scan_threshold=10_000),
            optimizers_config=OptimizersConfigDiff(indexing_threshold=20_000),
        )
        logger.info(f"Created Qdrant collection: '{config.qdrant_collection}'")
    else:
        logger.info(f"Qdrant collection '{config.qdrant_collection}' ready.")

    if FULLTEXT_COLLECTION not in existing_names:
        await _qdrant.client.create_collection(
            collection_name=FULLTEXT_COLLECTION,
            vectors_config=VectorParams(size=config.vector_size, distance=Distance.COSINE),
            hnsw_config=HnswConfigDiff(m=16, ef_construct=100, full_scan_threshold=10_000),
            optimizers_config=OptimizersConfigDiff(indexing_threshold=20_000),
        )
        logger.info(f"Created Qdrant collection: '{FULLTEXT_COLLECTION}'")
    else:
        logger.info(f"Qdrant collection '{FULLTEXT_COLLECTION}' ready.")


async def close_qdrant() -> None:
    if _qdrant.client:
        await _qdrant.client.close()
        logger.info("Qdrant connection closed.")


def get_qdrant() -> AsyncQdrantClient:
    if _qdrant.client is None:
        raise RuntimeError("Qdrant not initialised.")
    return _qdrant.client