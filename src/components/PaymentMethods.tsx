
import { useState } from "react";
import { CreditCard, Wallet, Banknote, Smartphone, ScanLine, Wifi } from 'lucide-react';
import { Input } from './ui/Input';
import { cn } from '../utils';
import { Button } from './ui/Button';

interface PaymentMethodsProps {
    onMethodChange?: (method: 'ONLINE' | 'COD') => void;
}

export const PaymentMethods = ({ onMethodChange }: PaymentMethodsProps) => {
  const [method, setMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [holder, setHolder] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleMethodChange = (newMethod: 'card' | 'upi' | 'cod') => {
      setMethod(newMethod);
      if (onMethodChange) {
          onMethodChange(newMethod === 'cod' ? 'COD' : 'ONLINE');
      }
  };

  const formatCardNumber = (val: string) => {
      return val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
  };

  const formatExpiry = (val: string) => {
      return val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
  };

  const handleScanCard = () => {
      setIsScanning(true);
      setTimeout(() => {
          setIsScanning(false);
          setCardNumber('4242 4242 4242 4242');
          setExpiry('12/28');
          setHolder('John Doe');
      }, 1500);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>

      {/* Method Selector */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleMethodChange('card')}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
            method === 'card' 
              ? "border-gray-900 bg-gray-900 text-white shadow-md" 
              : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
          )}
        >
          <CreditCard className="w-5 h-5 mb-2" />
          <span className="text-xs font-medium">Card</span>
        </button>
        <button
          onClick={() => handleMethodChange('upi')}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
            method === 'upi' 
              ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md" 
              : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
          )}
        >
          <Smartphone className="w-5 h-5 mb-2" />
          <span className="text-xs font-medium">UPI / GPay</span>
        </button>
        <button
          onClick={() => handleMethodChange('cod')}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
            method === 'cod' 
              ? "border-green-600 bg-green-50 text-green-700 shadow-md" 
              : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
          )}
        >
          <Banknote className="w-5 h-5 mb-2" />
          <span className="text-xs font-medium">Cash (COD)</span>
        </button>
      </div>

      {/* Credit Card Form */}
      {method === 'card' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
          
          {/* Card Visual */}
          <div className="relative h-48 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                      <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-sm flex items-center justify-center">
                          <Wifi className="w-5 h-5 text-white/70 rotate-90" />
                      </div>
                      <span className="font-mono text-lg italic font-bold opacity-80">VISA</span>
                  </div>
                  <div>
                      <div className="font-mono text-xl tracking-widest mb-1 shadow-black drop-shadow-sm">
                          {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-[10px] uppercase text-gray-400 mb-0.5">Card Holder</p>
                              <p className="font-medium tracking-wide uppercase">{holder || 'YOUR NAME'}</p>
                          </div>
                          <div>
                              <p className="text-[10px] uppercase text-gray-400 mb-0.5">Expires</p>
                              <p className="font-mono">{expiry || 'MM/YY'}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="space-y-4">
              <div className="flex items-end gap-2">
                  <div className="flex-1">
                      <Input 
                        label="Card Number" 
                        placeholder="0000 0000 0000 0000" 
                        value={cardNumber}
                        onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        icon={<CreditCard className="w-4 h-4" />} 
                      />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mb-[1px] border-dashed border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-900"
                    onClick={handleScanCard}
                    isLoading={isScanning}
                  >
                      <ScanLine className="w-4 h-4 mr-2" /> Scan
                  </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Expiry Date" 
                    placeholder="MM/YY" 
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                />
                <Input 
                    label="CVC" 
                    placeholder="123" 
                    maxLength={3}
                    type="password"
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/\D/g,''))}
                />
              </div>
              <Input 
                label="Cardholder Name" 
                placeholder="John Doe" 
                value={holder}
                onChange={e => setHolder(e.target.value)}
              />
          </div>
        </div>
      )}

      {/* UPI / GPay */}
      {method === 'upi' && (
        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 animate-in fade-in slide-in-from-top-4">
            <h4 className="font-semibold text-blue-900 mb-4">Pay via UPI / Google Pay</h4>
            <div className="space-y-4">
                <Input label="UPI ID" placeholder="username@okhdfcbank" />
                <div className="flex gap-2">
                    <button className="flex-1 py-3 border rounded-lg bg-white hover:bg-gray-50 font-medium text-sm flex items-center justify-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full" /> Google Pay
                    </button>
                    <button className="flex-1 py-3 border rounded-lg bg-white hover:bg-gray-50 font-medium text-sm flex items-center justify-center gap-2">
                        <div className="w-4 h-4 bg-purple-600 rounded-full" /> PhonePe
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    You will receive a payment request on your UPI app.
                </p>
            </div>
        </div>
      )}

      {/* COD Message */}
      {method === 'cod' && (
        <div className="bg-green-50 rounded-xl p-6 border border-green-100 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-full text-green-700">
                  <Banknote className="w-6 h-6" />
              </div>
              <div>
                  <h4 className="font-bold text-green-900">Cash on Delivery</h4>
                  <p className="text-sm text-green-700">Pay conveniently at your doorstep.</p>
              </div>
          </div>
          <ul className="text-sm text-green-800 space-y-2 list-disc list-inside opacity-80">
              <li>Please keep exact change ready if possible.</li>
              <li>You can also pay via UPI to the delivery agent.</li>
              <li>A verification code will be sent to confirm order.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
