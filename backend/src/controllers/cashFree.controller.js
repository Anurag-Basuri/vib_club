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
        const { name, email, phone, amount, lpuId, eventId, eventName } = req.body;

        if (!name || !email || !phone || !amount || !lpuId) {
            throw new ApiError(400, 'Missing required fields: name, email, phone, amount, and lpuId');
        }
        if (isNaN(amount) || amount <= 0) {
            throw new ApiError(400, 'Invalid amount');
        }
        if (isNaN(lpuId)) {
            throw new ApiError(400, 'LPU ID must be a valid number');
        }

        // Check if email already exists in tickets for this event
        const existingTicketByEmail = await Ticket.findOne({ 
            email: email.toLowerCase().trim(),
            eventId: eventId || 'event_raveyard_2025' 
        });

        if (existingTicketByEmail) {
            throw new ApiError(409, 'A ticket has already been purchased with this email address for this event');
        }

        // Check if LPU ID already exists in tickets for this event
        const existingTicketByLpu = await Ticket.findOne({ 
            LpuId: parseInt(lpuId),
            eventId: eventId || 'event_raveyard_2025' 
        });
        
        if (existingTicketByLpu) {
            throw new ApiError(409, 'A ticket has already been purchased with this LPU ID for this event');
        }

        const order_id = uuidv4();

        // Check for duplicate order_id
        const existing = await Transaction.findOne({ orderId: order_id });
        if (existing) {
            throw new ApiError(409, 'Duplicate orderId — try again');
        }
        const customer_id = uuidv4();

        const orderPayload = {
            order_id,
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
                customer_name: name, 
                customer_id,
                customer_email: email,
                customer_phone: phone,
            },
            order_meta: {
                return_url: `${process.env.CASHFREE_RETURN_URL}?order_id=${order_id}`,
                notify_url: process.env.CASHFREE_NOTIFY_URL,
                payment_methods: "upi,nb,cc,dc,app"
            },
            order_note: `${process.env.CASHFREE_BUSINESS_NAME || "Vibranta Student Organization"} - Payment for ${eventName || 'RaveYard 2025'} - LPU ID: ${lpuId}`,
            order_tags: {
                event_id: eventId,
                lpu_id: lpuId.toString(),
                event_name: eventName,
                payment_for: "event_ticket",
                business_name: process.env.CASHFREE_BUSINESS_NAME || "Vibranta Student Organization",
                business_description: process.env.CASHFREE_BUSINESS_DESCRIPTION || "Official Student Organization - LPU",
                merchant_name: "Vibranta Student Organization",
                organization: "LPU",
                event_title: "RaveYard 2025"
            },
            // Terminal data for web checkout
            terminal_data: {
                terminal_type: "WEB",
                terminal_id: "vibranta_web_terminal"
            },
            // Order expiry (30 minutes - more than 15 min requirement)
            order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        };

        // Create order with Cashfree
        const order = await createCashfreeOrder(orderPayload);

        // Create transaction record with multiple payment options
        await Transaction.create({
            orderId: order_id,
            user: { name, email },
            amount,
            status: 'PENDING',
            paymentMethod: 'MULTIPLE_OPTIONS', // Updated to support all payment methods
            lpuId: parseInt(lpuId), // Ensure lpuId is stored as number
            eventId: eventId || 'event_raveyard_2025',
            eventName: eventName || 'RaveYard 2025'
        });

        return res.status(200).json(
            new ApiResponse(
                200, // Status code should be first argument
                 order ,
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
