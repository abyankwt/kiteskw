import { useState } from 'react';
import { Tag, Plus, Pencil, Trash2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon, type Coupon } from '@/hooks/useCoupons';
import { cn } from '@/lib/utils';

const EMPTY: Partial<Coupon> = {
  code: '',
  description: '',
  discountType: 'percent',
  discountValue: 0,
  minOrderAmount: 0,
  maxUses: undefined,
  expiresAt: null,
  isActive: true,
  applicableCourseIds: null,
};

function CouponModal({
  initial,
  onClose,
}: {
  initial: Partial<Coupon> & { id?: string };
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Coupon> & { id?: string }>(initial);
  const create = useCreateCoupon();
  const update = useUpdateCoupon();
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">{isEdit ? 'Edit Coupon' : 'New Coupon'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Code *</label>
              <input
                required
                value={form.code ?? ''}
                onChange={e => set('code', e.target.value.toUpperCase())}
                placeholder="e.g. SAVE20"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
              <select
                value={form.discountType ?? 'percent'}
                onChange={e => set('discountType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed (KWD)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Value * {form.discountType === 'percent' ? '(%)' : '(KWD)'}
              </label>
              <input
                required
                type="number"
                min={0}
                max={form.discountType === 'percent' ? 100 : undefined}
                step={0.001}
                value={form.discountValue ?? ''}
                onChange={e => set('discountValue', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Min Order (KWD)</label>
              <input
                type="number"
                min={0}
                step={0.001}
                value={form.minOrderAmount ?? 0}
                onChange={e => set('minOrderAmount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Uses (blank = unlimited)</label>
              <input
                type="number"
                min={1}
                value={form.maxUses ?? ''}
                onChange={e => set('maxUses', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Unlimited"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Expires At</label>
              <input
                type="datetime-local"
                value={form.expiresAt ? form.expiresAt.slice(0, 16) : ''}
                onChange={e => set('expiresAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input
                value={form.description ?? ''}
                onChange={e => set('description', e.target.value)}
                placeholder="Internal note..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive ?? true}
                onChange={e => set('isActive', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
            </div>
          </div>

          {(create.error || update.error) && (
            <p className="text-xs text-red-600">
              {(create.error as any)?.response?.data?.error ?? 'Failed to save coupon'}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {busy ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCoupons() {
  const { data: coupons = [], isLoading } = useAdminCoupons();
  const deleteCoupon = useDeleteCoupon();
  const [modal, setModal] = useState<Partial<Coupon> & { id?: string } | null>(null);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await deleteCoupon.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage discount codes</p>
        </div>
        <button
          onClick={() => setModal(EMPTY)}
          className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={14} />
          New Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Value</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Uses</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Expires</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    <Tag size={20} className="mx-auto mb-2 text-gray-300" />
                    No coupons yet
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900">{c.code}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{c.discountType}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {c.discountType === 'percent' ? `${c.discountValue}%` : `KWD ${Number(c.discountValue).toFixed(3)}`}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.usedCount}{c.maxUses != null ? ` / ${c.maxUses}` : ''}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {c.expiresAt
                        ? new Date(c.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModal(c)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
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
      </div>

      {modal && <CouponModal initial={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
