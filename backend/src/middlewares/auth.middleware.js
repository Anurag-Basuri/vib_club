import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { Member } from '../models/member.model.js';
import Admin from '../models/admin.model.js';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(new ApiError('No token provided', 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new ApiError('Invalid token', 403));
        }
        req.user = decoded;
        next();
    });
};

const isAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
        return next(new ApiError('Access denied. Admins only.', 403));
    }
    req.admin = admin;
    next();
});

const authMiddleware = {
    verifyToken,
    isAdmin,
};

export default authMiddleware;
