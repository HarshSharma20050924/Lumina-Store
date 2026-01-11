import { useState } from "react";
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { RatingStars } from './ui/RatingStars';
import { useStore } from '../store';
import { Product } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: string; name: string; image: string };
}

export const ReviewModal = ({ isOpen, onClose, product }: ReviewModalProps) => {
  const { addReview } = useStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addReview(product.id, rating, comment);
      onClose();
      setComment('');
      setRating(5);
    } catch (e) {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h2>
        <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
           <img src={product.image} className="w-12 h-16 object-cover rounded" alt="" />
           <div>
               <p className="text-sm text-gray-500">Reviewing</p>
               <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex justify-center p-4 border border-gray-200 rounded-lg">
                <RatingStars rating={rating} size="lg" interactive onChange={setRating} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
            <textarea 
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black outline-none h-32"
              placeholder="How was the fit? The quality?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>Submit Review</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};