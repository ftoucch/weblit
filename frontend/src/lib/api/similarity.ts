import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import { BASE_URL } from '$lib/api/client';
import type { SimilarityCheckParams, SimilarityEvent } from '$lib/types/similarityCheck';

const WS_BASE_URL = BASE_URL.replace(/^http/, 'ws');

export async function* checkSimilarity(
  params: SimilarityCheckParams
): AsyncGenerator<SimilarityEvent> {
  const token = get(auth).token;
  const url = token
    ? `${WS_BASE_URL}/fulltext/check?token=${encodeURIComponent(token)}`
    : `${WS_BASE_URL}/fulltext/check`;

  const ws = new WebSocket(url);

  const queue: SimilarityEvent[] = [];
  let resolve: (() => void) | null = null;
  let done = false;
  let wsError: string | null = null;

  ws.onopen = () => {
    const payload: Record<string, unknown> = {
      minSimilarity: params.minSimilarity ?? 0.5,
      ...(params.text && { text: params.text }),
      ...(params.pdfBase64 && { pdfBase64: params.pdfBase64 }),
      ...(params.fieldOfStudy && { fieldOfStudy: params.fieldOfStudy }),
      ...(params.yearFrom && { yearFrom: params.yearFrom }),
      ...(params.yearTo && { yearTo: params.yearTo }),
    };
    ws.send(JSON.stringify(snakecaseKeys(payload, { deep: true })));
  };

  ws.onmessage = (e) => {
    try {
      const raw = JSON.parse(e.data);
      const event = camelcaseKeys(raw, { deep: true }) as SimilarityEvent;
      queue.push(event);
      resolve?.();
      resolve = null;
      if (event.type === 'result' || event.type === 'error') {
        done = true;
        ws.close();
      }
    } catch {
      // skip malformed message
    }
  };

  ws.onerror = () => {
    wsError = 'WebSocket connection failed';
    done = true;
    resolve?.();
    resolve = null;
  };

  ws.onclose = () => {
    done = true;
    resolve?.();
    resolve = null;
  };

  while (true) {
    if (queue.length > 0) {
      yield queue.shift()!;
    } else if (done) {
      if (wsError) yield { type: 'error', message: wsError } as SimilarityEvent;
      break;
    } else {
      await new Promise<void>((r) => {
        resolve = r;
      });
    }
  }
}
