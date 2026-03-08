import os
os.environ["MONGO_HOST"] = "localhost"
os.environ["MONGO_PORT"] = "27017"
os.environ["REDIS_HOST"] = "localhost"
os.environ["REDIS_PORT"] = "6379"

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
import redis.asyncio as redis

from app.main import app
from app.db.mongo import mongo_db
from app.core.config import config

TEST_MONGO_DB = f"{config.mongo_db}_test"
TEST_REDIS_DB = 9


@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    # MongoDB
    mongo_db.client = AsyncIOMotorClient(
        f"mongodb://{config.mongo_user}:{config.mongo_password}@"
        f"localhost:{config.mongo_port}/?authSource=admin"
    )
    mongo_db.db = mongo_db.client[TEST_MONGO_DB]
    mongo_db.collections = {
        "users": mongo_db.db.get_collection("users")
    }
    await mongo_db.db["users"].create_index("email", unique=True)

    # Redis
    import app.db.redis as redis_module
    import app.services.otp_service as otp_module

    test_redis = redis.Redis(
        host="localhost",
        port=config.redis_port,
        db=TEST_REDIS_DB,
        decode_responses=True,
    )
    redis_module.redis_client = test_redis
    otp_module.redis_client = test_redis

    # clean before each test
    await mongo_db.collections["users"].delete_many({})
    await test_redis.flushdb()

    yield

    await test_redis.flushdb()
    await test_redis.aclose()
    mongo_db.client.close()


@pytest_asyncio.fixture
async def client() -> AsyncClient: # type: ignore
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac # type: ignore


@pytest.fixture
def user_payload() -> dict:
    return {
        "name": "Test User",
        "email": "test@example.com",
        "password": "Testpass1!"
    }


@pytest_asyncio.fixture
async def registered_user(client: AsyncClient, user_payload: dict) -> dict:
    response = await client.post("/api/v1/auth/register", json=user_payload)
    assert response.status_code == 201
    return {"response": response.json(), "payload": user_payload}


@pytest_asyncio.fixture
async def verified_user(client: AsyncClient, registered_user: dict) -> dict:
    user_id = registered_user["response"]["id"]
    import app.db.redis as redis_module
    otp = await redis_module.redis_client.get(f"otp:verify_email:{user_id}")
    response = await client.post("/api/v1/auth/verify-email", json={
        "user_id": user_id,
        "otp": otp
    })
    assert response.status_code == 200
    return {"response": response.json(), "payload": registered_user["payload"]}


@pytest_asyncio.fixture
async def auth_token(client: AsyncClient, verified_user: dict) -> str:
    payload = verified_user["payload"]
    response = await client.post("/api/v1/auth/login", data={
        "username": payload["email"],
        "password": payload["password"]
    })
    assert response.status_code == 200
    return response.json()["access_token"]