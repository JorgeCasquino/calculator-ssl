import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export { Login, Register, PrivateRoute };