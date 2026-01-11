
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Box, CheckSquare, LogOut, Truck, ShieldCheck, User, Lock, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeliveryDashboard } from './DeliveryDashboard';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { getAppUrl } from '../../utils';

// Driver Flow Steps
type DriverStep = 'EMAIL' | 'OTP' | 'PASSWORD_SETUP' | 'DETAILS' | 'LOGIN_PASSWORD';

export const DeliveryLayout = () => {
  const { driverUser, logout, fetchAgentJobs, login, registerDriver, sendOtp, validateOtp, addToast, checkEmail } = useStore();
  const [currentTab, setCurrentTab] = useState<'jobs' | 'history'>('jobs');
  
  // Auth State
  const [step, setStep] = useState<DriverStep>('EMAIL');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
      if(driverUser) fetchAgentJobs();
  }, [fetchAgentJobs, driverUser]);

  // WebOTP API: Listen for incoming SMS
  useEffect(() => {
    if (step === 'OTP' && 'credentials' in navigator) {
      const ac = new AbortController();
      
      // @ts-ignore: WebOTP API
      navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then((otpCredential: any) => {
        if (otpCredential) {
          setOtp(otpCredential.code);
          // Optional: Auto-submit here if desired
          // handleVerifyOtp(new Event('submit') as any); 
        }
      }).catch((err: any) => {
        console.debug('WebOTP waiting ended', err);
      });

      return () => {
        ac.abort();
      };
    }
  }, [step]);

  // Step 1: Check Email & Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
          // Check if user exists first
          const exists = await checkEmail(email);
          if (exists) {
              addToast({ type: 'info', message: 'Account already exists. Please login.' });
              setStep('LOGIN_PASSWORD');
              return;
          }

          await sendOtp(email);
          setStep('OTP');
      } catch (e) {
          // Toast handled by store
      } finally {
          setLoading(false);
      }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
          const isValid = await validateOtp(email, otp);
          if (isValid) {
              setStep('PASSWORD_SETUP');
          }
      } catch (e) {
          // error
      } finally {
          setLoading(false);
      }
  };

  // Step 3: Create Password
  const handlePasswordSetup = (e: React.FormEvent) => {
      e.preventDefault();
      if (password.length < 6) return addToast({ type: 'error', message: 'Password too short' });
      setStep('DETAILS');
  };

  // Step 4: Finalize Registration
  const handleRegistration = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
          await registerDriver({ email, password, name });
      } catch (e) {
          // error
      } finally {
          setLoading(false);
      }
  };

  // Existing Driver Login
  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
          await login(email, password, undefined, 'AGENT');
      } catch (e) {
          // error
      } finally {
          setLoading(false);
      }
  };

  const navigateToStore = () => {
      window.location.href = getAppUrl('store');
  };

  // --- Render Logged In View ---
  if (driverUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col max-w-md mx-auto shadow-2xl relative">
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {driverUser.name.charAt(0)}
              </div>
              <div>
                  <h2 className="text-sm font-bold">Lumina Logistics</h2>
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Online
                  </div>
              </div>
          </div>
          <button onClick={() => { logout('AGENT'); }} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <LogOut className="w-4 h-4" />
          </button>
        </header>

        <main className="flex-1 p-4 overflow-y-auto pb-24">
            <DeliveryDashboard currentTab={currentTab} />
        </main>

        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around py-3 pb-6 z-50">
            <button onClick={() => setCurrentTab('jobs')} className={`flex flex-col items-center gap-1 text-xs font-medium ${currentTab === 'jobs' ? 'text-gray-900' : 'text-gray-400'}`}>
                <Box className={`w-6 h-6 ${currentTab === 'jobs' ? 'fill-gray-900' : ''}`} />
                Active Jobs
            </button>
            <button onClick={() => setCurrentTab('history')} className={`flex flex-col items-center gap-1 text-xs font-medium ${currentTab === 'history' ? 'text-gray-900' : 'text-gray-400'}`}>
                <CheckSquare className={`w-6 h-6 ${currentTab === 'history' ? 'fill-gray-900' : ''}`} />
                History
            </button>
        </nav>
      </div>
    );
  }

  // --- Render Auth Flows ---
  return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white">
          <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                      <Truck className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">Driver Partner</h2>
                  <p className="text-gray-400 mt-2">Lumina Logistics</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                  <AnimatePresence mode="wait">
                      
                      {/* Step 1: Email */}
                      {step === 'EMAIL' && (
                          <motion.form 
                            key="email"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSendOtp} 
                            className="space-y-4"
                          >
                              <div className="text-center mb-4">
                                  <h3 className="text-lg font-medium">Let's get started</h3>
                                  <p className="text-sm text-gray-400">Enter your email to verify account</p>
                              </div>
                              <Input 
                                className="bg-gray-900 border-gray-600 text-white"
                                placeholder="driver@lumina.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                              <Button className="w-full bg-blue-600 hover:bg-blue-700" isLoading={loading}>
                                  Verify Email
                              </Button>
                              <div className="mt-4 text-center">
                                  <button type="button" onClick={() => setStep('LOGIN_PASSWORD')} className="text-xs text-blue-400 hover:text-blue-300">
                                      Already have an account? Login
                                  </button>
                              </div>
                          </motion.form>
                      )}

                      {/* Step 2: OTP */}
                      {step === 'OTP' && (
                          <motion.form 
                            key="otp"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleVerifyOtp} 
                            className="space-y-4"
                          >
                              <div className="text-center mb-4">
                                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2"><ShieldCheck className="w-5 h-5 text-green-400"/></div>
                                  <h3 className="text-lg font-medium">Verify Identity</h3>
                                  <p className="text-sm text-gray-400">Enter code sent to {email}</p>
                              </div>
                              <Input 
                                className="bg-gray-900 border-gray-600 text-white text-center tracking-[0.5em] text-xl"
                                placeholder="000000"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                autoComplete="one-time-code" 
                                required
                              />
                              <Button className="w-full bg-blue-600 hover:bg-blue-700" isLoading={loading}>
                                  Verify
                              </Button>
                              <button type="button" onClick={() => setStep('EMAIL')} className="w-full text-sm text-gray-500 mt-2">Change Email</button>
                          </motion.form>
                      )}

                      {/* Step 3: Create Password */}
                      {step === 'PASSWORD_SETUP' && (
                          <motion.form 
                            key="pass"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            onSubmit={handlePasswordSetup} 
                            className="space-y-4"
                          >
                              <div className="text-center mb-4">
                                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2"><Lock className="w-5 h-5 text-blue-400"/></div>
                                  <h3 className="text-lg font-medium">Create Password</h3>
                                  <p className="text-sm text-gray-400">Secure your driver account</p>
                              </div>
                              <Input 
                                type="password"
                                className="bg-gray-900 border-gray-600 text-white"
                                placeholder="Create Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                  Next
                              </Button>
                          </motion.form>
                      )}

                      {/* Step 4: Details */}
                      {step === 'DETAILS' && (
                          <motion.form 
                            key="details"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleRegistration} 
                            className="space-y-4"
                          >
                              <div className="text-center mb-4">
                                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2"><User className="w-5 h-5 text-purple-400"/></div>
                                  <h3 className="text-lg font-medium">Profile Details</h3>
                                  <p className="text-sm text-gray-400">Finalize your registration</p>
                              </div>
                              <Input 
                                className="bg-gray-900 border-gray-600 text-white"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                              <Button className="w-full bg-green-600 hover:bg-green-700" isLoading={loading}>
                                  Complete Registration
                              </Button>
                          </motion.form>
                      )}

                      {/* Login Flow */}
                      {step === 'LOGIN_PASSWORD' && (
                          <motion.form 
                            key="login"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleLogin} 
                            className="space-y-4"
                          >
                              <div className="text-center mb-4">
                                  <h3 className="text-lg font-medium">Welcome Back</h3>
                                  <p className="text-sm text-gray-400">Login to access dashboard</p>
                              </div>
                              <Input 
                                className="bg-gray-900 border-gray-600 text-white"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                              <Input 
                                type="password"
                                className="bg-gray-900 border-gray-600 text-white"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                              <Button className="w-full bg-blue-600 hover:bg-blue-700" isLoading={loading}>
                                  Login
                              </Button>
                              <button type="button" onClick={() => setStep('EMAIL')} className="w-full text-sm text-gray-500 mt-2">
                                  Register new account
                              </button>
                          </motion.form>
                      )}

                  </AnimatePresence>
              </div>
              
              <div className="text-center mt-8">
                  <button onClick={navigateToStore} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                      <ChevronLeft className="w-4 h-4" /> Back to Store
                  </button>
              </div>
          </div>
      </div>
  );
};
