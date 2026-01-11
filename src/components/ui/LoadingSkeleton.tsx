import React from 'react';
import { cn } from '../../utils';

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rect' | 'circle' | 'text' | 'card' | 'avatar';
}

export const LoadingSkeleton = ({ className, variant = 'rect', ...props }: LoadingSkeletonProps) => {
  if (variant === 'card') {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="aspect-[3/4] w-full rounded-xl bg-gray-200/80 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-gray-200/80 animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-gray-200/80 animate-pulse" />
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={cn("h-10 w-10 rounded-full bg-gray-200/80 animate-pulse", className)} />;
  }

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