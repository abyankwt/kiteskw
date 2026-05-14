import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string | null;
  clientCompany: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
  courseId: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

export function usePublishedTestimonials() {
  return useQuery({
    queryKey: ['testimonials', 'published'],
    queryFn: () => apiClient.get('/testimonials').then((r) => r.data as Testimonial[]),
    staleTime: 60_000,
  });
}

export function useAdminTestimonials() {
  return useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: () => apiClient.get('/admin/testimonials').then((r) => r.data as Testimonial[]),
    staleTime: 30_000,
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Omit<Testimonial, 'id' | 'sortOrder' | 'createdAt'>) =>
      apiClient.post('/admin/testimonials', dto).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      qc.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: Partial<Testimonial> & { id: string }) =>
      apiClient.patch(`/admin/testimonials/${id}`, dto).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      qc.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/testimonials/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      qc.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useReorderTestimonials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      apiClient.post('/admin/testimonials/reorder', { orderedIds }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      qc.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}
