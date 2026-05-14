'use client';

import { useState } from 'react';
import { useMovies, useGenres } from '@/lib/hooks/useMovies';
import { MovieCard } from '@/components/ui/MovieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data: movies, isLoading } = useMovies({
    search: searchTerm,
    genre: selectedGenre,
    page,
  });

  const { data: genres } = useGenres();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Movies</h1>
          <p className="text-muted-foreground">Browse our collection of premium movies</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-12"
            />
          </div>

          {/* Genre Filter */}
          {genres?.results && (
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedGenre === undefined ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedGenre(undefined);
                  setPage(1);
                }}
              >
                All Genres
              </Badge>
              {genres.results.map((genre: any) => (
                <Badge
                  key={genre.slug}
                  variant={selectedGenre === genre.slug ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedGenre(genre.slug);
                    setPage(1);
                  }}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Movies Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg" />
                  <div className="mt-2 h-4 bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies?.results?.map((movie: any, index: number) => (
                  <motion.div
                    key={movie.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {movies?.count && (
                <div className="mt-12 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      Page {page} of {Math.ceil(movies.count / 20)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page * 20 >= movies.count}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}