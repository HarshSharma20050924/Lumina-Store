import React, { useState, useEffect, useRef } from 'react';
import { cn, formatPrice } from '../../utils';

interface PriceSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export const PriceSlider = ({ min, max, step = 10, value, onChange, className }: PriceSliderProps) => {
  const [localValue, setLocalValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercent = (val: number) => Math.round(((val - min) / (max - min)) * 100);

  // Simple range input implementation for dual sliders
  // In a real production app, consider using Radix UI Slider for better a11y and touch handling
  
  const handleChange = (index: 0 | 1, event: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(event.target.value);
    const newValue: [number, number] = [...localValue] as [number, number];
    
    if (index === 0) {
      newValue[0] = Math.min(val, localValue[1] - step);
    } else {
      newValue[1] = Math.max(val, localValue[0] + step);
    }
    
    setLocalValue(newValue);
    // Debounce or only fire on mouse up could be better, but this works for responsive UI
    onChange(newValue);
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative h-2 w-full rounded-full bg-gray-200">
        <div 
          className="absolute h-full rounded-full bg-gray-900"
          style={{
            left: `${getPercent(localValue[0])}%`,
            width: `${getPercent(localValue[1]) - getPercent(localValue[0])}%`
          }}
        />
        
        {/* Invisible Inputs Overlay */}
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={(e) => handleChange(0, e)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto"
        />
         <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={(e) => handleChange(1, e)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto"
        />

        {/* Visual Thumbs */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-gray-900 rounded-full shadow hover:scale-110 transition-transform pointer-events-none z-10"
          style={{ left: `${getPercent(localValue[0])}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-gray-900 rounded-full shadow hover:scale-110 transition-transform pointer-events-none z-10"
          style={{ left: `${getPercent(localValue[1])}%` }}
        />
      </div>

      <div className="flex justify-between mt-4 text-sm font-medium text-gray-700">
        <span>{formatPrice(localValue[0])}</span>
        <span>{formatPrice(localValue[1])}</span>
      </div>
    </div>
  );
};