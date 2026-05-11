import { UserRole } from './user.types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRole;
      fullName: string;
      permissions: string[];
    };
  }
}
