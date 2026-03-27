import logging
import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/pdf,*/*;q=0.9",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}


def _is_pdf_url(url: str) -> bool:
    return url.lower().split("?")[0].endswith(".pdf")


async def fetch_fulltext(oa_url: str) -> str | None:
    text = await _fetch_with_httpx(oa_url)
    if text:
        return text

    text = await _fetch_with_playwright(oa_url)
    return text


async def _fetch_with_httpx(oa_url: str) -> str | None:
    try:
        async with httpx.AsyncClient(
            timeout=30,
            follow_redirects=True,
            headers=HEADERS,
        ) as client:
            if _is_pdf_url(oa_url):
                response = await client.get(oa_url)
                response.raise_for_status()
                return _extract_from_pdf_bytes(response.content)

            response = await client.get(oa_url)
            response.raise_for_status()

            content_type = response.headers.get("content-type", "")

            if "application/pdf" in content_type:
                return _extract_from_pdf_bytes(response.content)

            if "text/html" in content_type:
                return _extract_from_html(response.text)

            if response.content[:4] == b"%PDF":
                return _extract_from_pdf_bytes(response.content)

            return None

    except httpx.HTTPStatusError as e:
        logger.debug(f"httpx {e.response.status_code} for {oa_url} — trying playwright")
        return None
    except Exception as e:
        logger.debug(f"httpx failed for {oa_url}: {e} — trying playwright")
        return None


async def _fetch_with_playwright(oa_url: str) -> str | None:
    try:
        from playwright.async_api import async_playwright

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent=HEADERS["User-Agent"],
                accept_downloads=True,
            )
            page = await context.new_page()

            download_future = None

            async def handle_download(download):
                nonlocal download_future
                download_future = download

            page.on("download", handle_download)

            try:
                await page.goto(oa_url, wait_until="networkidle", timeout=30000)
            except Exception:
                pass

            if download_future is not None:
                try:
                    import asyncio
                    path = await asyncio.wait_for(download_future.path(), timeout=15)
                    if path:
                        with open(str(path), "rb") as f:
                            pdf_bytes = f.read()
                        await browser.close()
                        return _extract_from_pdf_bytes(pdf_bytes)
                except Exception as e:
                    logger.debug(f"Download path failed: {e}")

            content = await page.content()
            await browser.close()

            if not content or len(content.strip()) < 100:
                return None

            return _extract_from_html(content)

    except ImportError:
        logger.warning("playwright not installed — cannot fetch JS-rendered pages")
        return None
    except Exception as e:
        logger.warning(f"playwright failed for {oa_url}: {e}")
        return None


def _extract_from_html(html: str) -> str | None:
    try:
        soup = BeautifulSoup(html, "html.parser")

        for tag in soup(["script", "style", "nav", "header", "footer", "aside", "figure"]):
            tag.decompose()

        candidates = (
            soup.find("article")
            or soup.find("main")
            or soup.find(id="content")
            or soup.find(id="main-content")
            or soup.find(class_="article-body")
            or soup.find(class_="fulltext")
            or soup.find(class_="article__body")
            or soup.find(class_="content")
            or soup.body
        )

        if not candidates:
            return None

        text = candidates.get_text(separator="\n", strip=True)
        lines = [l.strip() for l in text.splitlines() if len(l.strip()) > 40]
        result = "\n\n".join(lines)

        return result if len(result) > 500 else None

    except Exception as e:
        logger.warning(f"HTML extraction failed: {e}")
        return None


def _extract_from_pdf_bytes(pdf_bytes: bytes) -> str | None:
    if not pdf_bytes or pdf_bytes.lstrip()[:4] != b"%PDF":
        return None
    try:
        import io
        import pypdf

        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        pages = [page.extract_text() or "" for page in reader.pages]
        text = "\n\n".join(pages)
        return text if len(text.strip()) > 500 else None

    except Exception as e:
        logger.warning(f"PDF extraction failed: {e}")
        return None