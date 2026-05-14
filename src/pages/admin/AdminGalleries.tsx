import { useState } from 'react';
import { Plus, Pencil, Trash2, Images, ArrowLeft, X, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import {
  useAdminGalleries, useAdminGallery, useCreateGallery, useUpdateGallery, useDeleteGallery,
  useAddGalleryItem, useRemoveGalleryItem, type Gallery,
} from '@/hooks/useGallery';

const EMPTY: Partial<Gallery> = {
  title: '',
  description: '',
  eventDate: null,
  coverImageUrl: '',
  isPublished: false,
};

const API_BASE = (import.meta.env.VITE_API_URL ?? '/api/v1').replace('/api/v1', '');

function GalleryModal({ initial, onClose }: { initial: Partial<Gallery> & { id?: string }; onClose: () => void }) {
  const [form, setForm] = useState(initial);
  const create = useCreateGallery();
  const update = useUpdateGallery();
  const isEdit = !!initial.id;

  const set = (field: keyof typeof form, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await update.mutateAsync({ id: initial.id!, ...form });
    } else {
      await create.mutateAsync(form);
    }
    onClose();
  };

  const busy = create.isPending || update.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">{isEdit ? 'Edit Album' : 'New Album'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input
              required
              value={form.title ?? ''}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. SolidWorks Training — March 2024"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Event Date</label>
            <input
              type="date"
              value={form.eventDate ?? ''}
              onChange={e => set('eventDate', e.target.value || null)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description ?? ''}
              onChange={e => set('description', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={form.coverImageUrl ?? ''}
              onChange={e => set('coverImageUrl', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="gIsPublished"
              checked={form.isPublished ?? false}
              onChange={e => set('isPublished', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="gIsPublished" className="text-sm text-gray-700">Publish album</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
              {busy ? 'Saving...' : isEdit ? 'Save' : 'Create Album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AlbumDetail({ galleryId, onBack }: { galleryId: string; onBack: () => void }) {
  const { data: gallery, isLoading } = useAdminGallery(galleryId);
  const addItem = useAddGalleryItem();
  const removeItem = useRemoveGalleryItem();
  const [modal, setModal] = useState<Partial<Gallery> & { id?: string } | null>(null);

  const { data: mediaList = [] } = useQuery({
    queryKey: ['media'],
    queryFn: () => apiClient.get('/media').then(r => r.data),
  });

  const usedIds = new Set((gallery?.items ?? []).map((i: any) => i.mediaId));

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{gallery?.title}</h1>
          <p className="text-sm text-gray-500">{(gallery?.items ?? []).length} photos</p>
        </div>
        <button
          onClick={() => setModal(gallery ?? {})}
          className="flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Pencil size={13} />
          Edit Album
        </button>
      </div>

      {/* Current photos */}
      {(gallery?.items ?? []).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Album Photos</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {(gallery?.items ?? []).map((item: any) => (
              <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={item.url}
                  alt={item.caption ?? ''}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeItem.mutate({ galleryId, itemId: item.id })}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add from media library */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Add from Media Library</h2>
        {mediaList.length === 0 ? (
          <p className="text-sm text-gray-400">No media uploaded yet. Upload files in the Media section.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {mediaList
              .filter((m: any) => m.mime_type?.startsWith('image/') && !usedIds.has(m.id))
              .map((m: any) => {
                const url = `${API_BASE}/uploads/${m.filename}`;
                return (
                  <button
                    key={m.id}
                    onClick={() => addItem.mutate({ galleryId, mediaId: m.id })}
                    disabled={addItem.isPending}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all group"
                  >
                    <img src={url} alt={m.original_name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors flex items-center justify-center">
                      <Plus size={20} className="text-white opacity-0 group-hover:opacity-100 drop-shadow" />
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {modal && <GalleryModal initial={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

export default function AdminGalleries() {
  const { data: galleries = [], isLoading } = useAdminGalleries();
  const deleteGallery = useDeleteGallery();
  const [modal, setModal] = useState<(Partial<Gallery> & { id?: string }) | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  if (openId) {
    return <AlbumDetail galleryId={openId} onBack={() => setOpenId(null)} />;
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete album "${title}"? All photos will be removed from this album.`)) return;
    await deleteGallery.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Galleries</h1>
          <p className="text-sm text-gray-500 mt-0.5">Event photo albums</p>
        </div>
        <button
          onClick={() => setModal(EMPTY)}
          className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={14} />
          New Album
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-40 animate-pulse" />
          ))}
        </div>
      ) : galleries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Images size={32} className="mb-3 text-gray-300" />
          <p className="text-sm">No albums yet — create your first event gallery</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((g) => (
            <div key={g.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
              <button
                onClick={() => setOpenId(g.id)}
                className="block w-full text-left"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {g.coverImageUrl ? (
                    <img src={g.coverImageUrl} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Images size={28} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 truncate">{g.title}</p>
                  {g.eventDate && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(g.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </button>
              <div className="px-4 pb-4 flex items-center justify-between">
                <span className={`text-xs font-medium ${g.isPublished ? 'text-green-600' : 'text-gray-400'}`}>
                  {g.isPublished ? 'Published' : 'Draft'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setModal(g)}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(g.id, g.title)}
                    className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <GalleryModal initial={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
