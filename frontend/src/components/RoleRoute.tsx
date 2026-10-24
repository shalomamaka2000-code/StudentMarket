import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type Role } from '../context/AuthContext';

const RoleRoute: React.FC<{ children: React.ReactNode; roles: Role[] }> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default RoleRoute;