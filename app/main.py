from fastapi import FastAPI
from app.api.v1 import auth
from app.core.config import config
from app.core.logging import setup_logging
from contextlib import asynccontextmanager
from app.db.mongo import connect_mongo, close_mongo
from app.db.redis import connect_redis, close_redis

setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_mongo()
    await connect_redis()
    yield
    await close_mongo()
    await close_redis()

app = FastAPI(title= config.app_name, lifespan=lifespan)

@app.get("/health")
def read_root():
    return{"status" : "ok", "app": config.app_name}

api_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_prefix)