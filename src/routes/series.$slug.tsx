import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Star, Calendar, Tv, Lock, ChevronRight } from "lucide-react";
import { SeriesApi, assetUrl, unwrapList, Favorites } from "@/lib/api";
import { MediaRow } from "@/components/media/MediaRow";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/series/$slug")({
  head: ({ params }) => ({ meta: [{ title: `${params.slug} — StreamPlay` }] }),
  component: SeriesDetailPage,
});

function SeriesDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const { data: series, isLoading } = useQuery({
    queryKey: ["series", slug],
    queryFn: () => SeriesApi.detail(slug),
  });
  const similar = useQuery({
    queryKey: ["series", slug, "similar"],
    queryFn: () => SeriesApi.similar(slug),
    enabled: !!series,
  });

  const [activeSeason, setActiveSeason] = useState<number | null>(null);

  if (isLoading || !series) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  const seasons = series.seasons ?? [];
  const currentSeason = seasons.find((s) => s.number === (activeSeason ?? seasons[0]?.number));

  const backdrop = assetUrl(series.thumbnail || series.poster);
  const poster = assetUrl(series.poster || series.thumbnail);

  const addToList = async () => {
    if (!isAuthenticated) return toast.error("Sign in to save");
    try {
      await Favorites.add({ series: series.id });
      toast.success("Added to your list");
    } catch {
      toast.error("Could not add to list");
    }
  };

  return (
    <div className="pb-20">
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        {backdrop && (
          <motion.img
            src={backdrop}
            alt=""
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </div>

      <div className="relative -mt-32 mx-auto max-w-[1400px] px-4 lg:px-8">
        <div className="grid md:grid-cols-[280px,1fr] gap-8">
          {poster && (
            <div className="hidden md:block aspect-[2/3] rounded-xl overflow-hidden shadow-elevated bg-surface">
              <img src={poster} alt={series.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient">{series.title}</h1>
            {series.original_title && series.original_title !== series.title && (
              <p className="text-muted-foreground mt-1">{series.original_title}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {series.imdb_rating && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold/15 text-gold font-semibold">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {series.imdb_rating}
                </span>
              )}
              {series.release_year && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {series.release_year}
                </span>
              )}
              {series.total_seasons && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Tv className="h-3.5 w-3.5" /> {series.total_seasons} seasons · {series.total_episodes} ep.
                </span>
              )}
              {series.status && (
                <span className="px-1.5 py-0.5 border border-border rounded text-[11px] capitalize">
                  {series.status}
                </span>
              )}
              {series.is_premium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold/90 text-black text-xs font-bold">
                  <Lock className="h-3 w-3" /> PREMIUM
                </span>
              )}
            </div>

            {series.genres?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {series.genres.map((g) => (
                  <span key={g.id} className="px-2.5 py-0.5 rounded-full bg-surface border border-border text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {series.description && (
              <p className="mt-5 text-foreground/80 max-w-3xl leading-relaxed">{series.description}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {currentSeason?.episodes?.[0] && (
                <button
                  onClick={() =>
                    navigate({
                      to: "/watch/episode/$id",
                      params: { id: String(currentSeason.episodes[0].id) },
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-black font-semibold hover:bg-white/90 transition shadow-elevated"
                >
                  <Play className="h-4 w-4 fill-black" /> Play S{currentSeason.number} · E1
                </button>
              )}
              <button
                onClick={addToList}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-surface border border-border hover:bg-surface-elevated"
              >
                <Plus className="h-4 w-4" /> My list
              </button>
            </div>
          </div>
        </div>

        {seasons.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Episodes</h2>
              <select
                value={(activeSeason ?? seasons[0].number).toString()}
                onChange={(e) => setActiveSeason(Number(e.target.value))}
                className="h-10 rounded-md bg-surface border border-border px-3 text-sm"
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.number}>
                    Season {s.number}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3">
              {currentSeason?.episodes.map((ep) => (
                <Link
                  key={ep.id}
                  to="/watch/episode/$id"
                  params={{ id: String(ep.id) }}
                  className="group flex gap-4 p-3 rounded-xl bg-surface hover:bg-surface-elevated transition border border-border"
                >
                  <div className="w-40 sm:w-56 aspect-[16/9] rounded-md overflow-hidden bg-background flex-shrink-0 relative">
                    {ep.thumbnail ? (
                      <img src={assetUrl(ep.thumbnail)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">
                        Episode {ep.number}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition grid place-items-center">
                      <Play className="h-8 w-8 fill-white text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold">
                        {ep.number}. {ep.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {ep.duration_minutes ? `${ep.duration_minutes} min` : ""}
                      </span>
                    </div>
                    {ep.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {ep.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground self-center hidden sm:block" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {similar.data && unwrapList(similar.data).length > 0 && (
          <div className="-mx-4 lg:-mx-8 mt-12">
            <MediaRow title="More like this" items={unwrapList(similar.data)} kind="series" />
          </div>
        )}
      </div>
    </div>
  );
}
