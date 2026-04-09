import { useState } from 'react';
import { Search, UserCheck, UserX, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useAdminUsers } from '@/hooks/useAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    SUPER_ADMIN: 'bg-red-100 text-red-700',
    ADMIN: 'bg-blue-100 text-blue-700',
    STAFF: 'bg-purple-100 text-purple-700',
    STUDENT: 'bg-gray-100 text-gray-600',
  };
  const labels: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin', ADMIN: 'Admin', STAFF: 'Staff', STUDENT: 'Student',
  };
  return <Badge className={`${map[role] || ''} border-0`}>{labels[role] || role}</Badge>;
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const { user: currentUser } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useAdminUsers({ page, role: roleFilter, search });
  const users: any[] = data?.data || [];
  const pagination = data?.pagination;

  const updateUser = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      apiClient.patch(`/admin/users/${id}`, updates).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateUser.mutateAsync({ id: userId, updates: { role } });
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleToggleActive = async (user: any) => {
    try {
      await updateUser.mutateAsync({ id: user.id, updates: { isActive: !user.isActive } });
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
    } catch {
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination?.total ?? 0} users total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-8"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Loader2 size={20} className="animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-400 text-sm">No users found</TableCell>
              </TableRow>
            ) : users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-gray-600">
                        {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {currentUser?.role === 'SUPER_ADMIN' && user.id !== currentUser.id ? (
                    <Select
                      value={user.role}
                      onValueChange={(v) => handleRoleChange(user.id, v)}
                    >
                      <SelectTrigger className="w-32 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                        <SelectItem value="STUDENT">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    roleBadge(user.role)
                  )}
                </TableCell>
                <TableCell>
                  {user.isActive
                    ? <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
                    : <Badge className="bg-gray-100 text-gray-500 border-0">Inactive</Badge>
                  }
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : '—'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {user.id !== currentUser?.id && currentUser?.role === 'SUPER_ADMIN' && (
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => handleToggleActive(user)}
                      className={`h-8 text-xs ${user.isActive ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`}
                    >
                      {user.isActive
                        ? <><UserX size={13} className="mr-1" /> Deactivate</>
                        : <><UserCheck size={13} className="mr-1" /> Activate</>
                      }
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
