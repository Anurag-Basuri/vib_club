import Member from '../models/member.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';

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
