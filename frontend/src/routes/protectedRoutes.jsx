import { memo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
    <span className="text-lg font-semibold text-blue-600 animate-pulse">Loading...</span>
  </div>
);

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default memo(ProtectedRoutes);