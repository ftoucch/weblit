import { auth } from "$lib/stores/auth";
import { get } from "svelte/store";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

function getHeaders(token?: string, extra: Record<string, string> = {}): Record<string, string> {
    const resolvedToken = token ?? get(auth).token;

    return {
        "Content-Type": "application/json",
        ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
        ...extra
    };
}

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return camelcaseKeys(data, { deep: true }) as T;
}

export async function getRequest<T>(path: string, token?: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: getHeaders(token)
    });

    return handleResponse<T>(res);
}

export async function postRequest<T>(path: string, body: unknown, token?: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(snakecaseKeys(body as Record<string, unknown>, { deep: true }))
    });

    return handleResponse<T>(res);
}

export async function deleteRequest(path: string, token?: string): Promise<void> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "DELETE",
        headers: getHeaders(token)
    });

    if (!res.ok) {
        throw await res.json();
    }
}

export function streamRequest(path: string, body: unknown, token?: string): Promise<Response> {
    return fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(snakecaseKeys(body as Record<string, unknown>, { deep: true }))
    });
}

export { BASE_URL };