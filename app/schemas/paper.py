from pydantic import BaseModel, Field
from typing import Optional

from app.enums.paper_filter import SortBy
from app.enums.paper_source import PaperSource

class AuthorResponse(BaseModel):
    name: str
    institution: Optional[str] = None

class PaperSearchRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Natural language description of the research topic."
    )

    inclusion_criteria: Optional[str] = Field(
        default=None,
        max_length=500,
        description="What the paper must cover e.g. 'must include clinical trials on adults'."
    )
    exclusion_criteria: Optional[str] = Field(
        default=None,
        max_length=500,
        description="What to exclude e.g. 'exclude animal studies'."
    )
    year_from: Optional[int] = Field(default=None, ge=1900, le=2100)
    year_to: Optional[int] = Field(default=None, ge=1900, le=2100)
    field_of_study: Optional[str] = Field(default=None, max_length=200)
    sources: list[PaperSource] = Field(
        default=[PaperSource.OPENALEX, PaperSource.CORE]
    )
    sort_by: SortBy = SortBy.RELEVANCE
    limit: int = Field(default=20, ge=1, le=500)
    min_similarity: float = Field(default=0.5, ge=0.0, le=1.0)


class PaperSearchResult(BaseModel):
    """Single paper result for Module 1."""
    id: str
    title: str
    abstract: Optional[str] = None
    authors: list[AuthorResponse] = []
    year: Optional[int] = None
    field_of_study: Optional[str] = None
    source: PaperSource
    source_url: Optional[str] = None
    doi: Optional[str] = None
    citation_count: Optional[int] = None
    has_full_text: bool = False 
    similarity_score: float = Field(..., description="Semantic similarity score 0-1.")
    meets_inclusion: Optional[bool] = None
    meets_exclusion: Optional[bool] = None


class PaperSearchResponse(BaseModel):
    query: str
    total_found: int
    results: list[PaperSearchResult]
    sources_searched: list[PaperSource]
    cached: bool = False    