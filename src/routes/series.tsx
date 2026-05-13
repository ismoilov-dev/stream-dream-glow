import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { SeriesApi, Genres, unwrapList } from "@/lib/api";
import { MediaCard, MediaCardSkeleton } from "@/components/media/MediaCard";

type SeriesSearch = { q?: string; genre?: string; ordering?: string; page?: number };

export const Route = createFileRoute("/series")({
  validateSearch: (s: Record<string, unknown>): SeriesSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    genre: typeof s.genre === "string" ? s.genre : undefined,
    ordering: typeof s.ordering === "string" ? s.ordering : undefined,
    page: typeof s.page === "number" ? s.page : undefined,
  }),
  head: () => ({ meta: [{ title: "Series — StreamPlay" }] }),
  component: SeriesPage,
});

function SeriesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const params = useMemo(() => {
    const p: Record<string, unknown> = { page: search.page ?? 1 };
    if (search.q) p.search = search.q;
    if (search.genre) p.genres__slug = search.genre;
    p.ordering = search.ordering ?? "-views_count";
    return p;
  }, [search]);

  const series = useQuery({ queryKey: ["series-list", params], queryFn: () => SeriesApi.list(params) });
  const genres = useQuery({ queryKey: ["genres"], queryFn: Genres.list });
  const setSearch = (next: Partial<SeriesSearch>) =>
    navigate({ to: "/series", search: { ...search, ...next, page: undefined } });
  const totalPages = series.data ? Math.ceil(series.data.count / 20) : 1;

  return (
    <div className="pt-24 pb-16 mx-auto max-w-[1600px] px-4 lg:px-8">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Series</h1>
          <p className="text-muted-foreground mt-1">Binge-worthy stories, season after season.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={search.ordering ?? "-views_count"}
            onChange={(e) => setSearch({ ordering: e.target.value })}
            className="h-10 rounded-md bg-surface border border-border px-3 text-sm"
          >
            <option value="-views_count">Most viewed</option>
            <option value="-release_year">Newest</option>
            <option value="-imdb_rating">Highest rated</option>
            <option value="title">A → Z</option>
          </select>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="h-10 px-3 rounded-md bg-surface border border-border text-sm flex items-center gap-2"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="mb-6 rounded-xl border border-border bg-surface p-4 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Search title…"
            defaultValue={search.q}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSearch({ q: (e.target as HTMLInputElement).value });
            }}
            className="h-10 rounded-md bg-background border border-border px-3 text-sm"
          />
          <select
            value={search.genre ?? ""}
            onChange={(e) => setSearch({ genre: e.target.value || undefined })}
            className="h-10 rounded-md bg-background border border-border px-3 text-sm"
          >
            <option value="">All genres</option>
            {genres.data &&
              unwrapList(genres.data).map((g) => (
                <option key={g.id} value={g.slug}>
                  {g.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {(search.q || search.genre) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {search.q && <Chip label={`Search: ${search.q}`} onRemove={() => setSearch({ q: undefined })} />}
          {search.genre && <Chip label={`Genre: ${search.genre}`} onRemove={() => setSearch({ genre: undefined })} />}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {series.isLoading
          ? Array.from({ length: 18 }).map((_, i) => <MediaCardSkeleton key={i} />)
          : (series.data?.results ?? []).map((s) => (
              <MediaCard key={s.id} item={s} kind="series" />
            ))}
      </div>

      {!series.isLoading && (series.data?.results.length ?? 0) === 0 && (
        <div className="py-16 text-center text-muted-foreground">No series match your filters.</div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
            const page = i + 1;
            const active = (search.page ?? 1) === page;
            return (
              <Link
                key={page}
                to="/series"
                search={{ ...search, page }}
                className={`min-w-9 h-9 px-3 rounded-md grid place-items-center text-sm ${
                  active ? "gradient-brand text-primary-foreground" : "bg-surface border border-border"
                }`}
              >
                {page}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-xs">
      {label}
      <button onClick={onRemove}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
