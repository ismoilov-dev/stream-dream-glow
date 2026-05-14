import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useSeries = (params?: {
  page?: number;
  search?: string;
  ordering?: string;
  genre?: string;
}) => {
  return useQuery({
    queryKey: ['series', params],
    queryFn: async () => {
      const response = await api.get('/api/series/', { params });
      return response.data;
    },
  });
};

export const useSerie = (slug: string) => {
  return useQuery({
    queryKey: ['serie', slug],
    queryFn: async () => {
      const response = await api.get(`/api/series/${slug}/`);
      return response.data;
    },
    enabled: !!slug,
  });
};

export const useTrendingSeries = () => {
  return useQuery({
    queryKey: ['series', 'trending'],
    queryFn: async () => {
      const response = await api.get('/api/series/trending/');
      return response.data;
    },
  });
};

export const useNewReleasesSeries = () => {
  return useQuery({
    queryKey: ['series', 'new-releases'],
    queryFn: async () => {
      const response = await api.get('/api/series/new-releases/');
      return response.data;
    },
  });
};

export const useSimilarSeries = (slug: string) => {
  return useQuery({
    queryKey: ['series', 'similar', slug],
    queryFn: async () => {
      const response = await api.get(`/api/recommendations/series/similar/${slug}/`);
      return response.data;
    },
    enabled: !!slug,
  });
};

export const useSeason = (id: number) => {
  return useQuery({
    queryKey: ['season', id],
    queryFn: async () => {
      const response = await api.get(`/api/seasons/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useEpisode = (id: number) => {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: async () => {
      const response = await api.get(`/api/episodes/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};