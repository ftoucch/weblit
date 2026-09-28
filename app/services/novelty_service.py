import logging
import asyncio
import math
import uuid
from datetime import datetime
from typing import AsyncGenerator

from sqlalchemy import select

from app.db.postgres import AsyncSessionLocal
from app.models.orm import Paper, NoveltyCheck
from app.models.paper import FetchedPaper
from app.schemas.novelty import (
    NoveltyCheckRequest,
    NoveltyCheckResult,
    NoveltyAspects,
    AspectResult,
    RelatedWork,
)
from app.services.embedding_service import embedding_service
from app.services.ingestion_service import ingestion_service
from app.services.fulltext_ingestion_service import fulltext_ingestion_service
from app.services.sources.base import BaseSource
from app.services.sources.openalex import openalex_source

logger = logging.getLogger(__name__)

CURRENT_YEAR = datetime.utcnow().year

SOURCES: dict[str, BaseSource] = {
    "openalex": openalex_source,
}

TOPIC_HINTS = [
    "research topic", "study", "investigate", "focus on", "aim to", "objective",
    "purpose", "this paper", "we explore", "we examine", "concerned with",
    "related to", "area of", "field of",
]

PROBLEM_HINTS = [
    "problem", "challenge", "gap", "limitation", "issue", "lack", "need",
    "currently", "existing", "however", "unfortunately", "despite", "although",
    "no existing", "few studies", "little work", "not yet", "unsolved",
    "open question", "remains unclear",
]

METHOD_HINTS = [
    "method", "approach", "technique", "algorithm", "model", "framework",
    "architecture", "using", "employ", "propose", "we use", "we apply",
    "novel", "new approach", "we develop", "we design", "we introduce",
    "based on", "leveraging",
]

DOMAIN_HINTS = [
    "application", "domain", "field", "area", "industry", "context",
    "dataset", "experiment", "evaluation", "clinical", "medical", "healthcare",
    "deployed", "applied to", "use case", "real-world", "in practice",
]


def _extract_aspect_sentences(text: str, hints: list[str]) -> str:
    sentences = [s.strip() for s in text.replace("\n", " ").split(".") if s.strip()]
    matched = [s for s in sentences if any(h in s.lower() for h in hints)]
    return ". ".join(matched) if matched else text[:500]


def _recency_weight(year: int | None, citations: int | None) -> float:
    recency = 1.0
    if year:
        age = max(0, CURRENT_YEAR - year)
        recency = 1 / (1 + age * 0.1)
    citation_boost = 1.0
    if citations:
        citation_boost = 1 + math.log1p(citations) * 0.1
    return recency * citation_boost


def _weighted_novelty(papers: list[tuple[dict, float]]) -> float:
    if not papers:
        return 1.0

    total_weight = 0.0
    weighted_sim = 0.0

    for doc, similarity in papers:
        weight = _recency_weight(doc.get("year"), doc.get("citation_count"))
        weighted_sim += similarity * weight
        total_weight += weight

    avg_similarity = weighted_sim / total_weight if total_weight > 0 else 0.0
    return round(1 - avg_similarity, 4)


def _verdict(score: float) -> str:
    if score >= 0.80:
        return "Highly novel"
    if score >= 0.60:
        return "Moderately novel"
    if score >= 0.40:
        return "Somewhat novel"
    if score >= 0.20:
        return "Limited novelty"
    return "Low novelty — well covered territory"


def _aspect_summary(aspect: str, score: float, related_works: list[RelatedWork]) -> str:
    count = len(related_works)
    coverage = "well covered" if score < 0.4 else "moderately covered" if score < 0.7 else "less explored"
    years = [r.year for r in related_works if r.year]
    year_range = f"{min(years)}–{max(years)}" if years else "various years"

    summaries = {
        "topic": f"Research topic is {coverage} in existing literature — {count} related works found ({year_range}).",
        "problem_statement": f"Problem statement is {coverage} — {count} papers address similar gaps ({year_range}).",
        "methodology": f"Proposed methodology is {coverage} — {count} papers use similar approaches ({year_range}).",
        "domain": f"Application domain is {coverage} — {count} related works in this area ({year_range}).",
    }
    return summaries.get(aspect, f"Aspect is {coverage} — {count} related works found ({year_range}).")


def _top_paper(aspect_result: AspectResult) -> RelatedWork | None:
    if not aspect_result.related_works:
        return None
    return max(aspect_result.related_works, key=lambda r: r.similarity)


def _aspect_coverage_line(name: str, result: AspectResult) -> str:
    pct = round(result.score * 100)
    top = _top_paper(result)
    count = len(result.related_works)

    if result.score >= 0.7:
        line = f"Your {name} is your strongest angle ({pct}% novel)"
        if top:
            line += f" — the closest existing work is '{top.title}'"
            if top.year:
                line += f" ({top.year})"
            line += f" at {round(top.similarity * 100)}% similarity"
        if count:
            line += f", with only {count} related papers found"
        return line + "."

    if result.score >= 0.4:
        line = f"Your {name} is moderately covered ({pct}% novel)"
        if top:
            line += f" — '{top.title}'"
            if top.year:
                line += f" ({top.year})"
            line += f" is the most similar at {round(top.similarity * 100)}%"
        return line + "."

    line = f"Your {name} is well covered territory ({pct}% novel)"
    if top:
        line += f" — '{top.title}'"
        if top.year:
            line += f" ({top.year})"
        line += f" already addresses this at {round(top.similarity * 100)}% similarity"
    if count:
        line += f", and {count} other papers overlap significantly"
    return line + "."


def _recommendation(aspects: NoveltyAspects, overall: float) -> str:
    aspect_map = {
        "topic": aspects.topic,
        "problem statement": aspects.problem_statement,
        "methodology": aspects.methodology,
        "domain": aspects.domain,
    }
    scores = {k: v.score for k, v in aspect_map.items()}
    strongest = max(scores, key=lambda k: scores[k])
    weakest = min(scores, key=lambda k: scores[k])
    overall_pct = round(overall * 100)

    lines = []

    for name, result in aspect_map.items():
        lines.append(_aspect_coverage_line(name, result))

    lines.append("")

    if overall >= 0.7:
        lines.append(
            f"Overall your research is highly novel ({overall_pct}%). "
            f"Lead with your {strongest} in your proposal — it is your clearest differentiator."
        )
    elif overall >= 0.4:
        weakest_top = _top_paper(aspect_map[weakest])
        lines.append(
            f"Overall novelty is moderate ({overall_pct}%). "
            f"Frame your proposal around your {strongest} to stand out. "
        )
        if weakest_top:
            lines.append(
                f"For your {weakest}, explicitly acknowledge \'{weakest_top.title}\'"
                + (f" ({weakest_top.year})" if weakest_top.year else "")
                + " and articulate clearly how your work differs."
            )
        else:
            lines.append(f"For your {weakest}, explicitly position against existing work.")
    else:
        weakest_top = _top_paper(aspect_map[weakest])
        lines.append(
            f"This is a well-researched area ({overall_pct}% novel). "
            f"To strengthen your proposal, narrow the scope significantly — "
            f"focus on a specific gap that the existing literature has not addressed. "
        )
        if weakest_top:
            lines.append(
                f"Pay particular attention to \'{weakest_top.title}\'"
                + (f" ({weakest_top.year})" if weakest_top.year else "")
                + " — it is the closest match and reviewers will likely compare your work against it."
            )

    return " ".join(lines)


class NoveltyService:

    async def _search_similar(
        self,
        vector: list[float],
        request: NoveltyCheckRequest,
        top_k: int,
    ) -> list[tuple[dict, float]]:
        async with AsyncSessionLocal() as session:
            distance_expr = Paper.abstract_embedding.cosine_distance(vector)
            stmt = (
                select(Paper, distance_expr.label("distance"))
                .where(Paper.abstract_embedding.is_not(None))
            )
            if request.year_from:
                stmt = stmt.where(Paper.year >= request.year_from)
            if request.year_to:
                stmt = stmt.where(Paper.year <= request.year_to)

            stmt = stmt.order_by(distance_expr).limit(top_k)
            result = await session.execute(stmt)
            rows = result.all()

        return [
            (
                {
                    "_id": str(paper.id),
                    "title": paper.title,
                    "year": paper.year,
                    "doi": paper.doi,
                    "source_url": paper.source_url,
                    "citation_count": paper.citation_count,
                },
                1 - distance,
            )
            for paper, distance in rows
        ]

    async def _search_sources(
        self,
        query_text: str,
        request: NoveltyCheckRequest,
    ) -> list[FetchedPaper]:
        tasks = [
            source.fetch(
                query=query_text,
                limit=request.top_k,
                year_from=request.year_from,
                year_to=request.year_to,
                field_of_study=request.field_of_study,
            )
            for source in SOURCES.values()
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        papers: list[FetchedPaper] = []
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Source fetch failed: {result}")
                continue
            if isinstance(result, list):
                papers.extend(result)

        return papers

    def _to_related_work(self, doc: dict, similarity: float) -> RelatedWork:
        return RelatedWork(
            id=str(doc.get("_id", "")),
            title=doc.get("title", ""),
            year=doc.get("year"),
            doi=doc.get("doi"),
            source_url=doc.get("source_url"),
            citation_count=doc.get("citation_count"),
            similarity=round(similarity, 4),
        )

    async def _score_aspect(
        self,
        aspect_text: str,
        request: NoveltyCheckRequest,
        aspect_name: str,
    ) -> tuple[AspectResult, list[FetchedPaper]]:
        aspect_vector = await embedding_service.embed(aspect_text)

        cached_results = await self._search_similar(aspect_vector, request, request.top_k)

        fresh_papers = await self._search_sources(aspect_text, request)

        seen_ids = {doc["_id"] for doc, _ in cached_results}
        seen_source_ids = set()
        new_to_ingest: list[FetchedPaper] = []
        fresh_results: list[tuple[dict, float]] = []

        for paper in fresh_papers:
            key = f"{paper.source}:{paper.source_id}"
            if key in seen_source_ids:
                continue

            paper_text = f"{paper.title}. {paper.abstract}" if paper.abstract else paper.title
            paper_vector = await embedding_service.embed(paper_text)
            similarity = sum(a * b for a, b in zip(aspect_vector, paper_vector))

            paper.id = str(uuid.uuid4())

            pseudo_doc = {
                "_id": paper.id,
                "title": paper.title,
                "year": paper.year,
                "doi": paper.doi,
                "source_url": paper.source_url,
                "citation_count": paper.citation_count,
            }

            fresh_results.append((pseudo_doc, similarity))
            new_to_ingest.append(paper)
            seen_source_ids.add(key)

        all_results = cached_results + fresh_results
        all_results.sort(key=lambda x: x[1], reverse=True)
        top_results = all_results[:request.top_k]

        novelty = _weighted_novelty(top_results)
        related_works = [self._to_related_work(doc, sim) for doc, sim in top_results]
        summary = _aspect_summary(aspect_name, novelty, related_works)

        return AspectResult(
            score=novelty,
            summary=summary,
            related_works=related_works,
        ), new_to_ingest

    async def _save_check(
        self,
        request: NoveltyCheckRequest,
        result: NoveltyCheckResult,
        user_id: str | None,
    ) -> None:
        try:
            async with AsyncSessionLocal() as session:
                session.add(NoveltyCheck(
                    id=uuid.uuid4(),
                    user_id=uuid.UUID(user_id) if user_id else None,
                    input_text=request.text,
                    field_of_study=request.field_of_study,
                    year_from=request.year_from,
                    year_to=request.year_to,
                    novelty_score=result.novelty_score,
                    verdict=result.verdict,
                    aspects=result.aspects.model_dump(),
                    recommendation=result.recommendation,
                ))
                await session.commit()
        except Exception as e:
            logger.error(f"Failed to save novelty check: {e}")

    async def check_stream(
        self,
        request: NoveltyCheckRequest,
        user_id: str | None = None,
    ) -> AsyncGenerator[dict, None]:
        try:
            yield {"type": "progress", "message": "Analysing your text…", "progress": 5}

            topic_text     = _extract_aspect_sentences(request.text, TOPIC_HINTS)
            problem_text   = _extract_aspect_sentences(request.text, PROBLEM_HINTS)
            method_text    = _extract_aspect_sentences(request.text, METHOD_HINTS)
            domain_text    = _extract_aspect_sentences(request.text, DOMAIN_HINTS)

            yield {"type": "progress", "message": "Checking topic novelty…", "progress": 20}
            topic_result, topic_new = await self._score_aspect(topic_text, request, "topic")

            yield {"type": "progress", "message": "Checking problem statement novelty…", "progress": 40}
            problem_result, problem_new = await self._score_aspect(problem_text, request, "problem_statement")

            yield {"type": "progress", "message": "Checking methodology novelty…", "progress": 60}
            method_result, method_new = await self._score_aspect(method_text, request, "methodology")

            yield {"type": "progress", "message": "Checking domain novelty…", "progress": 78}
            domain_result, domain_new = await self._score_aspect(domain_text, request, "domain")

            yield {"type": "progress", "message": "Computing novelty score…", "progress": 92}

            aspects = NoveltyAspects(
                topic=topic_result,
                problem_statement=problem_result,
                methodology=method_result,
                domain=domain_result,
            )

            overall_score = round(
                (
                    topic_result.score +
                    problem_result.score +
                    method_result.score +
                    domain_result.score
                ) / 4,
                4,
            )

            result = NoveltyCheckResult(
                novelty_score=overall_score,
                verdict=_verdict(overall_score),
                aspects=aspects,
                recommendation=_recommendation(aspects, overall_score),
            )

            await self._save_check(request, result, user_id)

            all_new = list(
                {p.source_id: p for p in topic_new + problem_new + method_new + domain_new}.values()
            )
            if all_new:
                try:
                    stored = await ingestion_service.ingest(all_new)
                    fulltext_rows = [p for p in stored if p.has_full_text]
                    if fulltext_rows:
                        await fulltext_ingestion_service.index_batch(fulltext_rows)
                except Exception as e:
                    logger.error(f"Failed to ingest novelty-check papers: {e}")

            yield {"type": "result", "result": result.model_dump()}

        except Exception as e:
            logger.error(f"Novelty check error: {e}")
            yield {"type": "error", "message": str(e)}


novelty_service = NoveltyService()
