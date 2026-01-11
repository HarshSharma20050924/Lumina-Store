// import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Truck, Package } from 'lucide-react';
import { OrderStatus } from '../types';
import { cn } from '../utils';

interface ProgressTrackerProps {
  status: OrderStatus;
  className?: string;
}

export const ProgressTracker = ({ status, className }: ProgressTrackerProps) => {
  const steps: { id: OrderStatus; label: string; icon: any }[] = [
    { id: 'processing', label: 'Processing', icon: Clock },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Package },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);
  // Handle cancelled as a special case or mapping
  const activeIndex = status === 'cancelled' ? -1 : (currentStepIndex === -1 ? 0 : currentStepIndex);

  if (status === 'cancelled') {
     return (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center justify-center gap-2 font-medium">
           Order Cancelled
        </div>
     );
  }

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative flex justify-between">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10" />
        <div 
           className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 -z-10 transition-all duration-500"
           style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#22c55e' : '#f3f4f6',
                  color: isCompleted ? '#ffffff' : '#9ca3af',
                  scale: isCurrent ? 1.1 : 1
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center mb-2 z-10 shadow-sm"
              >
                <step.icon className="w-4 h-4" />
              </motion.div>
              <span className={cn(
                "text-xs font-medium",
                isCompleted ? "text-gray-900" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};