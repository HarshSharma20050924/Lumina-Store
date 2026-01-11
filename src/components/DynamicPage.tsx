
import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export const DynamicPage = () => {
  const { currentPageSlug, getStaticPage } = useStore();
  const page = currentPageSlug ? getStaticPage(currentPageSlug) : null;

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[50vh] flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-gray-500 mt-2">The content you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">{page.title}</h1>
            <div className="h-1 w-20 bg-gray-900 mx-auto rounded-full" />
        </div>
        
        {/* Using a styled wrapper to make basic HTML content look good */}
        <div 
          className="prose prose-lg prose-gray max-w-none 
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-gray-400"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </motion.div>
    </div>
  );
};
