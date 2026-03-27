from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from datetime import datetime
from typing import Optional


class AuthorDocument(BaseModel):
    name: str
    institution: Optional[str] = None


class PaperDocument(BaseModel):
    
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True
    )

    id: ObjectId = Field(default_factory=ObjectId, alias="_id")

    title: str
    abstract: Optional[str] = None
    authors: list[AuthorDocument] = []
    year: Optional[int] = None
    field_of_study: Optional[str] = None
    doi: Optional[str] = None
    source_url: Optional[str] = None
    citation_count: Optional[int] = None

    source: str                                
    source_id: str                             

    full_text: Optional[str] = None
    full_text_source: Optional[str] = None     
    has_full_text: bool = False
    oa_url: Optional[str] = None

    qdrant_abstract_id: Optional[str] = None   
    qdrant_fulltext_ids: list[str] = []        

    abstract_indexed: bool = False
    fulltext_indexed: bool = False

    indexed_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)