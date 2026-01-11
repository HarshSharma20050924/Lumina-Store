
import { api } from '../api';
import { AppSlice, AuthSlice } from './types';

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
      // If we are registering (name provided) and generic user
      if (name && role === 'USER') {
        data = await api.post('/auth/register', { email, password, name });
      } else {
        // Driver login or Admin login or User login
        data = await api.post('/auth/login', { email, password });
      }
      
      const userRole = data.role; 
      const hostname = window.location.hostname;
      const port = window.location.port;

      if (userRole === 'ADMIN') {
          // Redirect to Admin App
          if (port !== '3002') {
              window.location.href = `http://127.0.0.1:3002/admin.html?token=${data.token}`;
              return;
          }
          localStorage.setItem('admin_token', data.token);
          set({ adminUser: data });
          get().addToast({ type: 'success', message: 'Admin Dashboard Accessed' });

      } else if (userRole === 'AGENT') {
          // Redirect to Driver App
          if (port !== '3003') {
              window.location.href = `http://127.0.0.1:3003/driver.html?token=${data.token}`;
              return;
          }
          localStorage.setItem('driver_token', data.token);
          set({ driverUser: data });
          get().addToast({ type: 'success', message: 'Driver Interface Loaded' });

      } else {
          // Default Client User
          if (port === '3002' || port === '3003') {
               window.location.href = `http://127.0.0.1:3001/?token=${data.token}`;
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
          
          if (window.location.port !== '3003') {
              window.location.href = `http://127.0.0.1:3003/driver.html?token=${res.token}`;
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

    // --- TOKEN HANDOVER LOGIC (from redirects) ---
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
        if (port === '3002') {
            localStorage.setItem('admin_token', urlToken);
        } else if (port === '3003') {
            localStorage.setItem('driver_token', urlToken);
        } else {
            localStorage.setItem('client_token', urlToken);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    // ----------------------------

    // ADMIN APP
    if (port === '3002') {
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
    if (port === '3003') {
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
    if (role === 'ADMIN') {
        localStorage.removeItem('admin_token');
        set({ adminUser: null });
        window.location.href = 'http://127.0.0.1:3001/';
    } else if (role === 'AGENT') {
        localStorage.removeItem('driver_token');
        set({ driverUser: null });
        window.location.href = 'http://127.0.0.1:3001/';
    } else {
        localStorage.removeItem('client_token');
        set({ user: null });
        get().navigateHome();
    }
  },
});
