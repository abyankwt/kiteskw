import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  thumbnailUrl: string | null;
  authorId: string | null;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  data: BlogPost[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function usePublishedPosts(params: { page?: number; limit?: number; category?: string } = {}) {
  return useQuery({
    queryKey: ['blog', 'published', params],
    queryFn: () => apiClient.get('/blog', { params }).then((r) => r.data as BlogListResponse),
    staleTime: 60_000,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => apiClient.get(`/blog/${slug}`).then((r) => r.data as BlogPost),
    enabled: !!slug,
  });
}

export function useAdminPosts(params: { page?: number; limit?: number; category?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'blog', params],
    queryFn: () => apiClient.get('/admin/blog', { params }).then((r) => r.data as BlogListResponse),
    staleTime: 30_000,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<BlogPost>) =>
      apiClient.post('/admin/blog', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blog'] }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: Partial<BlogPost> & { id: string }) =>
      apiClient.patch(`/admin/blog/${id}`, dto).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog'] });
      qc.invalidateQueries({ queryKey: ['blog'] });
    },
  });
}

export function usePublishPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      apiClient.post(`/admin/blog/${id}/${publish ? 'publish' : 'unpublish'}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog'] });
      qc.invalidateQueries({ queryKey: ['blog'] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/blog/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog'] });
      qc.invalidateQueries({ queryKey: ['blog'] });
    },
  });
}
