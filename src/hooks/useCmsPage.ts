import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';

export interface CmsBlock {
  en?: string | object | null;
  ar?: string | object | null;
  media_url?: string;
  media_alt?: string;
  _ids?: { en?: string; ar?: string };
  _type?: string;
}

export interface CmsSection {
  id: string;
  display_name: string;
  is_visible: boolean;
  sort_order: number;
  blocks: Record<string, CmsBlock>;
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  updated_at: string;
  sections: Record<string, CmsSection>;
}

// Public hook — frontend pages use this to get CMS content
export function useCmsPage(slug: string) {
  return useQuery<CmsPage>({
    queryKey: ['cms', 'page', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/cms/pages/${slug}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — revalidates in background
    retry: false,
  });
}

// Admin hook — used by CMS editor
export function useAdminCmsPages() {
  return useQuery({
    queryKey: ['cms', 'pages'],
    queryFn: async () => {
      const { data } = await apiClient.get('/cms/pages');
      return data.data;
    },
  });
}

export function useUpdateBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      blockId,
      value_text,
      value_json,
    }: {
      blockId: string;
      value_text?: string;
      value_json?: any;
    }) => {
      const { data } = await apiClient.patch(`/cms/blocks/${blockId}`, {
        value_text,
        value_json,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms'] });
    },
  });
}

export function useToggleSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sectionId, isVisible }: { sectionId: string; isVisible: boolean }) => {
      const { data } = await apiClient.patch(`/cms/sections/${sectionId}`, {
        is_visible: isVisible,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms'] });
    },
  });
}

export function usePublishPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, publish }: { slug: string; publish: boolean }) => {
      const endpoint = publish ? 'publish' : 'unpublish';
      const { data } = await apiClient.post(`/cms/pages/${slug}/${endpoint}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms'] });
    },
  });
}

// Helper to get a block value by locale
export function getBlockValue(
  section: CmsSection | undefined,
  fieldKey: string,
  locale: 'en' | 'ar' = 'en'
): string | null {
  if (!section) return null;
  const block = section.blocks[fieldKey];
  if (!block) return null;
  return (block[locale] as string | null) ?? (block['en'] as string | null) ?? null;
}

export function getBlockJson(section: CmsSection | undefined, fieldKey: string): any {
  if (!section) return null;
  const block = section.blocks[fieldKey];
  if (!block) return null;
  return block['en'] ?? null;
}
