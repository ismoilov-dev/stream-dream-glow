'use client';

import { useMovie, useSimilarMovies } from '@/lib/hooks/useMovies';
import { MovieCard } from '@/components/ui/MovieCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Info, Heart, Share } from 'lucide-react';

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: movie, isLoading } = useMovie(slug);
  const { data: similarMovies } = useSimilarMovies(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">Loading...</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Movie not found</h1>
          <Link href="/movies">
            <Button>Back to Movies</Button>
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
          src={movie.backdrop_path || movie.poster_path}
          alt={movie.title}
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
                src={movie.poster_path}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-3 space-y-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className="text-base px-3 py-1">{movie.release_year}</Badge>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {movie.age_rating}
                </Badge>
                {movie.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-xl">★</span>
                    <span className="text-lg font-semibold">{movie.rating.toFixed(1)}</span>
                  </div>
                )}
                {movie.duration && (
                  <span className="text-muted-foreground">{movie.duration} min</span>
                )}
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              {movie.description}
            </p>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: any) => (
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
                <Heart className="w-5 h-5" />
                Add to Favorites
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Share className="w-5 h-5" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Cast and Crew */}
        {movie.actors && movie.actors.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {movie.actors.map((actor: any) => (
                <div key={actor.id} className="flex-shrink-0 text-center">
                  <div className="w-24 h-32 rounded-lg bg-gray-700 mb-2" />
                  <p className="text-sm font-medium line-clamp-2">{actor.name}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Similar Movies */}
        {similarMovies && similarMovies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {similarMovies.map((movie: any) => (
                <motion.div
                  key={movie.slug}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0"
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}