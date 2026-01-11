
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { ProductCard } from './ProductCard';
import { Button } from './ui/Button';

export const NewArrivals = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products, setFilter, navigateHome } = useStore();
  
  const newItems = products.filter(p => p.isNew);

  const handleViewAll = () => {
      setFilter('isNew', true);
      navigateHome();
      setTimeout(() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  if (newItems.length === 0) return null;

  return (
    <section className="py-20 overflow-hidden bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4 lg:px-8 mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Just Dropped</h2>
          <p className="text-gray-500 mt-2">Be the first to wear our latest designs.</p>
        </div>
        <Button variant="ghost" className="hidden sm:flex" onClick={handleViewAll}>
          Shop All New <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <div 
        className="flex overflow-x-auto gap-6 px-4 lg:px-8 pb-8 scrollbar-hide snap-x"
        ref={scrollRef}
      >
        {newItems.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[280px] md:min-w-[320px] snap-start"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
        {/* View All Card */}
        <div className="min-w-[200px] flex items-center justify-center snap-start">
           <button onClick={handleViewAll} className="group flex flex-col items-center gap-4 p-8 rounded-full border border-gray-200 hover:border-gray-900 transition-colors bg-white">
             <span className="font-medium text-gray-900">View All</span>
             <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-900 group-hover:text-white flex items-center justify-center transition-all">
               <ArrowRight className="w-4 h-4" />
             </div>
           </button>
        </div>
      </div>
    </section>
  );
};
