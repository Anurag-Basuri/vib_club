import Ticket from '../models/ticket.model.js';
import Event from '../models/event.model.js';
import Transaction from '../models/Transaction.js';
import createCashfreeOrder from '../services/cashFree.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { deleteFile } from '../utils/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import generateAndSendTicket from '../utils/generateAndSendTicket.js';

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

            // Move ticket generation and email to utility function
            const ticket = await generateAndSendTicket({
                fullName, email, LpuId, eventId, eventName,
            });

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
