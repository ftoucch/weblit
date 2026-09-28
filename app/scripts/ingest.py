"""Bulk paper ingestion CLI.

Usage:
    python -m app.scripts.ingest "machine learning" --limit 200
    python -m app.scripts.ingest "transformer architectures" --limit 100 --fulltext

Fetches papers from OpenAlex for the given topic, embeds and stores them in
Postgres. Replaces the old Celery `ingest_topic_task` — there's no queue here,
this just runs to completion in the current process (fine for a low-volume
test project; run it via `railway run` to target the deployed database).
"""
import argparse
import asyncio
import logging

from app.core.logging import setup_logging
from app.db.postgres import connect_postgres, close_postgres
from app.services.ingestion_service import ingestion_service
from app.services.fulltext_ingestion_service import fulltext_ingestion_service
from app.services.sources.openalex import openalex_source

logger = logging.getLogger(__name__)


async def run(topic: str, limit: int, fulltext: bool) -> None:
    await connect_postgres()
    try:
        logger.info(f"Fetching up to {limit} papers for '{topic}' from OpenAlex…")
        papers = await openalex_source.fetch(query=topic, limit=limit)
        logger.info(f"Fetched {len(papers)} papers, embedding + storing…")

        stored = await ingestion_service.ingest(papers)
        logger.info(f"Stored {len(stored)} new papers.")

        if fulltext:
            fulltext_rows = [p for p in stored if p.has_full_text]
            if fulltext_rows:
                logger.info(f"Indexing full text for {len(fulltext_rows)} open-access papers…")
                indexed = await fulltext_ingestion_service.index_batch(fulltext_rows)
                logger.info(f"Fulltext indexed {indexed} papers.")
    finally:
        await close_postgres()


def main() -> None:
    setup_logging()
    parser = argparse.ArgumentParser(description="Ingest papers for a topic into Postgres.")
    parser.add_argument("topic", help="Search topic/query, e.g. \"machine learning\"")
    parser.add_argument("--limit", type=int, default=100, help="Max papers to fetch (default: 100)")
    parser.add_argument("--fulltext", action="store_true", help="Also fetch + index full text for open-access papers")
    args = parser.parse_args()

    asyncio.run(run(args.topic, args.limit, args.fulltext))


if __name__ == "__main__":
    main()
