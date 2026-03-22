import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import { BASE_URL } from '$lib/api/client';
import type { NoveltyCheckParams, NoveltyEvent } from '$lib/types/noveltyCheck';

const WS_BASE_URL = BASE_URL.replace(/^http/, 'ws');

export async function* checkNovelty(params: NoveltyCheckParams): AsyncGenerator<NoveltyEvent> {
  const token = get(auth).token;
  const url = token
    ? `${WS_BASE_URL}/novelty/check?token=${encodeURIComponent(token)}`
    : `${WS_BASE_URL}/novelty/check`;

  const ws = new WebSocket(url);

  const queue: NoveltyEvent[] = [];
  let resolve: (() => void) | null = null;
  let done = false;
  let wsError: string | null = null;

  ws.onopen = () => {
    ws.send(
      JSON.stringify(
        snakecaseKeys(
          {
            text: params.text,
            topK: params.topK ?? 10,
            ...(params.fieldOfStudy && { fieldOfStudy: params.fieldOfStudy }),
            ...(params.yearFrom && { yearFrom: params.yearFrom }),
            ...(params.yearTo && { yearTo: params.yearTo }),
          },
          { deep: true }
        )
      )
    );
  };

  ws.onmessage = (e) => {
    try {
      const raw = JSON.parse(e.data);
      const event = camelcaseKeys(raw, { deep: true }) as NoveltyEvent;
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
      if (wsError) yield { type: 'error', message: wsError } as NoveltyEvent;
      break;
    } else {
      await new Promise<void>((r) => {
        resolve = r;
      });
    }
  }
}
