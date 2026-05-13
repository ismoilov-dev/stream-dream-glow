import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard, MediaCardSkeleton, type MediaCardData } from "./MediaCard";
import { cn } from "@/lib/utils";

export function MediaRow({
  title,
  items,
  kind,
  isLoading,
  variant = "poster",
}: {
  title: string;
  items: MediaCardData[];
  kind: "movies" | "series";
  isLoading?: boolean;
  variant?: "poster" | "landscape";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
  }, [items.length]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const cardWidth =
    variant === "landscape"
      ? "w-[260px] sm:w-[300px] md:w-[340px] lg:w-[380px]"
      : "w-[150px] sm:w-[170px] md:w-[180px] lg:w-[200px]";

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="relative group/row mt-10">
      <div className="flex items-end justify-between mb-3 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <h2 className="text-lg md:text-xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="relative">
        {canPrev && (
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-10 rounded-md bg-black/60 hover:bg-black/80 backdrop-blur grid place-items-center opacity-0 group-hover/row:opacity-100 transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {canNext && (
          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-10 rounded-md bg-black/60 hover:bg-black/80 backdrop-blur grid place-items-center opacity-0 group-hover/row:opacity-100 transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        <div
          ref={ref}
          onScroll={update}
          className={cn(
            "flex gap-3 overflow-x-auto scrollbar-hide row-fade-mask",
            "px-4 lg:px-8 pb-4",
            "max-w-[1600px] mx-auto",
            "snap-x snap-mandatory",
          )}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={cn("flex-shrink-0 snap-start", cardWidth)}>
                  <MediaCardSkeleton variant={variant} />
                </div>
              ))
            : items.map((item) => (
                <div key={`${kind}-${item.id}`} className={cn("flex-shrink-0 snap-start", cardWidth)}>
                  <MediaCard item={item} kind={kind} variant={variant} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
