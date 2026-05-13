import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Episodes, Progress, assetUrl } from "@/lib/api";
import { Player } from "./watch.movie.$slug";

export const Route = createFileRoute("/watch/episode/$id")({
  head: () => ({ meta: [{ title: "Now playing — StreamPlay" }] }),
  component: EpisodePlayerPage,
});

function EpisodePlayerPage() {
  const { id } = Route.useParams();
  const { data: ep } = useQuery({ queryKey: ["episode", id], queryFn: () => Episodes.detail(Number(id)) });
  const file = ep?.video_files?.[0];
  return (
    <Player
      title={ep ? `S${ep.season} · E${ep.number} · ${ep.title}` : "Loading…"}
      src={file?.hls_manifest_url || file?.dash_manifest_url || file?.file || ""}
      poster={assetUrl(ep?.thumbnail)}
      onProgress={(pos, dur) => {
        if (ep) Progress.update({ episode_id: ep.id, position_seconds: Math.floor(pos), duration_seconds: Math.floor(dur) }).catch(() => {});
      }}
    />
  );
}
