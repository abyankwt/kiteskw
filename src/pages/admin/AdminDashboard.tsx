import { format, subDays } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, Users, BookOpen, DollarSign,
  Eye, GraduationCap, ArrowUpRight,
} from 'lucide-react';
import { useAnalyticsOverview, useEnrollmentsOverTime, useTopCourses, useRevenueByCategory } from '@/hooks/useAnalytics';

function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <ArrowUpRight size={12} className="text-green-500" />
          {subtitle}
        </p>
      )}
    </div>
  );
}

const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#78716c', '#f97316'];

export default function AdminDashboard() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview();
  const { data: enrollmentTrend } = useEnrollmentsOverTime(thirtyDaysAgo, today);
  const { data: topCourses } = useTopCourses(5);
  const { data: revenueByCategory } = useRevenueByCategory();

  const chartEnrollments = (enrollmentTrend || []).map((d: any) => ({
    date: format(new Date(d.date), 'MMM d'),
    enrollments: d.count,
    revenue: parseFloat(d.revenue),
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Enrollments"
          value={overviewLoading ? '...' : (overview?.totalEnrollments ?? 0).toLocaleString()}
          subtitle={`${overview?.enrollmentsToday ?? 0} today`}
          icon={GraduationCap}
          color="blue"
        />
        <KPICard
          title="Monthly Revenue"
          value={overviewLoading ? '...' : `KWD ${(overview?.revenueThisMonth ?? 0).toFixed(3)}`}
          subtitle={`KWD ${(overview?.totalRevenue ?? 0).toFixed(3)} total`}
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="Published Courses"
          value={overviewLoading ? '...' : `${overview?.publishedCourses ?? 0} / ${overview?.totalCourses ?? 0}`}
          icon={BookOpen}
          color="purple"
        />
        <KPICard
          title="Conversion Rate"
          value={overviewLoading ? '...' : `${overview?.conversionRate ?? 0}%`}
          subtitle={`${overview?.totalUsers ?? 0} total users`}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Enrollment trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Enrollments (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartEnrollments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Courses by Enrollment</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topCourses || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis
                type="category"
                dataKey="title"
                tick={{ fontSize: 10 }}
                width={120}
                tickLine={false}
                tickFormatter={(v) => v.length > 18 ? v.substring(0, 18) + '…' : v}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="enrollmentCount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Revenue by category */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Revenue by Category</h2>
          {revenueByCategory && revenueByCategory.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                  >
                    {revenueByCategory.map((_: any, index: number) => (
                      <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => [`KWD ${parseFloat(v).toFixed(3)}`, 'Revenue']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 flex-1">
                {revenueByCategory.slice(0, 6).map((d: any, i: number) => (
                  <div key={d.category} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                    />
                    <span className="text-xs text-gray-600 flex-1 truncate">{d.category}</span>
                    <span className="text-xs font-medium text-gray-800">{d.enrollmentCount}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No revenue data yet
            </div>
          )}
        </div>

        {/* Recent enrollments summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            {[
              { label: 'Enrollments this month', value: overview?.enrollmentsThisMonth ?? 0, icon: GraduationCap, color: 'text-blue-600' },
              { label: 'Enrollments today', value: overview?.enrollmentsToday ?? 0, icon: TrendingUp, color: 'text-green-600' },
              { label: 'Total active users', value: overview?.totalUsers ?? 0, icon: Users, color: 'text-purple-600' },
              { label: 'Page views today', value: overview?.viewsToday ?? 0, icon: Eye, color: 'text-amber-600' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <stat.icon size={15} className={stat.color} />
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {overviewLoading ? '...' : stat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
