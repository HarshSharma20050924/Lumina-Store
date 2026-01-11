import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '../../utils';
import { useStore } from '../../store';
import { api } from '../../api';
import { Product } from '../../types';

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { searchQuery, setSearchQuery, navigateToProduct, setFilter } = useStore();
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          // Perform a quick search against the API directly for autocomplete
          // Note: using existing endpoint, might retrieve full grid data but works for demo
          const data = await api.get(`/products?keyword=${searchQuery}&limit=5`);
          setResults(data.products);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleProductClick = (product: Product) => {
    navigateToProduct(product);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        // Update the main store to filter the main grid
        useStore.getState().fetchProducts();
        
        // Scroll to grid
        const grid = document.getElementById('product-grid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        
        setIsOpen(false);
    }
  };

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="relative z-50"
          >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-100 border border-transparent rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent transition-all shadow-sm"
              />
              <div className="absolute right-2 flex items-center gap-1">
                 {isSearching && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
                 <button
                    type="button"
                    onClick={() => {
                        setSearchQuery('');
                        setIsOpen(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
              </div>
            </form>

            {/* Dropdown Results */}
            {searchQuery.length >= 2 && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                >
                    {results.length > 0 ? (
                        <ul>
                            {results.map(product => (
                                <li key={product.id}>
                                    <button 
                                        onClick={() => handleProductClick(product)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.category}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {formatPrice(product.discountPrice || product.price)}
                                        </span>
                                    </button>
                                </li>
                            ))}
                            <li className="p-2 bg-gray-50 text-center">
                                <button type="submit" onClick={handleSearchSubmit} className="text-xs text-primary-600 font-medium hover:underline">
                                    View all results
                                </button>
                            </li>
                        </ul>
                    ) : (
                        !isSearching && (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No products found.
                            </div>
                        )
                    )}
                </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};