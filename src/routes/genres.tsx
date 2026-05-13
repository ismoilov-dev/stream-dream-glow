import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Genres, unwrapList } from "@/lib/api";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/genres")({
  head: () => ({ meta: [{ title: "Genres — StreamPlay" }] }),
  component: GenresPage,
});

function GenresPage() {
  const { data, isLoading } = useQuery({ queryKey: ["genres"], queryFn: Genres.list });
  const genres = unwrapList(data);
  return (
    <div className="pt-24 pb-16 mx-auto max-w-[1600px] px-4 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight">Genres</h1>
      <p className="text-muted-foreground mt-1">Explore stories by mood and theme.</p>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl skeleton" />
            ))
          : genres.map((g, i) => (
              <Link
                key={g.id}
                to="/movies"
                search={{ genre: g.slug }}
                className="relative h-28 rounded-xl overflow-hidden gradient-brand grid place-items-center text-primary-foreground font-semibold transition hover:brightness-110"
                style={{ filter: `hue-rotate(${(i * 37) % 360}deg)` }}
              >
                <span className="text-lg">{g.name}</span>
              </Link>
            ))}
      </div>
    </div>
  );
}
