import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useSummary = (start?: string, end?: string) => {
  return useQuery({
    queryKey: ['summary', start, end],
    queryFn: async () => {
      const { data } = await api.get('/summary', { params: { start, end } });
      return data.data;
    },
    refetchInterval: 30000, // Refetch every 30s
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data.data;
    },
  });
};

export const useSalesHistory = (start?: string, end?: string) => {
  return useQuery({
    queryKey: ['sales-history', start, end],
    queryFn: async () => {
      const { data } = await api.get('/sales/history', { params: { start, end } });
      return data.data;
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct: any) => {
      const { data } = await api.post('/products', newProduct);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data } = await api.patch(`/products/${id}`, updates);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (adjustment: any) => {
      const { data } = await api.post('/products/adjust', adjustment);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useStockMovements = () => {
  return useQuery({
    queryKey: ['stock-movements'],
    queryFn: async () => {
      const { data } = await api.get('/products/movements');
      return data.data;
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/auth/users');
      return data.data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newUser: any) => {
      const { data } = await api.post('/auth/users', newUser);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ username, active }: { username: string; active: boolean }) => {
      const { data } = await api.patch(`/auth/users/${username}`, { active });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => {
      const { data } = await api.delete(`/auth/users/${username}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ username, newPassword }: { username: string; newPassword: string }) => {
      const { data } = await api.patch(`/auth/users/${username}/reset-password`, { newPassword });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
