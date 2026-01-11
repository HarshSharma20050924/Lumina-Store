
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../utils';

export const ToastNotifications = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none items-center">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onRemove }: { toast: any; onRemove: () => void }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer just in case
    if (timerRef.current) clearTimeout(timerRef.current);

    const duration = toast.duration || 3000;
    
    // Set new timer
    timerRef.current = setTimeout(() => {
      onRemove();
    }, duration);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []); 

  const icons: Record<string, React.ReactNode> = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className="pointer-events-auto bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-lg p-4 pr-10 min-w-[320px] max-w-md relative overflow-hidden group"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[toast.type] || icons.info}</div>
        <p className="text-sm font-medium text-gray-900 leading-snug">{toast.message}</p>
      </div>
      
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: (toast.duration || 3000) / 1000, ease: "linear" }}
        className={cn(
          "absolute bottom-0 left-0 h-1",
          toast.type === 'success' ? 'bg-green-500' : 
          toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        )}
      />
    </motion.div>
  );
};
