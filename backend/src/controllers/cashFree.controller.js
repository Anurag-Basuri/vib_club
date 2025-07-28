import express from "express";
import Transaction from "../models/Transaction.js";
import createCashfreeOrder from "../services/cashFree.service";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { createTicket } from "../controllers/ticket.controller.js"
import { v4 as uuidv4 } from "uuid";

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { name, email, phone, amount } = req.body;

        // Basic validation
        if (!name || !email || !phone || !amount) {
            throw new ApiError(400, "Missing required fields: name, email, phone, amount");
        }
        if (isNaN(amount) || amount <= 0) {
            throw new ApiError(400, "Invalid amount");
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

        // Save transaction in DB (optional, but recommended)
        await Transaction.create({
            orderId: order_id,
            user: { name, email },
            amount,
            status: 'PENDING',
            paymentMethod: 'UPI',
        });

		return res
		.status(200).json(
            new ApiResponse({
			success: true,
			data: { order },
			message: "Order created successfully"
		}));
    } catch (error) {
        // Improved error handling
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        console.error("Cashfree order error:", error);
        return res
        .status(500)
        .json(
            new ApiResponse(
                { success: false,
                message: "Internal server error"
            })
        );
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
	const { order_id } = req.query;

	if (!order_id) {
		throw new ApiError(400, 'Missing order_id');
	}

	// Step 1: Fetch transaction from DB
	const transaction = await Transaction.findOne({ orderId: order_id });

	if (!transaction) {
		throw new ApiError(404, 'Transaction not found');
	}

	// Step 2: Check if already completed
	if (transaction.status === 'SUCCESS') {
		return res.status(200).json({
			success: true,
			message: 'Payment already verified',
			transaction,
		});
	}

});


export default { createOrder };