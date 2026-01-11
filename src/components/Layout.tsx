
import React, { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { ToastNotifications } from './ui/ToastNotifications';
import { BackToTop } from './ui/BackToTop';
import { LoginModal } from './LoginModal';
import { useStore } from '../store';
import { AdminLayout } from './admin/AdminLayout';
import { LookbookModal } from './LookbookModal';
import { api } from '../api';
import { sendNotification } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { currentView, isLookbookOpen, toggleLookbook, user, addToast } = useStore();

  // Request Notification Permissions on mount if logged in
  useEffect(() => {
      if (user && "Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
      }
  }, [user]);

  // Polling for Notifications (Simulating Push)
  useEffect(() => {
      if (!user) return;

      const poll = async () => {
          try {
              // We cast response to any[] to iterate
              const notifications: any[] = await api.get('/notifications/poll');
              notifications.forEach(notif => {
                  // Use robust notification sender (handles Android/SW and desktop)
                  sendNotification(notif.title, notif.message);
                  
                  // Trigger in-app toast backup
                  addToast({ type: 'info', message: `${notif.title}: ${notif.message}`, duration: 5000 });
              });
          } catch (e) {
              console.error("Polling error", e);
          }
      };

      // Initial poll
      poll();

      const intervalId = setInterval(poll, 10000); // Poll every 10 seconds
      
      return () => clearInterval(intervalId);
  }, [user, addToast]);

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminLayout />
        <ToastNotifications />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <CartDrawer />
      <LoginModal />
      <LookbookModal isOpen={isLookbookOpen} onClose={() => toggleLookbook(false)} />
      <ToastNotifications />
      <BackToTop />
      
      <main className={`flex-grow ${currentView === 'checkout' || currentView === 'profile' ? 'pt-20' : ''}`}>
        {children}
      </main>
      
      {currentView !== 'checkout' && <Footer />}
    </div>
  );
};
