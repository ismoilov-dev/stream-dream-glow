import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "./auth-store";
import type {
  Actor,
  AuthTokens,
  Episode,
  Favorite,
  Genre,
  MovieDetail,
  MovieListItem,
  Paginated,
  SearchResults,
  Season,
  SeriesDetail,
  SeriesListItem,
  Subscription,
  SubscriptionPlan,
  User,
  WatchHistory,
  WatchProgress,
} from "./types";

// ─── Base URLs ────────────────────────────────────────────────────────────────
// Barcha API so'rovlari bevosita backendga ketadi.
// Development: vite.config.ts dagi proxy "/api" → "http://16.170.235.75" ga yo'naltiradi.
// Production:  VITE_API_URL env o'zgaruvchisi orqali to'g'ridan-to'g'ri backend URL.
const BACKEND = import.meta.env.VITE_API_URL ?? "http://16.170.235.75";

export const API_BASE = `${BACKEND}/api`;

// Rasmlar/mediya fayllar uchun proxy root (same-origin HTTPS orqali)
export const PROXY_ROOT = `${BACKEND}`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ─── Request interceptor: Bearer token qo'shish ──────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().tokens?.access;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: 401 da token yangilash ────────────────────────────
let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const refresh = useAuthStore.getState().tokens?.refresh;

    if (
      status === 401 &&
      refresh &&
      !original._retry &&
      !original.url?.includes("/auth/")
    ) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = (async () => {
            try {
              const { data } = await axios.post<{ access: string }>(
                `${API_BASE}/auth/refresh/`,
                { refresh },
              );
              useAuthStore.getState().setTokens({ access: data.access, refresh });
              return data.access;
            } catch {
              useAuthStore.getState().logout();
              return null;
            } finally {
              refreshing = null;
            }
          })();
        }
        const newAccess = await refreshing;
        if (newAccess && original.headers) {
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);
        }
      } catch {
        // fall through
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const Auth = {
  login: (username: string, password: string) =>
    api.post<AuthTokens>("/auth/login/", { username, password }).then((r) => r.data),

  register: (payload: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name?: string;
    last_name?: string;
  }) => api.post("/auth/register/", payload).then((r) => r.data),

  refresh: (refresh: string) =>
    api.post<{ access: string }>("/auth/refresh/", { refresh }).then((r) => r.data),

  verify: (token: string) =>
    api.post("/auth/verify/", { token }).then((r) => r.data),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const Users = {
  me: () => api.get<User>("/users/me/").then((r) => r.data),
  update: (id: number, payload: Partial<User>) =>
    api.patch<User>(`/users/${id}/`, payload).then((r) => r.data),
  changePassword: (old_password: string, new_password: string) =>
    api.post("/users/change-password/", { old_password, new_password }).then((r) => r.data),
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<User>>("/users/", { params }).then((r) => r.data),
};

// ─── Movies ───────────────────────────────────────────────────────────────────
export const Movies = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<MovieListItem>>("/movies/", { params }).then((r) => r.data),
  detail: (slug: string) =>
    api.get<MovieDetail>(`/movies/${slug}/`).then((r) => r.data),
  trending: () =>
    api.get<MovieListItem[] | Paginated<MovieListItem>>("/movies/trending/").then((r) => r.data),
  newReleases: () =>
    api.get<MovieListItem[] | Paginated<MovieListItem>>("/movies/new-releases/").then((r) => r.data),
  incrementViews: (slug: string) =>
    api.post(`/movies/${slug}/increment-views/`).then((r) => r.data),
  similar: (slug: string) =>
    api
      .get<MovieListItem[] | Paginated<MovieListItem>>(`/recommendations/movies/similar/${slug}/`)
      .then((r) => r.data),
  forMe: () =>
    api
      .get<MovieListItem[] | Paginated<MovieListItem>>("/recommendations/movies/for-me/")
      .then((r) => r.data),
};

// ─── Series ───────────────────────────────────────────────────────────────────
export const SeriesApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<SeriesListItem>>("/series/", { params }).then((r) => r.data),
  detail: (slug: string) =>
    api.get<SeriesDetail>(`/series/${slug}/`).then((r) => r.data),
  trending: () =>
    api.get<SeriesListItem[] | Paginated<SeriesListItem>>("/series/trending/").then((r) => r.data),
  newReleases: () =>
    api
      .get<SeriesListItem[] | Paginated<SeriesListItem>>("/series/new-releases/")
      .then((r) => r.data),
  similar: (slug: string) =>
    api
      .get<SeriesListItem[] | Paginated<SeriesListItem>>(`/recommendations/series/similar/${slug}/`)
      .then((r) => r.data),
  forMe: () =>
    api
      .get<SeriesListItem[] | Paginated<SeriesListItem>>("/recommendations/series/for-me/")
      .then((r) => r.data),
};

// ─── Seasons & Episodes ───────────────────────────────────────────────────────
export const Seasons = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<Season>>("/seasons/", { params }).then((r) => r.data),
  detail: (id: number) =>
    api.get<Season>(`/seasons/${id}/`).then((r) => r.data),
};

export const Episodes = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<Episode>>("/episodes/", { params }).then((r) => r.data),
  detail: (id: number) =>
    api.get<Episode>(`/episodes/${id}/`).then((r) => r.data),
  incrementViews: (id: number) =>
    api.post(`/episodes/${id}/increment-views/`).then((r) => r.data),
};

// ─── Genres & Actors ──────────────────────────────────────────────────────────
export const Genres = {
  list: () => api.get<Paginated<Genre>>("/genres/").then((r) => r.data),
  detail: (slug: string) =>
    api.get<Genre>(`/genres/${slug}/`).then((r) => r.data),
};

export const Actors = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<Actor>>("/actors/", { params }).then((r) => r.data),
  detail: (slug: string) =>
    api.get<Actor>(`/actors/${slug}/`).then((r) => r.data),
};

// ─── Search ───────────────────────────────────────────────────────────────────
export const Search = {
  query: (q: string) =>
    api.get<SearchResults>("/search/", { params: { q } }).then((r) => r.data),
};

// ─── Favorites ────────────────────────────────────────────────────────────────
export const Favorites = {
  list: () =>
    api.get<Paginated<Favorite>>("/analytics/favorites/").then((r) => r.data),
  add: (payload: { movie?: number; series?: number }) =>
    api.post<Favorite>("/analytics/favorites/", payload).then((r) => r.data),
  remove: (id: number) =>
    api.delete(`/analytics/favorites/${id}/`).then((r) => r.data),
};

// ─── Watch History ────────────────────────────────────────────────────────────
export const History = {
  list: () =>
    api.get<Paginated<WatchHistory>>("/analytics/history/").then((r) => r.data),
  clear: () =>
    api.post("/analytics/history/clear/").then((r) => r.data),
};

// ─── Watch Progress ───────────────────────────────────────────────────────────
export const Progress = {
  list: () =>
    api.get<Paginated<WatchProgress>>("/analytics/progress/").then((r) => r.data),
  continueWatching: () =>
    api
      .get<WatchProgress[] | Paginated<WatchProgress>>("/analytics/progress/continue-watching/")
      .then((r) => r.data),
  update: (payload: {
    movie_id?: number;
    episode_id?: number;
    position_seconds: number;
    duration_seconds?: number;
  }) =>
    api.post<WatchProgress>("/analytics/progress/update/", payload).then((r) => r.data),
};

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const Subscriptions = {
  plans: () =>
    api.get<Paginated<SubscriptionPlan>>("/subscriptions/plans/").then((r) => r.data),
  mine: () =>
    api.get<Subscription>("/subscriptions/my-subscription/").then((r) => r.data),
  subscribe: (plan_id: number, provider?: string) =>
    api.post("/subscriptions/subscribe/", { plan_id, provider }).then((r) => r.data),
  cancel: (id: number) =>
    api.post(`/subscriptions/${id}/cancel/`).then((r) => r.data),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function unwrapList<T>(data: T[] | Paginated<T> | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

/**
 * Upstream HTTP asset URL ni to'g'ridan-to'g'ri backend orqali qaytaradi.
 * (Agar CORS muammosi bo'lsa, same-origin proxy ishlatiladi)
 */
export function assetUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url, BACKEND);
    return `${PROXY_ROOT}${u.pathname}${u.search}`;
  } catch {
    return url;
  }
}