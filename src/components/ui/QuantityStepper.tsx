import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export const QuantityStepper = ({ 
  value, 
  min = 1, 
  max = 99, 
  onChange, 
  className 
}: QuantityStepperProps) => {
  return (
    <div className={cn("flex items-center border border-gray-200 rounded-lg bg-white", className)}>
      <button 
        className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg disabled:opacity-50 transition-colors"
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-12 text-center font-medium text-gray-900">{value}</span>
      <button 
        className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-r-lg disabled:opacity-50 transition-colors"
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};