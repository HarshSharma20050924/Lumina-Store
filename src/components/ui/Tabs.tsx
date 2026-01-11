import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export const Tabs = ({ tabs, defaultTab, className }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {tabs.map((tab) => {
          if (tab.id !== activeTab) return null;
          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab.content}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};