// api/auth.ts
import { postRequest, getRequest, BASE_URL } from "./client";
import type { AuthTokens, User } from "$lib/types/user";
import camelcaseKeys from "camelcase-keys";

export async function login(email: string, password: string): Promise<AuthTokens> {
    const form = new URLSearchParams({
        username: email,
        password
    });

    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form.toString()
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return camelcaseKeys(data, { deep: true }) as AuthTokens;
}

export function register(payload: {
    name: string;
    email: string;
    password: string;
}): Promise<User> {
    return postRequest('/auth/register', payload);
}

export function verifyOtp(userId: string, otp: string): Promise<{ message: string }> {
    return postRequest('/auth/verify-otp', { userId, otp });
}

export function resendOtp(token?: string): Promise<void> {
    return postRequest("/auth/resend-otp", {}, token);
}

export function getMe(token?: string): Promise<User> {
    return getRequest('/auth/me', token);
}

export function requestPasswordReset(email: string): Promise<{ message: string }> {
    return postRequest('/auth/forgot-password', { email });
}

export function resetPassword(token: string, password: string): Promise<{ message: string }> {
    return postRequest('/auth/reset-password', { token, password });
}