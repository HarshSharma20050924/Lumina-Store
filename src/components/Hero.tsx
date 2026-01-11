import { motion } from 'framer-motion';
import { ArrowDown, BookOpen } from 'lucide-react';
import { useStore } from '../store';

export const Hero = () => {
  const { toggleLookbook } = useStore();

  const handleShopNow = (e: React.MouseEvent) => {
    // Prevent any default behavior
    e.preventDefault();
    const element = document.getElementById('product-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn("Element #product-grid not found in DOM");
    }
  };

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-gray-900 flex items-center justify-center">
      {/* Background Image - Reduced z-index to ensure it stays behind */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
          alt="Hero Background"
          className="w-full h-full object-cover object-center opacity-80"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content - Increased z-index to 20 */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mix-blend-overlay">
            LUMINA
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide max-w-lg mx-auto">
            The Summer 2026 Collection. <br/>
            <span className="opacity-70">Minimalism redefined.</span>
          </p>
          
          {/* Buttons - Added explicit relative z-index */}
          <div className="relative z-30 flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button 
                onClick={handleShopNow}
                className="group pointer-events-auto relative px-8 py-4 bg-white text-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
                <span className="relative z-10 flex items-center gap-2 font-medium tracking-wider text-sm uppercase">
                    Shop Collection <ArrowDown className="w-4 h-4" />
                </span>
            </button>

            <button 
                onClick={() => toggleLookbook(true)}
                className="group pointer-events-auto relative px-8 py-4 backdrop-blur-md bg-white/10 border border-white/30 text-white rounded-full overflow-hidden transition-all hover:bg-white/20 active:scale-95"
            >
                <span className="relative z-10 flex items-center gap-2 font-medium tracking-wider text-sm uppercase">
                    <BookOpen className="w-4 h-4" /> Lookbook
                </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent opacity-50" />
      </motion.div>
    </div>
  );
};