
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const getAppUrl = (app: 'store' | 'admin' | 'driver') => {
  const isDev = import.meta.env.DEV;
  
  if (isDev) {
    const ports = { store: 3001, admin: 3002, driver: 3003 };
    // Use hostname to support local network testing (e.g. 192.168.x.x)
    return `http://${window.location.hostname}:${ports[app]}/${app === 'store' ? '' : app + '.html'}`;
  }

  // Production URLs from Vercel Environment Variables
  switch (app) {
    case 'store':
      return import.meta.env.VITE_STORE_URL || 'https://lumina-store-black.vercel.app';
    case 'admin':
      return import.meta.env.VITE_ADMIN_URL || 'https://lumina-admin-black.vercel.app';
    case 'driver':
      return import.meta.env.VITE_DRIVER_URL || 'https://lumina-driver-black.vercel.app';
  }
};
