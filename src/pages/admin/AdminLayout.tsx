import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminCourses from './AdminCourses';
import AdminUsers from './AdminUsers';
import AdminAnalytics from './AdminAnalytics';
import { PrivateRoute } from '@/components/admin/PrivateRoute';

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route
            path="users"
            element={
              <PrivateRoute roles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
