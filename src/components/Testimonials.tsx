// import React from 'react';
import { motion } from 'framer-motion';
import { RatingStars } from './ui/RatingStars';
import { Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Verified Buyer',
    rating: 5,
    text: "The quality of the Minimalist Tech Parka is outstanding. I've worn it in heavy rain and stayed completely dry. Definitely worth the investment.",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Architecture Student',
    rating: 5,
    text: "Lumina captures the essence of modern design. The clothes aren't just functional; they're architectural statements. Love the essentials line.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Creative Director',
    rating: 4,
    text: "Finally, a brand that understands subtle luxury. The fabrics feel incredible against the skin. Shipping was faster than expected too.",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">What People Are Saying</h2>
          <p className="text-gray-500">Join thousands of satisfied customers worldwide.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow"
            >
              <Quote className="absolute top-8 right-8 w-8 h-8 text-gray-100 group-hover:text-primary-100 transition-colors" />
              
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-gray-500">{review.role}</p>
                </div>
              </div>

              <RatingStars rating={review.rating} className="mb-4" />
              
              <p className="text-gray-600 leading-relaxed text-sm">
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};