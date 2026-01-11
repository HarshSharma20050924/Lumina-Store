
import React, { useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { ToastNotifications } from '../components/ui/ToastNotifications';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoginModal } from '../components/LoginModal';
import { useStore } from '../store';

export const AdminApp = () => {
  const { checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <ErrorBoundary>
        <AdminLayout />
        <LoginModal /> 
        <ToastNotifications />
      </ErrorBoundary>
    </div>
  );
};
