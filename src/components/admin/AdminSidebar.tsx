import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  LogOut,
  ChevronRight,
  Globe,
  Image,
  Shield,
  GraduationCap,
  CreditCard,
  Star,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  exact?: boolean;
  permission?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',   href: '/admin',            icon: LayoutDashboard, exact: true, permission: 'dashboard:view' },
  { label: 'Courses',     href: '/admin/courses',    icon: BookOpen,         permission: 'courses:read' },
  { label: 'Trending',    href: '/admin/featured',   icon: Star,             permission: 'courses:read' },
  { label: 'Enrollments', href: '/admin/enrollments',icon: GraduationCap,    permission: 'enrollments:read' },
  { label: 'Payments',    href: '/admin/payments',   icon: CreditCard,       permission: 'enrollments:read' },
  { label: 'Analytics',   href: '/admin/analytics',  icon: BarChart3,        permission: 'analytics:view' },
  { label: 'CMS Editor',  href: '/admin/cms',        icon: Globe,            permission: 'cms:read' },
  { label: 'Media',       href: '/admin/media',      icon: Image,            permission: 'media:upload' },
  { label: 'Users',       href: '/admin/users',      icon: Users,            permission: 'users:read' },
  { label: 'Roles',       href: '/admin/roles',      icon: Shield,           permission: 'roles:manage' },
];

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  STAFF: 'Staff',
  STUDENT: 'Student',
};

export function AdminSidebar() {
  const { pathname } = useLocation();
  const { user, hasPermission, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <aside className="w-60 h-screen bg-gray-900 flex flex-col border-r border-gray-800 shrink-0">
      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">K</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">KITES</p>
            <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider px-2 mb-3">Main</p>
        {visibleItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <item.icon size={16} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
            <span className="text-gray-200 text-xs font-semibold">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.fullName}</p>
            <p className="text-gray-500 text-xs truncate">{roleLabels[user?.role || ''] || user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-2.5 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
