
// import React from 'react';
import { useStore } from '../store';
import { ProductGrid } from './ProductGrid';
import { CategorySidebar } from './CategorySidebar';
import { motion } from 'framer-motion';
import { Breadcrumbs } from './ui/Breadcrumbs';

export const CollectionPage = () => {
  const { currentCollection, navigateHome, setFilter, navigation } = useStore();

  const getCollectionConfig = (gender: string | null) => {
      switch(gender) {
          case 'Men': return {
              image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop',
              title: 'The Men\'s Collection',
              subtitle: 'Precision tailoring and everyday essentials.',
          };
          case 'Women': return {
              image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
              title: 'The Women\'s Collection',
              subtitle: 'Effortless style and premium fabrics.',
          };
          case 'Kids': return {
              image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2000&auto=format&fit=crop',
              title: 'Lumina Mini',
              subtitle: 'Durable, comfortable, and stylish.',
          };
          default: return {
              image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
              title: 'Shop All',
              subtitle: 'Explore our entire collection.',
          };
      }
  };

  const config = getCollectionConfig(currentCollection);

  // Extract dynamic subcategories for the current gender/collection
  const currentNavItems = navigation.find(n => n.label === currentCollection);
  const subCategories = currentNavItems 
      ? currentNavItems.columns?.flatMap((col: any) => col.items).map((item: any) => item.label) || []
      : [];

  const handleSubCategory = (sub: string) => {
      setFilter('subcategory', sub);
      const grid = document.getElementById('product-grid');
      if(grid) grid.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
        {/* Collection Hero */}
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
            <div className="absolute inset-0">
                <img 
                    src={config.image} 
                    className="w-full h-full object-cover object-center"
                    alt={config.title}
                />
                <div className="absolute inset-0 bg-black/30" />
                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight font-serif">
                            {config.title}
                        </h1>
                        <p className="text-xl text-gray-200 max-w-xl font-light mb-8">
                            {config.subtitle}
                        </p>
                        
                        {/* Dynamic Sub Categories Quick Links */}
                        {subCategories.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {subCategories.map((sub, idx) => (
                                    <button
                                        key={`${sub}-${idx}`}
                                        onClick={() => handleSubCategory(sub)}
                                        className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white hover:text-gray-900 transition-all text-sm font-medium"
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-12">
            <Breadcrumbs 
                items={[
                    { label: 'Home', onClick: navigateHome },
                    { label: currentCollection || 'Shop', isActive: true }
                ]} 
                className="mb-8"
            />

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
                    <CategorySidebar />
                </aside>
                <div className="flex-1 w-full" id="product-grid">
                    <ProductGrid />
                </div>
            </div>
        </div>
    </div>
  );
};
