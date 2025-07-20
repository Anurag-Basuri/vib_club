import { Router } from 'express';
import {
    sendContact,
    getAllContacts,
    getContactById,
    markContactAsResolved,
} from '../controllers/contact.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { rateLimiter } from '../middlewares/rateLimit.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Apply rate limiter to contact form submission
router.post(
    '/',
    rateLimiter,
    validate([
        body('name')
            .notEmpty()
            .withMessage('Name is required'),
        body('email')
            .isEmail()
            .withMessage('Invalid email format'),
        body('message')
            .notEmpty()
            .withMessage('Message is required')
    ]),
    sendContact
);

// Admin routes (protected)
router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    getAllContacts
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    getContactById
);

router.patch(
    '/:id/resolve',
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    markContactAsResolved
);

// router.delete(
//     '/:id',
//     authMiddleware.verifyToken,
//     authMiddleware.isAdmin,
//     deleteContact
// );

export default router;