# ╔══════════════════════════════════════════════════════════════╗
# ║  BASE SOURCE  —  abstract interface for all paper sources    ║
# ║  Any source (OpenAlex, CORE, institution) must implement     ║
# ║  this interface to plug into the search pipeline             ║
# ╚══════════════════════════════════════════════════════════════╝

from abc import ABC, abstractmethod
from app.models.paper import PaperDocument


class BaseSource(ABC):

    @abstractmethod
    async def fetch(
        self,
        query: str,
        limit: int,
        year_from: int | None = None,
        year_to: int | None = None,
        field_of_study: str | None = None,
    ) -> list[PaperDocument]:
        """
        Fetch papers matching the query from this source.
        Returns a list of PaperDocument — not yet indexed into Qdrant or MongoDB.
        Deduplication happens in the search service, not here.
        """
        ...

    @property
    @abstractmethod
    def source_name(self) -> str:
        """The source identifier e.g. 'openalex', 'core'."""
        ...