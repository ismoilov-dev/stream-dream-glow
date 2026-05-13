import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Plus, Star, Lock } from "lucide-react";
import { assetUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

export type MediaCardData = {
  id: number;
  slug: string;
  title: string;
  poster?: string | null;
  thumbnail?: string | null;
  release_year?: number | null;
  imdb_rating?: string | null;
  is_premium?: boolean;
  short_description?: string;
  genres?: { id: number; name: string }[];
  duration_minutes?: number | null;
};

export function MediaCard({
  item,
  kind,
  className,
  variant = "poster",
}: {
  item: MediaCardData;
  kind: "movies" | "series";
  className?: string;
  variant?: "poster" | "landscape";
}) {
  const img = assetUrl(variant === "landscape" ? item.thumbnail || item.poster : item.poster || item.thumbnail);
  const aspect = variant === "landscape" ? "aspect-[16/9]" : "aspect-[2/3]";
  return (
    <Link
      to={kind === "movies" ? "/movies/$slug" : "/series/$slug"}
      params={{ slug: item.slug }}
      className={cn("group relative block rounded-lg overflow-hidden bg-surface", aspect, className)}
    >
      {img ? (
        <img
          src={img}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground text-xs px-2 text-center bg-gradient-to-br from-surface to-surface-elevated">
          {item.title}
        </div>
      )}
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90" />

      {/* premium badge */}
      {item.is_premium && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold/90 text-black text-[10px] font-bold backdrop-blur-sm">
          <Lock className="h-2.5 w-2.5" />
          PREMIUM
        </div>
      )}

      {/* rating */}
      {item.imdb_rating && (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[11px] font-medium">
          <Star className="h-3 w-3 fill-gold text-gold" />
          {item.imdb_rating}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="text-sm font-semibold leading-tight line-clamp-2">{item.title}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground flex items-center gap-1.5">
          {item.release_year && <span>{item.release_year}</span>}
          {item.genres?.[0] && (
            <>
              <span>•</span>
              <span className="truncate">{item.genres[0].name}</span>
            </>
          )}
        </div>
      </div>

      {/* hover panel */}
      <motion.div
        initial={false}
        className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
      >
        <div className="flex gap-1.5">
          <span className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-white text-black text-xs font-semibold">
            <Play className="h-3 w-3 fill-black" /> Play
          </span>
          <span className="inline-flex items-center justify-center px-2 py-1.5 rounded-md bg-white/15 backdrop-blur-sm border border-white/20 text-white">
            <Plus className="h-3.5 w-3.5" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export function MediaCardSkeleton({
  variant = "poster",
  className,
}: {
  variant?: "poster" | "landscape";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg skeleton",
        variant === "landscape" ? "aspect-[16/9]" : "aspect-[2/3]",
        className,
      )}
    />
  );
}
