from pydantic import BaseModel, Field
from typing import Optional


class FullTextCheckRequest(BaseModel):
    text: Optional[str] = Field(default=None, min_length=200)
    pdf_base64: Optional[str] = Field(default=None)
    year_from: Optional[int] = Field(default=None, ge=1900, le=2100)
    year_to: Optional[int] = Field(default=None, ge=1900, le=2100)
    field_of_study: Optional[str] = Field(default=None, max_length=200)
    min_similarity: float = Field(default=0.5, ge=0.0, le=1.0)

    def model_post_init(self, __context) -> None:
        if not self.text and not self.pdf_base64:
            raise ValueError("Either text or pdf_base64 must be provided.")


class ChunkMatch(BaseModel):
    paper_id: str
    title: str
    year: Optional[int] = None
    doi: Optional[str] = None
    source_url: Optional[str] = None
    similarity: float
    matched_text: Optional[str] = None


class ChunkResult(BaseModel):
    chunk_index: int
    text: str
    start_char: int
    end_char: int
    similarity: float
    similarity_level: str
    matches: list[ChunkMatch]


class FullTextResult(BaseModel):
    overall_similarity: float
    total_chunks: int
    high_similarity_chunks: int
    medium_similarity_chunks: int
    low_similarity_chunks: int
    chunks: list[ChunkResult]