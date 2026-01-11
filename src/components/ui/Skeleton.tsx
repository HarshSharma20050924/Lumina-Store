import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton = ({ className, variant = 'rect', ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200/80",
        variant === 'circle' && "rounded-full",
        variant === 'rect' && "rounded-md",
        variant === 'text' && "rounded h-4 w-3/4",
        className
      )}
      {...props}
    />
  );
};