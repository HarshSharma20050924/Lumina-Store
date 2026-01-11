import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export const RatingStars = ({ 
  rating, 
  maxStars = 5, 
  size = 'sm', 
  interactive = false,
  onChange,
  className 
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = (hoverRating !== null ? hoverRating : rating) >= starValue;
        
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={cn(
              "transition-transform",
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            )}
          >
            <Star 
              className={cn(
                sizes[size],
                isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                "transition-colors"
              )} 
            />
          </button>
        );
      })}
    </div>
  );
};