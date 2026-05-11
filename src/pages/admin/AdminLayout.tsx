import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { PrivateRoute } from '@/components/admin/PrivateRoute';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminCourses from './AdminCourses';
import AdminUsers from './AdminUsers';
import AdminAnalytics from './AdminAnalytics';
import AdminCMS from './AdminCMS';
import AdminMedia from './AdminMedia';
import AdminRoles from './AdminRoles';
import AdminPayments from './AdminPayments';
import AdminFeaturedCourses from './AdminFeaturedCourses';

// Ordered list of fallback routes when dashboard is not permitted
const FALLBACK_ROUTES: { permission: string; path: string }[] = [
  { permission: 'cms:read',         path: '/admin/cms' },
  { permission: 'media:upload',     path: '/admin/media' },
  { permission: 'courses:read',     path: '/admin/courses' },
  { permission: 'enrollments:read', path: '/admin/enrollments' },
  { permission: 'analytics:view',   path: '/admin/analytics' },
  { permission: 'users:read',       path: '/admin/users' },
  { permission: 'roles:manage',     path: '/admin/roles' },
];

function AdminIndex() {
  const { hasPermission } = useAuth();

  if (hasPermission('dashboard:view')) return <AdminDashboard />;

  const fallback = FALLBACK_ROUTES.find(r => hasPermission(r.permission));
  if (fallback) return <Navigate to={fallback.path} replace />;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-3">
      <p className="text-gray-500 text-sm">You don't have access to any admin sections.</p>
      <p className="text-gray-400 text-xs">Contact your Super Admin to be granted the right permissions.</p>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route index element={<AdminIndex />} />

          <Route
            path="courses"
            element={
              <PrivateRoute permission="courses:read">
                <AdminCourses />
              </PrivateRoute>
            }
          />

          <Route
            path="users"
            element={
              <PrivateRoute permission="users:read">
                <AdminUsers />
              </PrivateRoute>
            }
          />

          <Route
            path="analytics"
            element={
              <PrivateRoute permission="analytics:view">
                <AdminAnalytics />
              </PrivateRoute>
            }
          />

          <Route
            path="cms"
            element={
              <PrivateRoute permission="cms:read">
                <AdminCMS />
              </PrivateRoute>
            }
          />

          <Route
            path="media"
            element={
              <PrivateRoute permission="media:upload">
                <AdminMedia />
              </PrivateRoute>
            }
          />

          <Route
            path="featured"
            element={
              <PrivateRoute permission="courses:read">
                <AdminFeaturedCourses />
              </PrivateRoute>
            }
          />

          <Route
            path="payments"
            element={
              <PrivateRoute permission="enrollments:read">
                <AdminPayments />
              </PrivateRoute>
            }
          />

          <Route
            path="roles"
            element={
              <PrivateRoute permission="roles:manage">
                <AdminRoles />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
