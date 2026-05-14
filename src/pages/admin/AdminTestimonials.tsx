import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, AlertCircle } from 'lucide-react';
import {
  useAdminTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial,
  type Testimonial,
} from '@/hooks/useTestimonials';

const EMPTY: Partial<Testimonial> = {
  clientName: '',
  clientRole: '',
  clientCompany: '',
  content: '',
  rating: 5,
  avatarUrl: '',
  courseId: null,
  isPublished: true,
  displayLocation: 'all',
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-0.5"
        >
          <Star
            size={18}
            className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialModal({ initial, onClose }: { initial: Partial<Testimonial> & { id?: string }; onClose: () => void }) {
  const [form, setForm] = useState(initial);
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const isEdit = !!initial.id;

  const set = (field: keyof typeof form, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await update.mutateAsync({ id: initial.id!, ...form });
    } else {
      await create.mutateAsync(form as any);
    }
    onClose();
  };

  const busy = create.isPending || update.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-5">{isEdit ? 'Edit Testimonial' : 'New Testimonial'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Client Name *</label>
              <input
                required
                value={form.clientName ?? ''}
                onChange={e => set('clientName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role / Title</label>
              <input
                value={form.clientRole ?? ''}
                onChange={e => set('clientRole', e.target.value)}
                placeholder="e.g. Senior Engineer"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
              <input
                value={form.clientCompany ?? ''}
                onChange={e => set('clientCompany', e.target.value)}
                placeholder="e.g. Aramco"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Review *</label>
              <textarea
                required
                rows={4}
                value={form.content ?? ''}
                onChange={e => set('content', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Rating</label>
              <StarRating value={form.rating ?? 5} onChange={v => set('rating', v)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Avatar URL</label>
              <input
                type="url"
                value={form.avatarUrl ?? ''}
                onChange={e => set('avatarUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Show On</label>
              <select
                value={form.displayLocation ?? 'all'}
                onChange={e => set('displayLocation', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Both pages (Homepage + Training)</option>
                <option value="homepage">Homepage only</option>
                <option value="training">Training page only</option>
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="tIsPublished"
                checked={form.isPublished ?? true}
                onChange={e => set('isPublished', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="tIsPublished" className="text-sm text-gray-700">Visible on website</label>
            </div>
          </div>

          {(create.error || update.error) && (
            <p className="text-xs text-red-600">
              {(create.error as any)?.response?.data?.error ?? 'Failed to save'}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
              {busy ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTestimonials() {
  const { data: testimonials = [], isLoading } = useAdminTestimonials();
  const deleteTestimonial = useDeleteTestimonial();
  const [modal, setModal] = useState<(Partial<Testimonial> & { id?: string }) | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    await deleteTestimonial.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-0.5">Customer reviews and success stories</p>
        </div>
        <button
          onClick={() => setModal(EMPTY)}
          className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={14} />
          Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Review</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Show On</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Visible</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    <AlertCircle size={20} className="mx-auto mb-2 text-gray-300" />
                    No testimonials yet
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{t.clientName}</p>
                      <p className="text-xs text-gray-400">{t.clientRole || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.clientCompany || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} size={12} className={n <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate text-xs">{t.content}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">
                        {t.displayLocation === 'homepage' ? 'Homepage' : t.displayLocation === 'training' ? 'Training' : 'Both'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.isPublished ? (
                        <span className="text-xs text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-xs text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setModal(t)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(t.id, t.clientName)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
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
      </div>

      {modal && <TestimonialModal initial={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
