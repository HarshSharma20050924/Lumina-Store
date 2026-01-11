import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export const ActiveFilters = () => {
  const { filters, setFilter, resetFilters } = useStore();

  const removeFilter = (key: 'categories' | 'colors' | 'sizes', value: string) => {
    const current = filters[key];
    setFilter(key, current.filter(item => item !== value));
  };

  const hasFilters = filters.categories.length > 0 || filters.colors.length > 0 || filters.sizes.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <AnimatePresence>
        {filters.categories.map(cat => (
          <motion.button
            key={`cat-${cat}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => removeFilter('categories', cat)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
          >
            {cat} <X className="w-3 h-3" />
          </motion.button>
        ))}
        {filters.sizes.map(size => (
          <motion.button
            key={`size-${size}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => removeFilter('sizes', size)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-900 text-xs font-medium hover:bg-gray-200 transition-colors border border-gray-200"
          >
            Size: {size} <X className="w-3 h-3" />
          </motion.button>
        ))}
        {filters.colors.map(color => (
          <motion.button
            key={`color-${color}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => removeFilter('colors', color)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-900 text-xs font-medium hover:bg-gray-200 transition-colors border border-gray-200"
          >
            <div className="w-2 h-2 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
            Color <X className="w-3 h-3" />
          </motion.button>
        ))}
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={resetFilters}
          className="text-xs text-red-600 hover:text-red-700 font-medium underline px-2"
        >
          Clear All
        </motion.button>
      </AnimatePresence>
    </div>
  );
};