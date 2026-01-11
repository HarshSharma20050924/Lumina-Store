
// import React from 'react';
import { ProductCard } from './ProductCard';
import { useStore } from '../store';

interface ProductRecommendationsProps {
  currentProductId: string;
  category: string;
}

export const ProductRecommendations = ({ currentProductId, category }: ProductRecommendationsProps) => {
  const { products } = useStore();

  const recommendations = products
    .filter(p => p.id !== currentProductId && p.category === category)
    .slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <div className="py-16 border-t border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
