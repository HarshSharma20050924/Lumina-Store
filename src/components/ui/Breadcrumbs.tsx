import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils';
import { useStore } from '../../store';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  const { navigateHome } = useStore();

  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <button 
            onClick={navigateHome}
            className="text-gray-500 hover:text-gray-900 transition-colors flex items-center"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </button>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
            <button
              onClick={item.onClick}
              disabled={item.isActive || !item.onClick}
              className={cn(
                "text-sm font-medium transition-colors",
                item.isActive 
                  ? "text-gray-900 pointer-events-none" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};