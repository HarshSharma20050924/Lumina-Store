
// import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { useStore } from '../store';
import { SortDropdown } from './ui/SortDropdown';
import { ShoppingBag } from 'lucide-react';
import { Pagination } from './ui/Pagination';
import { ActiveFilters } from './ActiveFilters';
import { EmptyState } from './ui/EmptyState';
import { LoadingSkeleton } from './ui/LoadingSkeleton';

export const ProductGrid = () => {
  const { 
    products, 
    isLoading, 
    totalProducts, 
    itemsPerPage, 
    currentPage, 
    setPage, 
    sortOption, 
    setSortOption,
    resetFilters
  } = useStore();

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <p className="text-gray-500 text-sm">
          Showing <span className="font-medium text-gray-900">{products.length}</span> results
        </p>
        <SortDropdown value={sortOption} onChange={setSortOption} />
      </div>

      <ActiveFilters />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-12">
           {[...Array(6)].map((_, i) => (
             <LoadingSkeleton key={i} variant="card" />
           ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState 
          icon={ShoppingBag}
          title="No products found"
          description="We couldn't find any products matching your filters. Try adjusting your search criteria."
          actionLabel="Clear all filters"
          onAction={resetFilters}
        />
      ) : (
        <>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};
