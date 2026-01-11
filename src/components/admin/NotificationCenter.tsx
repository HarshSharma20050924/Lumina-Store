
import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Bell, Users, TrendingUp, Send, Target, Sparkles, Megaphone } from 'lucide-react';
import { useStore } from '../../store';

interface SmartCampaign {
    id: string;
    segment: string;
    userCount: number;
    suggestedTitle: string;
    suggestedMessage: string;
    targetUserIds: string[];
}

export const NotificationCenter = () => {
    const { addToast } = useStore();
    const [smartCampaigns, setSmartCampaigns] = useState<SmartCampaign[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Custom Send State
    const [customTitle, setCustomTitle] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchSmartCampaigns();
    }, []);

    const fetchSmartCampaigns = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/notifications/smart-campaigns', 'admin');
            setSmartCampaigns(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendCampaign = async (campaign: SmartCampaign) => {
        if (!confirm(`Send "${campaign.suggestedTitle}" to ${campaign.userCount} users?`)) return;
        
        try {
            await api.post('/notifications/send', { 
                title: campaign.suggestedTitle, 
                message: campaign.suggestedMessage, 
                userIds: campaign.targetUserIds // Send array of IDs for bulk create
            }, 'admin');
            addToast({ type: 'success', message: `Campaign sent to ${campaign.userCount} users!` });
        } catch (e) {
            addToast({ type: 'error', message: 'Failed to send campaign' });
        }
    };

    const handleSendBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            await api.post('/notifications/send', { 
                title: customTitle, 
                message: customMessage, 
                userId: 'all' 
            }, 'admin');
            
            addToast({ type: 'success', message: 'Broadcast Sent Successfully' });
            setCustomTitle('');
            setCustomMessage('');
        } catch (e) {
            addToast({ type: 'error', message: 'Failed to send broadcast' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Smart Campaigns Column */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" /> Smart Segments
                    </h3>
                    <Button variant="outline" size="sm" onClick={fetchSmartCampaigns} isLoading={isLoading}>
                        Refresh Analysis
                    </Button>
                </div>
                
                <p className="text-gray-500 text-sm">
                    AI-driven campaign suggestions based on recent user purchase history.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {smartCampaigns.map(camp => (
                        <div key={camp.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Target className="w-24 h-24 text-purple-600" />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {camp.segment}
                                    </span>
                                    <span className="flex items-center text-gray-500 text-sm">
                                        <Users className="w-4 h-4 mr-1" /> {camp.userCount} Users
                                    </span>
                                </div>

                                <h4 className="font-bold text-gray-900 mb-1">{camp.suggestedTitle}</h4>
                                <p className="text-sm text-gray-600 mb-6 line-clamp-2">{camp.suggestedMessage}</p>

                                <Button onClick={() => handleSendCampaign(camp)} className="w-full bg-gray-900 hover:bg-black text-white">
                                    <Send className="w-3 h-3 mr-2" /> Launch Campaign
                                </Button>
                            </div>
                        </div>
                    ))}
                    
                    {smartCampaigns.length === 0 && !isLoading && (
                        <div className="col-span-2 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                            Not enough data to generate smart segments yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Manual Broadcast Column */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-blue-600" /> Global Broadcast
                    </h3>
                    <p className="text-xs text-gray-500 mb-6">
                        Send a push notification to all registered users immediately.
                    </p>
                    
                    <form onSubmit={handleSendBroadcast} className="space-y-4">
                        <Input 
                            label="Notification Title" 
                            placeholder="e.g., Flash Sale 50% Off" 
                            value={customTitle} 
                            onChange={e => setCustomTitle(e.target.value)} 
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
                            <textarea 
                                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black outline-none h-24"
                                placeholder="Limited time offer starts now..."
                                value={customMessage}
                                onChange={e => setCustomMessage(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" isLoading={isSending}>
                            <Send className="w-4 h-4 mr-2" /> Send Broadcast
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Preview</p>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-start gap-3">
                            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white font-serif text-sm">L</div>
                            <div>
                                <p className="font-bold text-sm text-gray-900">{customTitle || 'Title'}</p>
                                <p className="text-xs text-gray-600">{customMessage || 'Message content...'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
