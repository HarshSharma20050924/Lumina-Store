import React from 'react';
import { cn } from '../../utils';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize?: string;
  onChange: (size: string) => void;
  className?: string;
}

export const SizeSelector = ({ sizes, selectedSize, onChange, className }: SizeSelectorProps) => {
  return (
    <div className={cn("grid grid-cols-4 sm:grid-cols-5 gap-2", className)}>
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onChange(size)}
          className={cn(
            "h-10 rounded-md border text-sm font-medium transition-all flex items-center justify-center",
            selectedSize === size 
              ? "bg-gray-900 text-white border-gray-900 shadow-sm" 
              : "bg-white text-gray-900 border-gray-200 hover:border-gray-900 hover:bg-gray-50"
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
};