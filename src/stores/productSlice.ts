import { api } from '../api';
import { FilterState } from '../types';
import { AppSlice, ProductSlice } from './types';

const initialFilters: FilterState = {
  priceRange: [0, 1000],
  categories: [],
  colors: [],
  sizes: [],
  gender: null,
  subcategory: null,
  isNew: false
};

export const createProductSlice: AppSlice<ProductSlice> = (set, get) => ({
  products: [],
  adminProducts: [],
  totalProducts: 0,
  isLoading: false,
  navigation: [],
  searchQuery: '',
  filters: initialFilters,
  sortOption: 'newest',

  fetchNavigation: async () => {
    try {
        const navData = await api.get('/products/navigation');
        set({ navigation: navData });
    } catch (e) {
        console.error("Failed to fetch navigation", e);
    }
  },

  fetchProducts: async (forAdmin = false) => {
    set({ isLoading: true });
    try {
      const { filters, sortOption, currentPage, itemsPerPage, searchQuery, currentView, currentCollection } = get();
      
      const params = new URLSearchParams();
      
      if (forAdmin) {
          params.append('all', 'true');
      } else {
          params.append('page', currentPage.toString());
          params.append('limit', itemsPerPage.toString());
          
          if (searchQuery) params.append('keyword', searchQuery);
          
          // Apply dedicated collection filter if on collection page
          if (currentView === 'collection' && currentCollection) {
              params.append('gender', currentCollection);
          } else if (filters.gender) {
              params.append('gender', filters.gender);
          }

          if (filters.categories.length > 0) params.append('category', filters.categories.join(','));
          if (filters.subcategory) params.append('subcategory', filters.subcategory);
          if (filters.isNew) params.append('isNew', 'true');
          
          if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0].toString());
          if (filters.priceRange[1] < 1000) params.append('maxPrice', filters.priceRange[1].toString());
          params.append('sort', sortOption);
      }

      const data = await api.get(`/products?${params.toString()}`);
      
      if (forAdmin) {
          set({ 
            adminProducts: data.products,
            isLoading: false
          });
      } else {
          set({ 
            products: data.products,
            totalProducts: data.total,
            isLoading: false
          });
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      set({ isLoading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      await api.post('/products', productData);
      get().fetchProducts(true);
      get().fetchProducts(false);
      get().fetchNavigation();
      get().addToast({ type: 'success', message: 'Product added successfully' });
    } catch (error: any) {
      get().addToast({ type: 'error', message: error.message || 'Failed to add product' });
    }
  },

  updateProduct: async (updatedProduct) => {
    try {
      await api.put(`/products/${updatedProduct.id}`, updatedProduct);
      get().fetchProducts(true);
      get().fetchProducts(false);
      get().fetchNavigation();
      get().addToast({ type: 'success', message: 'Product updated' });
    } catch (error: any) {
      get().addToast({ type: 'error', message: error.message || 'Update failed' });
    }
  },

  deleteProduct: async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      get().fetchProducts(true);
      get().fetchProducts(false);
      get().fetchNavigation();
      get().addToast({ type: 'info', message: 'Product deleted' });
    } catch (error: any) {
       get().addToast({ type: 'error', message: error.message || 'Delete failed' });
    }
  },

  uploadImage: async (file) => {
    try {
      return await api.upload(file);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  addReview: async (productId, rating, comment) => {
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      const { selectedProduct, navigateToProduct } = get();
      if (selectedProduct && selectedProduct.id === productId) {
          const updated = await api.get(`/products/${productId}`);
          navigateToProduct(updated);
      }
      get().addToast({ type: 'success', message: 'Review submitted!' });
    } catch (error: any) {
      get().addToast({ type: 'error', message: error.message || 'Failed to submit review' });
      throw error;
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      currentPage: 1 
    }));
    get().fetchProducts(false);
  },

  setSortOption: (option) => {
    set({ sortOption: option });
    get().fetchProducts(false);
  },

  resetFilters: () => {
    set({ filters: initialFilters, searchQuery: '', currentPage: 1 });
    get().fetchProducts(false);
  },
});