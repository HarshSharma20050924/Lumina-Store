import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { WishlistButton } from './ui/WishlistButton';
import { RatingStars } from './ui/RatingStars';
import { cn, formatPrice } from '../utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { navigateToProduct, addToCart } = useStore();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.colors[0], product.sizes[0]);
  };

  return (
    <motion.div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigateToProduct(product)}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-white/90 backdrop-blur-sm text-gray-900 rounded-sm shadow-sm">
              New
            </span>
          )}
          {product.isSale && (
            <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-red-500/90 backdrop-blur-sm text-white rounded-sm shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={product.id} />
        </div>

        {/* Images */}
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out",
            isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
          )}
        />
        <img
          src={product.hoverImage}
          alt={product.name}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out",
            isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
          )}
        />

        {/* Quick Add Overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <Button 
            variant="glass" 
            className="w-full shadow-lg border-white/40" 
            onClick={handleQuickAdd}
          >
            <Plus className="w-4 h-4 mr-2" /> Quick Add
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex flex-col items-end flex-shrink-0 ml-2">
             {product.discountPrice ? (
               <>
                 <span className="text-sm font-semibold text-red-600">{formatPrice(product.discountPrice)}</span>
                 <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
               </>
             ) : (
               <span className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</span>
             )}
          </div>
        </div>
        
        <p className="text-sm text-gray-500">{product.category}</p>
        
        <div className="flex items-center gap-1 pt-1">
          <RatingStars rating={product.rating} />
          <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
        </div>
      </div>
    </motion.div>
  );
};