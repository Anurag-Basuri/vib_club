import Apply from "../models/apply.model";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new application
const applyController = asyncHandler(async (req, res) => {
    const {
        fullName,
        LpuId,
        email,
        phone,
        course,
        gender,
        domains,
        accommodation,
        previousExperience,
        anyotherorg,
        bio
    } = req.body;

    if (!fullName || !LpuId || !email || !phone || !course || !domains || !accommodation) {
        throw new ApiError(400, 'You left one required field empty');
    }

    const newApplication = await Apply.create({
        fullName,
        LpuId,
        email,
        phone,
        course,
        gender,
        domains,
        accommodation,
        previousExperience,
        anyotherorg,
        bio
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                'Application created successfully',
                newApplication
            )
        );
});

// Get all applications
const getAllApplications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 }
    };

    const applications = await Apply.paginate({}, options);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Applications retrieved successfully',
                applications
            )
        );
});
