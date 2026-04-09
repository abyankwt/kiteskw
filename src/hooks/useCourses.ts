import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export interface CourseFilters {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
  status?: string;
}

export interface ApiCourse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  category: string;
  price: number;
  discountPercent: number;
  effectivePrice: number;
  thumbnailUrl: string | null;
  galleryUrls: string[];
  duration: string | null;
  level: string;
  instructor: string | null;
  tags: string[];
  status: string;
  rating: number;
  enrollmentCount: number;
  certified: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export function usePublishedCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: ['courses', 'published', filters],
    queryFn: () =>
      apiClient.get('/courses', { params: filters }).then((r) => r.data),
    staleTime: 60_000,
    retry: 1,
  });
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ['courses', slug],
    queryFn: () => apiClient.get(`/courses/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });
}

export function useAdminCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'courses', filters],
    queryFn: () =>
      apiClient.get('/admin/courses', { params: filters }).then((r) => r.data),
    staleTime: 30_000,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiClient.post('/admin/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'courses'] }),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      apiClient.patch(`/admin/courses/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'courses'] }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/admin/courses/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'courses'] }),
  });
}

export function usePublishCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      apiClient.post(`/admin/courses/${id}/${publish ? 'publish' : 'unpublish'}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'courses'] }),
  });
}

export function useRecordView() {
  return useMutation({
    mutationFn: (courseId: string) =>
      apiClient.post(`/courses/${courseId}/view`).then((r) => r.data),
  });
}

export function useEnrollCheckout() {
  return useMutation({
    mutationFn: (courseId: string) =>
      apiClient.post('/enrollments/checkout', { courseId }).then((r) => r.data),
  });
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['enrollments', 'my'],
    queryFn: () => apiClient.get('/enrollments/my').then((r) => r.data),
    staleTime: 60_000,
  });
}
