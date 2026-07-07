import { useAuthStore } from "@/stores/auth.store";
import { create } from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://dev.apiv2.inuk.in";

export { API_BASE_URL };

export const api = create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor ─────────────────────────────────────────────────────
// Read API key and auth token on EVERY request so they're never stale.
// axios.create() default headers are frozen at init time — env vars may not
// be defined yet when the module first loads, so we set them here instead.
api.interceptors.request.use(
  (config) => {
    // API key — read fresh from process.env each time
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    } else if (__DEV__) {
      console.warn(
        "[axios] EXPO_PUBLIC_API_KEY is not set — request may fail.",
      );
    }

    // Auth token from Zustand (works outside React components)
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-logout on 401 when the user is already authenticated.
    // Avoids accidentally triggering logout on auth/OTP screen errors.
    if (
      error.response?.status === 401 &&
      useAuthStore.getState().isAuthenticated
    ) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
