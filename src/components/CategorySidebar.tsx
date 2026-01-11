import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, X } from 'lucide-react';
import { useStore } from '../store';
import { cn } from '../utils';
import { PriceSlider } from './ui/PriceSlider';

const CATEGORIES = ['Outerwear', 'Essentials', 'Tailoring', 'Accessories', 'Activewear'];
const COLORS = ['#000000', '#FFFFFF', '#1F2937', '#565E63', '#9CA3AF', '#D1D5DB'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const CategorySidebar = () => {
  const { filters, setFilter, resetFilters } = useStore();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    category: true,
    color: true,
    size: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilterArray = (key: 'categories' | 'colors' | 'sizes', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    setFilter(key, updated);
  };

  const activeFilterCount = filters.categories.length + filters.colors.length + filters.sizes.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </h3>
        {activeFilterCount > 0 && (
          <button 
            onClick={resetFilters}
            className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100 pb-6">
        <button 
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-4"
        >
          Price Range
          <ChevronDown className={cn("w-4 h-4 transition-transform", openSections.price ? "rotate-180" : "")} />
        </button>
        <AnimatePresence>
          {openSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-2">
                <PriceSlider 
                  min={0} 
                  max={1000} 
                  value={filters.priceRange} 
                  onChange={(val) => setFilter('priceRange', val)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories */}
      <div className="border-b border-gray-100 pb-6">
        <button 
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-4"
        >
          Category
          <ChevronDown className={cn("w-4 h-4 transition-transform", openSections.category ? "rotate-180" : "")} />
        </button>
        <AnimatePresence>
          {openSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-3"
            >
              {CATEGORIES.map(category => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleFilterArray('categories', category)}
                      className="peer h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Colors */}
      <div className="border-b border-gray-100 pb-6">
        <button 
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-4"
        >
          Color
          <ChevronDown className={cn("w-4 h-4 transition-transform", openSections.color ? "rotate-180" : "")} />
        </button>
        <AnimatePresence>
          {openSections.color && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => toggleFilterArray('colors', color)}
                    className={cn(
                      "w-8 h-8 rounded-full border transition-all flex items-center justify-center",
                      filters.colors.includes(color)
                        ? "ring-2 ring-offset-2 ring-gray-900 border-transparent" 
                        : "border-gray-200 hover:scale-110"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {filters.colors.includes(color) && (
                      <X className={cn("w-3 h-3", color === '#FFFFFF' ? "text-black" : "text-white")} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sizes */}
      <div className="pb-6">
        <button 
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-4"
        >
          Size
          <ChevronDown className={cn("w-4 h-4 transition-transform", openSections.size ? "rotate-180" : "")} />
        </button>
        <AnimatePresence>
          {openSections.size && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleFilterArray('sizes', size)}
                    className={cn(
                      "h-8 rounded text-xs font-medium border transition-colors",
                      filters.sizes.includes(size)
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-900"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};