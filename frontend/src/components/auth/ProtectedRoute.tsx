import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import type { UserRole } from '@/types';

const ROLE_HOME: Record<UserRole, string> = {
  customer: '/customer',
  staff: '/staff',
  shop_admin: '/admin',
  super_admin: '/super-admin',
};

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: UserRole[] }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role]} replace />;
  return <>{children}</>;
}

export function RootRedirect() {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role]} replace />;
}
