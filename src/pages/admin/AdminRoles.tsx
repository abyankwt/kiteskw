import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus, Check, X, ChevronDown, ChevronRight } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { usePermission } from '@/hooks/usePermission';

function groupPermissions(perms: any[]): Record<string, any[]> {
  return perms.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {} as Record<string, any[]>);
}

function RoleCard({
  role,
  allPermissions,
}: {
  role: any;
  allPermissions: any[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string[]>(role.permissions ?? []);
  const queryClient = useQueryClient();
  const canManage = usePermission('roles:manage');

  const updateMutation = useMutation({
    mutationFn: async () => {
      await apiClient.put(`/admin/roles/${role.id}/permissions`, { permission_keys: selected });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const grouped = groupPermissions(allPermissions);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Shield size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{role.display_name}</p>
            <p className="text-xs text-gray-400">{role.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {role.is_system && (
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">System</span>
          )}
          <span className="text-xs text-gray-400">{selected.length} permissions</span>
          <button onClick={() => setExpanded((v) => !v)} className="text-gray-400 hover:text-gray-600">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          {Object.entries(grouped).map(([module, perms]) => (
            <div key={module}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{module}</p>
              <div className="flex flex-wrap gap-2">
                {perms.map((p) => {
                  const active = selected.includes(p.key);
                  return (
                    <button
                      key={p.key}
                      onClick={() => canManage && toggle(p.key)}
                      disabled={!canManage}
                      title={p.description}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
                      } disabled:cursor-default`}
                    >
                      {p.action}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {canManage && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending}
                className="flex items-center gap-1 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Check size={14} />
                Save Permissions
              </button>
              <button
                onClick={() => setSelected(role.permissions ?? [])}
                className="flex items-center gap-1 text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <X size={14} />
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminRoles() {
  const canManage = usePermission('roles:manage');

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/roles');
      return data.data;
    },
  });

  const { data: permsData } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/permissions');
      return data.data;
    },
  });

  const roles: any[] = rolesData ?? [];
  const permissions: any[] = permsData ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage what each role can access</p>
        </div>
      </div>

      {!canManage && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          You have read-only access to this page.
        </div>
      )}

      <div className="space-y-3">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} allPermissions={permissions} />
        ))}
      </div>
    </div>
  );
}
