
// In production, we use the relative path /api which Vercel rewrites to the backend.
// In development, we connect directly to localhost:5000 to avoid proxy complexities.
const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://127.0.0.1:5000/api';

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
    const path = await res.text();
    // Use the same base URL logic for images
    const baseUrl = import.meta.env.PROD ? '' : 'http://127.0.0.1:5000';
    return `${baseUrl}${path}`;
  }
};
