
import { api } from '../api';
import { AppSlice, AuthSlice } from './types';

// Helper to determine redirect URL based on environment
const getRedirectUrl = (app: 'admin' | 'driver' | 'store', token?: string) => {
    const isDev = import.meta.env.DEV;
    const search = token ? `?token=${token}` : '';
    
    if (isDev) {
        // Multi-port setup in local development
        const ports = { admin: 3002, driver: 3003, store: 3001 };
        const file = app === 'store' ? '' : `${app}.html`;
        // Use window.location.hostname to support local IP access (e.g. 192.168.x.x)
        return `http://${window.location.hostname}:${ports[app]}/${file}${search}`;
    } else {
        // Single-domain setup in production (Vercel)
        const file = app === 'store' ? '/' : `/${app}.html`;
        return `${file}${search}`;
    }
};

// Helper for Browser Notifications
const sendBrowserNotification = (title: string, body: string) => {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        new Notification(title, { body, icon: 'https://ui-avatars.com/api/?name=L+S&background=000&color=fff' });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body, icon: 'https://ui-avatars.com/api/?name=L+S&background=000&color=fff' });
            }
        });
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
      const currentPort = window.location.port;
      const isDev = import.meta.env.DEV;

      if (userRole === 'ADMIN') {
          // Redirect to Admin App
          if (isDev && currentPort !== '3002') {
              window.location.href = getRedirectUrl('admin', data.token);
              return;
          } else if (!isDev && !window.location.pathname.includes('admin.html')) {
              window.location.href = getRedirectUrl('admin', data.token);
              return;
          }
          
          localStorage.setItem('admin_token', data.token);
          set({ adminUser: data });
          get().addToast({ type: 'success', message: 'Admin Dashboard Accessed' });

      } else if (userRole === 'AGENT') {
          // Redirect to Driver App
          if (isDev && currentPort !== '3003') {
              window.location.href = getRedirectUrl('driver', data.token);
              return;
          } else if (!isDev && !window.location.pathname.includes('driver.html')) {
              window.location.href = getRedirectUrl('driver', data.token);
              return;
          }

          localStorage.setItem('driver_token', data.token);
          set({ driverUser: data });
          get().addToast({ type: 'success', message: 'Driver Interface Loaded' });

      } else {
          // Default Client User
          // Check if we are on the wrong app (admin or driver)
          const isWrongApp = 
            (isDev && (currentPort === '3002' || currentPort === '3003')) ||
            (!isDev && (window.location.pathname.includes('admin.html') || window.location.pathname.includes('driver.html')));

          if (isWrongApp) {
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

          if ((isDev && currentPort !== '3003') || (!isDev && !window.location.pathname.includes('driver.html'))) {
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
          if("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
              await Notification.requestPermission();
          }

          const response = await api.post('/auth/send-otp', { email });
          
          if (response.otp) {
              sendBrowserNotification("Lumina Security Code", `Your verification code is: ${response.otp}`);
          }

          get().addToast({ type: 'info', message: `Verification code sent` });
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
          await api.post('/auth/reset-password', { email, otp, newPassword: newPass });
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
    const port = window.location.port;
    const path = window.location.pathname;
    const isDev = import.meta.env.DEV;

    // --- TOKEN HANDOVER LOGIC (from redirects) ---
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    const isAdminApp = (isDev && port === '3002') || (!isDev && path.includes('admin.html'));
    const isDriverApp = (isDev && port === '3003') || (!isDev && path.includes('driver.html'));

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
    // ----------------------------

    // ADMIN APP
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

    // DRIVER APP
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

    // STORE APP
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
      set({ user: updatedUser });
      get().addToast({ type: 'success', message: 'Profile updated' });
    } catch (error: any) {
      console.error(error);
      get().addToast({ type: 'error', message: error.message || 'Update failed' });
      throw error;
    }
  },

  logout: (role = 'USER') => {
    const isDev = import.meta.env.DEV;
    const storeUrl = isDev ? `http://${window.location.hostname}:3001/` : '/';

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
