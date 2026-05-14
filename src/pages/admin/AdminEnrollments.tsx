import { useState } from 'react';
import { useAdminEnrollments } from '@/hooks/useAnalytics';
import { Download, Search, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';

type StatusFilter = 'all' | 'active' | 'pending' | 'cancelled';

function statusBadge(status: string) {
  if (status === 'active') return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">Active</span>
  );
  if (status === 'pending') return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
  );
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 capitalize">
      {status}
    </span>
  );
}

function exportCsv(rows: any[], from: string, to: string) {
  const headers = ['Name', 'Email', 'Phone', 'Course', 'Date', 'Status', 'Amount (KWD)'];
  const lines = rows.map(r => [
    r.full_name ?? '',
    r.email ?? '',
    r.phone ?? '',
    r.course_title ?? '',
    r.enrolled_at ? new Date(r.enrolled_at).toLocaleDateString('en-GB') : '',
    r.status ?? '',
    r.amount_paid != null ? parseFloat(r.amount_paid).toFixed(3) : '',
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const datePart = from && to ? `_${from}_to_${to}` : `_${new Date().toISOString().split('T')[0]}`;
  a.download = `enrollments${datePart}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const DATE_PRESETS = [
  { label: 'Today', from: () => format(new Date(), 'yyyy-MM-dd'), to: () => format(new Date(), 'yyyy-MM-dd') },
  { label: 'Last 7 days', from: () => format(subDays(new Date(), 7), 'yyyy-MM-dd'), to: () => format(new Date(), 'yyyy-MM-dd') },
  { label: 'Last 30 days', from: () => format(subDays(new Date(), 30), 'yyyy-MM-dd'), to: () => format(new Date(), 'yyyy-MM-dd') },
  { label: 'Last 90 days', from: () => format(subDays(new Date(), 90), 'yyyy-MM-dd'), to: () => format(new Date(), 'yyyy-MM-dd') },
];

export default function AdminEnrollments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data, isLoading } = useAdminEnrollments({
    page,
    limit: 50,
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(from && { from }),
    ...(to && { to }),
  });

  const allRows = data?.data ?? [];
  const pagination = data?.pagination;

  const filtered = search.trim()
    ? allRows.filter((r: any) =>
        r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase())
      )
    : allRows;

  const hasDateFilter = from || to;

  const clearDates = () => { setFrom(''); setTo(''); setPage(1); };

  const applyPreset = (preset: typeof DATE_PRESETS[0]) => {
    setFrom(preset.from());
    setTo(preset.to());
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-sm text-gray-500 mt-0.5">All course participant registrations</p>
        </div>
        <button
          onClick={() => exportCsv(filtered, from, to)}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Date filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date Range</p>
          {hasDateFilter && (
            <button onClick={clearDates} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
              <X size={12} /> Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {DATE_PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                from === p.from() && to === p.to()
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={from}
              onChange={e => { setFrom(e.target.value); setPage(1); }}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <span className="text-gray-400 mt-4">—</span>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={to}
              onChange={e => { setTo(e.target.value); setPage(1); }}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {hasDateFilter && (
            <div className="mt-4 text-xs text-blue-600 font-medium">
              {pagination?.total ?? '—'} results
            </div>
          )}
        </div>
      </div>

      {/* Search + status filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'pending', 'cancelled'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={cn(
                'px-3 py-2 text-xs font-semibold rounded-lg border transition-colors capitalize',
                statusFilter === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    <AlertCircle size={20} className="mx-auto mb-2 text-gray-300" />
                    No enrollments found
                  </td>
                </tr>
              ) : (
                filtered.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.full_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{r.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">{r.course_title}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {r.enrolled_at
                        ? new Date(r.enrolled_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">{statusBadge(r.status)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {r.amount_paid != null ? `KWD ${parseFloat(r.amount_paid).toFixed(3)}` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>{pagination.total} total enrollments</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-gray-700 font-medium">{page} / {pagination.totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
