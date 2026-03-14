import { writable, derived } from "svelte/store";
import type { User, AuthState } from "$lib/types/user";

const isBrowser = typeof localStorage !== "undefined";

function createAuthStore() {

    const storedUser = isBrowser ? localStorage.getItem("user") : null;
    const storedToken = isBrowser ? localStorage.getItem("token") : null;

    const { subscribe, set, update } = writable<AuthState>({
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken,
        isLoading: false
    });

    return {
        subscribe,

        setToken(token: string) {
            if (isBrowser) localStorage.setItem("token", token);
            update((s) => ({ ...s, token }));
        },

        setUser(user: User) {
            if (isBrowser) localStorage.setItem("user", JSON.stringify(user));
            update((s) => ({ ...s, user }));
        },

        clearUser() {
            if (isBrowser) localStorage.removeItem("user");
            update((s) => ({ ...s, user: null }));
        },

        logout() {
            if (isBrowser) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
            set({ user: null, token: null, isLoading: false });
        },

        setIsLoading(isLoading: boolean) {
            update((s) => ({ ...s, isLoading }));
        }
    };
}

export const auth = createAuthStore();

export const currentUser = derived(auth, ($a) => $a.user);
export const isAuthenticated = derived(auth, ($a) => !!$a.token);
export const isAuthorized = derived(auth, ($a) => !!$a.token && $a.user?.isVerified === true);
export const isVerified = derived(auth, ($a) => $a.user?.isVerified === true);
export const isAdmin = derived(auth, ($a) => $a.user?.role === "admin");