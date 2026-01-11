
// Determine API URL based on environment
// 1. VITE_API_URL defined in .env (Priority)
// 2. PROD mode -> use relative path '/api' (Expects a proxy or same-domain hosting)
// 3. DEV mode fallback -> localhost:5000
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.PROD) {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getBaseUrl();

// Base URL for static assets (images)
// If API is on a different domain, we need to prefix images with that domain.
const ASSET_URL = API_URL.startsWith('http') 
  ? API_URL.replace('/api', '') 
  : ''; 

const getHeaders = (isMultipart: boolean = false) => {
  const token = localStorage.getItem('token') || 
                localStorage.getItem('admin_token') || 
                localStorage.getItem('client_token') || 
                localStorage.getItem('driver_token');
  
  const headers: any = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const api = {
  get: async (endpoint: string, context?: 'client' | 'admin' | 'driver') => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  post: async (endpoint: string, body: any, context?: 'client' | 'admin' | 'driver') => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  put: async (endpoint: string, body: any, context?: 'client' | 'admin' | 'driver') => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  patch: async (endpoint: string, body: any, context?: 'client' | 'admin' | 'driver') => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  delete: async (endpoint: string, context?: 'client' | 'admin' | 'driver') => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: getHeaders(true), 
      body: formData,
    });
    
    if (!res.ok) throw await res.text();
    const path = await res.text(); // e.g. "/uploads/image.png"
    return `${ASSET_URL}${path}`;
  }
};
