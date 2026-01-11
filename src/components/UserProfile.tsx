
import { useState } from "react";
import { User, Settings, ShoppingBag, Heart, MapPin, LogOut, Shield, Key } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Tabs } from './ui/Tabs';
import { OrderHistory } from './OrderHistory';
import { ProductCard } from './ProductCard';
import { Breadcrumbs } from './ui/Breadcrumbs';

// --- Extracted Components to fix focus loss bug ---

const ProfileTab = ({ 
    formData, 
    setFormData, 
    passData, 
    setPassData, 
    isEditing, 
    setIsEditing, 
    handleUpdateProfile, 
    handleUpdatePassword, 
    isSaving 
}: any) => {
    return (
        <div className="max-w-2xl space-y-12">
            {/* Basic Info */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                        <p className="text-sm text-gray-500">Manage your personal details and delivery address.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="Full Name" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            disabled={!isEditing}
                        />
                        <Input 
                            label="Email Address" 
                            type="email"
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            disabled={!isEditing}
                        />
                        <Input 
                            label="Phone Number" 
                            type="tel"
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            disabled={!isEditing}
                        />
                        <Input 
                            label="Default Address" 
                            value={formData.address} 
                            onChange={e => setFormData({...formData, address: e.target.value})}
                            disabled={!isEditing}
                        />
                    </div>

                    {isEditing && (
                        <div className="flex justify-end pt-4">
                            <Button type="submit" isLoading={isSaving}>Save Changes</Button>
                        </div>
                    )}
                </form>
            </div>

            {/* Security Section */}
            <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" /> Security
                </h3>
                
                <form onSubmit={handleUpdatePassword} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Key className="w-4 h-4" /> Change Password
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input 
                            type="password" 
                            label="Current Password" 
                            value={passData.currentPassword}
                            onChange={e => setPassData({...passData, currentPassword: e.target.value})}
                            required
                        />
                        <Input 
                            type="password" 
                            label="New Password" 
                            value={passData.newPassword}
                            onChange={e => setPassData({...passData, newPassword: e.target.value})}
                            required
                        />
                        <Input 
                            type="password" 
                            label="Confirm New" 
                            value={passData.confirmPassword}
                            onChange={e => setPassData({...passData, confirmPassword: e.target.value})}
                            required
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button type="submit" variant="outline" size="sm" isLoading={isSaving}>Update Password</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const WishlistTab = ({ wishlistProducts, navigateHome }: any) => {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Saved Items ({wishlistProducts.length})</h2>
                <p className="text-sm text-gray-500">Items you've bookmarked for later.</p>
            </div>
            {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlistProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                    <Button variant="ghost" onClick={navigateHome} className="mt-2">Start Shopping</Button>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

export const UserProfile = () => {
  const { user, logout, navigateHome, orders, wishlist, updateUserProfile, products, addToast } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile Data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // Password Data
  const [passData, setPassData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
  });

  if (!user) {
    navigateHome();
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Toast handled in store
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (passData.newPassword !== passData.confirmPassword) {
          addToast({ type: 'error', message: "Passwords don't match" });
          return;
      }
      setIsSaving(true);
      try {
          await updateUserProfile({ 
              // @ts-ignore
              currentPassword: passData.currentPassword,
              newPassword: passData.newPassword
          });
          setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (e) {
          // error
      } finally {
          setIsSaving(false);
      }
  };

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Breadcrumbs items={[
          { label: 'Home', onClick: navigateHome },
          { label: 'Account', isActive: true }
        ]} className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-8">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`} 
                alt={user.name} 
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover" 
              />
              <div>
                <h2 className="font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500 truncate max-w-[150px]">{user.email}</p>
              </div>
            </div>

            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => { logout(); navigateHome(); }}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Tabs 
              tabs={[
                { 
                  id: 'orders', 
                  label: 'Order History', 
                  content: <OrderHistory orders={orders} />
                },
                { 
                  id: 'profile', 
                  label: 'Profile & Settings', 
                  content: <ProfileTab 
                                formData={formData} 
                                setFormData={setFormData}
                                passData={passData}
                                setPassData={setPassData}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                handleUpdateProfile={handleUpdateProfile}
                                handleUpdatePassword={handleUpdatePassword}
                                isSaving={isSaving}
                           />
                },
                { 
                  id: 'wishlist', 
                  label: 'Wishlist', 
                  content: <WishlistTab wishlistProducts={wishlistProducts} navigateHome={navigateHome} />
                }
              ]}
              defaultTab="orders"
            />
          </main>
        </div>
      </div>
    </div>
  );
};
