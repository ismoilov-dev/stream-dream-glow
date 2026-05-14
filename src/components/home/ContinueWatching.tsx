'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { MovieCard } from '@/components/ui/MovieCard';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth';

export function ContinueWatching() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: continueWatching, isLoading } = useQuery({
    queryKey: ['continue-watching'],
    queryFn: async () => {
      const response = await api.get('/api/analytics/progress/continue-watching/');
      return response.data;
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse" />
              <div className="mt-2 h-4 bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!continueWatching?.length) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold mb-6"
      >
        Continue Watching
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
      >
        {continueWatching.map((item: any, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <MovieCard movie={item.content} />
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(item.watched_duration / item.total_duration) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}