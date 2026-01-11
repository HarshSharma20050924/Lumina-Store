
import { StateCreator } from 'zustand';
import { 
  Product, CartItem, Toast, FilterState, SortOption, User, Order, 
  OrderStatus, HeroSlide, SiteSection, SocialLink, StaticPage, DeliveryJob 
} from '../types';

export interface ProductSlice {
  products: Product[];
  adminProducts: Product[];
  totalProducts: number;
  isLoading: boolean;
  navigation: any[];
  searchQuery: string;
  filters: FilterState;
  sortOption: SortOption;
  fetchProducts: (forAdmin?: boolean) => Promise<void>;
  fetchNavigation: () => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  addReview: (productId: string, rating: number, comment: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilter: (key: keyof FilterState, value: any) => void;
  setSortOption: (option: SortOption) => void;
  resetFilters: () => void;
}

export interface CartSlice {
  cart: CartItem[];
  isCartOpen: boolean;
  wishlist: string[];
  addToCart: (product: Product, quantity: number, color: string, size: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  toggleCart: (isOpen?: boolean) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
}

export interface AuthSlice {
  user: User | null;
  isLoginOpen: boolean;
  toggleLoginModal: (isOpen?: boolean) => void;
  adminUser: User | null;
  driverUser: User | null;
  login: (email: string, password?: string, name?: string, role?: 'USER' | 'ADMIN' | 'AGENT') => Promise<void>;
  registerDriver: (data: { email: string, password: string, name: string }) => Promise<void>;
  logout: (role?: 'USER' | 'ADMIN' | 'AGENT') => void;
  checkAuth: () => Promise<void>;
  checkEmail: (email: string) => Promise<boolean>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string, password?: string, name?: string) => Promise<void>;
  validateOtp: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPass: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<void>;
}

export interface OrderSlice {
  checkoutStep: number;
  orders: Order[];
  setCheckoutStep: (step: number) => void;
  resetCheckout: () => void;
  fetchMyOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  // Updated signature to match usage in Checkout.tsx
  placeOrder: (shippingAddress: string, saveAddress?: boolean, paymentMethod?: 'ONLINE' | 'COD') => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export interface CMSSlice {
  heroSlides: HeroSlide[];
  sections: SiteSection[];
  socialLinks: SocialLink[];
  staticPages: StaticPage[];
  fetchSiteContent: () => Promise<void>;
  updateHeroSlide: (slide: Partial<HeroSlide>) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;
  updateSection: (section: Partial<SiteSection>) => Promise<void>;
  updateSocialLink: (link: Partial<SocialLink>) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;
  updateStaticPage: (page: Partial<StaticPage>) => Promise<void>;
  getStaticPage: (slug: string) => StaticPage | undefined;
}

export interface DeliverySlice {
  agentJobs: DeliveryJob[];
  fetchAgentJobs: (silent?: boolean) => Promise<void>;
  completeDelivery: (jobId: string, otp: string, photo: File | null) => Promise<void>;
  notifyArrival: (jobId: string) => Promise<void>;
}

export interface UISlice {
  // Added 'lookbook' to union type
  currentView: 'home' | 'collection' | 'product-detail' | 'checkout' | 'profile' | 'admin' | 'page' | 'delivery' | 'lookbook';
  currentCollection: string | null;
  currentPageSlug: string | null;
  selectedProduct: Product | null;
  isLookbookOpen: boolean;
  toasts: Toast[];
  navigateToProduct: (product: Product) => void;
  navigateHome: () => void;
  navigateToCollection: (gender: string) => void;
  navigateToCheckout: () => void;
  navigateToProfile: () => void;
  navigateToAdmin: () => void;
  navigateToDelivery: () => void;
  navigateToPage: (slug: string) => void;
  toggleLookbook: (isOpen: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  currentPage: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
}

export type AppState = ProductSlice & CartSlice & AuthSlice & OrderSlice & CMSSlice & DeliverySlice & UISlice;

export type AppSlice<T> = StateCreator<AppState, [], [], T>;
