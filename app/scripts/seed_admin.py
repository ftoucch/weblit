"""Create/sync the bootstrap admin without restarting the app.

Usage:
    python -m app.scripts.seed_admin

Reads ADMIN_EMAIL / ADMIN_PASSWORD from the environment (same as the
automatic seed that runs on every app startup — see app/db/seed.py) and
does the exact same idempotent create-or-sync. Useful for running against
a deployed database via `railway run python -m app.scripts.seed_admin`
without triggering a redeploy.
"""
import asyncio

from app.core.logging import setup_logging
from app.core.config import config
from app.db.postgres import connect_postgres, close_postgres
from app.db.seed import seed_admin


async def run() -> None:
    if not config.admin_email or not config.admin_password:
        print("ADMIN_EMAIL and ADMIN_PASSWORD must both be set in the environment.")
        return

    await connect_postgres()
    try:
        await seed_admin()
        print(f"Admin user '{config.admin_email}' created/synced.")
    finally:
        await close_postgres()


def main() -> None:
    setup_logging()
    asyncio.run(run())


if __name__ == "__main__":
    main()
