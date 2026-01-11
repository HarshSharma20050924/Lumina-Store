import React, { useState, useRef } from 'react';
import { cn } from '../../utils';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageZoom = ({ src, alt, className }: ImageZoomProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-crosshair group", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <img 
        src={src} 
        alt={alt} 
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isHovering ? "opacity-0" : "opacity-100"
        )}
      />
      {isHovering && (
        <div 
          className="absolute inset-0 w-full h-full bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
            backgroundSize: '250%', // Zoom level
          }}
        />
      )}
    </div>
  );
};