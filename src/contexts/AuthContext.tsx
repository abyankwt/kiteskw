import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { setAccessToken } from '@/lib/apiClient';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'STUDENT';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Attempt to restore session on mount using refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch {
      // Ignore logout errors
    }
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
