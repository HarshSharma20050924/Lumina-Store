
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen } from 'lucide-react';
import { useStore } from '../store';

export const Navigation = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { setFilter, setSortOption, navigateHome, resetFilters, navigation, fetchNavigation, navigateToCollection, toggleLookbook } = useStore();

  useEffect(() => {
      fetchNavigation();
  }, [fetchNavigation]);

  const handleGenderClick = (e: React.MouseEvent, gender: string) => {
      e.preventDefault();
      resetFilters();
      if (gender === 'Sale') {
          setSortOption('price-low');
          navigateHome();
          setTimeout(() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
          navigateToCollection(gender);
      }
      setActiveMenu(null);
  };

  const handleSubItemClick = (e: React.MouseEvent, parentGender: string, item: any) => {
      e.preventDefault();
      e.stopPropagation();
      resetFilters();
      
      navigateToCollection(parentGender);
      setTimeout(() => {
          if (item.isNew) setFilter('isNew', true);
          if (item.subcategory) setFilter('subcategory', item.subcategory);
      }, 50);
      
      setActiveMenu(null);
  };

  return (
    <nav className="hidden md:flex items-center gap-8 h-full">
      {/* Dynamic Categories */}
      {navigation.map((item) => (
        <div 
          key={item.label} 
          className="relative h-full flex items-center"
          onMouseEnter={() => setActiveMenu(item.label)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <a 
            href={item.href} 
            onClick={(e) => handleGenderClick(e, item.label)}
            className={`text-sm font-medium transition-colors flex items-center gap-1 py-4 ${
              item.isHighlight ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
            {item.columns && item.columns.length > 0 && <ChevronDown className="w-3 h-3 mt-0.5" />}
          </a>

          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {activeMenu === item.label && item.columns && item.columns.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white shadow-xl border border-gray-100 rounded-xl p-8 z-50 mt-1"
              >
                <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
                
                <div className="grid grid-cols-3 gap-8">
                  {item.columns.map((col: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                      <h4 className="font-bold text-gray-900 text-sm">{col.title}</h4>
                      <ul className="space-y-2">
                        {col.items.map((subItem: any) => (
                          <li key={subItem.label}>
                            <button 
                                onClick={(e) => handleSubItemClick(e, item.label, subItem)}
                                className="text-sm text-gray-500 hover:text-primary-600 transition-colors block text-left w-full"
                            >
                              {subItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="col-span-1 rounded-lg bg-gray-100 p-4 flex flex-col justify-end min-h-[150px] relative overflow-hidden group cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                      alt="Collection"
                    />
                    <div className="relative z-10">
                       <span className="text-xs font-bold text-gray-900 uppercase">New Collection</span>
                       <p className="text-sm font-medium text-gray-900">Summer 2026</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Lookbook Tab */}
      <button 
        onClick={() => toggleLookbook(true)}
        className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1"
      >
        <BookOpen className="w-4 h-4" /> Lookbook
      </button>
    </nav>
  );
};
