import Social from '../models/socials.model.js';
import { ApiError } from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cloudinary } from '../utils/cloudinary.js';
import Member from '../models/member.model.js';
import Admin from '../models/admin.model.js';

const getSocials = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const socials = await Social.find()
        .populate('userId', 'name profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalCount = await Social.countDocuments();

    res.status(200).json(new ApiResponse(socials, {
        page: Number(page),
        limit: Number(limit),
        totalCount,
    }));
});