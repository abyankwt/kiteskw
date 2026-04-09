import { useState } from 'react';
import { format, subDays } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useEnrollmentsOverTime, useTopCourses, useRevenueByCategory } from '@/hooks/useAnalytics';

const COLORS = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#78716c','#f97316'];

const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export default function AdminAnalytics() {
  const [from, setFrom] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  const { data: enrollmentData } = useEnrollmentsOverTime(from, to, groupBy);
  const { data: topCourses } = useTopCourses(10);
  const { data: revenueData } = useRevenueByCategory();

  const chartEnrollments = (enrollmentData || []).map((d: any) => ({
    date: format(new Date(d.date), groupBy === 'month' ? 'MMM yyyy' : 'MMM d'),
    enrollments: d.count,
    revenue: parseFloat(d.revenue),
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Detailed enrollment and revenue metrics</p>
      </div>

      {/* Date Range Picker */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.days}
                variant="outline"
                size="sm"
                onClick={() => {
                  setFrom(format(subDays(new Date(), p.days), 'yyyy-MM-dd'));
                  setTo(format(new Date(), 'yyyy-MM-dd'));
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <div className="flex items-end gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">From</Label>
              <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-36" />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">To</Label>
              <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="w-36" />
            </div>
            <div className="flex gap-1">
              {(['day', 'week', 'month'] as const).map((g) => (
                <Button
                  key={g}
                  variant={groupBy === g ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGroupBy(g)}
                  className={groupBy === g ? 'bg-blue-600 text-white' : ''}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Enrollments Over Time</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartEnrollments}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `KWD ${v}`} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <Line yAxisId="left" type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} dot={false} name="Enrollments" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} name="Revenue (KWD)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Courses + Revenue pie */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Courses</h2>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs">#</TableHead>
                <TableHead className="text-xs">Course</TableHead>
                <TableHead className="text-xs text-right">Enrollments</TableHead>
                <TableHead className="text-xs text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(topCourses || []).map((c: any, i: number) => (
                <TableRow key={c.id}>
                  <TableCell className="text-xs text-gray-400">{i + 1}</TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-gray-900 line-clamp-1">{c.title}</p>
                    <p className="text-xs text-gray-400">{c.category}</p>
                  </TableCell>
                  <TableCell className="text-xs text-right font-medium">{c.enrollmentCount.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right text-gray-500">{c.viewCount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Enrollments by Category</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={revenueData || []} dataKey="enrollmentCount" nameKey="category"
                  cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                  {(revenueData || []).map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any) => [v.toLocaleString(), 'Enrollments']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 flex-1">
              {(revenueData || []).slice(0, 7).map((d: any, i: number) => (
                <div key={d.category} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-gray-600 flex-1 truncate">{d.category}</span>
                  <span className="text-xs font-medium text-gray-800">{d.enrollmentCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
