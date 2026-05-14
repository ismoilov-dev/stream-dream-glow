import { HeroSection } from '@/components/home/HeroSection';
import { TrendingMovies } from '@/components/home/TrendingMovies';
import { PopularMovies } from '@/components/home/PopularMovies';
import { NewReleases } from '@/components/home/NewReleases';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { ContinueWatching } from '@/components/home/ContinueWatching';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="space-y-12 pb-12">
        <ContinueWatching />
        <TrendingMovies />
        <PopularMovies />
        <NewReleases />
        <FeaturedCollections />
      </div>
    </div>
  );
}
