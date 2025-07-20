import Admin from '../models/admin.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new admin
const createAdmin = asyncHandler(async (req, res) => {
  const { fullname, password, secret } = req.body;

    if (!fullname || !password || !secret) {
        throw new ApiError.badRequest('Fullname, password, and secret are required');
    }

    if (secret !== process.env.ADMIN_SECRET) {
        throw new ApiError.unauthorized('Invalid admin secret');
    }

    const existingAdmin = await Admin.findOne({ fullname });
    if (existingAdmin) {
        throw new ApiError.conflict('Admin with this fullname already exists');
    }

    const admin = await Admin.create({ fullname, password });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                'Admin created successfully',
                admin
            )
        );
});

// Login admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { fullname, password } = req.body;

    if (!fullname || !password) {
        throw new ApiError.badRequest('Fullname and password are required');
    }

    const admin = await Admin.findOne({ fullname });
    if (!admin || !(await admin.comparePassword(password))) {
        throw new ApiError.unauthorized('Invalid credentials');
    }

    const token = admin.generateAuthToken();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Login successful',
                { token }
            )
        );
});

export {
    createAdmin,
    loginAdmin
};
