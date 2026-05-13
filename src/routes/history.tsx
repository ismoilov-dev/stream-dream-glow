import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { History, unwrapList } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Watch history — StreamPlay" }] }),
  component: () => (
    <RequireAuth>
      <HistoryPage />
    </RequireAuth>
  ),
});

function HistoryPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["history"], queryFn: History.list });
  const items = unwrapList(data);

  return (
    <div className="pt-24 pb-16 mx-auto max-w-[1600px] px-4 lg:px-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Watch history</h1>
          <p className="text-muted-foreground mt-1">Your recently watched titles.</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={async () => {
              try {
                await History.clear();
                qc.invalidateQueries({ queryKey: ["history"] });
                toast.success("History cleared");
              } catch { toast.error("Failed to clear"); }
            }}
            className="inline-flex items-center gap-2 px-3 h-10 rounded-md bg-surface border border-border hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" /> Clear all
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-xl skeleton" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-xl border border-border p-10 text-center text-muted-foreground">
          You haven't watched anything yet.
        </div>
      ) : (
        <div className="mt-8 space-y-2">
          {items.map((h) => (
            <div key={h.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface border border-border">
              <div className="w-32 aspect-[16/9] rounded-md bg-background grid place-items-center text-xs text-muted-foreground">
                {h.movie ? `Movie #${h.movie}` : `Episode #${h.episode}`}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">
                  {h.movie ? "Movie" : "Episode"} · {Math.floor(h.watched_seconds / 60)} min watched
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(h.started_at).toLocaleString()} {h.device ? `· ${h.device}` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
