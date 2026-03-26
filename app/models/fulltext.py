from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from datetime import datetime
from typing import Optional


class ChunkMatchDocument(BaseModel):
    paper_id: str
    title: str
    year: Optional[int] = None
    doi: Optional[str] = None
    source_url: Optional[str] = None
    similarity: float


class ChunkResultDocument(BaseModel):
    chunk_index: int
    text: str
    start_char: int
    end_char: int
    similarity: float
    similarity_level: str
    matches: list[ChunkMatchDocument] = []


class FullTextCheckDocument(BaseModel):

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
    )

    id: ObjectId = Field(default_factory=ObjectId, alias="_id")

    user_id: Optional[ObjectId] = None

    input_preview: str
    field_of_study: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None

    overall_similarity: float
    total_chunks: int
    high_similarity_chunks: int
    medium_similarity_chunks: int
    low_similarity_chunks: int

    chunks: list[ChunkResultDocument] = []

    created_at: datetime = Field(default_factory=datetime.utcnow)