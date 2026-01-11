
import { api } from '../api';
import { AppSlice, OrderSlice } from './types';

export const createOrderSlice: AppSlice<OrderSlice> = (set, get) => ({
  checkoutStep: 1,
  orders: [],

  setCheckoutStep: (step) => set({ checkoutStep: step }),
  resetCheckout: () => set({ checkoutStep: 1 }),
  
  fetchMyOrders: async () => {
     try {
       const orders = await api.get('/orders/myorders');
       set({ orders });
     } catch (error) {
       console.error(error);
     }
  },

  fetchAllOrders: async () => {
    try {
      const orders = await api.get('/orders');
      set({ orders });
    } catch (error) {
      console.error("Failed to fetch all orders", error);
      get().addToast({ type: 'error', message: 'Failed to load orders' });
    }
  },

  placeOrder: async (shippingAddress, saveAddress = false, paymentMethod = 'ONLINE') => {
    try {
      const { cart, user, updateUserProfile } = get();
      if (!user) throw new Error("Must be logged in");

      if (saveAddress && user.address !== shippingAddress) {
          await updateUserProfile({ address: shippingAddress });
      }

      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      }));

      const newOrder = await api.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod
      });

      set((state) => ({
        orders: [newOrder, ...state.orders],
        cart: [],
        checkoutStep: 3
      }));
      
      get().addToast({ type: 'success', message: `Receipt sent to ${user.email}`, duration: 5000 });
      
    } catch (error: any) {
      get().addToast({ type: 'error', message: error.message || 'Failed to place order' });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      // Use api.patch for consistent URL handling across environments
      await api.patch(`/orders/${orderId}/status`, { status });

      set((state) => {
          const updatedOrders = state.orders.map(o => o.id === orderId ? { ...o, status } : o);
          if (status === 'shipped') {
              get().addToast({ type: 'success', message: 'Order Shipped - Notification Sent' });
          } else if (status === 'delivered') {
              get().addToast({ type: 'success', message: 'Delivery Confirmed' });
          } else {
              get().addToast({ type: 'info', message: `Order status: ${status}` });
          }
          return { orders: updatedOrders };
      });
    } catch (error) {
      console.error(error);
      get().addToast({ type: 'error', message: 'Failed to update order status' });
    }
  },
});
