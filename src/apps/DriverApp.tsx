
import React, { useEffect } from 'react';
import { DeliveryLayout } from '../components/delivery/DeliveryLayout';
import { ToastNotifications } from '../components/ui/ToastNotifications';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useStore } from '../store';

export const DriverApp = () => {
  const { checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ErrorBoundary>
        <DeliveryLayout />
        <ToastNotifications />
      </ErrorBoundary>
    </div>
  );
};
