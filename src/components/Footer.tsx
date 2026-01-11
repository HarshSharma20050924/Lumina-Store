import React from 'react';
import { Facebook, Twitter, Instagram, Github, Mail, Globe, Linkedin, Youtube } from 'lucide-react';
import { Button } from './ui/Button';
import { useStore } from '../store';

export const Footer = () => {
  const { navigateToPage, setSortOption, navigateHome, socialLinks, setFilter } = useStore();

  const handleLink = (type: string, value: string) => {
    if (type === 'page') {
      navigateToPage(value);
    } else if (type === 'sort') {
      setSortOption(value as any);
      navigateHome();
      setTimeout(() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (type === 'category') {
      setFilter('categories', [value]);
      navigateHome();
      setTimeout(() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (type === 'new') {
        // Handle new arrivals
        // In a real app we would have a filter for isNew
        navigateHome();
        setTimeout(() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const socialIcons: Record<string, any> = {
    Facebook, Twitter, Instagram, Github, Linkedin, Youtube
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold tracking-tighter text-gray-900">Lumina</div>
              <div className="h-2 w-2 rounded-full bg-primary-500 mt-1" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Crafting the future of digital commerce with minimalist aesthetics and human-centric design. Experience the difference of quality.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
              {socialLinks.length === 0 && (
                 <span className="text-sm text-gray-400">No social links configured in Admin.</span>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><button onClick={() => handleLink('new', '')} className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all">New Arrivals</button></li>
              <li><button onClick={() => handleLink('sort', 'popular')} className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all">Best Sellers</button></li>
              <li><button onClick={() => handleLink('category', 'Essentials')} className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all">Essentials</button></li>
              <li><button onClick={() => handleLink('category', 'Accessories')} className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all">Accessories</button></li>
              <li><button onClick={() => handleLink('sort', 'price-low')} className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all">Sale</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {['about-us', 'sustainability', 'careers', 'press', 'affiliates'].map((slug) => (
                <li key={slug}>
                  <button onClick={() => handleLink('page', slug)} className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all capitalize">
                    {slug.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Support</h4>
            <ul className="space-y-3 text-sm text-gray-500">
               {['help-center', 'shipping-returns', 'size-guide', 'contact-us'].map((slug) => (
                <li key={slug}>
                  <button onClick={() => handleLink('page', slug)} className="hover:text-primary-600 hover:translate-x-1 inline-block transition-all capitalize">
                    {slug.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-semibold text-gray-900">Stay Updated</h4>
            <p className="text-xs text-gray-500">
              Subscribe to our newsletter for exclusive drops.
            </p>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Email address"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                />
              </div>
              <Button size="sm" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 Lumina Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <button onClick={() => navigateToPage('privacy')} className="hover:text-gray-900">Privacy Policy</button>
            <button onClick={() => navigateToPage('terms')} className="hover:text-gray-900">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};