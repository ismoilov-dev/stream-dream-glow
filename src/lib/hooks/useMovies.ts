import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useMovies = (params?: {
  page?: number;
  search?: string;
  ordering?: string;
  genre?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: async () => {
      const response = await api.get('/api/movies/', { params });
      return response.data;
    },
  });
};

export const useMovie = (slug: string) => {
  return useQuery({
    queryKey: ['movie', slug],
    queryFn: async () => {
      const response = await api.get(`/api/movies/${slug}/`);
      return response.data;
    },
    enabled: !!slug,
  });
};

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: async () => {
      const response = await api.get('/api/movies/trending/');
      return response.data;
    },
  });
};

export const useNewReleasesMovies = () => {
  return useQuery({
    queryKey: ['movies', 'new-releases'],
    queryFn: async () => {
      const response = await api.get('/api/movies/new-releases/');
      return response.data;
    },
  });
};

export const useSimilarMovies = (slug: string) => {
  return useQuery({
    queryKey: ['movies', 'similar', slug],
    queryFn: async () => {
      const response = await api.get(`/api/recommendations/movies/similar/${slug}/`);
      return response.data;
    },
    enabled: !!slug,
  });
};

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const response = await api.get('/api/genres/');
      return response.data;
    },
  });
};