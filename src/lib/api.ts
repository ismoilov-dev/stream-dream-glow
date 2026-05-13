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

export const API_BASE = "/api/proxy";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().tokens?.access;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const refresh = useAuthStore.getState().tokens?.refresh;

    if (status === 401 && refresh && !original._retry && !original.url?.includes("/auth/")) {
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

// ---------- Endpoint helpers ----------

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
  verify: (token: string) => api.post("/auth/verify/", { token }).then((r) => r.data),
};

export const Users = {
  me: () => api.get<User>("/users/me/").then((r) => r.data),
  update: (id: number, payload: Partial<User>) =>
    api.patch<User>(`/users/${id}/`, payload).then((r) => r.data),
  changePassword: (old_password: string, new_password: string) =>
    api.post("/users/change-password/", { old_password, new_password }).then((r) => r.data),
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<User>>("/users/", { params }).then((r) => r.data),
};

export const Movies = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<MovieListItem>>("/movies/", { params }).then((r) => r.data),
  detail: (slug: string) => api.get<MovieDetail>(`/movies/${slug}/`).then((r) => r.data),
  trending: () =>
    api.get<MovieListItem[] | Paginated<MovieListItem>>("/movies/trending/").then((r) => r.data),
  newReleases: () =>
    api
      .get<MovieListItem[] | Paginated<MovieListItem>>("/movies/new-releases/")
      .then((r) => r.data),
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

export const SeriesApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<SeriesListItem>>("/series/", { params }).then((r) => r.data),
  detail: (slug: string) => api.get<SeriesDetail>(`/series/${slug}/`).then((r) => r.data),
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

export const Seasons = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<Season>>("/seasons/", { params }).then((r) => r.data),
  detail: (id: number) => api.get<Season>(`/seasons/${id}/`).then((r) => r.data),
};

export const Episodes = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<Episode>>("/episodes/", { params }).then((r) => r.data),
  detail: (id: number) => api.get<Episode>(`/episodes/${id}/`).then((r) => r.data),
  incrementViews: (id: number) =>
    api.post(`/episodes/${id}/increment-views/`).then((r) => r.data),
};

export const Genres = {
  list: () => api.get<Paginated<Genre>>("/genres/").then((r) => r.data),
  detail: (slug: string) => api.get<Genre>(`/genres/${slug}/`).then((r) => r.data),
};

export const Actors = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<Actor>>("/actors/", { params }).then((r) => r.data),
  detail: (slug: string) => api.get<Actor>(`/actors/${slug}/`).then((r) => r.data),
};

export const Search = {
  query: (q: string) => api.get<SearchResults>("/search/", { params: { q } }).then((r) => r.data),
};

export const Favorites = {
  list: () => api.get<Paginated<Favorite>>("/analytics/favorites/").then((r) => r.data),
  add: (payload: { movie?: number; series?: number }) =>
    api.post<Favorite>("/analytics/favorites/", payload).then((r) => r.data),
  remove: (id: number) => api.delete(`/analytics/favorites/${id}/`).then((r) => r.data),
};

export const History = {
  list: () => api.get<Paginated<WatchHistory>>("/analytics/history/").then((r) => r.data),
  clear: () => api.post("/analytics/history/clear/").then((r) => r.data),
};

export const Progress = {
  list: () => api.get<Paginated<WatchProgress>>("/analytics/progress/").then((r) => r.data),
  continueWatching: () =>
    api
      .get<WatchProgress[] | Paginated<WatchProgress>>("/analytics/progress/continue-watching/")
      .then((r) => r.data),
  update: (payload: {
    movie_id?: number;
    episode_id?: number;
    position_seconds: number;
    duration_seconds?: number;
  }) => api.post<WatchProgress>("/analytics/progress/update/", payload).then((r) => r.data),
};

export const Subscriptions = {
  plans: () => api.get<Paginated<SubscriptionPlan>>("/subscriptions/plans/").then((r) => r.data),
  mine: () => api.get<Subscription>("/subscriptions/my-subscription/").then((r) => r.data),
  subscribe: (plan_id: number, provider?: string) =>
    api.post("/subscriptions/subscribe/", { plan_id, provider }).then((r) => r.data),
  cancel: (id: number) => api.post(`/subscriptions/${id}/cancel/`).then((r) => r.data),
};

export function unwrapList<T>(data: T[] | Paginated<T> | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

export function imageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://16.170.235.75")) return url.replace("http://16.170.235.75", "/api/proxy/..").replace("/api/proxy/../api/", "/api/proxy/");
  if (url.startsWith("/")) return `/api/proxy/..${url}`.replace("/api/proxy/../api/", "/api/proxy/");
  return url;
}
