import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Movies, SeriesApi, Genres, Progress, unwrapList } from "@/lib/api";
import { HeroBanner } from "@/components/media/HeroBanner";
import { MediaRow } from "@/components/media/MediaRow";
import { useAuthStore } from "@/lib/auth-store";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StreamPlay — Watch movies & series in cinematic quality" },
      { name: "description", content: "Stream trending movies and series. Personalized recommendations, continue watching, and more." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated } = useAuthStore();

  const trendingMovies = useQuery({ queryKey: ["movies", "trending"], queryFn: Movies.trending });
  const newMovies = useQuery({ queryKey: ["movies", "new"], queryFn: Movies.newReleases });
  const popularMovies = useQuery({ queryKey: ["movies", "popular"], queryFn: () => Movies.list({ ordering: "-views_count", page: 1 }) });
  const trendingSeries = useQuery({ queryKey: ["series", "trending"], queryFn: SeriesApi.trending });
  const newSeries = useQuery({ queryKey: ["series", "new"], queryFn: SeriesApi.newReleases });
  const genres = useQuery({ queryKey: ["genres"], queryFn: Genres.list });
  const forMe = useQuery({
    queryKey: ["recs", "movies", "me"],
    queryFn: Movies.forMe,
    enabled: isAuthenticated,
  });
  const continueWatching = useQuery({
    queryKey: ["progress", "continue"],
    queryFn: Progress.continueWatching,
    enabled: isAuthenticated,
  });

  const trendingMoviesList = useMemo(() => unwrapList(trendingMovies.data), [trendingMovies.data]);
  const newMoviesList = useMemo(() => unwrapList(newMovies.data), [newMovies.data]);
  const popularMoviesList = useMemo(() => unwrapList(popularMovies.data), [popularMovies.data]);
  const trendingSeriesList = useMemo(() => unwrapList(trendingSeries.data), [trendingSeries.data]);
  const newSeriesList = useMemo(() => unwrapList(newSeries.data), [newSeries.data]);
  const forMeList = useMemo(() => unwrapList(forMe.data), [forMe.data]);

  // Hero rotates among trending
  const [heroIdx, setHeroIdx] = useState(0);
  const heroPool = trendingMoviesList.length > 0 ? trendingMoviesList : popularMoviesList;
  useEffect(() => {
    if (heroPool.length < 2) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % Math.min(5, heroPool.length)), 8000);
    return () => clearInterval(t);
  }, [heroPool.length]);

  const heroItem = heroPool[heroIdx]
    ? { ...heroPool[heroIdx], kind: "movies" as const }
    : null;

  return (
    <div className="pb-16">
      <HeroBanner item={heroItem} />

      {isAuthenticated && (
        <ContinueWatchingRow data={continueWatching.data} />
      )}

      <MediaRow
        title="Trending Movies"
        items={trendingMoviesList}
        kind="movies"
        isLoading={trendingMovies.isLoading}
      />
      {isAuthenticated && (
        <MediaRow title="Recommended for you" items={forMeList} kind="movies" isLoading={forMe.isLoading} />
      )}
      <MediaRow title="Trending Series" items={trendingSeriesList} kind="series" isLoading={trendingSeries.isLoading} />
      <MediaRow title="New Movie Releases" items={newMoviesList} kind="movies" isLoading={newMovies.isLoading} variant="landscape" />
      <MediaRow title="New Series" items={newSeriesList} kind="series" isLoading={newSeries.isLoading} />
      <MediaRow title="Popular on StreamPlay" items={popularMoviesList} kind="movies" isLoading={popularMovies.isLoading} />

      {/* Genres */}
      {genres.data && (
        <section className="mt-14 mx-auto max-w-[1600px] px-4 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold tracking-tight mb-4">Browse by genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {unwrapList(genres.data).map((g, i) => (
              <Link
                key={g.id}
                to="/movies"
                search={{ genre: g.slug }}
                className="relative h-20 rounded-lg overflow-hidden gradient-brand grid place-items-center text-primary-foreground font-semibold text-sm transition hover:brightness-110"
                style={{
                  filter: `hue-rotate(${(i * 45) % 360}deg)`,
                }}
              >
                <span className="relative z-10">{g.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ContinueWatchingRow({ data }: { data: unknown }) {
  const list = unwrapList(data as never) as Array<{
    id: number;
    movie: number | null;
    episode: number | null;
    percentage: number;
    position_seconds: number;
  }>;
  if (!list || list.length === 0) return null;
  // We don't have direct slug info from progress endpoint, so render a compact row of placeholders linking to history
  return (
    <section className="mt-10 mx-auto max-w-[1600px] px-4 lg:px-8">
      <h2 className="text-lg md:text-xl font-bold tracking-tight mb-3">Continue watching</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {list.slice(0, 12).map((p) => (
          <Link
            key={p.id}
            to="/history"
            className="flex-shrink-0 w-[260px] rounded-lg overflow-hidden bg-surface relative group"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-surface-elevated to-surface grid place-items-center text-muted-foreground text-xs">
              {p.movie ? `Movie #${p.movie}` : `Episode #${p.episode}`}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
              <div
                className="h-full gradient-brand"
                style={{ width: `${Math.max(2, Math.min(100, p.percentage || 0))}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
