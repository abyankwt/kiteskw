import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  applicableCourseIds: string[] | null;
  createdAt: string;
}

export interface ValidateCouponResult {
  valid: boolean;
  message: string;
  discountAmount?: number;
  finalAmount?: number;
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: (payload: { code: string; courseId: string; amount: number }) =>
      apiClient.post('/coupons/validate', payload).then((r) => r.data as ValidateCouponResult),
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: () => apiClient.get('/admin/coupons').then((r) => r.data as Coupon[]),
    staleTime: 30_000,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) =>
      apiClient.post('/admin/coupons', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: Partial<Coupon> & { id: string }) =>
      apiClient.patch(`/admin/coupons/${id}`, dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/coupons/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  });
}
