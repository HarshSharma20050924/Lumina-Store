
import { Request, Response } from 'express';
import prisma from '../config/db';
import { Prisma } from '@prisma/client';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req: Request, res: Response) => {
  if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod = 'ONLINE'
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      let itemsTotal = 0;
      const orderItemsData = [];

      for (const item of orderItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) throw new Error(`Product not found with id: ${item.productId}`);
        if (product.stock < item.quantity) throw new Error(`Insufficient stock for product: ${product.name}`);

        const price = product.discountPrice ?? product.price;
        itemsTotal += price * item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          price: price,
        });
      }

      const shippingPrice = itemsTotal > 200 ? 0 : 15;
      const taxPrice = itemsTotal * 0.08;
      const finalTotal = itemsTotal + shippingPrice + taxPrice;

      // NOTE: We do NOT generate deliveryCode here anymore. 
      // It is generated when driver arrives.

      const createdOrder = await tx.order.create({
        data: {
          userId: req.user!.id,
          total: finalTotal,
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          isPaid: paymentMethod === 'ONLINE',
          deliveryCode: null, // Explicitly null initially
          status: 'processing', // Ensure it starts as processing
          items: { create: orderItemsData },
          delivery: {
              create: {
                  status: 'ASSIGNED',
                  codAmount: paymentMethod === 'COD' ? finalTotal : 0
              }
          }
        },
        include: { items: true },
      });

      // --- TRIGGER NOTIFICATION: RECEIPT ---
      await tx.notification.create({
          data: {
              title: 'Order Confirmed',
              message: `Your order #${createdOrder.id.split('-')[0]} has been placed and is processing.`,
              userId: req.user!.id
          }
      });

      return createdOrder;
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error('[Order Error]', error);
    res.status(400).json({ message: error.message || 'Order creation failed' });
  }
};

// @desc    Driver arrived at location -> Generate OTP -> Notify User
// @route   POST /api/orders/:id/arrival
// @access  Agent
export const driverArrived = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        
        // 1. Generate 4-digit OTP
        const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();

        // 2. Update Order with OTP
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { deliveryCode }
        });

        // 3. Notify User
        if (order.userId) {
            await prisma.notification.create({
                data: {
                    title: 'Driver Arrived!',
                    message: `Your driver has arrived. Please share this delivery PIN: ${deliveryCode}`,
                    userId: order.userId
                }
            });
        }

        res.json({ message: 'Arrival confirmed. OTP sent to customer.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing arrival' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
            include: {
                product: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders (Driver View - HIDDEN OTP)
// @route   GET /api/orders
// @access  Private/Admin/Agent
export const getOrders = async (req: Request, res: Response) => {
  try {
    const isDriver = req.user?.role === 'AGENT';

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, phone: true },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (isDriver) {
        const sanitizedOrders = orders.map(order => {
            // Driver never sees the code via API
            const { deliveryCode, ...rest } = order;
            return rest;
        });
        return res.json(sanitizedOrders);
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, otp } = req.body;
    const orderId = req.params.id;
    
    // Server-side OTP Verification
    if (status === 'delivered') {
        const currentOrder = await prisma.order.findUnique({
            where: { id: orderId }
        });

        // Only check OTP if one was generated (which implies driver arrived)
        if (currentOrder?.deliveryCode) {
            if (!otp || otp !== currentOrder.deliveryCode) {
                return res.status(400).json({ message: 'Invalid Verification Code' });
            }
        }
    }
    
    console.log(`[Order Update] ${orderId} -> ${status}`);

    let dataToUpdate: any = { status };
    if (status === 'shipped') {
        const trackingNumber = `LUM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        dataToUpdate.trackingNumber = trackingNumber;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: dataToUpdate,
    });

    if (status === 'shipped') {
        await prisma.delivery.update({
            where: { orderId: orderId },
            data: { status: 'OUT_FOR_DELIVERY' }
        }).catch(err => console.log("No delivery record found or update failed"));
    }

    // --- TRIGGER NOTIFICATION: STATUS UPDATE ---
    let notifTitle = '';
    let notifMsg = '';

    if (status === 'shipped') {
        notifTitle = 'Order Shipped';
        notifMsg = `Your order #${orderId.split('-')[0]} is on its way! Track it in the app.`;
    } else if (status === 'delivered') {
        notifTitle = 'Order Delivered';
        notifMsg = `Package delivered successfully.`;
    }

    if (notifTitle && order.userId) {
        await prisma.notification.create({
            data: {
                title: notifTitle,
                message: notifMsg,
                userId: order.userId
            }
        });
    }

    res.json(order);
  } catch (error) {
    console.error('[Order Update Error]', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
