import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, Activity } from 'lucide-react';
import { useStore } from '../../store';
import { formatPrice } from '../../utils';

export const DashboardCards = () => {
  const { orders, products } = useStore();

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => (p.stock || 0) < 20).length;

  const stats = [
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      trend: '+12.5%',
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      trend: '+4.3%',
      color: 'bg-blue-500'
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts,
      icon: Activity,
      trend: 'Needs Attention',
      color: 'bg-orange-500'
    },
    {
      title: 'Active Users',
      value: '1,234',
      icon: Users,
      trend: '+8.1%',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <span className={`text-xs font-medium ${stat.trend.includes('+') ? 'text-green-600' : 'text-orange-600'} bg-gray-50 px-2 py-1 rounded-full`}>
              {stat.trend}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};