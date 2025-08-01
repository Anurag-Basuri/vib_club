import Transaction from '../models/Transaction.js';
import Ticket from '../models/ticket.model.js';
import createCashfreeOrder from '../services/cashFree.service.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { config } from 'dotenv';
config()

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { name, email, phone, amount, eventId, lpuId } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !amount || !lpuId) {
            throw new ApiError(400, 'Missing required fields: name, email, phone, amount, lpuId');
        }
        if (isNaN(amount) || amount <= 0) {
            throw new ApiError(400, 'Invalid amount');
        }

        // Check for duplicate ticket by email for this event
        const eventIdToUse = eventId || '68859a199ec482166f0e8523';
        const existingTicket = await Ticket.findOne({
            $or: [
            { email: email.trim() },
            { lpuId: lpuId.trim() }
            ],
            eventId: eventIdToUse
        });
        if (existingTicket) {
            throw new ApiError(409, 'A ticket has already been purchased with this email address or LPU ID for this event');
        }

        // Generate unique order and customer IDs
        const orderId = uuidv4() + '-' + Date.now();
        const customerId = uuidv4();

        // Check for duplicate orderId
        const existingOrder = await Transaction.findOne({ orderId });
        if (existingOrder) {
            throw new ApiError(409, 'Duplicate orderId — try again');
        }

        // Resolve event name for order note
        let resolvedEventName = 'RaveYard 2025';
        if (eventIdToUse) {
            const eventDoc = await Ticket.findOne({ eventId: eventIdToUse });
            if (eventDoc && eventDoc.eventName) {
                resolvedEventName = eventDoc.eventName;
            }
        }

        // Prepare Cashfree order payload
        const orderPayload = {
            orderId,
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
                customer_name: name,
                customer_id: customerId,
                customer_email: email,
                customer_phone: phone,
            },
            order_meta: {
                return_url: `${process.env.CASHFREE_RETURN_URL}?order_id=${orderId}`,
                notify_url: process.env.CASHFREE_NOTIFY_URL,
                payment_methods: "upi"
            },
            order_note: `${process.env.CASHFREE_BUSINESS_NAME || "Vibranta"} - ${resolvedEventName} - LPU ID: ${lpuId}`,
            order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        };

        // Create order with Cashfree
        const order = await createCashfreeOrder(orderPayload);

        // Check if order creation was successful
        if (!order || !order.payment_session_id) {
            throw new ApiError(500, 'Failed to create order with Cashfree');
        }

        // Create transaction record
        await Transaction.create({
            orderId: orderId,
            user: { name, email, phone, lpuId },
            amount: Number(amount),
            status: 'PENDING',
            paymentMethod: 'UPI',
            eventId: eventIdToUse,
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                order,
                'Order created successfully'
            )
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        console.error('Cashfree order error:', error);
        return res.status(500).json(new ApiResponse(500, null, 'Internal server error'));
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
    try {
        const { order_id } = req.query;
        let { fullName, email, LpuId, eventId, eventName } = req.body;

        if (!order_id) throw new ApiError(400, 'Missing order_id');

        // Fetch transaction
        let transaction = await Transaction.findOne({ orderId: order_id });
        if (!transaction) throw new ApiError(404, 'Transaction not found');

        // Use transaction data if not provided in request body
        if (!fullName && transaction.user?.name) {
            fullName = transaction.user.name;
        }
        if (!email && transaction.user?.email) {
            email = transaction.user.email;
        }
        if (!LpuId && transaction.lpuId) {
            LpuId = transaction.lpuId;
        }
        if (!eventId && transaction.eventId) {
            eventId = transaction.eventId;
        }
        if (!eventName && transaction.eventName) {
            eventName = transaction.eventName;
        } else if (!eventName) {
            eventName = 'RaveYard 2025'; // Default event name
        }

        // Already completed
        if (transaction.status === 'SUCCESS') {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    { transaction },
                    'Payment already verified'
                )
            );
        }

        // Verify with Cashfree
        let cashfreeResponse;
        try {
            console.log('Verifying payment with Cashfree for order:', order_id);
            console.log('Cashfree Base URL:', process.env.CASHFREE_BASE_URL);
            console.log('App ID:', process.env.CASHFREE_APP_ID ? 'Present' : 'Missing');
            console.log('Secret Key:', process.env.CASHFREE_SECRET_KEY ? 'Present' : 'Missing');
            
            // Use the same credentials as in the service
            const baseURL = process.env.CASHFREE_BASE_URL || 'https://sandbox.cashfree.com/pg';
            const clientId = process.env.CASHFREE_APP_ID;
            const clientSecret = process.env.CASHFREE_SECRET_KEY;
            
            cashfreeResponse = await axios.get(
                `${baseURL}/orders/${order_id}`,
                {
                    headers: {
                        'x-client-id': clientId,
                        'x-client-secret': clientSecret,
                        'x-api-version': '2022-09-01',
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                }
            );
            console.log('Cashfree verification response:', cashfreeResponse.data);
        } catch (err) {
            console.error('Cashfree verification error:', err.response?.data || err.message);
            console.error('Error status:', err.response?.status);
            console.error('Error headers:', err.response?.headers);
            throw new ApiError(502, `Failed to verify payment with Cashfree: ${err.response?.data?.message || err.message}`);
        }

        const status = cashfreeResponse.data.order_status;

        if (status === 'PAID') {
            transaction.status = 'SUCCESS';
            await transaction.save();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    { transaction },
                    'Payment verified successfully'
                )
            );
        } else if (status === 'ACTIVE') {
            return res.status(202).json(
                new ApiResponse(
                    202,
                    null,
                    'Payment is still processing. Try again shortly.'
                )
            );
        } else {
            transaction.status = 'FAILED';
            await transaction.save();
            return res.status(400).json(
                new ApiResponse(
                    400,
                    null,
                    `Payment failed or expired (${status})`
                )
            );
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(
                new ApiResponse(
                    error.statusCode,
                    null,
                    error.message
                )
            );
        }
        console.error('Verify payment error:', error);
        return res.status(500).json(
            new ApiResponse(
                500,
                null,
                'Internal server error'
            )
        );
    }
});

// Webhook handler for Cashfree payment notifications (CRITICAL for production)
const handleWebhook = asyncHandler(async (req, res) => {
    try {
        console.log('Received webhook:', req.body);
        
        const { order_id, payment_status, payment_amount, order_amount } = req.body;
        
        if (!order_id) {
            throw new ApiError(400, 'Missing order_id in webhook');
        }

        // Find transaction
        const transaction = await Transaction.findOne({ orderId: order_id });
        if (!transaction) {
            console.log(`Transaction not found for order: ${order_id}`);
            return res.status(200).json({ status: 'ok', message: 'Transaction not found' });
        }

        // Update transaction status based on webhook
        if (payment_status === 'SUCCESS' && payment_amount === order_amount) {
            transaction.status = 'SUCCESS';
            transaction.paymentDate = new Date();
            await transaction.save();
            
            console.log(`Payment successful for order: ${order_id}`);
            
            // TODO: Send confirmation email here
            // TODO: Generate ticket/QR code here
            
        } else if (payment_status === 'FAILED') {
            transaction.status = 'FAILED';
            await transaction.save();
            
            console.log(`Payment failed for order: ${order_id}`);
        }

        // Always respond with 200 to acknowledge webhook
        return res.status(200).json({ 
            status: 'ok', 
            message: 'Webhook processed successfully' 
        });
        
    } catch (error) {
        console.error('Webhook processing error:', error);
        // Still return 200 to prevent Cashfree retries
        return res.status(200).json({ 
            status: 'error', 
            message: 'Webhook processing failed' 
        });
    }
});

export default { createOrder, verifyPayment, handleWebhook };
