from pydantic import BaseModel, Field
from typing import Optional


class NoveltyCheckRequest(BaseModel):
    text: str = Field(..., min_length=50)
    year_from: Optional[int] = Field(default=None, ge=1900, le=2100)
    year_to: Optional[int] = Field(default=None, ge=1900, le=2100)
    field_of_study: Optional[str] = Field(default=None, max_length=200)
    top_k: int = Field(default=10, ge=1, le=50)


class RelatedWork(BaseModel):
    id: str
    title: str
    year: Optional[int] = None
    doi: Optional[str] = None
    source_url: Optional[str] = None
    citation_count: Optional[int] = None
    similarity: float


class AspectResult(BaseModel):
    score: float
    summary: str
    related_works: list[RelatedWork]


class NoveltyAspects(BaseModel):
    topic: AspectResult
    problem_statement: AspectResult
    methodology: AspectResult
    domain: AspectResult


class NoveltyCheckResult(BaseModel):
    novelty_score: float
    verdict: str
    aspects: NoveltyAspects
    recommendation: str


class NoveltyProgressEvent(BaseModel):
    type: str
    message: str
    progress: int


class NoveltyResultEvent(BaseModel):
    type: str
    result: NoveltyCheckResult