import Ticket from '../models/ticket.model.js';
import Event from '../models/event.model.js';
import Transaction from '../models/Transaction.js';
import createCashfreeOrder from '../services/cashFree.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { generateTicketQR } from '../services/qrcode.service.js';
import { sendRegistrationEmail } from '../services/email.service.js';
import { deleteFile } from '../utils/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { name, email, phone, amount } = req.body;

        // Basic validation
        if (!name || !email || !phone || !amount) {
            throw new ApiError(400, 'Missing required fields: name, email, phone, amount');
        }
        if (isNaN(amount) || amount <= 0) {
            throw new ApiError(400, 'Invalid amount');
        }

        const order_id = uuidv4();

        const orderPayload = {
            order_id,
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
                customer_email: email,
                customer_phone: phone,
            },
            order_meta: {
                return_url: `${process.env.CASHFREE_RETURN_URL}?order_id=${order_id}`,
                notify_url: process.env.CASHFREE_NOTIFY_URL,
            },
            payment_method: 'UPI',
        };

        // Create order with Cashfree
        const order = await createCashfreeOrder(orderPayload);

        // Save transaction in DB
        await Transaction.create({
            orderId: order_id,
            user: { name, email },
            amount,
            status: 'PENDING',
            paymentMethod: 'UPI',
        });

        return res.status(200).json(
            new ApiResponse({
                success: true,
                data: { order },
                message: 'Order created successfully',
            })
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse({
                success: false,
                message: error.message,
            }));
        }
        console.error('Cashfree order error:', error);
        return res.status(500).json(new ApiResponse({
            success: false,
            message: 'Internal server error',
        }));
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
    try {
        const { order_id } = req.query;
        const { fullName, email, LpuId, eventId, eventName } = req.body;

        if (!order_id) throw new ApiError(400, 'Missing order_id');

        // Fetch transaction
        const transaction = await Transaction.findOne({ orderId: order_id });
        if (!transaction) throw new ApiError(404, 'Transaction not found');

        // Already completed
        if (transaction.status === 'SUCCESS') {
            return res.status(200).json(new ApiResponse({
                success: true,
                message: 'Payment already verified',
                data: { transaction },
            }));
        }

        // Verify with Cashfree
        let cashfreeResponse;
        try {
            cashfreeResponse = await axios.get(
                `${process.env.CASHFREE_BASE_URL}/orders/${order_id}`,
                {
                    headers: {
                        'x-client-id': process.env.CASHFREE_CLIENT_ID,
                        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
                    },
                }
            );
        } catch (err) {
            throw new ApiError(502, 'Failed to verify payment with Cashfree');
        }

        const status = cashfreeResponse.data.order_status;

        if (status === 'PAID') {
            transaction.status = 'SUCCESS';
            await transaction.save();

            // Validate ticket fields
            if (!fullName || !email || !LpuId || !eventId || !eventName) {
                throw new ApiError(400, 'All ticket fields are required');
            }

            const event = await Event.findById(eventId);
            if (!event) throw new ApiError(404, 'Event not found');

            const existingTicket = await Ticket.findOne({ LpuId, eventId });
            if (existingTicket) throw new ApiError(409, 'Already registered for this event');

            const ticket = new Ticket({
                ticketId: uuidv4(),
                fullName,
                email,
                LpuId,
                eventId,
                eventName,
                isUsed: false,
                isCancelled: false,
            });

            await ticket.save();

            // Generate QR code
            let qrCode;
            try {
                qrCode = await generateTicketQR(ticket.ticketId);
                if (!qrCode?.url || !qrCode?.public_id) throw new Error('Invalid QR code generated');
                ticket.qrCode = { url: qrCode.url, publicId: qrCode.public_id };
                await ticket.save();
            } catch (qrErr) {
                await Ticket.findByIdAndDelete(ticket._id);
                if (qrCode?.public_id && qrCode.url) {
                    await deleteFile({ public_id: qrCode.public_id, resource_type: 'image' });
                }
                throw new ApiError(500, 'Failed to generate QR code for the ticket');
            }

            // Send registration email
            try {
                await sendRegistrationEmail({
                    to: email,
                    name: fullName,
                    eventName: event.name,
                    eventDate: event.date,
                    qrUrl: qrCode.url,
                });
            } catch (emailErr) {
                await Ticket.findByIdAndDelete(ticket._id);
                if (qrCode?.public_id && qrCode.url) {
                    await deleteFile({ public_id: qrCode.public_id, resource_type: 'image' });
                }
                throw new ApiError(500, 'Failed to send registration email, ticket deleted');
            }

            return res.status(200).json(new ApiResponse({
                success: true,
                data: { transaction, ticket },
                message: 'Payment verified and ticket created successfully',
            }));
        } else if (status === 'ACTIVE') {
            return res.status(202).json(new ApiResponse({
                success: false,
                message: 'Payment is still processing. Try again shortly.',
            }));
        } else {
            transaction.status = 'FAILED';
            await transaction.save();
            return res.status(400).json(new ApiResponse({
                success: false,
                message: `Payment failed or expired (${status})`,
            }));
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse({
                success: false,
                message: error.message,
            }));
        }
        console.error('Verify payment error:', error);
        return res.status(500).json(new ApiResponse({
            success: false,
            message: 'Internal server error',
        }));
    }
});

export default { createOrder, verifyPayment };
