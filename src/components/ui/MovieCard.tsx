'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface Movie {
  slug: string;
  title: string;
  poster_path: string;
  release_year: number;
  age_rating: string;
  rating?: number;
  genres?: Array<{ name: string }>;
}

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className = '' }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative w-48 cursor-pointer ${className}`}
    >
      <Link href={`/movies/${movie.slug}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
          <Image
            src={movie.poster_path}
            alt={movie.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
            sizes="192px"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-12 h-12 text-white" />
          </div>

          {/* Rating badge */}
          {movie.rating && (
            <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1">
              <span className="text-xs font-medium text-white flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                {movie.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-2 space-y-1">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{movie.release_year}</span>
            <Badge variant="outline" className="text-xs px-1 py-0">
              {movie.age_rating}
            </Badge>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {movie.genres.slice(0, 2).map((genre: any) => (
                <Badge key={genre.name} variant="secondary" className="text-xs">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}