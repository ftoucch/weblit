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
    pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir .

RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')"

# ── Stage 2: Slim runtime ─────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /project

RUN useradd -m appuser

# --chown copies straight into the new layer with the right owner, instead of
# COPY-then-`chown -R`, which forces Docker to duplicate the entire (multi-GB)
# tree into a second layer just to change its metadata.
COPY --from=builder --chown=appuser:appuser /project/venv /project/venv
COPY --from=builder --chown=appuser:appuser /root/.cache /home/appuser/.cache

COPY --chown=appuser:appuser pyproject.toml .
COPY --chown=appuser:appuser ./app ./app

ENV PATH="/project/venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/home/appuser/.cache/huggingface \
    SENTENCE_TRANSFORMERS_HOME=/home/appuser/.cache/huggingface

USER appuser

EXPOSE 8000

# Railway (and most PaaS) inject $PORT at runtime — bind to it, falling back to 8000 locally.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
