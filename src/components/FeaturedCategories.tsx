import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';

const CATEGORIES = [
  {
    id: 'outerwear',
    name: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1974&auto=format&fit=crop',
    description: 'Protect yourself from the elements in style.'
  },
  {
    id: 'essentials',
    name: 'Essentials',
    image: 'https://images.unsplash.com/photo-1503341338985-c0477be52513?q=80&w=2070&auto=format&fit=crop',
    description: 'Timeless pieces for your everyday rotation.'
  },
  {
    id: 'tailoring',
    name: 'Tailoring',
    image: 'https://images.unsplash.com/photo-1594938328870-9623159c8c99?q=80&w=1974&auto=format&fit=crop',
    description: 'Sharp silhouettes for the modern professional.'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1589363360147-4f2d51541551?q=80&w=1974&auto=format&fit=crop',
    description: 'The finishing touches that define your look.'
  }
];

export const FeaturedCategories = () => {
  const { setFilter } = useStore();

  const handleCategoryClick = (category: string) => {
    // In a real app, this would also navigate to the grid or filter section
    setFilter('categories', [category]);
    const element = document.getElementById('product-grid');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16">
      <div className="flex justify-between items-end mb-8 px-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Collections</h2>
          <p className="text-gray-500 mt-2">Curated for the modern aesthetic.</p>
        </div>
        <Button variant="ghost" className="hidden sm:flex">
          View All <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative h-[400px] overflow-hidden rounded-2xl cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="absolute inset-0 bg-gray-200">
               <img 
                 src={category.image} 
                 alt={category.name}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-80" />
            
            <div className="absolute bottom-0 left-0 p-6 w-full text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                {category.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};