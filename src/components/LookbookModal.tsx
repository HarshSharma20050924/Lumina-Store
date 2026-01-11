
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LookbookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LookbookModal = ({ isOpen, onClose }: LookbookModalProps) => {
    // High-quality editorial images for the lookbook
    const lookbookImages = [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529139574466-a302c27e3844?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534030347209-7147fd2e7506?w=800&auto=format&fit=crop"
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md"
                        onClick={onClose}
                    />
                    
                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white w-full h-full md:w-[90vw] md:h-[90vh] md:max-w-6xl md:rounded-2xl shadow-2xl relative flex flex-col overflow-hidden z-[10000]"
                    >
                        
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-bold font-serif text-gray-900">Summer 2026 Lookbook</h2>
                                <p className="text-sm text-gray-500">A curated selection of styles defining the season.</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-900" />
                            </button>
                        </div>

                        {/* Masonry Gallery */}
                        <div className="overflow-y-auto p-6 flex-1 bg-gray-50 custom-scrollbar">
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                {lookbookImages.map((src, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="break-inside-avoid group relative rounded-xl overflow-hidden shadow-sm cursor-pointer"
                                        onClick={() => console.log('View Lookbook Item', i)}
                                    >
                                        <img 
                                            src={src} 
                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                                            alt={`Lookbook ${i + 1}`} 
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <span className="text-white font-medium text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Shop This Look</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
