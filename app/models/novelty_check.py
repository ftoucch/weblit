from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from datetime import datetime
from typing import Optional


class RelatedWorkDocument(BaseModel):
    id: str
    title: str
    year: Optional[int] = None
    doi: Optional[str] = None
    source_url: Optional[str] = None
    citation_count: Optional[int] = None
    similarity: float


class AspectDocument(BaseModel):
    score: float
    summary: str
    related_works: list[RelatedWorkDocument] = []


class NoveltyAspectsDocument(BaseModel):
    topic: AspectDocument
    methods: AspectDocument
    domain: AspectDocument


class NoveltyCheckDocument(BaseModel):

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
    )

    id: ObjectId = Field(default_factory=ObjectId, alias="_id")

    user_id: Optional[ObjectId] = None

    input_text: str
    field_of_study: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None

    novelty_score: float
    verdict: str
    aspects: NoveltyAspectsDocument
    recommendation: str

    created_at: datetime = Field(default_factory=datetime.utcnow)