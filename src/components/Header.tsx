
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, User, Settings, LayoutDashboard, LogOut, Download } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { SearchBar } from './ui/SearchBar';
import { LoginModal } from './LoginModal';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { cn } from '../utils';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  const { cart, toggleCart, navigateHome, user, toggleLoginModal, logout, navigateToProfile, navigateToAdmin } = useStore();
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  return (
    <>
      <LoginModal />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        installPrompt={installPrompt}
        onInstall={handleInstallClick}
      />
      
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-gray-200/50 py-3 shadow-sm' 
            : 'bg-white/0 border-transparent py-5'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-4">
               <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <button onClick={navigateHome} className="text-2xl font-bold tracking-tighter text-gray-900 group flex items-center gap-1">
                Lumina
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500 mt-1 transition-transform group-hover:scale-150" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <Navigation />

            {/* Actions */}
            <div className="flex items-center justify-end gap-1 sm:gap-2">
              {installPrompt && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleInstallClick}
                  className="hidden sm:flex items-center gap-2 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100"
                >
                  <Download className="w-3.5 h-3.5" /> Install App
                </Button>
              )}

              <SearchBar />
              
              <div className="relative hidden sm:block">
                {user ? (
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:ring-2 ring-primary-500 transition-all overflow-hidden"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleLoginModal(true)}
                    aria-label="Sign In"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                )}

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-primary-600 font-medium mt-1">{user.role}</p>
                      </div>
                      
                      {isAdmin && (
                        <button 
                          onClick={() => { navigateToAdmin(); setIsUserMenuOpen(false); }}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                           <LayoutDashboard className="w-4 h-4" /> Admin Console
                        </button>
                      )}

                      <button 
                        onClick={() => { navigateToProfile(); setIsUserMenuOpen(false); }}
                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                         <Settings className="w-4 h-4" /> Account Settings
                      </button>
                      <button 
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                         <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleCart()} 
                className="relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 h-4 w-4 bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};
