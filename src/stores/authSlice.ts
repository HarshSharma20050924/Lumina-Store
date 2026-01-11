
import { api } from '../api';
import { AppSlice, AuthSlice } from './types';
import { getAppUrl } from '../utils';

// Helper to determine redirect URL based on environment
const getRedirectUrl = (app: 'admin' | 'driver' | 'store', token?: string) => {
    const baseUrl = getAppUrl(app);
    const search = token ? `?token=${token}` : '';
    if (app === 'store') {
        return `${baseUrl.replace(/\/$/, '')}/${search}`;
    }
    return `${baseUrl}${search}`;
};

// Robust Mobile Notification Sender
const sendBrowserNotification = async (title: string, body: string) => {
    // 1. Check basic support
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification");
        return;
    }

    // 2. Request permission if needed
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }

    // 3. If granted, try to show
    if (Notification.permission === "granted") {
        // Method A: Service Worker (Required for Android/Mobile Chrome)
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                if (registration) {
                    await registration.showNotification(title, {
                        body,
                        icon: '/logo.svg', // Ensure this matches manifest
                        badge: '/logo.svg',
                        vibrate: [200, 100, 200],
                        tag: 'lumina-otp',
                        requireInteraction: true // Keeps notification visible until clicked
                    });
                    return;
                }
            } catch (swError) {
                console.warn("ServiceWorker notification failed:", swError);
            }
        }

        // Method B: Classic Notification API (Desktop Fallback)
        try {
            new Notification(title, { 
                body, 
                icon: '/logo.svg',
                requireInteraction: true 
            });
        } catch (e) {
            console.warn("Classic Notification API failed:", e);
        }
    }
};

export const createAuthSlice: AppSlice<AuthSlice> = (set, get) => ({
  user: null,
  adminUser: null,
  driverUser: null,
  isLoginOpen: false,

  toggleLoginModal: (isOpen) => set((state) => ({ 
    isLoginOpen: isOpen !== undefined ? isOpen : !state.isLoginOpen 
  })),
  
  login: async (email, password, name, role = 'USER') => {
    try {
      let data;
      if (name && role === 'USER') {
        data = await api.post('/auth/register', { email, password, name });
      } else {
        data = await api.post('/auth/login', { email, password });
      }
      
      const userRole = data.role; 
      const isDev = import.meta.env.DEV;
      const currentPort = window.location.port;

      const isAdminOnCorrectApp = (isDev && currentPort === '3002') || (!isDev && window.location.hostname.includes('admin'));
      const isDriverOnCorrectApp = (isDev && currentPort === '3003') || (!isDev && window.location.hostname.includes('driver'));
      const isStoreOnCorrectApp = (isDev && currentPort === '3001') || (!isDev && window.location.hostname.includes('store'));

      if (userRole === 'ADMIN') {
          if (!isAdminOnCorrectApp) {
              window.location.href = getRedirectUrl('admin', data.token);
              return;
          }
          localStorage.setItem('admin_token', data.token);
          set({ adminUser: data });
          get().addToast({ type: 'success', message: 'Admin Dashboard Accessed' });

      } else if (userRole === 'AGENT') {
          if (!isDriverOnCorrectApp) {
              window.location.href = getRedirectUrl('driver', data.token);
              return;
          }
          localStorage.setItem('driver_token', data.token);
          set({ driverUser: data });
          get().addToast({ type: 'success', message: 'Driver Interface Loaded' });

      } else {
          if (!isStoreOnCorrectApp && !isAdminOnCorrectApp && !isDriverOnCorrectApp) {
               window.location.href = getRedirectUrl('store', data.token);
               return;
          }
          
          if (isAdminOnCorrectApp || isDriverOnCorrectApp) {
               window.location.href = getRedirectUrl('store', data.token);
               return;
          }

          localStorage.setItem('client_token', data.token);
          set({ user: data, isLoginOpen: false });
          get().addToast({ type: 'success', message: `Welcome back, ${data.name}` });
      }

    } catch (error: any) {
      get().addToast({ type: 'error', message: error.message || 'Authentication failed' });
      throw error;
    }
  },

  registerDriver: async (data) => {
      try {
          const res = await api.post('/auth/register', { ...data });
          
          const isDev = import.meta.env.DEV;
          const currentPort = window.location.port;
          const isDriverApp = (isDev && currentPort === '3003') || (!isDev && window.location.hostname.includes('driver'));

          if (!isDriverApp) {
              window.location.href = getRedirectUrl('driver', res.token);
              return;
          }

          localStorage.setItem('driver_token', res.token);
          set({ driverUser: { ...res, role: 'AGENT' } });
          get().addToast({ type: 'success', message: 'Driver Account Created' });

      } catch (e: any) {
          get().addToast({ type: 'error', message: e.message });
          throw e;
      }
  },

  checkEmail: async (email: string) => {
      try {
          const res = await api.post('/auth/check-email', { email });
          return res.exists;
      } catch (e) {
          console.error(e);
          return false;
      }
  },

  sendOtp: async (email: string) => {
      try {
          // Pre-emptively request permission on click (User Action)
          if("Notification" in window && Notification.permission === "default") {
              await Notification.requestPermission();
          }

          const response = await api.post('/auth/send-otp', { email });
          
          if (response.otp) {
              const msg = `Security Code: ${response.otp}`;
              
              // 1. Show Persistent Toast (Guaranteed Visibility)
              get().addToast({ type: 'info', message: msg, duration: 15000 }); // 15 seconds
              
              // 2. Trigger System Notification
              await sendBrowserNotification("Lumina Verification", msg);
          } else {
              get().addToast({ type: 'info', message: `Verification code sent to ${email}` });
          }

      } catch (error: any) {
          get().addToast({ type: 'error', message: error.message });
          throw error;
      }
  },

  verifyOtp: async (email: string, otp: string, password?: string, name?: string) => {
      try {
          const data = await api.post('/auth/verify-otp', { email, otp, password, name });
          localStorage.setItem('client_token', data.token);
          set({ 
            user: data,
            isLoginOpen: false
          });
          get().addToast({ type: 'success', message: `Welcome ${data.name}` });
      } catch (error: any) {
          get().addToast({ type: 'error', message: error.message });
          throw error;
      }
  },

  validateOtp: async (email: string, otp: string) => {
      try {
          await api.post('/auth/validate-otp', { email, otp });
          return true;
      } catch (error: any) {
          get().addToast({ type: 'error', message: 'Invalid OTP' });
          return false;
      }
  },

  resetPassword: async (email: string, otp: string, newPass: string) => {
      try {
          await api.post('/auth/reset-password', { email, otp, newPass });
          set({ 
            user: null,
            isLoginOpen: true
          });
          get().addToast({ type: 'success', message: 'Password reset successfully. Please login.' });
      } catch (error: any) {
          get().addToast({ type: 'error', message: error.message });
          throw error;
      }
  },

  socialLogin: async (provider: 'google' | 'apple') => {
      return new Promise<void>((resolve, reject) => {
          setTimeout(async () => {
              try {
                  const mockEmail = `user@${provider}.com`;
                  const mockName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
                  
                  const data = await api.post('/auth/register', { email: mockEmail, password: 'social-login-pass', name: mockName });
                  localStorage.setItem('client_token', data.token);
                  
                  set({ 
                    user: data,
                    isLoginOpen: false,
                  });
                  get().addToast({ type: 'success', message: `Welcome ${data.name}` });
                  resolve();
              } catch (e: any) {
                  try {
                      const loginData = await api.post('/auth/login', { email: `user@${provider}.com`, password: 'social-login-pass' });
                      localStorage.setItem('client_token', loginData.token);
                      set({ 
                        user: loginData,
                        isLoginOpen: false,
                      });
                      get().addToast({ type: 'success', message: `Welcome ${loginData.name}` });
                      resolve();
                  } catch(err) { reject(err); }
              }
          }, 1000);
      });
  },

  checkAuth: async () => {
    const isDev = import.meta.env.DEV;
    const port = window.location.port;
    const hostname = window.location.hostname;

    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    const isAdminApp = (isDev && port === '3002') || (!isDev && hostname.includes('admin'));
    const isDriverApp = (isDev && port === '3003') || (!isDev && hostname.includes('driver'));

    if (urlToken) {
        if (isAdminApp) {
            localStorage.setItem('admin_token', urlToken);
        } else if (isDriverApp) {
            localStorage.setItem('driver_token', urlToken);
        } else {
            localStorage.setItem('client_token', urlToken);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (isAdminApp) {
        const adminToken = localStorage.getItem('admin_token');
        if (adminToken) {
            try {
                const adminUser = await api.get('/auth/me', 'admin');
                set({ adminUser });
            } catch {
                localStorage.removeItem('admin_token');
                set({ adminUser: null });
            }
        }
        return; 
    }

    if (isDriverApp) {
        const driverToken = localStorage.getItem('driver_token');
        if (driverToken) {
            try {
                const driverUser = await api.get('/auth/me', 'driver');
                set({ driverUser });
            } catch {
                localStorage.removeItem('driver_token');
                set({ driverUser: null });
            }
        }
        return;
    }

    const clientToken = localStorage.getItem('client_token');
    if (clientToken) {
        try {
            const user = await api.get('/auth/me', 'client');
            set({ user });
        } catch { 
            localStorage.removeItem('client_token'); 
            set({ user: null }); 
        }
    }
  },

  updateUserProfile: async (data) => {
    try {
      const updatedUser = await api.put('/auth/profile', data, 'client');
      // Ensure we don't accidentally switch roles on the frontend
      set(state => ({ 
          user: { 
              ...state.user, 
              ...updatedUser,
              // Keep original role if not explicitly changed
              role: state.user?.role || updatedUser.role 
          } 
      }));
      get().addToast({ type: 'success', message: 'Profile updated' });
    } catch (error: any) {
      console.error(error);
      get().addToast({ type: 'error', message: error.message || 'Update failed' });
      throw error;
    }
  },

  logout: (role = 'USER') => {
    const storeUrl = getAppUrl('store');

    if (role === 'ADMIN') {
        localStorage.removeItem('admin_token');
        set({ adminUser: null });
        window.location.href = storeUrl;
    } else if (role === 'AGENT') {
        localStorage.removeItem('driver_token');
        set({ driverUser: null });
        window.location.href = storeUrl;
    } else {
        localStorage.removeItem('client_token');
        set({ user: null });
        get().navigateHome();
    }
  },
});
