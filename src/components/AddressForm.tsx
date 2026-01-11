
import React, { useEffect, useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useStore } from '../store';
import { ShieldCheck, Edit2, Smartphone, RefreshCw, Loader2 } from 'lucide-react';

interface AddressFormProps {
  onAddressChange?: (address: string) => void;
  onSavePreferenceChange?: (save: boolean) => void;
}

export const AddressForm = ({ onAddressChange, onSavePreferenceChange }: AddressFormProps) => {
  const { user, sendOtp, validateOtp, updateUserProfile, addToast } = useStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const [saveInfo, setSaveInfo] = useState(true);
  
  // Verification State
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (user) {
      const names = user.name ? user.name.split(' ') : ['', ''];
      
      let city = '', state = '', zip = '', street = user.address || '';
      if (user.address && user.address.includes(',')) {
          const parts = user.address.split(',').map(s => s.trim());
          if (parts.length >= 3) {
              street = parts[0];
              city = parts[1];
              const lastPart = parts[parts.length - 1].split(' ');
              if (lastPart.length > 1) {
                  state = lastPart[0];
                  zip = lastPart[1];
              } else {
                  state = parts[2];
              }
          }
      }

      setFormData({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        address: street,
        city: city,
        state: state,
        zip: zip
      });
      
      // Initialize verification state from DB
      // If the DB says verified AND the phone number matches the input, it's verified.
      if (user.isPhoneVerified && user.phone) {
          setIsPhoneVerified(true);
      } else {
          setIsPhoneVerified(false);
      }

      const fullAddress = user.address || '';
      if (onAddressChange && fullAddress) onAddressChange(fullAddress);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Logic for Phone Change
    if (name === 'phone') {
        // If user changes phone, unverify instantly so they have to verify the new number
        if (value !== user?.phone) {
            setIsPhoneVerified(false);
            setShowOtpInput(false); 
        } else if (user?.isPhoneVerified) {
            // If they type back the original verified number, restore status
            setIsPhoneVerified(true);
        }
    }

    setFormData(prev => {
        const next = { ...prev, [name]: value };
        const fullAddress = `${next.address}, ${next.city}, ${next.state} ${next.zip}`;
        if (onAddressChange) onAddressChange(fullAddress);
        return next;
    });
  };

  const handleSendOtp = async () => {
      if (formData.phone.length < 10) return addToast({type: 'error', message: 'Invalid phone number'});
      setIsVerifying(true);
      try {
          // In real app, send to SMS. Here we simulate/log it.
          await sendOtp(user?.email || 'test@example.com'); 
          setShowOtpInput(true);
          addToast({type: 'info', message: `OTP sent to mobile ending in ${formData.phone.slice(-4)}`});
      } catch(e) {
          // error handled in store
      } finally {
          setIsVerifying(false);
      }
  };

  const handleVerifyOtp = async () => {
      setIsVerifying(true);
      try {
          // Pass phone number context to validation if needed
          const isValid = await validateOtp(user?.email || '', otp);
          
          if (isValid) {
              setIsPhoneVerified(true);
              setShowOtpInput(false);
              setOtp('');
              
              // Persist verified status to DB immediately
              await updateUserProfile({ 
                  phone: formData.phone,
                  isPhoneVerified: true 
              });
              
              addToast({type: 'success', message: 'Mobile number verified successfully'});
          }
      } catch(e) {
          // error handled
      } finally {
          setIsVerifying(false);
      }
  };

  const handleEditPhone = () => {
      // Allow editing the field
      setIsPhoneVerified(false);
      setShowOtpInput(false);
      // Focus logic would go here ideally
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
        <Input name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} />
          
          {/* Mobile Verification Block */}
          <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              
              <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Smartphone className="w-4 h-4" />
                  </div>
                  <input 
                    name="phone"
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleChange}
                    disabled={isPhoneVerified} 
                    className={`flex h-11 w-full rounded-lg border px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 transition-all
                        ${isPhoneVerified 
                            ? "bg-green-50/50 border-green-200 text-green-900 pr-24" 
                            : "bg-white border-gray-300 focus:ring-primary-500"
                        }
                    `}
                    placeholder="+1 (555) 000-0000"
                  />
                  
                  {isPhoneVerified && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-white/80 px-2 py-1 rounded shadow-sm">
                              <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                          <button onClick={handleEditPhone} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" title="Change Number">
                              <Edit2 className="w-3 h-3" />
                          </button>
                      </div>
                  )}
              </div>

              {/* Verification UI */}
              {!isPhoneVerified && formData.phone.length >= 10 && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2">
                      {!showOtpInput ? (
                          <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500">Verify for delivery updates.</p>
                              <Button size="sm" variant="outline" onClick={handleSendOtp} isLoading={isVerifying}>
                                  Send OTP
                              </Button>
                          </div>
                      ) : (
                          <div className="space-y-3">
                              <p className="text-xs text-gray-600 font-medium">Enter 6-digit code sent to mobile</p>
                              <div className="flex gap-2">
                                  <input 
                                    className="flex-1 h-10 text-center text-lg tracking-[0.5em] font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                                    placeholder="000000"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                  />
                                  <Button className="px-6" onClick={handleVerifyOtp} isLoading={isVerifying}>
                                      Verify
                                  </Button>
                              </div>
                              <div className="flex justify-between items-center pt-1">
                                  <button onClick={handleSendOtp} disabled={isVerifying} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                      {isVerifying ? <Loader2 className="w-3 h-3 animate-spin"/> : <RefreshCw className="w-3 h-3" />} Resend Code
                                  </button>
                                  <button onClick={() => setShowOtpInput(false)} className="text-xs text-gray-400 hover:text-gray-600">
                                      Change Number
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              )}
          </div>
      </div>
      
      <Input name="address" label="Address" value={formData.address} onChange={handleChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input name="city" label="City" value={formData.city} onChange={handleChange} />
        <Input name="state" label="State" value={formData.state} onChange={handleChange} />
        <Input name="zip" label="ZIP Code" value={formData.zip} onChange={handleChange} />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input 
            type="checkbox" 
            id="save-address" 
            checked={saveInfo}
            onChange={(e) => { setSaveInfo(e.target.checked); if(onSavePreferenceChange) onSavePreferenceChange(e.target.checked); }}
            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" 
        />
        <label htmlFor="save-address" className="text-sm text-gray-600">
          Save this information for next time
        </label>
      </div>
    </div>
  );
};
