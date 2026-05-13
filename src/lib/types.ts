// Types derived from the StreamPlay OpenAPI schema.

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type AgeRating = "G" | "PG" | "PG-13" | "R" | "NC-17";
export type SeriesStatus = "ongoing" | "completed" | "cancelled";
export type Quality = "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p";

export interface Genre {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Actor {
  id: number;
  full_name: string;
  slug: string;
  biography?: string;
  birth_date?: string | null;
  photo?: string | null;
}

export interface MovieListItem {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  release_year?: number | null;
  duration_minutes?: number | null;
  age_rating?: AgeRating;
  imdb_rating?: string | null;
  thumbnail?: string | null;
  poster?: string | null;
  is_premium?: boolean;
  views_count?: number;
  genres: Genre[];
}

export interface MovieDetail extends MovieListItem {
  original_title?: string;
  description?: string;
  country?: string;
  language?: string;
  director?: string;
  trailer_url?: string;
  is_published?: boolean;
  actors?: Actor[];
  video_files?: VideoFile[];
}

export interface SeriesListItem {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  release_year?: number | null;
  status?: SeriesStatus;
  total_seasons?: number;
  total_episodes?: number;
  age_rating?: AgeRating;
  imdb_rating?: string | null;
  thumbnail?: string | null;
  poster?: string | null;
  is_premium?: boolean;
  views_count?: number;
  genres: Genre[];
}

export interface SeriesDetail extends SeriesListItem {
  original_title?: string;
  description?: string;
  country?: string;
  language?: string;
  trailer_url?: string;
  seasons?: Season[];
}

export interface Episode {
  id: number;
  season: number;
  number: number;
  title: string;
  description?: string;
  duration_minutes?: number | null;
  thumbnail?: string | null;
  air_date?: string | null;
  views_count: number;
  video_files: VideoFile[];
  created_at: string;
}

export interface Season {
  id: number;
  series: number;
  number: number;
  title?: string;
  description?: string;
  release_year?: number | null;
  poster?: string | null;
  episodes: Episode[];
  created_at: string;
}

export interface Subtitle {
  id: number;
  video_file: number;
  language: string;
  language_name?: string;
  file: string;
  is_default?: boolean;
}

export interface AudioTrack {
  id: number;
  video_file: number;
  language: string;
  language_name?: string;
  file?: string;
  is_default?: boolean;
}

export interface VideoFile {
  id: number;
  movie?: number | null;
  episode?: number | null;
  quality: Quality;
  file?: string | null;
  hls_manifest_url?: string;
  dash_manifest_url?: string;
  size_bytes?: number;
  duration_seconds?: number;
  bitrate_kbps?: number;
  status?: string;
  is_encrypted?: boolean;
  subtitles: Subtitle[];
  audio_tracks: AudioTrack[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
  birth_date?: string | null;
  phone?: string;
  preferred_language?: "uz" | "ru" | "en";
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Favorite {
  id: number;
  user: number;
  movie: number | null;
  series: number | null;
  created_at: string;
}

export interface WatchProgress {
  id: number;
  user: number;
  movie: number | null;
  episode: number | null;
  position_seconds: number;
  duration_seconds: number;
  completed: boolean;
  percentage: number;
  updated_at: string;
}

export interface WatchHistory {
  id: number;
  user: number;
  movie: number | null;
  episode: number | null;
  watched_seconds: number;
  device?: string;
  ip_address?: string | null;
  started_at: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: string;
  currency: string;
  period: string;
  duration_days: number;
  max_quality: Quality;
  max_concurrent_streams: number;
  allows_downloads: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: number;
  user: number;
  plan: number;
  plan_details: SubscriptionPlan;
  status: string;
  started_at: string;
  expires_at: string;
  auto_renew: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SearchResults = {
  movies?: MovieListItem[];
  series?: SeriesListItem[];
  actors?: Actor[];
  results?: Array<MovieListItem | SeriesListItem>;
};
