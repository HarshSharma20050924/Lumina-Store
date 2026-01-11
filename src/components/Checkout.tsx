
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { CheckoutStepper } from './CheckoutStepper';
import { AddressForm } from './AddressForm';
import { PaymentMethods } from './PaymentMethods';
import { OrderSummary } from './OrderSummary';
import { Button } from './ui/Button';
import { ChevronLeft, Lock } from 'lucide-react';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { ConfettiEffect } from './ui/ConfettiEffect';

export const Checkout = () => {
  const { checkoutStep, setCheckoutStep, navigateHome, cart, placeOrder, user, navigateToProfile, resetCheckout } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Checkout State
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [shouldSaveAddress, setShouldSaveAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');

  // Force reset checkout step on mount
  useEffect(() => {
    resetCheckout();
  }, [resetCheckout]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && checkoutStep !== 3) {
      navigateHome();
    }
  }, [cart, navigateHome, checkoutStep]);

  const handleNext = async () => {
    if (checkoutStep === 1) {
        if (!shippingAddress || shippingAddress.length < 5) {
            alert("Please enter a valid shipping address");
            return;
        }
        setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      setIsProcessing(true);
      // Simulate API payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Place Order
      await placeOrder(shippingAddress, shouldSaveAddress, paymentMethod);
      
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (checkoutStep > 1) {
      setCheckoutStep(checkoutStep - 1);
    } else {
      navigateHome();
    }
  };

  if (checkoutStep === 3) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 relative">
        <ConfettiEffect />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-500 mb-8">
            Thank you for your purchase. We've sent a confirmation email to your inbox.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => { resetCheckout(); navigateHome(); }} size="lg">
              Continue Shopping
            </Button>
            <Button variant="ghost" onClick={navigateToProfile}>
              View Order History
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
           <Breadcrumbs items={[
             { label: 'Home', onClick: navigateHome },
             { label: 'Cart', onClick: () => {} }, 
             { label: 'Checkout', isActive: true }
           ]} />
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="mb-8">
              <CheckoutStepper 
                currentStep={checkoutStep} 
                steps={['Shipping', 'Payment', 'Review']} 
              />
            </div>

            <motion.div
              key={checkoutStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {checkoutStep === 1 && (
                <AddressForm 
                    onAddressChange={setShippingAddress} 
                    onSavePreferenceChange={setShouldSaveAddress}
                />
              )}
              {checkoutStep === 2 && (
                <PaymentMethods onMethodChange={setPaymentMethod} />
              )}
            </motion.div>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
              <button 
                onClick={handleBack}
                className="flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {checkoutStep === 1 ? 'Return to Store' : 'Back'}
              </button>
              
              <Button onClick={handleNext} size="lg" className="min-w-[150px]" isLoading={isProcessing}>
                {checkoutStep === 2 ? 'Place Order' : 'Continue'}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};
