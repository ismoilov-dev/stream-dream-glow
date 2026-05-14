'use client';

import { useTrendingMovies } from '@/lib/hooks/useMovies';
import { MovieCard } from '@/components/ui/MovieCard';
import { motion } from 'framer-motion';

export function TrendingMovies() {
  const { data: trendingMovies, isLoading } = useTrendingMovies();

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse" />
              <div className="mt-2 h-4 bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!trendingMovies?.results?.length) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold mb-6"
      >
        Trending Now
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
      >
        {trendingMovies.results.map((movie: any, index: number) => (
          <motion.div
            key={movie.slug}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0"
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}