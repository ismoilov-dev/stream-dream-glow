import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft, Settings, SkipForward, Loader2 } from "lucide-react";
import { Movies, Episodes, Progress, assetUrl } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export const RouteMovie = createFileRoute("/watch/movie/$slug")({
  head: () => ({ meta: [{ title: "Now playing — StreamPlay" }] }),
  component: MoviePlayerPage,
});

export const Route = RouteMovie;

function MoviePlayerPage() {
  const { slug } = Route.useParams();
  const { data: movie } = useQuery({ queryKey: ["movie", slug], queryFn: () => Movies.detail(slug) });
  const file = movie?.video_files?.[0];
  return (
    <Player
      title={movie?.title ?? ""}
      src={file?.hls_manifest_url || file?.dash_manifest_url || file?.file || ""}
      poster={assetUrl(movie?.thumbnail || movie?.poster)}
      onProgress={(pos, dur) => {
        if (movie) Progress.update({ movie_id: movie.id, position_seconds: Math.floor(pos), duration_seconds: Math.floor(dur) }).catch(() => {});
      }}
    />
  );
}

export function Player({
  title,
  src,
  poster,
  onProgress,
  onNext,
}: {
  title: string;
  src: string;
  poster?: string;
  onProgress?: (positionSeconds: number, duration: number) => void;
  onNext?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState("Auto");
  const navigate = useNavigate();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      setProgress(v.currentTime);
      setDuration(v.duration || 0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [src]);

  // periodic progress reporting
  useEffect(() => {
    if (!onProgress) return;
    const id = setInterval(() => {
      const v = videoRef.current;
      if (v && !v.paused && v.duration) onProgress(v.currentTime, v.duration);
    }, 10000);
    return () => clearInterval(id);
  }, [onProgress]);

  // auto-hide controls
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(t);
  }, [showControls, playing]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };

  const seek = (val: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = val;
  };

  const fullscreen = () => {
    const el = videoRef.current?.parentElement;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <div
      className="relative w-screen h-screen bg-black overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls((s) => !s)}
    >
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          className="absolute inset-0 w-full h-full object-contain bg-black"
          onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">
          <div className="text-center">
            <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
            No video source available.
          </div>
        </div>
      )}

      {/* top controls */}
      <div
        className={`absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/" })} className="p-2 rounded-md hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
      </div>

      {/* bottom controls */}
      <div
        className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 to-transparent transition-opacity ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full h-1 accent-primary"
        />
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-md hover:bg-white/10">
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
            </button>
            {onNext && (
              <button onClick={onNext} className="p-2 rounded-md hover:bg-white/10" aria-label="Next">
                <SkipForward className="h-5 w-5" />
              </button>
            )}
            <button onClick={() => setMuted((m) => !m)} className="p-2 rounded-md hover:bg-white/10">
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                setMuted(v === 0);
                if (videoRef.current) {
                  videoRef.current.volume = v;
                  videoRef.current.muted = v === 0;
                }
              }}
              className="w-24 accent-primary"
            />
            <span className="tabular-nums text-muted-foreground">
              {fmt(progress)} / {fmt(duration)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs"
            >
              {["Auto", "1080p", "720p", "480p"].map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <select
              defaultValue="off"
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs"
            >
              <option value="off">Subtitles · Off</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
              <option value="uz">O'zbek</option>
            </select>
            <button onClick={fullscreen} className="p-2 rounded-md hover:bg-white/10">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
