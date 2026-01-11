
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Lock, ShieldCheck, Check, AlertTriangle, Eye, EyeOff, Apple, KeyRound } from 'lucide-react';
import { api } from '../api';

type LoginStep = 'EMAIL' | 'PASSWORD_LOGIN' | 'CREATE_PASSWORD' | 'VERIFY_OTP' | 'FORGOT_PASSWORD_EMAIL' | 'FORGOT_PASSWORD_OTP' | 'FORGOT_PASSWORD_RESET';

export const LoginModal = () => {
  const { isLoginOpen, toggleLoginModal, login, verifyOtp, sendOtp, validateOtp, addToast, socialLogin, resetPassword } = useStore();
  const [step, setStep] = useState<LoginStep>('EMAIL');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  // Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  // Password validation
  const passValidations = {
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*]/.test(password),
    match: password === confirmPass && password.length > 0
  };
  const isStrongPass = Object.values(passValidations).every(Boolean);

  // WebOTP API hook
  useEffect(() => {
    if ((step === 'VERIFY_OTP' || step === 'FORGOT_PASSWORD_OTP') && 'credentials' in navigator) {
        const ac = new AbortController();
        navigator.credentials.get({
            otp: { transport: ['sms'] },
            signal: ac.signal
        } as any).then((otpCredential: any) => {
            if (otpCredential) setOtp(otpCredential.code);
        }).catch((err: any) => {
            console.debug('WebOTP error or abort', err);
        });
        return () => ac.abort();
    }
  }, [step]);

  const resetForm = () => {
      setEmail('');
      setPassword('');
      setConfirmPass('');
      setName('');
      setOtp('');
      setStep('EMAIL');
      setIsLoading(false);
  };

  const handleClose = () => {
      toggleLoginModal(false);
      setTimeout(resetForm, 300);
  };

  const checkEmail = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.includes('@')) return addToast({ type: 'error', message: 'Invalid email' });
      
      setIsLoading(true);
      try {
          const res = await api.post('/auth/check-email', { email });
          if (res.exists) {
              setStep('PASSWORD_LOGIN');
          } else {
              setStep('CREATE_PASSWORD');
          }
      } catch (e) {
          addToast({ type: 'error', message: 'Something went wrong' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          await login(email, password);
          handleClose();
      } catch (e) {
          // Error handled in store
      } finally {
          setIsLoading(false);
      }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isStrongPass) return;
      
      setIsLoading(true);
      try {
          if(!name) setName(email.split('@')[0]);
          await sendOtp(email);
          setStep('VERIFY_OTP');
      } catch (e) {
          addToast({ type: 'error', message: 'Failed to send OTP' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleVerifyRegistration = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          await verifyOtp(email, otp, password, name);
          handleClose();
      } catch (e) {
          // Error in store
      } finally {
          setIsLoading(false);
      }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          await sendOtp(email);
          setStep('FORGOT_PASSWORD_OTP');
      } catch (e) {
          addToast({ type: 'error', message: 'User not found or failed to send OTP' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          const isValid = await validateOtp(email, otp);
          if (isValid) {
              setStep('FORGOT_PASSWORD_RESET');
          }
      } catch (e) {
          // Toast handled in store
      } finally {
          setIsLoading(false);
      }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isStrongPass) return;
      setIsLoading(true);
      try {
          await resetPassword(email, otp, password);
          // Store resets view but keeps modal open to login, let's close and reset properly
          setStep('PASSWORD_LOGIN');
          setPassword('');
      } catch (e) {
          // Error handled in store
      } finally {
          setIsLoading(false);
      }
  };

  const handleSocial = async (provider: 'google' | 'apple') => {
      try {
          await socialLogin(provider);
          handleClose();
      } catch(e) {
          // handled
      }
  };

  return (
    <Modal isOpen={isLoginOpen} onClose={handleClose} showCloseButton={true}>
      <div className="p-8">
        <AnimatePresence mode="wait">
            
            {/* STEP 1: EMAIL */}
            {step === 'EMAIL' && (
                <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900">Welcome to Lumina</h3>
                        <p className="text-gray-500 mt-2">Enter your email to continue</p>
                    </div>
                    <form onSubmit={checkEmail} className="space-y-4">
                        <Input 
                            type="email" 
                            label="Email Address"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                            required
                        />
                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleSocial('google')}
                            className="flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Google
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleSocial('apple')}
                            className="flex items-center gap-2"
                        >
                            <Apple className="w-4 h-4" />
                            Apple
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* STEP 2A: EXISTING USER LOGIN */}
            {step === 'PASSWORD_LOGIN' && (
                <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Welcome back</h3>
                        <p className="text-sm text-gray-500 mt-1">{email}</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Input 
                                type={showPass ? "text" : "password"}
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                                {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={() => setStep('FORGOT_PASSWORD_EMAIL')} className="text-xs text-primary-600 hover:underline">Forgot password?</button>
                        </div>
                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Log In
                        </Button>
                        <button type="button" onClick={() => setStep('EMAIL')} className="w-full text-sm text-gray-500 mt-4">Back</button>
                    </form>
                </motion.div>
            )}

            {/* FORGOT PASSWORD: EMAIL */}
            {step === 'FORGOT_PASSWORD_EMAIL' && (
                <motion.div
                    key="forgot-email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <KeyRound className="w-6 h-6 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                        <p className="text-sm text-gray-500 mt-2">Enter your email to receive a reset code.</p>
                    </div>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <Input 
                            type="email" 
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly
                            className="bg-gray-50"
                        />
                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Send Reset Code
                        </Button>
                        <button type="button" onClick={() => setStep('PASSWORD_LOGIN')} className="w-full text-sm text-gray-500 mt-4">Back to Login</button>
                    </form>
                </motion.div>
            )}

            {/* FORGOT PASSWORD: OTP */}
            {step === 'FORGOT_PASSWORD_OTP' && (
                <motion.div
                    key="forgot-otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900">Verify Code</h3>
                        <p className="text-sm text-gray-500">Code sent to {email}</p>
                    </div>
                    <form onSubmit={handleVerifyResetOtp} className="space-y-4">
                        <Input 
                            label="Verification Code"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="text-center tracking-[0.5em] text-lg font-mono"
                            maxLength={6}
                            autoComplete="one-time-code"
                            required
                            autoFocus
                        />
                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Verify Code
                        </Button>
                        <button type="button" onClick={() => setStep('FORGOT_PASSWORD_EMAIL')} className="w-full text-sm text-gray-500 mt-4">Resend Code</button>
                    </form>
                </motion.div>
            )}

            {/* FORGOT PASSWORD: NEW PASS */}
            {step === 'FORGOT_PASSWORD_RESET' && (
                <motion.div
                    key="reset-pass"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900">Set New Password</h3>
                        <p className="text-sm text-gray-500">Enter your new strong password</p>
                    </div>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="relative">
                            <Input 
                                type={showPass ? "text" : "password"}
                                label="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoFocus
                            />
                             <button 
                                type="button" 
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                                {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                        <Input 
                            type="password"
                            label="Confirm Password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required
                        />

                        {/* Strength Indicators */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className={`flex items-center gap-1 ${passValidations.length ? 'text-green-600' : 'text-gray-400'}`}>
                                {passValidations.length ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />} 8+ Characters
                            </div>
                            <div className={`flex items-center gap-1 ${passValidations.capital ? 'text-green-600' : 'text-gray-400'}`}>
                                {passValidations.capital ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />} 1 Uppercase
                            </div>
                            <div className={`flex items-center gap-1 ${passValidations.number ? 'text-green-600' : 'text-gray-400'}`}>
                                {passValidations.number ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />} 1 Number
                            </div>
                            <div className={`flex items-center gap-1 ${passValidations.symbol ? 'text-green-600' : 'text-gray-400'}`}>
                                {passValidations.symbol ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />} 1 Symbol
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={!isStrongPass} isLoading={isLoading}>
                            Reset Password
                        </Button>
                    </form>
                </motion.div>
            )}

            {/* STEP 2B: NEW USER CREATE PASSWORD */}
            {step === 'CREATE_PASSWORD' && (
                <motion.div
                    key="create-pass"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900">Create Account</h3>
                        <p className="text-sm text-gray-500">Set a strong password for {email}</p>
                    </div>
                    <form onSubmit={handleCreatePassword} className="space-y-4">
                        <Input 
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <div className="relative">
                            <Input 
                                type={showPass ? "text" : "password"}
                                label="Create Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                             <button 
                                type="button" 
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                                {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                        <Input 
                            type="password"
                            label="Confirm Password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required
                        />

                        {/* Password Strength Indicators */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className={`flex items-center gap-1 ${passValidations.length ? 'text-green-600' : 'text-gray-400'}`}>
                                {passValidations.length ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />} 8+ Characters
                            </div>
                            <div className={`flex items-center gap-1 ${passValidations.capital ? 'text-green-600' : 'text-gray-400'}`}>
                                {passValidations.capital ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />} 1 Uppercase
                            </div>
                            <div className={`flex items-center gap-1 ${passValidations.number ? 'text-green-600' : 'text-gray-400'}`}>
                                {passValidations.number ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />} 1 Number
                            </div>
                            <div className={`flex items-center gap-1 ${passValidations.symbol ? 'text-green-600' : 'text-gray-400'}`}>
                                {passValidations.symbol ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />} 1 Symbol
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={!isStrongPass} isLoading={isLoading}>
                            Send Verification OTP
                        </Button>
                        <button type="button" onClick={() => setStep('EMAIL')} className="w-full text-sm text-gray-500 mt-4">Back</button>
                    </form>
                </motion.div>
            )}

            {/* STEP 3: VERIFY OTP (REGISTRATION) */}
            {step === 'VERIFY_OTP' && (
                <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-6 h-6 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Check your inbox</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            We sent a verification code to <span className="font-medium text-gray-900">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerifyRegistration} className="space-y-4">
                        <Input 
                            label="Verification Code"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="text-center tracking-[0.5em] text-lg font-mono"
                            maxLength={6}
                            autoComplete="one-time-code"
                            autoFocus
                        />
                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Verify & Create Account
                        </Button>
                    </form>
                    
                    <button onClick={() => setStep('CREATE_PASSWORD')} className="w-full text-sm text-gray-500 hover:text-gray-900">
                        Back
                    </button>
                </motion.div>
            )}

        </AnimatePresence>
      </div>
    </Modal>
  );
};
