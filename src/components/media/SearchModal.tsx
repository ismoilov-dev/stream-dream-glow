import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Film, Tv, Loader2, ArrowRight } from "lucide-react";
import { Search as SearchApi, assetUrl } from "@/lib/api";
import type { MovieListItem, SeriesListItem } from "@/lib/types";

function useDebounced<T>(value: T, delay = 300): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const debounced = useDebounced(q, 300);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQ("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => SearchApi.query(debounced),
    enabled: debounced.trim().length >= 2,
    staleTime: 30_000,
  });

  const movies: MovieListItem[] = (data?.movies ?? []) as MovieListItem[];
  const series: SeriesListItem[] = (data?.series ?? []) as SeriesListItem[];
  const generic = (data?.results ?? []) as Array<MovieListItem | SeriesListItem>;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-start pt-[12vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <motion.div
            className="relative w-full max-w-2xl glass-strong rounded-2xl shadow-elevated overflow-hidden"
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search movies, series, actors…"
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q.trim()) {
                    onOpenChange(false);
                    navigate({ to: "/search", search: { q: q.trim() } });
                  }
                }}
              />
              {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border border-border">esc</kbd>
            </div>
            <div className="max-h-[60vh] overflow-auto">
              {debounced.trim().length < 2 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Start typing to discover movies, series and more.
                </div>
              )}
              {debounced.trim().length >= 2 &&
                !isFetching &&
                movies.length === 0 &&
                series.length === 0 &&
                generic.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No results for “{debounced}”.
                  </div>
                )}
              {movies.length > 0 && (
                <Section title="Movies" icon={<Film className="h-3.5 w-3.5" />}>
                  {movies.slice(0, 6).map((m) => (
                    <ResultRow
                      key={`m-${m.id}`}
                      title={m.title}
                      sub={m.release_year ? `${m.release_year}` : "Movie"}
                      img={assetUrl(m.thumbnail || m.poster)}
                      onClick={() => {
                        onOpenChange(false);
                        navigate({ to: "/movies/$slug", params: { slug: m.slug } });
                      }}
                    />
                  ))}
                </Section>
              )}
              {series.length > 0 && (
                <Section title="Series" icon={<Tv className="h-3.5 w-3.5" />}>
                  {series.slice(0, 6).map((s) => (
                    <ResultRow
                      key={`s-${s.id}`}
                      title={s.title}
                      sub={s.release_year ? `${s.release_year}` : "Series"}
                      img={assetUrl(s.thumbnail || s.poster)}
                      onClick={() => {
                        onOpenChange(false);
                        navigate({ to: "/series/$slug", params: { slug: s.slug } });
                      }}
                    />
                  ))}
                </Section>
              )}
              {q.trim() && (
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate({ to: "/search", search: { q: q.trim() } });
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm border-t border-border hover:bg-surface"
                >
                  <span>See all results for “{q.trim()}”</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="py-2">
      <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {icon}
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ResultRow({
  title,
  sub,
  img,
  onClick,
}: {
  title: string;
  sub: string;
  img?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface text-left"
    >
      <div className="h-12 w-9 rounded overflow-hidden bg-surface-elevated flex-shrink-0">
        {img ? (
          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </button>
  );
}
