import uuid
from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey, String, Text, Boolean, Integer, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.core.config import config
from app.enums.user import UserRole


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)

    role: Mapped[str] = mapped_column(String, default=UserRole.USER.value)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class Paper(Base):
    __tablename__ = "papers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title: Mapped[str] = mapped_column(Text, nullable=False)
    abstract: Mapped[str | None] = mapped_column(Text, nullable=True)
    authors: Mapped[list] = mapped_column(JSONB, default=list)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    field_of_study: Mapped[str | None] = mapped_column(String, nullable=True)
    doi: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)
    source_url: Mapped[str | None] = mapped_column(String, nullable=True)
    citation_count: Mapped[int | None] = mapped_column(Integer, nullable=True)

    source: Mapped[str] = mapped_column(String, nullable=False)
    source_id: Mapped[str] = mapped_column(String, nullable=False)

    full_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    full_text_source: Mapped[str | None] = mapped_column(String, nullable=True)
    has_full_text: Mapped[bool] = mapped_column(Boolean, default=False)
    oa_url: Mapped[str | None] = mapped_column(String, nullable=True)

    abstract_embedding: Mapped[list | None] = mapped_column(Vector(config.vector_size), nullable=True)

    fulltext_indexed: Mapped[bool] = mapped_column(Boolean, default=False)

    indexed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FulltextChunk(Base):
    __tablename__ = "fulltext_chunks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paper_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("papers.id", ondelete="CASCADE"), nullable=False, index=True)

    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    start_char: Mapped[int] = mapped_column(Integer, nullable=False)
    end_char: Mapped[int] = mapped_column(Integer, nullable=False)

    chunk_embedding: Mapped[list] = mapped_column(Vector(config.vector_size), nullable=False)

    paper: Mapped["Paper"] = relationship()


class NoveltyCheck(Base):
    __tablename__ = "novelty_checks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True, index=True)

    input_text: Mapped[str] = mapped_column(Text, nullable=False)
    field_of_study: Mapped[str | None] = mapped_column(String, nullable=True)
    year_from: Mapped[int | None] = mapped_column(Integer, nullable=True)
    year_to: Mapped[int | None] = mapped_column(Integer, nullable=True)

    novelty_score: Mapped[float] = mapped_column(Float, nullable=False)
    verdict: Mapped[str] = mapped_column(String, nullable=False)
    aspects: Mapped[dict] = mapped_column(JSONB, nullable=False)
    recommendation: Mapped[str] = mapped_column(Text, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class FullTextCheck(Base):
    __tablename__ = "fulltext_checks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True, index=True)

    input_preview: Mapped[str] = mapped_column(Text, nullable=False)
    field_of_study: Mapped[str | None] = mapped_column(String, nullable=True)
    year_from: Mapped[int | None] = mapped_column(Integer, nullable=True)
    year_to: Mapped[int | None] = mapped_column(Integer, nullable=True)

    overall_similarity: Mapped[float] = mapped_column(Float, nullable=False)
    total_chunks: Mapped[int] = mapped_column(Integer, nullable=False)
    high_similarity_chunks: Mapped[int] = mapped_column(Integer, nullable=False)
    medium_similarity_chunks: Mapped[int] = mapped_column(Integer, nullable=False)
    low_similarity_chunks: Mapped[int] = mapped_column(Integer, nullable=False)

    chunks: Mapped[list] = mapped_column(JSONB, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SavedSearch(Base):
    __tablename__ = "saved_searches"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)

    query: Mapped[str] = mapped_column(Text, nullable=False)
    filters: Mapped[dict] = mapped_column(JSONB, default=dict)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class OTPCode(Base):
    __tablename__ = "otp_codes"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    purpose: Mapped[str] = mapped_column(String, primary_key=True)

    code: Mapped[str] = mapped_column(String, nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0)

    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    cooldown_until: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
