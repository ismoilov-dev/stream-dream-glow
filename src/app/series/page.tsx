'use client';

import { useSeries } from '@/lib/hooks/useSeries';
import { useGenres } from '@/lib/hooks/useMovies';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';

export default function SeriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data: series, isLoading } = useSeries({
    search: searchTerm,
    genre: selectedGenre,
    page,
  });

  const { data: genresData } = useGenres();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">TV Series</h1>
          <p className="text-muted-foreground">Discover amazing series</p>
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
              placeholder="Search series..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-12"
            />
          </div>

          {/* Genre Filter */}
          {genresData?.results && (
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
              {genresData.results.map((genre: any) => (
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

        {/* Series Grid */}
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
                {series?.results?.map((s: any, index: number) => (
                  <motion.div
                    key={s.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/series/${s.slug}`}>
                      <div className="group relative rounded-lg overflow-hidden cursor-pointer h-full">
                        <Image
                          src={s.poster_path}
                          alt={s.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-lg font-semibold">{s.title}</p>
                            <p className="text-sm text-gray-300">
                              {s.episodes_count} episodes
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {series?.count && (
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
                      Page {page} of {Math.ceil(series.count / 20)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page * 20 >= series.count}
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