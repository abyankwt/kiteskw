import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export interface GalleryItem {
  id: string;
  mediaId: string;
  caption: string | null;
  sortOrder: number;
  url: string;
  filename: string;
}

export interface Gallery {
  id: string;
  title: string;
  description: string | null;
  eventDate: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  items?: GalleryItem[];
}

export function usePublishedGalleries() {
  return useQuery({
    queryKey: ['gallery', 'published'],
    queryFn: () => apiClient.get('/gallery').then((r) => r.data as Gallery[]),
    staleTime: 60_000,
  });
}

export function useGallery(id: string) {
  return useQuery({
    queryKey: ['gallery', id],
    queryFn: () => apiClient.get(`/gallery/${id}`).then((r) => r.data as Gallery),
    enabled: !!id,
  });
}

export function useAdminGalleries() {
  return useQuery({
    queryKey: ['admin', 'galleries'],
    queryFn: () => apiClient.get('/admin/galleries').then((r) => r.data as Gallery[]),
    staleTime: 30_000,
  });
}

export function useAdminGallery(id: string) {
  return useQuery({
    queryKey: ['admin', 'galleries', id],
    queryFn: () => apiClient.get(`/admin/galleries/${id}`).then((r) => r.data as Gallery),
    enabled: !!id,
  });
}

export function useCreateGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<Gallery>) =>
      apiClient.post('/admin/galleries', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'galleries'] }),
  });
}

export function useUpdateGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: Partial<Gallery> & { id: string }) =>
      apiClient.patch(`/admin/galleries/${id}`, dto).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'galleries'] });
      qc.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
}

export function useDeleteGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/galleries/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'galleries'] });
      qc.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
}

export function useAddGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ galleryId, mediaId, caption }: { galleryId: string; mediaId: string; caption?: string }) =>
      apiClient.post(`/admin/galleries/${galleryId}/items`, { mediaId, caption }).then((r) => r.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['admin', 'galleries', vars.galleryId] }),
  });
}

export function useRemoveGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ galleryId, itemId }: { galleryId: string; itemId: string }) =>
      apiClient.delete(`/admin/galleries/${galleryId}/items/${itemId}`).then((r) => r.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['admin', 'galleries', vars.galleryId] }),
  });
}

export function useReorderGalleryItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ galleryId, orderedIds }: { galleryId: string; orderedIds: string[] }) =>
      apiClient.post(`/admin/galleries/${galleryId}/items/reorder`, { orderedIds }).then((r) => r.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['admin', 'galleries', vars.galleryId] }),
  });
}
