import Transaction from '../models/Transaction.js';
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
        const { name, email, phone, amount, upiId, lpuId, eventId, eventName } = req.body;

        if (!name || !email || !phone || !amount || !upiId || !lpuId) {
            throw new ApiError(400, 'Missing required fields: name, email, phone, amount, upiId, and lpuId');
        }
        if (isNaN(amount) || amount <= 0) {
            throw new ApiError(400, 'Invalid amount');
        }
        if (isNaN(lpuId)) {
            throw new ApiError(400, 'LPU ID must be a valid number');
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
            },
            // The payment_methods object is the correct way to specify UPI Collect
            payment_methods: {
                upi: {
                    channel: 'collect',
                    upi_id: upiId // Use the ID provided by the user
                }
            }
        };

        // Create order with Cashfree
        const order = await createCashfreeOrder(orderPayload);

        // -> Change #4: Add upiId when creating the transaction record
        await Transaction.create({
            orderId: order_id,
            user: { name, email },
            amount,
            status: 'PENDING',
            paymentMethod: 'UPI',
            upiId: upiId, // Add the missing field here
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

export default { createOrder, verifyPayment };
