
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store';

export const ShopOverview = () => {
  const { sections, navigateToCollection, setFilter, navigateHome } = useStore();

  const handleSectionClick = (identifier: string, title: string) => {
    const id = identifier.toLowerCase();
    if (id.includes('men') && !id.includes('women')) {
        navigateToCollection('Men');
    } else if (id.includes('women')) {
        navigateToCollection('Women');
    } else if (id.includes('kid')) {
        navigateToCollection('Kids');
    } else {
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

  const displaySections = defaultSections.map(def => 
    sections.find(s => s.identifier === def.identifier) || def
  );

  return (
    <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {displaySections.map((section, index) => (
          <motion.div
            key={section.identifier}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative h-[350px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => handleSectionClick(section.identifier, section.title)}
          >
            <div className="absolute inset-0 bg-gray-200">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
            
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-3xl md:text-4xl font-bold mb-2 md:mb-3 tracking-tight font-serif">{section.title}</h3>
              <p className="text-gray-200 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm md:text-lg max-w-[90%] leading-relaxed hidden md:block">
                {section.description}
              </p>
              
              <div className="flex items-center text-white font-medium tracking-wide uppercase text-xs md:text-sm gap-2 opacity-90 group-hover:opacity-100">
                Explore Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
