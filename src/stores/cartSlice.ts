import { CartItem } from '../types';
import { AppSlice, CartSlice } from './types';

export const createCartSlice: AppSlice<CartSlice> = (set, get) => ({
  cart: [],
  isCartOpen: false,
  wishlist: [],

  addToCart: (product, quantity, color, size) => {
    set((state) => {
      const existingItem = state.cart.find(
        item => item.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      let newCart;
      if (existingItem) {
        newCart = state.cart.map(item => 
          item.cartId === existingItem.cartId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          ...product,
          cartId: `${product.id}-${Date.now()}`,
          quantity,
          selectedColor: color,
          selectedSize: size,
        };
        newCart = [...state.cart, newItem];
      }

      get().addToast({ type: 'success', message: `Added ${product.name}`, duration: 2000 });
      return { 
        cart: newCart,
        isCartOpen: true
      };
    });
  },

  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter(item => item.cartId !== cartId)
  })),

  updateQuantity: (cartId, delta) => set((state) => ({
    cart: state.cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    })
  })),

  toggleCart: (isOpen) => set((state) => ({
    isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen
  })),

  clearCart: () => set({ cart: [] }),

  toggleWishlist: (productId) => set((state) => {
    const exists = state.wishlist.includes(productId);
    const newWishlist = exists 
      ? state.wishlist.filter(id => id !== productId)
      : [...state.wishlist, productId];
      
    const message = exists ? `Removed from wishlist` : `Added to wishlist`;
    get().addToast({ type: 'info', message, duration: 2000 });
    
    return { wishlist: newWishlist };
  }),
});