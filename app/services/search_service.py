import logging
import asyncio
from typing import AsyncGenerator
from bson import ObjectId

from app.db.mongo import mongo_db
from app.db.qdrant import get_qdrant
from app.core.config import config
from app.models.paper import PaperDocument
from app.schemas.paper import (
    PaperSearchRequest,
    PaperSearchResult,
    PaperSource,
    AuthorResponse,
)

from app.services.embedding_service import embedding_service
from app.services.ingestion_service import ingestion_service
from app.services.sources.openalex import openalex_source
from app.services.sources.base import BaseSource