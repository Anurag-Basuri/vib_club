import { Router } from 'express';
import {
    createTicket,
    getTicketById,
    updateTicketStatus,
    getTicketsByEvent,
    deleteTicket
} from '../controllers/ticket.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { body, param } from 'express-validator';

const router = Router();

// Create a new ticket (public, with rate limit)
router.post(
    '/create',
    validate([
        body('fullName').notEmpty().withMessage('Full name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('LpuId').notEmpty().withMessage('LPU ID is required'),
        body('eventId').isMongoId().withMessage('Valid event ID is required')
    ]),
    createTicket
);

// Get ticket by ID (protected, member or admin)
router.get(
    '/:ticketId',
    authMiddleware.verifyToken,
    validate([
        param('ticketId').isMongoId().withMessage('Invalid ticket ID')
    ]),
    getTicketById
);

// Update ticket status (admin only)
router.patch(
    '/:ticketId/status',
    authMiddleware.verifyToken,
    validate([
        param('ticketId').isMongoId().withMessage('Invalid ticket ID'),
    ]),
    updateTicketStatus
);

// Get all tickets for an event (admin only)
router.get(
    '/event/:eventId',
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    validate([
        param('eventId').isMongoId().withMessage('Invalid event ID')
    ]),
    getTicketsByEvent
);

// Delete a ticket (admin only)
router.delete(
    '/:ticketId',
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    validate([
        param('ticketId').isMongoId().withMessage('Invalid ticket ID')
    ]),
    deleteTicket
);

export default router;