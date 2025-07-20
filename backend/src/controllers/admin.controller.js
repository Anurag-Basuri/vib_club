import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Admin
const createAdmin = asyncHandler(async (req, res) => {
    const { fullname, password, secret } = req.body;

    if (!fullname || !password || !secret) {
        throw new ApiError(400, "Fullname, password, and secret are required");
    }

    if (secret !== process.env.ADMIN_SECRET) {
        throw new ApiError(401, "Unauthorized: Invalid admin secret");
    }

    const existing = await Admin.findOne({ fullname });
    if (existing) {
        throw new ApiError(409, "Admin with this fullname already exists");
    }

    const admin = await Admin.create({ fullname, password });
    const token = admin.generateAuthToken();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Admin created successfully",
                {admin, token}
            )
        );
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { fullname, password } = req.body;

    if (!fullname || !password) {
        throw new ApiError(400, "Fullname and password are required");
    }

    const admin = await Admin.findOne({ fullname });
    if (!admin || !(await admin.comparePassword(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = admin.generateAuthToken();

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Login successful", {
            admin,
            token,
        })
    );
});

// Logout Admin
const logoutAdmin = asyncHandler(async (req, res) => {
    const admin = req.admin;

    if (!admin) {
        throw new ApiError(401, "Unauthorized");
    }

    admin.tokens = [];
    await admin.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Logout successful")
        );
});

export { createAdmin, loginAdmin };
