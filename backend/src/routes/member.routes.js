import { Router } from "express";
import {
    registerMember,
    loginMember,
    logoutMember,
    resetPassword,
    updateProfile,
    updateMemberByAdmin,
    uploadProfilePicture,
    getCurrentMember,
    getMemberById,
    sendResetPasswordEmail
} from '../controllers/member.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { uploadFile } from '../middlewares/multer.middleware.js';
import { body, param } from 'express-validator';

const router = Router();

// Register Member
router.post(
    '/register',
    validate([
        body('fullName').notEmpty().withMessage('Full name is required'),
        body('LpuId').notEmpty().withMessage('LPU ID is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ]),
    registerMember
);

// Login Member
router.post(
    '/login',
    validate([
        body('password').notEmpty().withMessage('Password is required')
    ]),
    loginMember
);

// Logout Member
router.post(
    '/logout',
    validate([
        body('refreshToken').notEmpty().withMessage('Refresh token is required')
    ]),
    logoutMember
);

// Reset Password
router.post(
    '/reset-password',
    validate([
        body('LpuId').notEmpty().withMessage('LPU ID is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    ]),
    resetPassword
);

// Update Profile
router.put(
    '/:id/update',
    authMiddleware.verifyToken,
    authMiddleware.isMember,
    validate([
        param('id').isMongoId().withMessage('Invalid member ID'),
        body('fullName').optional().isString(),
        body('email').optional().isEmail().withMessage('Invalid email'),
        body('program').optional().isString(),
        body('year').optional().isInt({ min: 1, max: 5 }),
        body('linkedIn').optional().isURL().withMessage('Invalid LinkedIn URL'),
        body('github').optional().isURL().withMessage('Invalid GitHub URL'),
        body('bio').optional().isString()
    ]),
    updateProfile
);

// Update Member by Admin
router.put(
    '/:id/admin',
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    validate([
        param('id').isMongoId().withMessage('Invalid member ID'),
        body('department').optional().isString(),
        body('designation').optional().isString(),
        body('LpuId').optional().isString()
    ]),
    updateMemberByAdmin
);

// Upload Profile Picture
router.post(
    '/:id/profile-picture',
    authMiddleware.verifyToken,
    authMiddleware.isMember,
    uploadFile('profilePictures'),
    validate([
        param('id').isMongoId().withMessage('Invalid member ID'),
        body('profilePicture').notEmpty().withMessage('Profile picture is required')
    ]),
    uploadProfilePicture
);

// Get Current Member
router.get(
    '/me',
    authMiddleware.verifyToken,
    authMiddleware.isMember,
    getCurrentMember
);

// Get Member By ID
router.get(
    '/:id',
    authMiddleware.verifyToken,
    validate([
        param('id').isMongoId().withMessage('Invalid member ID')
    ]),
    getMemberById
);

// Send Password Reset Email
router.post(
    '/send-reset-email',
    validate([
        body('email').notEmpty().withMessage('Email is required')
    ]),
    sendResetPasswordEmail
);

export default router;