
import React, { useEffect } from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { ShopOverview } from '../components/ShopOverview';
import { NewArrivals } from '../components/NewArrivals';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { CategorySidebar } from '../components/CategorySidebar';
import { ProductGrid } from '../components/ProductGrid';
import { Testimonials } from '../components/Testimonials';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { ProductDetails } from '../components/ProductDetails';
import { Checkout } from '../components/Checkout';
import { UserProfile } from '../components/UserProfile';
import { CollectionPage } from '../components/CollectionPage';
import { DynamicPage } from '../components/DynamicPage';
import { LookbookPage } from '../components/LookbookPage';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Layout } from '../components/Layout';
import { ToastNotifications } from '../components/ui/ToastNotifications';
import { useStore } from '../store';

export const StoreApp = () => {
  const { currentView, checkAuth, fetchProducts, fetchSiteContent, fetchNavigation } = useStore();

  useEffect(() => {
    // Safety check: If this app is loaded on port 3002 or 3003, redirect to correct HTML file
    if (window.location.port === '3002' && window.location.pathname === '/') {
        window.location.href = '/admin.html';
        return;
    }
    if (window.location.port === '3003' && window.location.pathname === '/') {
        window.location.href = '/driver.html';
        return;
    }

    checkAuth();
    fetchProducts();
    fetchNavigation();
    fetchSiteContent();
  }, [checkAuth, fetchProducts, fetchNavigation, fetchSiteContent]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  if (currentView === 'lookbook') {
      return (
          <ErrorBoundary>
              <LookbookPage />
              <ToastNotifications />
          </ErrorBoundary>
      );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'checkout':
        return <Checkout />;
      case 'profile':
        return <UserProfile />;
      case 'product-detail':
        return <ProductDetails />;
      case 'page':
        return <DynamicPage />;
      case 'collection':
        return <CollectionPage />;
      case 'home':
      default:
        // Fallback for any 'admin' or 'delivery' state stuck in localStorage
        return (
          <>
            <HeroCarousel />
            <ShopOverview />
            <NewArrivals />
            <FeaturedCategories />
            <section id="product-grid" className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 border-t border-gray-100">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
                  <CategorySidebar />
                </aside>
                <div className="flex-1 w-full">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Shop All</h2>
                    <p className="text-gray-500">Explore our complete collection of premium essentials.</p>
                  </div>
                  <ProductGrid />
                </div>
              </div>
            </section>
            <Testimonials />
            <NewsletterSignup />
          </>
        );
    }
  };

  return (
    <ErrorBoundary>
      <Layout>
        {renderContent()}
      </Layout>
    </ErrorBoundary>
  );
};
