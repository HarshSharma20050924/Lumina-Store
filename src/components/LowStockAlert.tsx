import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

interface LowStockAlertProps {
  stock: number;
  threshold?: number;
  className?: string;
}

export const LowStockAlert = ({ stock, threshold = 10, className }: LowStockAlertProps) => {
  if (stock > threshold) return null;

  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-medium animate-pulse", className)}>
      <AlertTriangle className="w-3.5 h-3.5" />
      {stock === 0 ? "Out of Stock" : `Only ${stock} left in stock!`}
    </div>
  );
};