import logging
import asyncio
from functools import lru_cache
from sentence_transformers import SentenceTransformer
from app.core.config import config

logger = logging.getLogger(__name__)

class EmbeddingService:
    """
    Wraps sentence-transformers for async use.

    SentenceTransformer.encode() is synchronous and CPU-bound.
    We run it in a thread pool via asyncio.to_thread() so it
    never blocks the FastAPI event loop.

    Model is loaded once at startup and reused — loading is expensive.
    """

    def __init__(self):
        self._model: SentenceTransformer | None = None

    def _load_model(self) -> SentenceTransformer:
        "Lazy Load - only loads when first called"
        if self._model is None:
            logger.info(f"Loading embedding model: {config.embedding_model}")
            self._model = SentenceTransformer(config.embedding_model)
            logger.info("Embeding model loaded")

        return self._model
    
    def _encode(self, text:str) -> list[float]:
        """Synchronous encode runs in thread pool."""
        model = self._load_model()
        vector = model.encode(text, normalize_embeddings=True)
        return vector.tolist()
    
    def _encode_batch(self, texts: list[str]) -> list[list[float]]:
        """Synchronous batch encode - more efficient than one by one"""
        model = self._load_model()
        vectors = model.encode(texts, normalize_embeddings=True, batch_size=32)
        return vectors.tolist()
    
    async def embed(self, text:str) -> list[float]:
        """embed a single-text - used for query embedding at search time.
        runs in a thread pool to avoid blocking the event loop
        """

        return await asyncio.to_thread(self._encode, text)
    
    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """
        Embed multiple texts — used during ingestion.
        More efficient than calling embed() in a loop.
        """
        return await asyncio.to_thread(self._encode_batch, texts)
    
    async def embed_paper(self, title: str, abstract: str | None) -> list[float]:
        """
        Embeds title + abstract together as one unit.
        Abstract is optional — some papers only have titles.
        """
        if abstract:
            text = f"{title}. {abstract}"
        else:
            text = title
        return await self.embed(text)
    
    async def embed_chunks(self, chunks: list[str]) -> list[list[float]]:
        """
        Embeds full text chunks.
        Each chunk becomes a separate Qdrant point.
        """
        return await self.embed_batch(chunks)
    
embedding_service = EmbeddingService()