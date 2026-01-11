Generate the following Next.js 14 components with TypeScript, Tailwind CSS, and shadcn/ui integration. All components must be highly interactive, modern 2026 aesthetic, and production-ready:

### **1. Layout Components**
- `Layout.tsx` - Root layout with header, footer, navigation
- `Header.tsx` - Sticky header with logo, search, cart icon, user menu. **Updated**: Navigation must support top-level categories (Men, Women, Kids) and subcategories (Pants, Jeans, Jackets, Shirts, T-shirts).
- `Navigation.tsx` - Category dropdown navigation (mega menu for desktop, hamburger for mobile)
- `Footer.tsx` - Multi-column footer with links, newsletter signup
- `MobileMenu.tsx` - Full-screen mobile navigation drawer

### **2. Product Display Components**
- `ShopOverview.tsx` - **New**: High-level visual overview of main sections (Men, Women, Kids) for the homepage.
- `ProductCard.tsx` - Card with image hover zoom, quick add to cart, wishlist heart
- `ProductGrid.tsx` - Responsive grid with infinite scroll/pagination
- `ProductImageGallery.tsx` - Interactive gallery with thumbnails, zoom, 360° view placeholder
- `ProductDetails.tsx` - Product page with variant selector, size guide, share buttons
- `ProductRecommendations.tsx` - "You may also like" carousel

### **3. Category & Filtering**
- `CategoryHero.tsx` - Category banner with breadcrumbs
- `CategorySidebar.tsx` - Filter sidebar (price range, size, color) with collapsible sections
- `ActiveFilters.tsx` - Chips for applied filters with remove option
- `SortDropdown.tsx` - Sort by price, popularity, newness

### **4. Cart & Checkout**
- `CartDrawer.tsx` - Slide-out cart with real-time updates
- `CartItem.tsx` - Cart item with quantity stepper, remove, save for later
- `CheckoutStepper.tsx` - Multi-step checkout (4 steps)
- `AddressForm.tsx` - Form with auto-complete, validation
- `PaymentMethods.tsx` - Credit card, UPI, wallet options with animations
- `OrderSummary.tsx` - Order breakdown with collapsible details

### **5. User Authentication**
- `LoginModal.tsx` - Tabbed modal (email/phone/Gmail) with OTP flow
- `UserProfile.tsx` - Dashboard with tabs (orders, addresses, wishlist)
- `OrderHistory.tsx` - Expandable order cards with tracking timeline

### **6. Admin Panel Components**
- `AdminLayout.tsx` - Dashboard layout with sidebar navigation
- `InventoryManager.tsx` - Table with inline editing, bulk actions, CSV import
- `ProductForm.tsx` - Multi-step form with image upload, variant management. **Updated**: Support for Gender (Men/Women/Kids) and granular Subcategories.
- `OrderManager.tsx` - Kanban board view of orders (drag & drop status)
- `DashboardCards.tsx` - Metric cards with sparkline charts
- `LowStockAlert.tsx` - Notification component with action buttons

### **7. Shared UI Components**
- `SearchBar.tsx` - Debounced search with autocomplete suggestions
- `WishlistButton.tsx` - Heart icon with animation on add/remove
- `SizeSelector.tsx` - Interactive size buttons with out-of-stock indication
- `QuantityStepper.tsx` - +/- buttons with min/max validation
- `RatingStars.tsx` - Interactive star rating (display and input)
- `ToastNotifications.tsx` - Stack of toast messages with progress bars
- `LoadingSkeleton.tsx` - Product card, text, and image skeletons
- `EmptyState.tsx` - Illustrations for empty cart, no results, etc.
- `ErrorBoundary.tsx` - Graceful error fallback UI

### **8. Interactive Elements**
- `ImageZoom.tsx` - Product image zoom on hover (lens effect)
- `ColorSwatch.tsx` - Interactive color selector with tooltip
- `PriceSlider.tsx` - Dual-thumb price range slider with visual feedback
- `AccordionFAQ.tsx` - Animated accordion for FAQs, size guides
- `ProgressTracker.tsx` - Order status visualization with animations
- `ConfettiEffect.tsx` - Celebration animation on order completion

### **9. Homepage Components**
- `HeroCarousel.tsx` - Auto-rotating hero banner with call-to-action
- `FeaturedCategories.tsx` - Grid of category cards with hover effects
- `NewArrivals.tsx` - Horizontal scroll section with "tilt on hover"
- `Testimonials.tsx` - Customer review carousel with star ratings
- `NewsletterSignup.tsx` - Email capture with success animation

### **10. Utility Components**
- `BackToTop.tsx` - Animated scroll-to-top button
- `Breadcrumbs.tsx` - Dynamic breadcrumb navigation
- `Tooltip.tsx` - Rich tooltip with images/details
- `Modal.tsx` - Reusable modal with backdrop blur
- `Tabs.tsx` - Animated tab component for product details
- `Pagination.tsx` - Accessible pagination with page jump