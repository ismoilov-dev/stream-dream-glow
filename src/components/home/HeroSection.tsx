'use client';

import { useTrendingMovies } from '@/lib/hooks/useMovies';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { data: trendingMovies, isLoading } = useTrendingMovies();

  if (isLoading || !trendingMovies?.results?.length) {
    return (
      <div className="relative h-[70vh] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-4">
            <div className="h-8 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
              <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredMovie = trendingMovies.results[0];

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={featuredMovie.backdrop_path || featuredMovie.poster_path}
          alt={featuredMovie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white leading-tight"
          >
            {featuredMovie.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <Badge variant="secondary" className="text-sm">
              {featuredMovie.release_year}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {featuredMovie.age_rating}
            </Badge>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-white">{featuredMovie.rating?.toFixed(1)}</span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-200 line-clamp-3"
          >
            {featuredMovie.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-4"
          >
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              <Play className="w-5 h-5 mr-2" />
              Play Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}