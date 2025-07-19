import Member from '../models/member.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';

// Generate JWT token
const generateToken = (memberId) => {
    try {
        const accessToken = jwt.sign(
            { memberId },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE || '1h',
            }
        )

        return accessToken;
    } catch (error) {
        throw new ApiError(500, 'Token generation failed');
    }
};

//  Register a new member
const registerMember = asyncHandler(async (req, res) => {
    const {name, LpuId, password} = req.body;
    if (!name || !LpuId || !password) {
        throw new ApiError(400, 'Name, LPU ID, and password are required');
    }

    const existingMember = await Member.findOne({ LpuId });
    if (existingMember) {
        throw new ApiError(400, 'Member with this LPU ID already exists');
    }

    const member = await Member.create({
        name,
        LpuId,
        password
    });

    const accessToken = generateToken(member.id);

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            'Member registered successfully',
            { member: member.toJSON() },
            { accessToken }
        )
    );
});

// Login member
const loginMember = asyncHandler(async (req, res) => {
    const {LpuId, password} = req.body;
    if (!LpuId || !password) {
        throw new ApiError(400, 'LPU ID and password are required');
    }

    const member = await Member.findOne({ LpuId });
    if (!member || !(await member.comparePassword(password))) {
        throw new ApiError(401, 'Invalid LPU ID or password');
    }

    const accessToken = generateToken(member.id);

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            'Login successful',
            { member: member.toJSON() },
            { accessToken }
        )
    );
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const {LpuId, newPassword} = req.body;
    if (!LpuId || !newPassword) {
        throw new ApiError(400, 'LPU ID and new password are required');
    }

    const member = await Member.findOne({ LpuId });
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }

    member.password = newPassword;
    await member.save();

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            'Password reset successfully',
            { member: member.toJSON() }
        )
    );
});