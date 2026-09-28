import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

function getHeaders(token?: string, extra: Record<string, string> = {}): Record<string, string> {
  const resolvedToken = token ?? get(auth).token;

  return {
    'Content-Type': 'application/json',
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
    ...extra,
  };
}

// FastAPI's custom HTTPExceptions send `detail` as a plain string, but its
// automatic request-validation errors (422s) send `detail` as an array of
// {msg, loc, type, ...} objects — normalise both to a single string here so
// every `catch (e) { message = e?.detail }` call site gets readable text
// instead of Svelte stringifying an object array to "[object Object]".
function extractDetail(data: unknown): string {
  const detail = (data as { detail?: unknown })?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (d && typeof d === 'object' && typeof d.msg === 'string' ? d.msg : JSON.stringify(d)))
      .join(' ');
  }
  return 'Something went wrong';
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json();

  if (!res.ok) {
    throw { detail: extractDetail(data) };
  }

  return camelcaseKeys(data, { deep: true }) as T;
}

export async function getRequest<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(token),
  });

  return handleResponse<T>(res);
}

export async function postRequest<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(snakecaseKeys(body as Record<string, unknown>, { deep: true })),
  });

  return handleResponse<T>(res);
}

export async function deleteRequest(path: string, token?: string): Promise<void> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  if (!res.ok) {
    throw { detail: extractDetail(await res.json()) };
  }
}

export function streamRequest(path: string, body: unknown, token?: string): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(snakecaseKeys(body as Record<string, unknown>, { deep: true })),
  });
}

export { BASE_URL };
