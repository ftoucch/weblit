import { streamRequest } from '$lib/api/client';
import type { SearchParams, SearchResultEvent } from '$lib/types/researchPaper';
import camelcaseKeys from 'camelcase-keys';

export async function* searchPapers(
  params: SearchParams,
  token?: string
): AsyncGenerator<SearchResultEvent> {
  const response = await streamRequest(
    '/search/papers',
    {
      query: params.query,
      sources: ['openalex'],
      limit: params.limit ?? 100,
      minSimilarity: params.minSimilarity ?? 0.5,
      ...(params.include && { inclusionCriteria: params.include }),
      ...(params.exclude && { exclusionCriteria: params.exclude }),
      ...(params.fieldOfStudy && { fieldOfStudy: params.fieldOfStudy }),
      ...(params.yearFrom && { yearFrom: params.yearFrom }),
      ...(params.yearTo && { yearTo: params.yearTo }),
    },
    token
  );

  if (!response.ok || !response.body) {
    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        yield camelcaseKeys(JSON.parse(line.slice(6)), { deep: true }) as SearchResultEvent;
      } catch {
        // malformed line, skip
      }
    }
  }
}

export async function* continuePapers(
  cursor: string,
  inclusionCriteria?: string,
  exclusionCriteria?: string,
  token?: string
): AsyncGenerator<SearchResultEvent> {
  const response = await streamRequest(
    '/search/papers/continue',
    {
      cursor,
      ...(inclusionCriteria && { inclusionCriteria }),
      ...(exclusionCriteria && { exclusionCriteria }),
    },
    token
  );

  if (!response.ok || !response.body) {
    throw new Error(`Continue failed: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        yield camelcaseKeys(JSON.parse(line.slice(6)), { deep: true }) as SearchResultEvent;
      } catch {
        continue;
      }
    }
  }
}
