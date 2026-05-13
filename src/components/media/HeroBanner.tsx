import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Info, Star } from "lucide-react";
import { assetUrl } from "@/lib/api";
import type { MovieListItem, SeriesListItem } from "@/lib/types";

type HeroItem = (MovieListItem | SeriesListItem) & { kind: "movies" | "series" };

export function HeroBanner({ item }: { item: HeroItem | null }) {
  if (!item) {
    return (
      <div className="relative w-full h-[70vh] min-h-[480px] max-h-[820px] bg-gradient-to-br from-surface via-surface-elevated to-background animate-pulse" />
    );
  }
  const bg = assetUrl(item.thumbnail || item.poster);

  return (
    <section className="relative w-full h-[80vh] min-h-[520px] max-h-[860px] overflow-hidden">
      {bg && (
        <motion.img
          key={item.id}
          src={bg}
          alt={item.title}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
      <div className="absolute inset-0 gradient-hero-fade" />

      <div className="relative z-10 h-full flex items-end pb-16 lg:pb-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest mb-3">
              <span className="px-2 py-0.5 rounded gradient-brand text-primary-foreground">Featured</span>
              <span>{item.kind === "movies" ? "Movie" : "Series"}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-gradient leading-[1.05]">
              {item.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              {item.imdb_rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="text-foreground font-semibold">{item.imdb_rating}</span>
                </span>
              )}
              {item.release_year && <span>{item.release_year}</span>}
              {item.age_rating && (
                <span className="px-1.5 py-0.5 border border-border rounded text-[11px]">
                  {item.age_rating}
                </span>
              )}
              {item.genres?.slice(0, 3).map((g) => (
                <span key={g.id} className="hidden sm:inline">{g.name}</span>
              ))}
            </div>
            {item.short_description && (
              <p className="mt-5 text-base md:text-lg text-foreground/80 line-clamp-3 max-w-xl">
                {item.short_description}
              </p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={item.kind === "movies" ? "/watch/movie/$slug" : "/series/$slug"}
                params={{ slug: item.slug }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white text-black font-semibold hover:bg-white/90 transition shadow-elevated"
              >
                <Play className="h-5 w-5 fill-black" />
                Play
              </Link>
              <Link
                to={item.kind === "movies" ? "/movies/$slug" : "/series/$slug"}
                params={{ slug: item.slug }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 font-semibold transition"
              >
                <Info className="h-5 w-5" />
                More info
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
