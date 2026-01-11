
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { MapPin, Clock, DollarSign, ChevronRight, Phone, Navigation, RefreshCw, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeliveryJob } from '../../types';
import { DeliveryDetail } from './DeliveryDetail';

interface Props {
    currentTab: 'jobs' | 'history';
}

export const DeliveryDashboard = ({ currentTab }: Props) => {
  const { agentJobs, fetchAgentJobs, driverUser } = useStore();
  const [selectedJob, setSelectedJob] = useState<DeliveryJob | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll for new jobs and notifications
  useEffect(() => {
      const poll = setInterval(() => {
          fetchAgentJobs(true); // Silent refresh
      }, 15000);
      return () => clearInterval(poll);
  }, [fetchAgentJobs]);

  const handleRefresh = async () => {
      setIsRefreshing(true);
      await fetchAgentJobs();
      setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter jobs based on tab
  const displayJobs = agentJobs.filter(job => {
      if (currentTab === 'jobs') {
          return job.deliveryStatus !== 'COMPLETED' && job.deliveryStatus !== 'ATTEMPTED';
      } else {
          return job.deliveryStatus === 'COMPLETED' || job.deliveryStatus === 'ATTEMPTED';
      }
  });

  if (selectedJob) {
      return <DeliveryDetail job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-700">
                {currentTab === 'jobs' ? 'Active Assignments' : 'Delivery History'} 
                <span className="ml-2 text-sm text-gray-400 font-normal">({displayJobs.length})</span>
            </h3>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
                <button 
                    onClick={handleRefresh} 
                    className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                >
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
            </div>
        </div>

        <AnimatePresence mode="popLayout">
            {displayJobs.map(job => (
                <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    onClick={() => {
                        // Only active jobs are clickable for detail view actions
                        if (currentTab === 'jobs') setSelectedJob(job);
                    }}
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-transform ${currentTab === 'jobs' ? 'active:scale-98 cursor-pointer' : 'opacity-80'}`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            job.deliveryStatus === 'OUT_FOR_DELIVERY' ? 'bg-green-100 text-green-700' : 
                            job.deliveryStatus === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {job.deliveryStatus.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-xs text-gray-500">#{job.id.split('-')[0]}</span>
                    </div>

                    <div className="flex gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 line-clamp-1">{job.shippingAddress}</h4>
                            <p className="text-sm text-gray-500">{job.customerName || 'Customer'}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                            {currentTab === 'jobs' ? (
                                <>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.estimatedTime}</span>
                                    <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {job.distance}</span>
                                </>
                            ) : (
                                <span className="flex items-center gap-1 text-green-600"><Clock className="w-3 h-3" /> Completed Today</span>
                            )}
                        </div>
                        {job.codAmount > 0 && (
                            <div className="flex items-center gap-1 text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                                <DollarSign className="w-3 h-3" /> Collect ${job.codAmount}
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
        
        {displayJobs.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    {currentTab === 'jobs' ? <Clock className="w-8 h-8 text-gray-400" /> : <Archive className="w-8 h-8 text-gray-400" />}
                </div>
                <p>{currentTab === 'jobs' ? 'No active jobs' : 'No history found'}</p>
                <p className="text-xs mt-2">Pull down to refresh</p>
                <button onClick={handleRefresh} className="mt-4 text-sm text-blue-600 font-medium">Retry Sync</button>
            </div>
        )}
    </div>
  );
};
