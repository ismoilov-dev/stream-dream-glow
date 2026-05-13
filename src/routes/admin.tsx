import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Movies, SeriesApi, Episodes, Users, unwrapList } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { Film, Tv, Users as UsersIcon, ListVideo, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — StreamPlay" }] }),
  component: () => (
    <RequireAuth>
      <Admin />
    </RequireAuth>
  ),
});

function Admin() {
  const movies = useQuery({ queryKey: ["movies-list", { page: 1 }], queryFn: () => Movies.list({ page: 1 }) });
  const series = useQuery({ queryKey: ["series-list", { page: 1 }], queryFn: () => SeriesApi.list({ page: 1 }) });
  const episodes = useQuery({ queryKey: ["episodes-list"], queryFn: () => Episodes.list() });
  const users = useQuery({ queryKey: ["users-list"], queryFn: () => Users.list().catch(() => undefined) });

  return (
    <div className="pt-24 pb-16 mx-auto max-w-[1600px] px-4 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight">Admin dashboard</h1>
      <p className="text-muted-foreground mt-1">Library overview and quick management.</p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={<Film />} label="Movies" value={movies.data?.count ?? 0} />
        <Stat icon={<Tv />} label="Series" value={series.data?.count ?? 0} />
        <Stat icon={<ListVideo />} label="Episodes" value={episodes.data?.count ?? 0} />
        <Stat icon={<UsersIcon />} label="Users" value={users.data?.count ?? 0} />
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <Panel
          title="Recent movies"
          actionLabel="Manage all"
          action="/movies"
          rows={unwrapList(movies.data).slice(0, 6).map((m) => ({
            id: m.id, title: m.title, sub: `${m.release_year ?? "—"} · ${m.views_count ?? 0} views`,
          }))}
        />
        <Panel
          title="Recent series"
          actionLabel="Manage all"
          action="/series"
          rows={unwrapList(series.data).slice(0, 6).map((s) => ({
            id: s.id, title: s.title, sub: `${s.total_seasons ?? 0} seasons · ${s.total_episodes ?? 0} episodes`,
          }))}
        />
      </div>

      <div className="mt-10 rounded-xl bg-surface border border-border p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Quick actions</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionCard label="Upload movie" sub="Add a new film to the catalogue" />
          <ActionCard label="Add series" sub="Create a new series record" />
          <ActionCard label="Manage episodes" sub="Edit episodes & video files" />
          <ActionCard label="User management" sub="Roles, suspensions & more" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Forms hook into the same REST endpoints used by the rest of the app. Permissions are enforced server-side.
        </p>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-5">
      <div className="h-9 w-9 rounded-md gradient-brand grid place-items-center text-primary-foreground">{icon}</div>
      <div className="mt-3 text-3xl font-black">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function Panel({ title, rows, action, actionLabel }: { title: string; rows: { id: number; title: string; sub: string }[]; action: string; actionLabel: string }) {
  return (
    <div className="rounded-xl bg-surface border border-border">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h2 className="font-semibold">{title}</h2>
        <Link to={action} className="text-xs text-primary hover:underline">{actionLabel}</Link>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((r) => (
          <li key={r.id} className="p-4 flex items-center justify-between text-sm">
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.sub}</div>
            </div>
            <span className="text-xs text-muted-foreground">#{r.id}</span>
          </li>
        ))}
        {rows.length === 0 && <li className="p-6 text-sm text-muted-foreground text-center">Nothing yet.</li>}
      </ul>
    </div>
  );
}

function ActionCard({ label, sub }: { label: string; sub: string }) {
  return (
    <button className="text-left p-4 rounded-lg bg-background border border-border hover:border-primary transition group">
      <div className="font-semibold group-hover:text-primary">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </button>
  );
}
