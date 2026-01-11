
import { Request, Response } from 'express';
import prisma from '../config/db';

// @desc    Get user analytics for admin
// @route   GET /api/notifications/analytics
// @access  Admin
export const getUserAnalytics = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            include: {
                orders: {
                    include: {
                        items: {
                            include: {
                                product: { select: { category: true, gender: true } }
                            }
                        }
                    }
                }
            }
        });

        // Transform data
        const analytics = users.map(user => {
            let totalSpent = 0;
            const categoryCounts: Record<string, number> = {};
            
            user.orders.forEach(order => {
                totalSpent += order.total;
                order.items.forEach(item => {
                    const cat = item.product.category;
                    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                });
            });

            // Find top category
            let topCategory = 'None';
            let maxCount = 0;
            Object.entries(categoryCounts).forEach(([cat, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    topCategory = cat;
                }
            });

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                totalOrders: user.orders.length,
                totalSpent,
                topCategory
            };
        });

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics' });
    }
};

// @desc    Get Smart Campaigns (AI Generated Suggestions)
// @route   GET /api/notifications/smart-campaigns
// @access  Admin
export const getSmartCampaigns = async (req: Request, res: Response) => {
    try {
        // Fetch all orders with products
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } }
        });

        const interestGroups: Record<string, Set<string>> = {};

        // Analyze purchases to group users by interest (e.g., "Men's Jackets")
        orders.forEach(order => {
            if(!order.userId) return;
            order.items.forEach(item => {
                const key = `${item.product.gender || 'General'} ${item.product.category}`;
                if (!interestGroups[key]) interestGroups[key] = new Set();
                interestGroups[key].add(order.userId);
            });
        });

        // Generate Campaign Cards
        const campaigns = Object.keys(interestGroups)
            .filter(key => interestGroups[key].size > 0) // Only relevant groups
            .map(key => {
                const userCount = interestGroups[key].size;
                return {
                    id: `camp-${Math.random().toString(36).substr(2, 9)}`,
                    segment: key, // e.g., "Men Outerwear"
                    userCount,
                    suggestedTitle: `New in ${key}`,
                    suggestedMessage: `Hey! We noticed you love ${key}. Check out the new arrivals just for you.`,
                    targetUserIds: Array.from(interestGroups[key])
                };
            })
            .sort((a, b) => b.userCount - a.userCount) // Sort by impact
            .slice(0, 5); // Top 5 suggestions

        res.json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate campaigns' });
    }
};

// @desc    Send a notification
// @route   POST /api/notifications/send
// @access  Admin
export const sendNotification = async (req: Request, res: Response) => {
    try {
        const { title, message, userId, userIds } = req.body;
        console.log(`[Notification] Request: "${title}"`);

        if (userId === 'all') {
            await prisma.notification.create({
                data: { title, message, userId: null } // Broadcast
            });
        } else if (userIds && Array.isArray(userIds)) {
            // Bulk Send (Smart Campaign)
            await prisma.notification.createMany({
                data: userIds.map((uid: string) => ({
                    title,
                    message,
                    userId: uid
                }))
            });
        } else {
            // Single User
            await prisma.notification.create({
                data: { title, message, userId }
            });
        }

        res.json({ message: 'Notification queued successfully' });
    } catch (error) {
        console.error("[Notification Error]", error);
        res.status(500).json({ message: 'Error sending notification' });
    }
};

// @desc    Poll for new notifications
// @route   GET /api/notifications/poll
// @access  Private
export const pollNotifications = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({message: 'Auth required'});

        // Get unread notifications for this user OR broadcasts created in the last minute
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

        const notifs = await prisma.notification.findMany({
            where: {
                OR: [
                    { userId: req.user.id, isRead: false },
                    { userId: null, createdAt: { gt: oneMinuteAgo } } 
                ]
            },
            orderBy: { createdAt: 'desc' }
        });

        // Mark user-specific ones as read
        const userNotifIds = notifs.filter(n => n.userId === req.user!.id).map(n => n.id);
        if (userNotifIds.length > 0) {
            await prisma.notification.updateMany({
                where: { id: { in: userNotifIds } },
                data: { isRead: true }
            });
        }

        res.json(notifs);
    } catch (error) {
        res.json([]);
    }
};

// @desc    Get my notifications history
// @route   GET /api/notifications/my
// @access  Private
export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({message: 'Auth required'});

        const notifs = await prisma.notification.findMany({
            where: {
                OR: [
                    { userId: req.user.id },
                    { userId: null }
                ],
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        res.json(notifs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};
