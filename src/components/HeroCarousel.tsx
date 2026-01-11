
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, ArrowDown } from 'lucide-react';
import { Button } from './ui/Button';
import { useStore } from '../store';

export const HeroCarousel = () => {
  const { heroSlides, toggleLookbook } = useStore();
  const [current, setCurrent] = useState(0);

  // Fallback slides if DB is empty
  const slides = heroSlides.length > 0 ? heroSlides : [
    {
      id: 'default-1',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
      title: 'Future of Minimalism',
      subtitle: 'Discover the Summer 2026 Collection.',
      align: 'left' as const
    }
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const handleShopNow = () => {
    const element = document.getElementById('product-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSlide = slides[current];

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Image */}
          <div className="absolute inset-0">
             <img
               src={currentSlide.image}
               alt={currentSlide.title}
               className="w-full h-full object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-black/30" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 lg:px-8 h-full flex items-center relative z-10">
            <div className={`w-full max-w-3xl ${
              currentSlide.align === 'center' ? 'mx-auto text-center' : 
              currentSlide.align === 'right' ? 'ml-auto text-right items-end flex flex-col' : ''
            }`}>
               <motion.div
                 initial={{ y: 30, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.3, duration: 0.8 }}
                 className="space-y-6"
               >
                 <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-medium tracking-widest uppercase border border-white/20">
                   New Collection
                 </span>
                 <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                   {currentSlide.title}
                 </h1>
                 <p className="text-xl text-gray-200 font-light max-w-lg">
                   {currentSlide.subtitle}
                 </p>
                 <div className={`flex gap-4 pt-4 ${
                    currentSlide.align === 'center' ? 'justify-center' : 
                    currentSlide.align === 'right' ? 'justify-end' : ''
                 }`}>
                   <button 
                        onClick={handleShopNow}
                        className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden transition-all hover:scale-105"
                    >
                        <span className="relative z-10 flex items-center gap-2 font-medium tracking-wider text-sm uppercase">
                            Shop Now <ArrowDown className="w-4 h-4" />
                        </span>
                    </button>

                    <button 
                        onClick={() => toggleLookbook(true)}
                        className="group relative px-8 py-4 backdrop-blur-md bg-white/10 border border-white/30 text-white rounded-full overflow-hidden transition-all hover:bg-white/20"
                    >
                        <span className="relative z-10 flex items-center gap-2 font-medium tracking-wider text-sm uppercase">
                            <BookOpen className="w-4 h-4" /> Lookbook
                        </span>
                    </button>
                 </div>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 container mx-auto px-4 lg:px-8 flex justify-between items-center">
           <div className="flex gap-2">
             {slides.map((_, idx) => (
               <button
                 key={idx}
                 onClick={() => setCurrent(idx)}
                 className={`h-1 transition-all duration-300 rounded-full ${
                   current === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                 }`}
                 aria-label={`Go to slide ${idx + 1}`}
               />
             ))}
           </div>
           
           <div className="flex gap-2">
             <button onClick={prev} className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button onClick={next} className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
        </div>
      )}
    </div>
  );
};
