from abc import ABC, abstractmethod
from typing import AsyncGenerator

from app.models.paper import PaperDocument


class BaseSource(ABC):

    @property
    @abstractmethod
    def source_name(self) -> str: ...

    @abstractmethod
    async def fetch(
        self,
        query: str,
        limit: int,
        year_from: int | None = None,
        year_to: int | None = None,
        field_of_study: str | None = None,
    ) -> list[PaperDocument]: ...

    @abstractmethod
    def fetch_pages(
        self,
        query: str,
        max_results: int,
        year_from: int | None = None,
        year_to: int | None = None,
        field_of_study: str | None = None,
    ) -> AsyncGenerator[list[PaperDocument], None]: ...