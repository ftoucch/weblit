from fastapi import FastAPI
from app.api.v1 import auth
from app.core.config import config
from app.core.logging import setup_logging
from contextlib import asynccontextmanager
from app.db.config import connect_mongo, close_mongo

setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_mongo()
    yield
    await close_mongo()

app = FastAPI(title= config.app_name, lifespan=lifespan)

@app.get("/health")
def read_root():
    return{"status" : "ok", "app": config.app_name}

api_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_prefix)