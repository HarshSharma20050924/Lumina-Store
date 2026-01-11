import React from 'react';
import { Breadcrumbs } from './ui/Breadcrumbs';

interface CategoryHeroProps {
  title: string;
  description: string;
  image: string;
}

export const CategoryHero = ({ title, description, image }: CategoryHeroProps) => {
  return (
    <div className="relative h-64 md:h-80 w-full overflow-hidden mb-8 rounded-2xl">
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
         <div className="container mx-auto">
           <Breadcrumbs 
             items={[{ label: 'Home' }, { label: title, isActive: true }]} 
             className="mb-4 text-gray-200 [&_button]:text-gray-200 [&_button:hover]:text-white"
           />
           <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">{title}</h1>
           <p className="text-lg text-gray-100 max-w-xl">{description}</p>
         </div>
      </div>
    </div>
  );
};