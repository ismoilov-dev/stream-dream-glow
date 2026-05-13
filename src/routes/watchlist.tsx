import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Favorites, Movies, SeriesApi, assetUrl, unwrapList } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/watchlist")({
  head: () => ({ meta: [{ title: "My list — StreamPlay" }] }),
  component: () => (
    <RequireAuth>
      <Watchlist />
    </RequireAuth>
  ),
});

function Watchlist() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["favorites"], queryFn: Favorites.list });
  const favs = unwrapList(data);

  const remove = async (id: number) => {
    try {
      await Favorites.remove(id);
      qc.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Removed");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="pt-24 pb-16 mx-auto max-w-[1600px] px-4 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight">My list</h1>
      <p className="text-muted-foreground mt-1">Saved for later viewing.</p>
      {isLoading ? (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[2/3] rounded-lg skeleton" />)}
        </div>
      ) : favs.length === 0 ? (
        <div className="mt-12 rounded-xl border border-border p-10 text-center text-muted-foreground">
          Nothing here yet — start adding titles to your list.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {favs.map((f) => (
            <FavoriteCard key={f.id} f={f} onRemove={() => remove(f.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FavoriteCard({ f, onRemove }: { f: any; onRemove: () => void }) {
  return (
    <div className="relative group">
      <div className="aspect-[2/3] rounded-lg bg-surface grid place-items-center text-muted-foreground text-xs">
        {f.movie ? `Movie #${f.movie}` : `Series #${f.series}`}
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 hover:bg-destructive transition opacity-0 group-hover:opacity-100"
        aria-label="Remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
