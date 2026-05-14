'use client';

import { useSerie } from '@/lib/hooks/useSeries';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';

export default function SeriesDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: serie, isLoading } = useSerie(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!serie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Series not found</h1>
          <Link href="/series">
            <Button>Back to Series</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={serie.backdrop_path || serie.poster_path}
          alt={serie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={serie.poster_path}
                alt={serie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-3 space-y-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{serie.title}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className="text-base px-3 py-1">{serie.release_year}</Badge>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {serie.age_rating}
                </Badge>
                {serie.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-xl">★</span>
                    <span className="text-lg font-semibold">{serie.rating.toFixed(1)}</span>
                  </div>
                )}
                <span className="text-muted-foreground">
                  {serie.seasons_count} seasons
                </span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              {serie.description}
            </p>

            {serie.genres && serie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {serie.genres.map((genre: any) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Play
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Seasons */}
        {serie.seasons && serie.seasons.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Seasons</h2>
            <div className="space-y-4">
              {serie.seasons.map((season: any) => (
                <div
                  key={season.id}
                  className="border border-gray-700 rounded-lg p-4 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Season {season.season_number}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {season.episodes_count} episodes
                      </p>
                    </div>
                    <Button variant="outline">View Episodes</Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}