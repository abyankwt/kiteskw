import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminPosts, useCreatePost, useUpdatePost, usePublishPost, useDeletePost, type BlogPost } from '@/hooks/useBlog';
import { cn } from '@/lib/utils';

const EMPTY: Partial<BlogPost> = {
  title: '',
  content: '',
  excerpt: '',
  thumbnailUrl: '',
  category: 'news',
  tags: [],
  isPublished: false,
};

function PostDrawer({ initial, onClose }: { initial: Partial<BlogPost> & { id?: string }; onClose: () => void }) {
  const [form, setForm] = useState(initial);
  const create = useCreatePost();
  const update = useUpdatePost();
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-5">{isEdit ? 'Edit Post' : 'New Blog Post'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input
              required
              value={form.title ?? ''}
              onChange={e => set('title', e.target.value)}
              placeholder="Post title"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <input
                value={form.category ?? 'news'}
                onChange={e => set('category', e.target.value)}
                placeholder="e.g. news, training, events"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
              <input
                value={(form.tags ?? []).join(', ')}
                onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                placeholder="engineering, training"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Thumbnail URL</label>
            <input
              type="url"
              value={form.thumbnailUrl ?? ''}
              onChange={e => set('thumbnailUrl', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt ?? ''}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="Short summary shown in listings..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
            <textarea
              rows={10}
              value={form.content ?? ''}
              onChange={e => set('content', e.target.value)}
              placeholder="Full post content..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished ?? false}
              onChange={e => set('isPublished', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isPublished" className="text-sm text-gray-700">Publish immediately</label>
          </div>

          {(create.error || update.error) && (
            <p className="text-xs text-red-600">
              {(create.error as any)?.response?.data?.error ?? 'Failed to save post'}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
              {busy ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminPosts({ page });
  const publishPost = usePublishPost();
  const deletePost = useDeletePost();
  const [drawer, setDrawer] = useState<(Partial<BlogPost> & { id?: string }) | null>(null);

  const posts = data?.data ?? [];
  const pagination = data?.pagination;

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await deletePost.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage posts, news, and articles</p>
        </div>
        <button
          onClick={() => setDrawer(EMPTY)}
          className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={14} />
          New Post
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Published</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">
                    <AlertCircle size={20} className="mx-auto mb-2 text-gray-300" />
                    No posts yet — create your first post
                  </td>
                </tr>
              ) : (
                posts.map((p: BlogPost) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 truncate max-w-[280px]">{p.title}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{p.category}</td>
                    <td className="px-4 py-3">
                      {p.isPublished ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">Published</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => publishPost.mutate({ id: p.id, publish: !p.isPublished })}
                          title={p.isPublished ? 'Unpublish' : 'Publish'}
                          className={cn(
                            'p-1.5 rounded-md transition-colors',
                            p.isPublished
                              ? 'hover:bg-amber-50 text-amber-500 hover:text-amber-700'
                              : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                          )}
                        >
                          {p.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          onClick={() => setDrawer(p)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>{pagination.total} total posts</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
              <span className="px-3 py-1 text-gray-700 font-medium">{page} / {pagination.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>

      {drawer && <PostDrawer initial={drawer} onClose={() => setDrawer(null)} />}
    </div>
  );
}
