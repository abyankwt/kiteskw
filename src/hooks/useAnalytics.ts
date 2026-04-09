import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'overview'],
    queryFn: () => apiClient.get('/admin/analytics/overview').then((r) => r.data),
    refetchInterval: 60_000,
  });
}

export function useEnrollmentsOverTime(from: string, to: string, groupBy = 'day') {
  return useQuery({
    queryKey: ['admin', 'analytics', 'enrollments', from, to, groupBy],
    queryFn: () =>
      apiClient.get('/admin/analytics/enrollments', { params: { from, to, groupBy } }).then((r) => r.data),
  });
}

export function useTopCourses(limit = 10) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'top-courses', limit],
    queryFn: () =>
      apiClient.get('/admin/analytics/top-courses', { params: { limit } }).then((r) => r.data),
  });
}

export function useRevenueByCategory() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'revenue'],
    queryFn: () => apiClient.get('/admin/analytics/revenue').then((r) => r.data),
  });
}

export function useAdminUsers(filters: { page?: number; role?: string; search?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => apiClient.get('/admin/users', { params: filters }).then((r) => r.data),
  });
}

export function useAdminEnrollments(filters: { page?: number; courseId?: string; status?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'enrollments', filters],
    queryFn: () => apiClient.get('/admin/enrollments', { params: filters }).then((r) => r.data),
  });
}
