import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { formatPrice } from '../utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
    >
      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 relative group">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 pr-4">{item.name}</h3>
            <p className="text-sm font-medium text-gray-900">
              {formatPrice((item.discountPrice || item.price) * item.quantity)}
            </p>
          </div>
          <p className="mt-1 text-xs text-gray-500">{item.category}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              Size: {item.selectedSize}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Color:</span>
              <div 
                className="w-3 h-3 rounded-full border border-gray-200" 
                style={{ backgroundColor: item.selectedColor }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg h-8">
            <button 
              className="px-2 h-full hover:bg-gray-50 rounded-l-lg text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors"
              onClick={() => onUpdateQuantity(item.cartId, -1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-medium tabular-nums">{item.quantity}</span>
            <button 
              className="px-2 h-full hover:bg-gray-50 rounded-r-lg text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => onUpdateQuantity(item.cartId, 1)}
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.cartId)}
            className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
};