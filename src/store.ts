import { create } from 'zustand';
import { AppState } from './stores/types';
import { createProductSlice } from './stores/productSlice';
import { createCartSlice } from './stores/cartSlice';
import { createAuthSlice } from './stores/authSlice';
import { createOrderSlice } from './stores/orderSlice';
import { createCMSSlice } from './stores/cmsSlice';
import { createDeliverySlice } from './stores/deliverySlice';
import { createUISlice } from './stores/uiSlice';

export const useStore = create<AppState>()((...a) => ({
  ...createProductSlice(...a),
  ...createCartSlice(...a),
  ...createAuthSlice(...a),
  ...createOrderSlice(...a),
  ...createCMSSlice(...a),
  ...createDeliverySlice(...a),
  ...createUISlice(...a),
}));