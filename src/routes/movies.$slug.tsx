import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Plus, Star, Calendar, Clock, Globe2, Lock } from "lucide-react";
import { Movies, assetUrl, unwrapList, Favorites } from "@/lib/api";
import { MediaRow } from "@/components/media/MediaRow";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/movies/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — StreamPlay` },
    ],
  }),
  component: MovieDetailPage,
});

function MovieDetailPage() {
  const { slug } = Route.useParams();
  const { isAuthenticated } = useAuthStore();

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", slug],
    queryFn: () => Movies.detail(slug),
  });

  const similar = useQuery({
    queryKey: ["movie", slug, "similar"],
    queryFn: () => Movies.similar(slug),
    enabled: !!movie,
  });

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>
    );
  }

  const backdrop = assetUrl(movie.thumbnail || movie.poster);
  const poster = assetUrl(movie.poster || movie.thumbnail);

  const addToList = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to save");
      return;
    }
    try {
      await Favorites.add({ movie: movie.id });
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block aspect-[2/3] rounded-xl overflow-hidden shadow-elevated bg-surface"
            >
              <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient">{movie.title}</h1>
            {movie.original_title && movie.original_title !== movie.title && (
              <p className="text-muted-foreground mt-1">{movie.original_title}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {movie.imdb_rating && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold/15 text-gold font-semibold">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {movie.imdb_rating}
                </span>
              )}
              {movie.release_year && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {movie.release_year}
                </span>
              )}
              {movie.duration_minutes && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {movie.duration_minutes} min
                </span>
              )}
              {movie.country && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Globe2 className="h-3.5 w-3.5" />
                  {movie.country}
                </span>
              )}
              {movie.age_rating && (
                <span className="px-1.5 py-0.5 border border-border rounded text-[11px]">
                  {movie.age_rating}
                </span>
              )}
              {movie.is_premium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold/90 text-black text-xs font-bold">
                  <Lock className="h-3 w-3" /> PREMIUM
                </span>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-2.5 py-0.5 rounded-full bg-surface border border-border text-xs"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {movie.description && (
              <p className="mt-5 text-foreground/80 max-w-3xl leading-relaxed">{movie.description}</p>
            )}

            {movie.director && (
              <div className="mt-3 text-sm text-muted-foreground">
                Directed by <span className="text-foreground">{movie.director}</span>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/watch/movie/$slug"
                params={{ slug: movie.slug }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-black font-semibold hover:bg-white/90 transition shadow-elevated"
              >
                <Play className="h-4 w-4 fill-black" /> Play movie
              </Link>
              <button
                onClick={addToList}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-surface border border-border hover:bg-surface-elevated transition"
              >
                <Plus className="h-4 w-4" /> My list
              </button>
              {movie.trailer_url && (
                <a
                  href={movie.trailer_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-surface border border-border hover:bg-surface-elevated"
                >
                  Watch trailer
                </a>
              )}
            </div>

            {movie.actors && movie.actors.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Cast</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {movie.actors.map((a) => (
                    <div key={a.id} className="flex-shrink-0 w-20 text-center">
                      <div className="aspect-square rounded-full overflow-hidden bg-surface mx-auto">
                        {a.photo ? (
                          <img src={assetUrl(a.photo)} alt={a.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="grid place-items-center w-full h-full text-xs text-muted-foreground">
                            {a.full_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="text-xs mt-1.5 truncate">{a.full_name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {similar.data && unwrapList(similar.data).length > 0 && (
          <div className="-mx-4 lg:-mx-8 mt-12">
            <MediaRow title="Similar movies" items={unwrapList(similar.data)} kind="movies" />
          </div>
        )}
      </div>
    </div>
  );
}
