
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';

const LOOKS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop",
        title: "Urban Utility",
        description: "Engineered for the city. Water-resistant fabrics meet tailored cuts.",
        products: ["Tech Parka", "Cargo Trousers"]
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1550614000-4b9519e02a48?q=80&w=2000&auto=format&fit=crop",
        title: "Monochrome Essentials",
        description: "The art of simplicity. Building a timeless wardrobe with neutral tones.",
        products: ["Basic Tee", "Slim Jeans"]
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
        title: "Summer Breeze",
        description: "Lightweight linens and organic cottons for effortless comfort.",
        products: ["Linen Shirt", "Chino Shorts"]
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop",
        title: "Modern Formal",
        description: "Redefining the suit. Softer structures for the modern professional.",
        products: ["Wool Blazer", "Derby Shoes"]
    }
];

export const LookbookPage = () => {
    const { navigateHome } = useStore();
    const { scrollYProgress } = useScroll();
    
    // Parallax effect for header
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    const handleShopLook = (lookId: number) => {
        // Logic to filter products by look tags could go here
        navigateHome();
        setTimeout(() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Nav */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center mix-blend-difference text-white">
                <button onClick={navigateHome} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
                    <ArrowLeft className="w-4 h-4" /> Back to Store
                </button>
                <div className="text-xl font-bold">LUMINA / 2026</div>
                <div className="text-sm font-bold uppercase tracking-widest">Lookbook</div>
            </div>

            {/* Cover */}
            <div className="relative h-screen overflow-hidden flex items-center justify-center">
                <motion.div style={{ y }} className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
                        className="w-full h-full object-cover brightness-75"
                        alt="Cover"
                    />
                </motion.div>
                <div className="relative z-10 text-center text-white space-y-6">
                    <motion.h1 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-7xl md:text-9xl font-bold tracking-tighter"
                    >
                        THE FUTURE
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-xl font-light tracking-wide max-w-md mx-auto"
                    >
                        OF MINIMALISM
                    </motion.p>
                </div>
            </div>

            {/* Editorial Content */}
            <div className="relative z-20 bg-white">
                <div className="container mx-auto px-4 py-24">
                    <div className="grid gap-40">
                        {LOOKS.map((look, index) => (
                            <motion.div 
                                key={look.id}
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-20%" }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="w-full md:w-1/2 aspect-[3/4] overflow-hidden">
                                    <motion.img 
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.7 }}
                                        src={look.image} 
                                        className="w-full h-full object-cover"
                                        alt={look.title}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 space-y-8 px-4 md:px-12">
                                    <div className="space-y-4">
                                        <span className="text-9xl font-bold text-gray-100 absolute -translate-y-16 -translate-x-8 -z-10 select-none">
                                            0{index + 1}
                                        </span>
                                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{look.title}</h2>
                                        <p className="text-xl text-gray-500 font-light leading-relaxed">{look.description}</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Featured Items</p>
                                        <ul className="space-y-2">
                                            {look.products.map(p => (
                                                <li key={p} className="text-lg border-b border-gray-100 pb-2">{p}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button onClick={() => handleShopLook(look.id)} size="lg" className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
                                        Shop This Look <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="h-[50vh] bg-gray-900 flex items-center justify-center text-center px-4">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold text-white">Ready to explore?</h2>
                        <Button onClick={navigateHome} size="lg" className="bg-white text-black hover:bg-gray-200 h-16 px-12 text-lg rounded-full">
                            Shop Full Collection
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
