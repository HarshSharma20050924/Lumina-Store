import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';
import { useStore } from '../../store';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  variant?: 'icon' | 'text';
}

export const WishlistButton = ({ productId, className, variant = 'icon' }: WishlistButtonProps) => {
  const { wishlist, toggleWishlist } = useStore();
  const isActive = wishlist.includes(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(productId);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={cn(
        "group relative transition-all",
        variant === 'icon' && "p-2 rounded-full hover:bg-white hover:shadow-sm",
        className
      )}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          "w-5 h-5 transition-colors duration-300",
          isActive ? "fill-red-500 text-red-500" : "text-gray-900",
          variant === 'icon' && !isActive && "text-gray-900 opacity-0 group-hover:opacity-100"
        )} 
      />
    </motion.button>
  );
};