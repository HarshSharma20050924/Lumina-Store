
// import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';

export const ShopOverview = () => {
  const { sections, navigateToCollection, setFilter, navigateHome } = useStore();

  const handleSectionClick = (identifier: string, title: string) => {
    const id = identifier.toLowerCase();
    
    // Check if it's a gender category for dedicated page
    if (id.includes('men') && !id.includes('women')) {
        navigateToCollection('Men');
    } else if (id.includes('women')) {
        navigateToCollection('Women');
    } else if (id.includes('kid')) {
        navigateToCollection('Kids');
    } else {
        // Fallback for generic sections (scroll to grid)
        setFilter('categories', [title]);
        navigateHome();
        setTimeout(() => {
            const element = document.getElementById('product-grid');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  };

  const defaultSections = [
    {
      id: 'default-1',
      identifier: 'women',
      title: 'Women',
      image: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?q=80&w=2000&auto=format&fit=crop',
      description: 'Effortless style for the modern woman.'
    },
    {
      id: 'default-2',
      identifier: 'men',
      title: 'Men',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2000&auto=format&fit=crop',
      description: 'Precision tailoring and everyday essentials.'
    },
    {
      id: 'default-3',
      identifier: 'kids',
      title: 'Kids',
      image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2000&auto=format&fit=crop',
      description: 'Comfort and durability for little explorers.'
    }
  ];

  // Merge defaults with DB sections (DB takes precedence if identifier matches)
  const displaySections = defaultSections.map(def => 
    sections.find(s => s.identifier === def.identifier) || def
  );

  return (
    <section className="container mx-auto px-4 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displaySections.map((section, index) => (
          <motion.div
            key={section.identifier}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative h-[600px] overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => handleSectionClick(section.identifier, section.title)}
          >
            <div className="absolute inset-0 bg-gray-200">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
            
            <div className="absolute bottom-0 left-0 p-10 w-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-4xl font-bold mb-3 tracking-tight font-serif">{section.title}</h3>
              <p className="text-gray-200 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-lg max-w-[80%] leading-relaxed">
                {section.description}
              </p>
              
              <div className="flex items-center text-white font-medium tracking-wide uppercase text-sm gap-2 opacity-90 group-hover:opacity-100">
                Explore Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
