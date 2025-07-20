import { Router } from 'express';
import { createAdmin,
    loginAdmin,
    logoutAdmin } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Admin routes
router.post('/register',
    validate([
        body('fullname').notEmpty().withMessage('Fullname is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('secret').notEmpty().withMessage('Secret is required'),
    ]),
    createAdmin
);

router.post('/login',
    validate([
        body('fullname').notEmpty().withMessage('Fullname is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ]),
    loginAdmin
);

router.post('/logout',
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    logoutAdmin
);

export default router;
