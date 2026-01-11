
import { DeliveryJob, Order } from '../types';
import { AppSlice, DeliverySlice } from './types';
import { api } from '../api';

export const createDeliverySlice: AppSlice<DeliverySlice> = (set, get) => ({
  agentJobs: [],
  
  fetchAgentJobs: async (silent = false) => {
      try {
          // Explicitly use 'driver' context to get driver_token
          const allOrders = await api.get('/orders', 'driver');
          
          // Filter for orders visible to agent (Shipped/Processing/Delivered)
          const jobs: DeliveryJob[] = allOrders
            .filter((o: Order) => o.status === 'shipped' || o.status === 'processing' || o.status === 'delivered') 
            .map((o: any) => ({
              ...o,
              // Map DB status to Agent View status
              deliveryStatus: o.status === 'delivered' ? 'COMPLETED' : (o.status === 'shipped' ? 'OUT_FOR_DELIVERY' : 'ASSIGNED'),
              // Mock location data
              distance: (Math.random() * 5 + 0.5).toFixed(1) + ' km',
              estimatedTime: Math.ceil(Math.random() * 25 + 5) + ' mins',
              codAmount: o.paymentMethod === 'COD' ? o.total : 0,
              customerPhone: o.user?.phone || null,
            }));

          // Check for NEW jobs if silent update (compare lengths or IDs)
          const currentCount = get().agentJobs.length;
          if (silent && jobs.length > currentCount) {
              const newJobs = jobs.length - currentCount;
              get().addToast({ type: 'info', message: `${newJobs} new delivery assignment(s)!`, duration: 5000 });
              if ("Notification" in window && Notification.permission === "granted") {
                  new Notification("New Delivery Assignment", { body: "New orders are ready for pickup." });
              }
          }

          set({ agentJobs: jobs });
      } catch (e) {
          if(!silent) {
              console.error("Failed to fetch agent jobs", e);
              get().addToast({ type: 'error', message: 'Sync failed: Check network or login' });
          }
      }
  },

  notifyArrival: async (jobId) => {
      try {
          await api.post(`/orders/${jobId}/arrival`, {}, 'driver');
          get().addToast({ type: 'success', message: 'Arrival Confirmed. OTP Sent to Customer.' });
      } catch (e: any) {
          get().addToast({ type: 'error', message: 'Failed to notify arrival' });
          throw e;
      }
  },

  completeDelivery: async (jobId, otp, photo) => {
      try {
          // Use 'driver' context to authorize this patch request and send OTP for verification
          await api.patch(`/orders/${jobId}/status`, { status: 'delivered', otp }, 'driver');

          // Update local state to move job to history (completed)
          set((state) => ({
              agentJobs: state.agentJobs.map(j => j.id === jobId ? { ...j, deliveryStatus: 'COMPLETED' } : j)
          }));
          
          get().addToast({ type: 'success', message: 'Delivery Verified & Completed' });
      } catch (e: any) {
          get().addToast({ type: 'error', message: e.message || 'Verification Failed' });
          throw e;
      }
  }
});
