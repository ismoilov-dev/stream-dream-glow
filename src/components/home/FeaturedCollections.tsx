'use client';

import { useGenres, useMovies } from '@/lib/hooks/useMovies';
import { MovieCard } from '@/components/ui/MovieCard';
import { motion } from 'framer-motion';

export function FeaturedCollections() {
  const { data: genres } = useGenres();

  if (!genres?.results?.length) return null;

  // Take first 3 genres for featured collections
  const featuredGenres = genres.results.slice(0, 3);

  return (
    <section className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold mb-6"
      >
        Featured Collections
      </motion.h2>

      <div className="space-y-8">
        {featuredGenres.map((genre: any, genreIndex: number) => (
          <GenreCollection key={genre.slug} genre={genre} index={genreIndex} />
        ))}
      </div>
    </section>
  );
}

function GenreCollection({ genre, index }: { genre: any; index: number }) {
  const { data: movies, isLoading } = useMovies({
    genre: genre.slug,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">{genre.name}</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse" />
              <div className="mt-2 h-4 bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies?.results?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
    >
      <h3 className="text-xl font-semibold mb-4">{genre.name}</h3>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
      >
        {movies.results.map((movie: any, movieIndex: number) => (
          <motion.div
            key={movie.slug}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: movieIndex * 0.05 }}
            className="flex-shrink-0"
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}