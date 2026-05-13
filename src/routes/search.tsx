import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/use-debounce";
import { Search as SearchApi } from "@/lib/api";
import { MediaCard, MediaCardSkeleton } from "@/components/media/MediaCard";

type S = { q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): S => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => ({ meta: [{ title: "Search — StreamPlay" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q ?? "");
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    if ((debounced || "") !== (q || "")) {
      navigate({ to: "/search", search: { q: debounced || undefined }, replace: true });
    }
  }, [debounced, q, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["search-page", debounced],
    queryFn: () => SearchApi.query(debounced),
    enabled: !!debounced && debounced.length >= 2,
  });

  const movies = (data?.movies ?? []) as any[];
  const series = (data?.series ?? []) as any[];

  return (
    <div className="pt-24 pb-16 mx-auto max-w-[1600px] px-4 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight">Search</h1>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search movies, series…"
        className="mt-4 w-full h-12 rounded-md bg-surface border border-border px-4 outline-none focus:border-primary"
      />
      {debounced && debounced.length >= 2 && (
        <div className="mt-8 space-y-10">
          <Section title="Movies" items={movies} kind="movies" loading={isLoading} />
          <Section title="Series" items={series} kind="series" loading={isLoading} />
        </div>
      )}
      {(!debounced || debounced.length < 2) && (
        <p className="mt-12 text-center text-muted-foreground">Type at least 2 characters to search.</p>
      )}
    </div>
  );
}

function Section({ title, items, kind, loading }: { title: string; items: any[]; kind: "movies" | "series"; loading: boolean }) {
  if (!loading && items.length === 0) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <MediaCardSkeleton key={i} />)
          : items.map((m) => <MediaCard key={m.id} item={m} kind={kind} />)}
      </div>
    </section>
  );
}
