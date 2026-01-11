
export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  gender?: 'Men' | 'Women' | 'Kids' | 'Unisex';
  subcategory?: string;
  image: string;
  hoverImage: string;
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  colors: string[];
  sizes: string[];
  description: string;
  stock?: number;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  colors: string[];
  sizes: string[];
  gender?: string | null;
  subcategory?: string | null;
  isNew?: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  isPhoneVerified?: boolean; // Added this field
  address?: string;
  role?: 'USER' | 'ADMIN' | 'AGENT' | 'user' | 'admin' | 'agent';
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  trackingNumber?: string;
  total: number;
  items: CartItem[];
  shippingAddress: string;
  customerName?: string;
  userId?: string;
  paymentMethod?: 'ONLINE' | 'COD';
  isPaid?: boolean;
  deliveryCode?: string; // OTP
}

// --- Delivery Types ---
export interface DeliveryJob extends Order {
    distance?: string; 
    estimatedTime?: string;
    deliveryStatus: 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'ATTEMPTED';
    codAmount: number;
    customerPhone?: string; 
}

// --- CMS Types ---

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  align: 'left' | 'center' | 'right';
  order: number;
}

export interface SiteSection {
  id: string;
  identifier: string; // 'men', 'women', 'kids'
  title: string;
  description: string;
  image: string;
  link?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedAt?: string;
}
