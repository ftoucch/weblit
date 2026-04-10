from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, search, novelty, fulltext, admin
from app.core.config import config
from app.core.logging import setup_logging
from contextlib import asynccontextmanager
from app.db.mongo import connect_mongo, close_mongo
from app.db.redis import connect_redis, close_redis
from app.db.qdrant import connect_qdrant, close_qdrant

setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_mongo()
    await connect_redis()
    await connect_qdrant()
    yield
    await close_mongo()
    await close_redis()
    await close_qdrant()

app = FastAPI(title= config.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def read_root():
    return{"status" : "ok", "app": config.app_name}

api_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(search.router, prefix=api_prefix)
app.include_router(novelty.router, prefix=api_prefix)
app.include_router(fulltext.router, prefix=api_prefix)
app.include_router(admin.router, prefix=api_prefix)