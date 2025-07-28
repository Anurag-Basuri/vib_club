import express from 'express';
import cashFreeController from '../controllers/cashFree.controller.js';

const router = express.Router();

// Create a new Cashfree order
router.post('/order', cashFreeController.createOrder);

// Verify payment and generate ticket
router.post('/verify', cashFreeController.verifyPayment);

export default router;