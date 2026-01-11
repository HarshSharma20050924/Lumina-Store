
import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronRight, PenTool, Search, KeyRound } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatPrice } from '../utils';
import { Button } from './ui/Button';
import { ReviewModal } from './ReviewModal';
import { TrackingModal } from './TrackingModal';

interface OrderHistoryProps {
  orders: Order[];
}

export const OrderHistory = ({ orders }: OrderHistoryProps) => {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; image: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleWriteReview = (product: { id: string; name: string; image: string }) => {
    setSelectedProduct(product);
    setReviewModalOpen(true);
  };

  const handleTrackOrder = (order: Order) => {
      setSelectedOrder(order);
      setTrackingModalOpen(true);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="text-gray-500 mt-1 mb-6">Start shopping to see your orders here.</p>
        <Button>Browse Products</Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div>
                  <p className="text-gray-500 mb-0.5">Order Placed</p>
                  <p className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Total</p>
                  <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                </div>
                {/* Visual PIN for User */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && order.deliveryCode && (
                    <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-blue-600" />
                        <div>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide leading-none">Delivery PIN</p>
                            <p className="text-lg font-mono font-bold text-blue-800 leading-none">{order.deliveryCode}</p>
                        </div>
                    </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
                <p className="text-sm font-medium text-gray-900">#{order.id.split('-')[0]}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={`${order.id}-${idx}`} className="flex gap-4">
                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Qty: {item.quantity} · {item.selectedSize} · {item.selectedColor}
                      </p>
                      
                      {order.status === 'delivered' && (
                          <div className="flex items-center gap-4 mt-2">
                             <button 
                                onClick={() => handleWriteReview({ 
                                    id: item.productId, 
                                    name: item.name, 
                                    image: item.image // Pass actual image from item
                                })}
                                className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
                             >
                               <PenTool className="w-3 h-3" /> Write a Review
                             </button>
                             <button className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                               Buy Again
                             </button>
                          </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice((item.discountPrice || item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
                {(order.status === 'shipped' || order.status === 'delivered') && (
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleTrackOrder(order)}>
                        <Search className="w-3 h-3" /> Track Order
                    </Button>
                )}
                <Button variant="outline" size="sm" className="gap-2">
                  Order Details <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedProduct && (
          <ReviewModal 
            isOpen={reviewModalOpen} 
            onClose={() => setReviewModalOpen(false)} 
            product={selectedProduct} 
          />
      )}

      {selectedOrder && (
          <TrackingModal 
            isOpen={trackingModalOpen}
            onClose={() => setTrackingModalOpen(false)}
            order={selectedOrder}
          />
      )}
    </>
  );
};
