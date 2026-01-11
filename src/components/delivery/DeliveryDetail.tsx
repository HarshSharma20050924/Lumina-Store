
import React, { useState } from 'react';
import { ChevronLeft, Phone, Navigation, Camera, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { DeliveryJob } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useStore } from '../../store';

interface Props {
    job: DeliveryJob;
    onBack: () => void;
}

export const DeliveryDetail = ({ job, onBack }: Props) => {
    const { completeDelivery, addToast, notifyArrival } = useStore();
    const [step, setStep] = useState<'details' | 'verify'>('details');
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNotifying, setIsNotifying] = useState(false);
    const [proofPhoto, setProofPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);

    const handleArrived = async () => {
        setIsNotifying(true);
        try {
            await notifyArrival(job.id);
            setStep('verify');
        } catch (e) {
            // Toast handled in store
        } finally {
            setIsNotifying(false);
        }
    };

    const handleConfirm = async () => {
        if (otp.length !== 4) {
            addToast({ type: 'error', message: 'Please enter valid 4-digit code' });
            return;
        }
        setIsSubmitting(true);
        try {
            await completeDelivery(job.id, otp, proofPhoto);
            onBack();
        } catch (e: any) {
            addToast({ type: 'error', message: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProofPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        try {
            // Re-trigger arrival to resend code
            await notifyArrival(job.id);
        } catch (e) {
            addToast({ type: 'error', message: 'Failed to resend code' });
        } finally {
            setIsResending(false);
        }
    };

    const getMaskedPhone = () => {
        if (!job.customerPhone) return '****';
        return '******' + job.customerPhone.slice(-4);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Nav */}
            <div className="flex items-center gap-2 mb-4">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-200 rounded-full">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h3 className="font-bold text-lg">Order #{job.id.split('-')[0]}</h3>
            </div>

            {step === 'details' ? (
                <>
                    {/* Map Placeholder */}
                    <div className="h-48 bg-gray-300 rounded-xl mb-6 relative overflow-hidden group border border-gray-200 shadow-inner">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium">
                            Map Visualization
                        </div>
                        {/* Mock Route Line */}
                        <svg className="absolute inset-0 w-full h-full stroke-blue-500 stroke-[4] fill-none opacity-50">
                            <path d="M50 150 Q 150 50 300 100" />
                        </svg>
                        <div className="absolute bottom-4 right-4">
                            <button 
                                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(job.shippingAddress)}`)}
                                className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm"
                            >
                                <Navigation className="w-4 h-4" /> Start Navigation
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4 mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Customer</p>
                                <h4 className="font-bold text-lg">{job.customerName || 'Guest Customer'}</h4>
                                {job.customerPhone && (
                                    <p className="text-xs text-gray-400 mt-1">{getMaskedPhone()}</p>
                                )}
                            </div>
                            <a href={`tel:${job.customerPhone || ''}`} className="bg-green-100 p-3 rounded-full text-green-700 hover:bg-green-200 transition-colors">
                                <Phone className="w-5 h-5" />
                            </a>
                        </div>
                        <div className="border-t border-gray-50 pt-2">
                            <p className="text-sm text-gray-500">Delivery Address</p>
                            <p className="font-medium">{job.shippingAddress}</p>
                        </div>
                    </div>

                    {/* Payment Warning */}
                    {job.codAmount > 0 && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6 flex items-center gap-3 animate-pulse">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <div>
                                <p className="font-bold text-red-900">Collect Payment</p>
                                <p className="text-red-700 text-sm">Amount: ${job.codAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-auto">
                        <Button 
                            className="w-full h-14 text-lg shadow-lg" 
                            onClick={handleArrived}
                            isLoading={isNotifying}
                        >
                            Arrived at Location
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-6">Proof of Delivery</h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <label className="font-medium text-gray-700 flex justify-between">
                                Verification Code
                                <button 
                                    onClick={handleResendOtp} 
                                    disabled={isResending}
                                    className="text-xs text-blue-600 font-medium flex items-center gap-1"
                                >
                                    <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} /> Resend to {getMaskedPhone()}
                                </button>
                            </label>
                            <Input 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="0000"
                                className="text-center text-2xl tracking-[0.5em] h-14 font-mono"
                                maxLength={4}
                                type="tel"
                            />
                            <p className="text-xs text-gray-500 text-center">
                                Ask customer for the 4-digit code sent to their mobile number {getMaskedPhone()}.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="font-medium text-gray-700 block">Photo Proof (Optional)</label>
                            <label className={`border-2 border-dashed ${photoPreview ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'} rounded-xl h-48 flex flex-col items-center justify-center text-gray-500 cursor-pointer overflow-hidden relative transition-colors`}>
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Proof" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Camera className="w-8 h-8 mb-2" />
                                        <span className="text-sm font-medium">Tap to Capture</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    capture="environment" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                                {photoPreview && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <span className="text-white font-medium">Retake</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p>By confirming, you certify that the package was delivered to the correct address and payment (if any) was collected.</p>
                        </div>
                        <Button 
                            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-lg" 
                            onClick={handleConfirm}
                            isLoading={isSubmitting}
                            disabled={otp.length !== 4}
                        >
                            Confirm Delivery
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
