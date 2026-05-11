import { useAuth } from '@/contexts/AuthContext';

export function usePermission(key: string): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(key);
}

export function usePermissions(keys: string[]): Record<string, boolean> {
  const { hasPermission } = useAuth();
  return Object.fromEntries(keys.map(k => [k, hasPermission(k)]));
}
