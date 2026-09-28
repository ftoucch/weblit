from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, search, novelty, fulltext, admin
from app.core.config import config
from app.core.logging import setup_logging
from contextlib import asynccontextmanager
from app.db.postgres import connect_postgres, close_postgres
from app.db.seed import seed_admin

setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_postgres()
    await seed_admin()
    yield
    await close_postgres()

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