from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection
from app.core.config import config
import logging

logger = logging.getLogger(__name__)

class _MongoDB:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None
    collections: dict[str, AsyncIOMotorCollection] | None = None

mongo_db = _MongoDB()

async def connect_mongo() -> None:
    logger.info("Connecting to MongoDB...")
    mongo_db.client = AsyncIOMotorClient(
        config.db_url,
        serverSelectionTimeoutMS=5000
    )
    
    mongo_db.db = mongo_db.client[config.mongo_db]
    await mongo_db.client.admin.command('ping')
    logger.info("Successfully connected to MongoDB.")

    mongo_db.collections = {
        "users": mongo_db.db["users"],
        "papers": mongo_db.db["papers"]
    }

    await mongo_db.db["users"].create_index("email", unique=True)
    await mongo_db.db["papers"].create_index("doi", unique=True, sparse=True)
    await mongo_db.db["papers"].create_index(
        [("source", 1), ("source_id", 1)], unique=True
    )
    await mongo_db.db["papers"].create_index("has_full_text")

    logger.info("MongoDB collections and indexes are set up.")

async def close_mongo() -> None:
    if mongo_db.client:
        mongo_db.client.close()
        logger.info("MongoDB connection closed.")

def get_db() -> AsyncIOMotorDatabase:
    if mongo_db.db is None:
        raise Exception("MongoDB is not connected.")
    return mongo_db.db