'use client';

import { useState } from 'react';
import { useMovies } from '@/lib/hooks/useMovies';
import { useSeries } from '@/lib/hooks/useSeries';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: movies } = useMovies({ search: searchTerm });
  const { data: series } = useSeries({ search: searchTerm });

  const { data: searchResults } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return { movies: [], series: [] };
      const response = await api.get('/api/search/', { params: { q: searchTerm } });
      return response.data;
    },
    enabled: searchTerm.length > 0,
  });

  const hasResults = (movies?.results?.length || 0) > 0 || (series?.results?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Search</h1>
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search movies, series, actors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
              autoFocus
            />
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {searchTerm && !hasResults ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-2">No results found</p>
              <p className="text-sm text-muted-foreground">Try different keywords</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Movies */}
              {movies?.results && movies.results.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Movies</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.results.map((movie: any, index: number) => (
                      <motion.div
                        key={movie.slug}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/movies/${movie.slug}`}>
                          <div className="group relative rounded-lg overflow-hidden cursor-pointer">
                            <Image
                              src={movie.poster_path}
                              alt={movie.title}
                              width={200}
                              height={300}
                              className="w-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                              <div className="p-3 w-full">
                                <p className="font-semibold text-sm line-clamp-2">
                                  {movie.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Series */}
              {series?.results && series.results.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Series</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {series.results.map((s: any, index: number) => (
                      <motion.div
                        key={s.slug}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/series/${s.slug}`}>
                          <div className="group relative rounded-lg overflow-hidden cursor-pointer">
                            <Image
                              src={s.poster_path}
                              alt={s.title}
                              width={200}
                              height={300}
                              className="w-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                              <div className="p-3 w-full">
                                <p className="font-semibold text-sm line-clamp-2">
                                  {s.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}