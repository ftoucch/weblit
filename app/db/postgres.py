import logging

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import config
from app.models.orm import Base

logger = logging.getLogger(__name__)

engine: AsyncEngine = create_async_engine(config.sqlalchemy_database_url, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def connect_postgres() -> None:
    logger.info("Connecting to Postgres...")
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Postgres connected and tables ensured.")


async def close_postgres() -> None:
    await engine.dispose()
    logger.info("Postgres connection closed.")
