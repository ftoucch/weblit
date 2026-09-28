import os
os.environ.setdefault("DATABASE_URL", "postgresql://weblit:weblit@localhost:5432/weblit_test")

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy import text

from app.main import app
from app.db.postgres import engine
from app.models.orm import Base


@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)

    yield

    async with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(table.delete())


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
    from app.db.postgres import AsyncSessionLocal
    from app.models.orm import OTPCode
    import uuid

    user_id = registered_user["response"]["id"]
    async with AsyncSessionLocal() as session:
        row = await session.get(OTPCode, (uuid.UUID(user_id), "verify_email"))
        otp = row.code

    response = await client.post("/api/v1/auth/verify-otp", json={
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
