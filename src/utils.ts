
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

/**
 * Sends a notification using Service Worker if available (for Mobile/Android support),
 * falling back to standard Notification API.
 * Includes a timeout to prevent hanging if SW is unresponsive.
 */
export const sendNotification = async (title: string, body: string) => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission !== "granted") return;

  const options = {
    body,
    icon: '/logo.svg',
    badge: '/logo.svg',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    tag: 'lumina-notification'
  };

  // Try Service Worker first (Required for Android Chrome)
  if ('serviceWorker' in navigator) {
    try {
      // Race condition: If SW isn't ready in 500ms, fall back to standard notification
      // This prevents the "loading forever" issue during auth
      const swRegistration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(() => reject('SW_TIMEOUT'), 500))
      ]) as ServiceWorkerRegistration;

      if (swRegistration && typeof swRegistration === 'object' && 'showNotification' in swRegistration) {
        // @ts-ignore
        await swRegistration.showNotification(title, options);
        return;
      }
    } catch (e) {
      // Fallback silently if SW isn't ready or times out
      // console.warn("SW Notification failed or timed out, using fallback", e);
    }
  }

  // Desktop/Fallback
  try {
    new Notification(title, options);
  } catch (e) {
    console.error("Notification API failed", e);
  }
};
