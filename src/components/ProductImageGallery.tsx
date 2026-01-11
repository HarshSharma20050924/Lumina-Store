import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { ImageZoom } from './ui/ImageZoom';
import { WishlistButton } from './ui/WishlistButton';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  productId: string;
}

export const ProductImageGallery = ({ images, productName, productId }: ProductImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4 sticky top-24">
      <motion.div 
        layoutId={`product-image-${productId}`}
        className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 w-full relative group border border-gray-100 shadow-sm"
      >
        <ImageZoom 
          src={activeImage} 
          alt={productName} 
          className="w-full h-full"
        />
        
        <div className="absolute top-4 right-4 z-10">
          <WishlistButton productId={productId} className="bg-white/80 backdrop-blur-sm" />
        </div>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Hover to zoom
        </div>
      </motion.div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={cn(
              "aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all relative",
              activeImage === img ? "border-gray-900 ring-1 ring-gray-900 opacity-100" : "border-transparent hover:border-gray-200 opacity-70 hover:opacity-100"
            )}
            aria-label={`View image ${idx + 1}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            {activeImage === img && <div className="absolute inset-0 bg-black/5 pointer-events-none" />}
          </button>
        ))}
      </div>
    </div>
  );
};