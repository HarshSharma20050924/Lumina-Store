
// import React from 'react';
import { Modal } from './ui/Modal';
import { ProgressTracker } from './ProgressTracker';
import { Order } from '../types';
import { Package, Truck, MapPin, KeyRound, AlertTriangle } from 'lucide-react';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const TrackingModal = ({ isOpen, onClose, order }: TrackingModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-xl font-bold text-gray-900">Track Order</h3>
                <p className="text-sm text-gray-500">Order ID: #{order.id.split('-')[0]}</p>
            </div>
            {order.trackingNumber && (
                <div className="bg-gray-100 px-3 py-1 rounded text-xs font-mono font-medium">
                    {order.trackingNumber}
                </div>
            )}
        </div>

        <div className="mb-8">
            <ProgressTracker status={order.status} />
        </div>

        {/* Secure Handover Section */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && order.deliveryCode && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <KeyRound className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-blue-900">Secure Delivery PIN</h4>
                    <p className="text-xs text-blue-700 mb-1">Share this code with the driver to receive your package.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
                    <span className="text-2xl font-mono font-bold text-blue-800 tracking-widest">{order.deliveryCode}</span>
                </div>
            </div>
        )}

        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="font-semibold text-gray-900">Order Packed</p>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}</p>
                </div>
            </div>

            {order.status !== 'processing' && (
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Truck className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Shipped via Lumina Logistics</p>
                        <p className="text-sm text-gray-500">Expected Delivery: {new Date(new Date(order.date).getTime() + 5*24*60*60*1000).toLocaleDateString()}</p>
                    </div>
                </div>
            )}

            {order.status === 'delivered' && (
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Delivered</p>
                        <p className="text-sm text-gray-500">Your package has been delivered to {order.shippingAddress.split(',')[0]}</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </Modal>
  );
};
