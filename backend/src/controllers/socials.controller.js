import Social from '../models/socials.model.js';
import { ApiError } from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadFile, deleteFile } from '../utils/cloudinary.js';
import Member from '../models/member.model.js';
import Admin from '../models/admin.model.js';
import mongoose from 'mongoose';

const getSocials = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { createdAt: -1 },
        populate: { path: 'userId', select: 'name profilePicture' }
    };

    try {
        const socials = await Social.getPaginatedSocials(page, limit);
        return ApiResponse.success(res, 'Social posts fetched successfully', socials);
    } catch (error) {
        throw new ApiError.internal('Failed to fetch social posts', [error.message]);
    }
});

const createSocial = asyncHandler(async (req, res) => {
    const { userId, content } = req.body;
    const files = req.file;

    if (!userId || !content) {
        throw ApiError.badRequest('User ID and content are required');
    }

    // Ensure files is always an array for consistency
    const uploadedFiles = Array.isArray(files) ? files : files ? [files] : [];

    if (uploadedFiles.length === 0) {
        throw ApiError.badRequest('At least one file is required');
    }

    if (uploadedFiles.length > 5) {
        throw ApiError.badRequest('You can upload a maximum of 5 files');
    }

    const cloudinaryUploads = await Promise.all(uploadedFiles.map(file => uploadFile(file)));

    socials = new Social({
        userId: mongoose.Types.ObjectId(userId),
        content,
        images: cloudinaryUploads.filter(file => file.url.match(/\.(jpg|jpeg|png|gif)$/i)).map(file => file.url),
        videos: cloudinaryUploads.filter(file => file.url.match(/\.(mp4|webm|ogg)$/i)).map(file => file.url),
    });

    await socials.save();

    res
        .status(201)
        .json(ApiResponse.success('Social post created successfully', socials));
});

const deleteSocial = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Valid social post ID is required');
    }

    const social = await Social.findById(id);
    if (!social) {
        throw ApiError.notFound('Social post not found');
    }

    // Delete associated files from cloud storage if any
    const filesToDelete = [
        ...(social.images || []),
        ...(social.videos || [])
    ];
    await Promise.all(filesToDelete.map(url => deleteFile(url)));

    await social.deleteOne();

    return ApiResponse.success(res, 'Social post deleted successfully');
});

export {
    getSocials,
    createSocial,
    deleteSocial
}
