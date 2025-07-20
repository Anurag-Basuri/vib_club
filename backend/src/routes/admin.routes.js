import { Router } from 'express';
import { createAdmin,
    loginAdmin,
    logoutAdmin } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';

const router = Router();

// Admin routes
router.post('/create',
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
    authMiddleware,
    logoutAdmin
);

export default router;
