import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../utils';

interface CheckoutStepperProps {
  currentStep: number;
  steps: string[];
}

export const CheckoutStepper = ({ currentStep, steps }: CheckoutStepperProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10" />
        
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={step} className="flex flex-col items-center bg-white px-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? '#111827' : '#FFFFFF',
                  borderColor: isCompleted || isCurrent ? '#111827' : '#E5E7EB',
                }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-colors",
                  isCurrent ? "ring-4 ring-gray-100" : ""
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={cn("text-xs font-bold", isCurrent ? "text-white" : "text-gray-400")}>
                    {stepNumber}
                  </span>
                )}
              </motion.div>
              <span className={cn(
                "text-xs font-medium uppercase tracking-wider",
                isCurrent ? "text-gray-900" : "text-gray-400"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};