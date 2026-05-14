import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth';
import { toast } from 'sonner';

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post('/api/auth/login/', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.user, data.access, data.refresh);
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Login failed');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }) => {
      const response = await api.post('/api/auth/register/', userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Registration successful! Please check your email to verify your account.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Registration failed');
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post('/api/auth/verify/', { token });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Email verification failed');
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.get('/api/users/me/');
      return response.data;
    },
    enabled: useAuthStore.getState().isAuthenticated,
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    toast.success('Logged out successfully');
  };
};