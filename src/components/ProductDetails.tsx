
import { useState } from "react";
import { Share2, Ruler, MessageSquare } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { RatingStars } from './ui/RatingStars';
import { SizeSelector } from './ui/SizeSelector';
import { QuantityStepper } from './ui/QuantityStepper';
import { AccordionFAQ } from './ui/AccordionFAQ';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductRecommendations } from './ProductRecommendations';
import { LowStockAlert } from './LowStockAlert';
import { SizeGuideModal } from './SizeGuideModal';
import { cn, formatPrice } from '../utils';

export const ProductDetails = () => {
  const { selectedProduct, navigateHome, addToCart, addToast } = useStore();
  const [selectedSize, setSelectedSize] = useState(selectedProduct?.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  if (!selectedProduct) return null;

  const handleShare = async () => {
      const shareData = {
          title: selectedProduct.name,
          text: selectedProduct.description,
          url: window.location.href
      };

      if (navigator.share) {
          try {
              await navigator.share(shareData);
          } catch (err) {
              console.error(err);
          }
      } else {
          // Fallback to clipboard
          navigator.clipboard.writeText(window.location.href);
          addToast({ type: 'success', message: 'Link copied to clipboard!' });
      }
  };

  // Use gallery images if available, otherwise fallback
  const images = selectedProduct.images && selectedProduct.images.length > 0 
    ? selectedProduct.images 
    : [selectedProduct.image, selectedProduct.hoverImage || selectedProduct.image];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-24 min-h-screen">
      <div className="mb-8">
        <Breadcrumbs items={[
          { label: 'Collection', onClick: navigateHome },
          { label: selectedProduct.category, onClick: () => {} },
          { label: selectedProduct.name, isActive: true }
        ]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <ProductImageGallery 
            images={images} 
            productName={selectedProduct.name}
            productId={selectedProduct.id}
          />
        </div>

        {/* Info */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                {selectedProduct.category}
              </span>
              {selectedProduct.isNew && (
                <span className="text-sm font-medium text-gray-900 border border-gray-200 px-2 py-1 rounded-md">
                  New Season
                </span>
              )}
            </div>
            <a href="#reviews" className="flex items-center gap-1 hover:text-primary-600">
               <RatingStars rating={selectedProduct.rating} size="sm" />
               <span className="text-xs text-gray-500">({selectedProduct.reviews?.length || 0} reviews)</span>
            </a>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            {selectedProduct.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-2xl font-medium">
              {selectedProduct.discountPrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-red-600">{formatPrice(selectedProduct.discountPrice)}</span>
                  <span className="text-gray-400 text-lg line-through">{formatPrice(selectedProduct.price)}</span>
                </div>
              ) : (
                formatPrice(selectedProduct.price)
              )}
            </div>
          </div>

          <LowStockAlert stock={selectedProduct.stock || 0} className="mb-6" />

          <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
            {selectedProduct.description} Designed for those who value understated elegance and superior comfort. 
            Meticulously crafted to ensure durability and style.
          </p>

          <div className="space-y-6 mb-8 border-t border-b border-gray-100 py-8">
            {/* Color Selector */}
            <div>
              <label className="text-sm font-medium text-gray-900 block mb-3">
                Color: <span className="text-gray-500">{selectedColor}</span>
              </label>
              <div className="flex gap-3">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                      selectedColor === color 
                        ? "ring-2 ring-offset-2 ring-gray-900 border-transparent scale-110" 
                        : "border-gray-200 hover:scale-110"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-900">Select Size</label>
                <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-sm text-gray-500 underline flex items-center gap-1 hover:text-gray-900"
                >
                    <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <SizeSelector 
                sizes={selectedProduct.sizes} 
                selectedSize={selectedSize}
                onChange={setSelectedSize}
              />
            </div>

            {/* Quantity */}
             <div>
                <label className="text-sm font-medium text-gray-900 block mb-3">Quantity</label>
                <QuantityStepper value={quantity} onChange={setQuantity} className="w-32" />
             </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button 
              size="lg" 
              className="flex-1 text-base h-14"
              onClick={() => selectedSize && selectedColor && addToCart(selectedProduct, quantity, selectedColor, selectedSize)}
            >
              Add to Cart - {formatPrice((selectedProduct.discountPrice || selectedProduct.price) * quantity)}
            </Button>
            <Button 
                size="lg" 
                variant="ghost" 
                className="h-14 px-6 border border-gray-200 hover:border-gray-900 transition-colors"
                onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Details Accordion */}
          <AccordionFAQ items={[
            {
              title: "Description & Fit",
              content: "Tailored for a regular fit. Fits true to size. Features a structured shoulder and fully lined interior."
            },
            {
              title: "Composition & Care",
              content: "100% Organic Cotton. Machine wash cold with like colors. Do not bleach. Tumble dry low. Cool iron if needed."
            },
            {
              title: "Shipping & Returns",
              content: "Free standard shipping on orders over $200. Returns are accepted within 30 days of purchase."
            }
          ]} />
        </div>
      </div>

      {/* Real Reviews Section */}
      <div id="reviews" className="mt-24 pt-16 border-t border-gray-100">
          <div className="flex items-center justify-between mb-10">
              <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                      <RatingStars rating={selectedProduct.rating} />
                      <span className="text-sm text-gray-600">Based on {selectedProduct.reviews?.length || 0} reviews</span>
                  </div>
              </div>
              <Button variant="outline" className="hidden sm:flex">Write a Review</Button>
          </div>

          {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {selectedProduct.reviews.map((review: any) => (
                      <div key={review.id} className="bg-gray-50 p-6 rounded-2xl">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 font-bold">
                                      {review.user?.avatar ? (
                                          <img src={review.user.avatar} className="w-full h-full object-cover" alt="" />
                                      ) : (
                                          review.user?.name?.charAt(0) || 'A'
                                      )}
                                  </div>
                                  <div>
                                      <p className="font-bold text-sm text-gray-900">{review.user?.name || 'Anonymous'}</p>
                                      <p className="text-xs text-gray-500">Verified Buyer</p>
                                  </div>
                              </div>
                              <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <RatingStars rating={review.rating} size="sm" className="mb-3" />
                          <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                      <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
                  <p className="text-gray-500 mt-1 mb-6">Be the first to share your thoughts on this product.</p>
                  <Button variant="outline">Write a Review</Button>
              </div>
          )}
      </div>

      <ProductRecommendations currentProductId={selectedProduct.id} category={selectedProduct.category} />
      
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
        category={selectedProduct.category} 
      />
    </div>
  );
};
