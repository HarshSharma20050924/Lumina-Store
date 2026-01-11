
import { AppSlice, UISlice } from './types';
import { api } from '../api';

// Helper to get initial view for Store App
const getInitialView = (): any => {
  const path = window.location.pathname;
  
  if (path.startsWith('/lookbook')) return 'lookbook';
  
  try {
    const saved = localStorage.getItem('currentView');
    // Prevent StoreApp from initializing with Admin or Delivery views from shared localStorage
    if (saved === 'admin' || saved === 'delivery') return 'home';
    return saved || 'home';
  } catch {
    return 'home';
  }
};

const getAppUrl = (app: 'admin' | 'driver') => {
    const isDev = import.meta.env.DEV;
    if (isDev) {
        const port = app === 'admin' ? 3002 : 3003;
        return `http://${window.location.hostname}:${port}/${app}.html`;
    }
    // Production (Same Origin)
    return `/${app}.html`;
};

export const createUISlice: AppSlice<UISlice> = (set, get) => ({
  currentView: getInitialView(),
  currentCollection: null,
  currentPageSlug: null,
  selectedProduct: null,
  isLookbookOpen: false,
  toasts: [],
  
  // Pagination State
  currentPage: 1,
  itemsPerPage: 8,
  setPage: (page: number) => {
    set({ currentPage: page }); // @ts-ignore
    get().fetchProducts();
  },

  navigateToProduct: async (product) => {
      try {
          const freshData = await api.get(`/products/${product.id}`);
          set({ currentView: 'product-detail', selectedProduct: freshData, currentPageSlug: null });
          window.history.pushState({}, '', `/product/${product.id}`);
      } catch(e) {
          set({ currentView: 'product-detail', selectedProduct: product, currentPageSlug: null });
      }
      window.scrollTo(0, 0);
  },
  
  navigateHome: () => {
      set({ currentView: 'home', selectedProduct: null, currentPageSlug: null, currentCollection: null });
      window.history.pushState({}, '', '/');
      window.scrollTo(0, 0);
  },
  
  navigateToCollection: (gender) => {
      set({ currentView: 'collection', currentCollection: gender, currentPageSlug: null, selectedProduct: null });
      window.history.pushState({}, '', `/collection/${gender.toLowerCase()}`);
      get().resetFilters();
      window.scrollTo(0, 0);
  },
  
  navigateToCheckout: () => {
      set({ currentView: 'checkout', isCartOpen: false, currentPageSlug: null });
      window.history.pushState({}, '', '/checkout');
  },
  
  navigateToProfile: () => {
    set({ currentView: 'profile', isCartOpen: false, currentPageSlug: null });
    window.history.pushState({}, '', '/profile');
    get().fetchMyOrders();
  },
  
  navigateToAdmin: () => {
    window.location.href = getAppUrl('admin');
  },
  
  navigateToDelivery: () => {
    window.location.href = getAppUrl('driver');
  },
  
  navigateToPage: (slug) => {
    set({ currentView: 'page', currentPageSlug: slug, isCartOpen: false });
    window.history.pushState({}, '', `/page/${slug}`);
    window.scrollTo(0, 0);
  },

  toggleLookbook: (isOpen) => {
      if (isOpen) {
          set({ currentView: 'lookbook', isCartOpen: false });
          window.history.pushState({}, '', '/lookbook');
          window.scrollTo(0, 0);
      } else {
          get().navigateHome();
      }
  },

  addToast: (toast) => set((state) => {
    const id = Math.random().toString(36).substring(7);
    return { toasts: [...state.toasts, { ...toast, id, duration: toast.duration || 3000 }] };
  }),
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),
});
