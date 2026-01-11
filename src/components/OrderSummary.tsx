import React from 'react';
import { useStore } from '../store';
import { formatPrice } from '../utils';

export const OrderSummary = () => {
  const { cart } = useStore();

  const subtotal = cart.reduce((acc, item) => {
    const price = item.discountPrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 rounded-xl p-6 lg:p-8 sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
        {cart.map((item) => (
          <div key={item.cartId} className="flex gap-4">
            <div className="w-16 h-20 rounded-md overflow-hidden bg-white border border-gray-200 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {item.selectedColor} / {item.selectedSize}
              </p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice((item.discountPrice || item.price) * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4">
        <div className="flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};