from pydantic import BaseModel
from typing import Optional


class AuthorDocument(BaseModel):
    name: str
    institution: Optional[str] = None


class FetchedPaper(BaseModel):
    """A paper as returned by a source connector, before it has been persisted.

    `id` may be pre-assigned by the caller (e.g. a live search result streamed
    to the client before ingestion completes) so the id shown to the client
    matches the row that gets persisted moments later.
    """

    id: Optional[str] = None

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

    full_text_source: Optional[str] = None
    has_full_text: bool = False
    oa_url: Optional[str] = None
