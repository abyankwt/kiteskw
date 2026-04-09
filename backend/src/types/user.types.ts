export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}
