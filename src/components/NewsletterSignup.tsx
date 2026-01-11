import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from './ui/Button';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="relative py-24 overflow-hidden">
       {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gray-900" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/20 blur-[120px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen opacity-50" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Join the Inner Circle
          </h2>
          <p className="text-lg text-gray-400 font-light">
            Subscribe to receive early access to new drops, exclusive events, and 10% off your first order.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Subscribed successfully!
              </motion.div>
            ) : (
              <>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all backdrop-blur-sm"
                  disabled={status === 'loading'}
                />
                <Button 
                  type="submit" 
                  className="bg-white text-gray-900 hover:bg-gray-100 h-auto py-4 px-8 rounded-xl font-semibold"
                  isLoading={status === 'loading'}
                >
                  Subscribe
                </Button>
              </>
            )}
          </form>

          <p className="text-xs text-gray-500">
            By subscribing you agree to our Terms & Privacy Policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};