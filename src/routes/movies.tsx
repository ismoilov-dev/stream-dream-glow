import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { Movies, Genres, unwrapList } from "@/lib/api";
import { MediaCard, MediaCardSkeleton } from "@/components/media/MediaCard";

type MoviesSearch = {
  q?: string;
  genre?: string;
  year?: number;
  ordering?: string;
  page?: number;
};

export const Route = createFileRoute("/movies")({
  validateSearch: (s: Record<string, unknown>): MoviesSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    genre: typeof s.genre === "string" ? s.genre : undefined,
    year: typeof s.year === "number" ? s.year : undefined,
    ordering: typeof s.ordering === "string" ? s.ordering : undefined,
    page: typeof s.page === "number" ? s.page : undefined,
  }),
  head: () => ({ meta: [{ title: "Movies — StreamPlay" }, { name: "description", content: "Browse the StreamPlay movie catalogue." }] }),
  component: MoviesPage,
});

const SORTS = [
  { v: "-views_count", l: "Most viewed" },
  { v: "-release_year", l: "Newest" },
  { v: "release_year", l: "Oldest" },
  { v: "-imdb_rating", l: "Highest rated" },
  { v: "title", l: "A → Z" },
];

function MoviesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const params = useMemo(() => {
    const p: Record<string, unknown> = { page: search.page ?? 1 };
    if (search.q) p.search = search.q;
    if (search.genre) p.genres__slug = search.genre;
    if (search.year) p.release_year = search.year;
    p.ordering = search.ordering ?? "-views_count";
    return p;
  }, [search]);

  const movies = useQuery({ queryKey: ["movies-list", params], queryFn: () => Movies.list(params) });
  const genres = useQuery({ queryKey: ["genres"], queryFn: Genres.list });

  const setSearch = (next: Partial<MoviesSearch>) =>
    navigate({ to: "/movies", search: { ...search, ...next, page: undefined } });

  const totalPages = movies.data ? Math.ceil(movies.data.count / 20) : 1;

  return (
    <div className="pt-24 pb-16 mx-auto max-w-[1600px] px-4 lg:px-8">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Movies</h1>
          <p className="text-muted-foreground mt-1">Discover blockbusters, indie gems and more.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={search.ordering ?? "-views_count"}
            onChange={(e) => setSearch({ ordering: e.target.value })}
            className="h-10 rounded-md bg-surface border border-border px-3 text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.v} value={s.v}>
                {s.l}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="h-10 px-3 rounded-md bg-surface border border-border text-sm flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="mb-6 rounded-xl border border-border bg-surface p-4 grid gap-3 sm:grid-cols-3">
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
          <input
            type="number"
            placeholder="Year"
            defaultValue={search.year}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setSearch({ year: Number((e.target as HTMLInputElement).value) || undefined });
            }}
            className="h-10 rounded-md bg-background border border-border px-3 text-sm"
          />
        </div>
      )}

      {(search.q || search.genre || search.year) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {search.q && (
            <Chip label={`Search: ${search.q}`} onRemove={() => setSearch({ q: undefined })} />
          )}
          {search.genre && (
            <Chip label={`Genre: ${search.genre}`} onRemove={() => setSearch({ genre: undefined })} />
          )}
          {search.year && (
            <Chip label={`Year: ${search.year}`} onRemove={() => setSearch({ year: undefined })} />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.isLoading
          ? Array.from({ length: 18 }).map((_, i) => <MediaCardSkeleton key={i} />)
          : (movies.data?.results ?? []).map((m) => (
              <MediaCard key={m.id} item={m} kind="movies" />
            ))}
      </div>

      {!movies.isLoading && (movies.data?.results.length ?? 0) === 0 && (
        <div className="py-16 text-center text-muted-foreground">No movies match your filters.</div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
            const page = i + 1;
            const active = (search.page ?? 1) === page;
            return (
              <Link
                key={page}
                to="/movies"
                search={{ ...search, page }}
                className={`min-w-9 h-9 px-3 rounded-md grid place-items-center text-sm ${
                  active ? "gradient-brand text-primary-foreground" : "bg-surface hover:bg-surface-elevated border border-border"
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
      <button onClick={onRemove} className="hover:text-primary">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
