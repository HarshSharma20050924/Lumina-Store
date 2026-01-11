
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, User, ShoppingBag, Heart, Download } from 'lucide-react';
import { Button } from './ui/Button';
import { useStore } from '../store';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  installPrompt?: any;
  onInstall?: () => void;
}

export const MobileMenu = ({ isOpen, onClose, installPrompt, onInstall }: MobileMenuProps) => {
  const { user, navigateToProfile, toggleLoginModal } = useStore();
  
  const MENU = [
    { label: 'Men', items: ['New Arrivals', 'Clothing', 'Accessories'] },
    { label: 'Women', items: ['New Arrivals', 'Clothing', 'Accessories'] },
    { label: 'Kids', items: ['Boys', 'Girls', 'Baby'] },
    { label: 'Sale', href: '#sale', highlight: true }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-white flex flex-col"
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
             <span className="font-bold text-xl">Menu</span>
             <Button variant="ghost" size="icon" onClick={onClose}>
               <X className="w-6 h-6" />
             </Button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {MENU.map((item) => (
              <div key={item.label} className="border-b border-gray-50 pb-2">
                <button className="flex items-center justify-between w-full py-3 text-lg font-medium text-gray-900">
                  <span className={item.highlight ? 'text-red-600' : ''}>{item.label}</span>
                  {item.items && <ChevronRight className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-gray-50 space-y-4">
             {installPrompt && (
                <Button 
                  onClick={onInstall} 
                  className="w-full bg-primary-100 text-primary-700 hover:bg-primary-200 border-transparent mb-2"
                >
                  <Download className="w-4 h-4 mr-2" /> Install App
                </Button>
             )}

             {user ? (
               <div className="flex items-center gap-4 mb-4" onClick={() => { onClose(); navigateToProfile(); }}>
                 <img src={user.avatar} className="w-12 h-12 rounded-full" alt="User" />
                 <div>
                   <p className="font-medium">Welcome back,</p>
                   <p className="font-bold text-lg">{user.name}</p>
                 </div>
               </div>
             ) : (
               <Button className="w-full" size="lg" onClick={() => { onClose(); toggleLoginModal(true); }}>
                 Sign In / Register
               </Button>
             )}
             
             <div className="grid grid-cols-2 gap-4">
               <Button variant="outline" className="justify-start">
                 <ShoppingBag className="w-4 h-4 mr-2" /> Orders
               </Button>
               <Button variant="outline" className="justify-start">
                 <Heart className="w-4 h-4 mr-2" /> Wishlist
               </Button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
