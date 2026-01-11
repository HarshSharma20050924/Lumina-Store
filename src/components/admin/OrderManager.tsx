
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Clock, XCircle, MoreHorizontal } from 'lucide-react';
import { useStore } from '../../store';
import { Order, OrderStatus } from '../../types';
import { formatPrice } from '../../utils';

export const OrderManager = () => {
  const { orders, updateOrderStatus } = useStore();

  const columns: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'processing', label: 'Processing', icon: Clock },
    { status: 'shipped', label: 'In Transit', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-x-auto pb-4">
      {columns.map((col) => {
        const colOrders = orders.filter(o => o.status === col.status);
        
        return (
          <div key={col.status} className="bg-gray-50 rounded-xl p-4 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center gap-2 mb-4 px-2">
              <col.icon className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-700">{col.label}</h3>
              <span className="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {colOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {colOrders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500">#{order.id.split('-')[0]}</span>
                    <span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-1">{order.customerName || 'Guest'}</h4>
                  <p className="text-sm text-gray-500 mb-3">{order.items.length} items • {formatPrice(order.total)}</p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    {col.status === 'processing' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="flex-1 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        Ship Order
                      </button>
                    )}
                    {col.status === 'shipped' && (
                      <div className="flex-1 py-1.5 text-xs font-medium text-center text-gray-400 italic">
                        Awaiting Driver Confirmation
                      </div>
                    )}
                    {col.status !== 'cancelled' && col.status !== 'delivered' && (
                      <button 
                         onClick={() => updateOrderStatus(order.id, 'cancelled')}
                         className="px-2 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {colOrders.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm italic">
                  No orders in {col.label.toLowerCase()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
