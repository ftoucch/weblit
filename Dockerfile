# ── Stage 1: Build venv ───────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /project

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

RUN python -m venv /project/venv
ENV PATH="/project/venv/bin:$PATH"

COPY pyproject.toml .
RUN mkdir -p app && touch app/__init__.py
RUN pip install --upgrade pip setuptools && \
    pip install --no-cache-dir .

RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-mpnet-base-v2')"

RUN playwright install chromium --with-deps

# ── Stage 2: Slim runtime ─────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /project

RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
    libgbm1 libasound2 libpango-1.0-0 libcairo2 && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /project/venv /project/venv
COPY --from=builder /root/.cache /root/.cache
COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright

COPY pyproject.toml .
COPY ./app ./app

ENV PATH="/project/venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/home/appuser/.cache/huggingface \
    SENTENCE_TRANSFORMERS_HOME=/home/appuser/.cache/huggingface \
    PLAYWRIGHT_BROWSERS_PATH=/home/appuser/.cache/ms-playwright

RUN useradd -m appuser && \
    cp -r /root/.cache /home/appuser/.cache && \
    chown -R appuser /project /home/appuser/.cache

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]