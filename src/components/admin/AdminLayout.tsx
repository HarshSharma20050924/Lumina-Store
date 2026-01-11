
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, FileText, LogOut, Truck, Lock, Megaphone } from 'lucide-react';
import { useStore } from '../../store';
import { DashboardCards } from './DashboardCards';
import { InventoryManager } from './InventoryManager';
import { OrderManager } from './OrderManager';
import { ContentManager } from './ContentManager';
import { NotificationCenter } from './NotificationCenter';
import { Button } from '../ui/Button';
import { getAppUrl } from '../../utils';

export const AdminLayout = () => {
  const { logout, adminUser, toggleLoginModal, fetchAllOrders, fetchProducts, fetchSiteContent } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'content' | 'marketing'>('dashboard');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
      const timer = setTimeout(() => setIsReady(true), 500);
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
      if (adminUser) {
          fetchAllOrders();
          fetchProducts(true);
          fetchSiteContent();
      }
  }, [adminUser, fetchAllOrders, fetchProducts, fetchSiteContent]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'content', label: 'Content Manager', icon: FileText },
    { id: 'marketing', label: 'Marketing & Drops', icon: Megaphone },
  ];

  if (!isReady) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
      );
  }

  if (!adminUser) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
                  <p className="text-gray-500 mb-8">You must be logged in with an administrator account to view this panel.</p>
                  
                  <div className="flex gap-4 flex-col">
                      <Button onClick={() => toggleLoginModal(true)} className="w-full">
                          Log In as Admin
                      </Button>
                      <Button variant="ghost" onClick={() => window.location.href = getAppUrl('store')}>
                          Return to Store
                      </Button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 top-16 z-30 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  {adminUser.name.charAt(0)}
              </div>
              <div>
                  <p className="text-xs font-bold text-gray-900">Admin Panel</p>
                  <p className="text-[10px] text-gray-500">{adminUser.email}</p>
              </div>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100 space-y-2">
           <button 
             onClick={() => { window.open(getAppUrl('driver'), '_blank'); }}
             className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full p-2 rounded transition-colors"
           >
             <Truck className="w-5 h-5 mr-3" /> Driver App
           </button>
           <button 
             onClick={() => { logout('ADMIN'); }}
             className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 w-full p-2 rounded transition-colors"
           >
             <LogOut className="w-5 h-5 mr-3" /> Exit Admin
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center lg:hidden">
             <div className="flex gap-2">
               {tabs.map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                 >
                   <tab.icon className="w-5 h-5" />
                 </button>
               ))}
             </div>
             <button onClick={() => { logout('ADMIN'); }} className="text-sm font-medium text-gray-600">Exit</button>
          </header>

          <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{activeTab.replace('-', ' ')} Overview</h1>

          {activeTab === 'dashboard' && <DashboardCards />}
          {activeTab === 'dashboard' && <div className="mt-8"><OrderManager /></div>}
          
          {activeTab === 'products' && <InventoryManager />}
          {activeTab === 'orders' && <OrderManager />}
          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'marketing' && <NotificationCenter />}
        </div>
      </main>
    </div>
  );
};
