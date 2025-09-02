import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './ApiError.js';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
const InitializeCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    } catch (error) {
        throw ApiError.internal('Failed to initialize Cloudinary', [error.message]);
    }
};

// Allowed file types for uploads
const ALLOWED_FILE_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
    'video/mpeg': 'mpeg',
    'video/quicktime': 'mov',
    'video/webm': 'webm',
    'video/ogg': 'ogg',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
};

// MAX file size in bytes (10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Validate file type and size
const validateFile = (file) => {
    if (!file || !file.mimetype || !ALLOWED_FILE_TYPES[file.mimetype]) {
        throw ApiError.badRequest(
            `Invalid file type "${file?.mimetype}". Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`
        );
    }

    if (file.size > MAX_FILE_SIZE) {
        throw ApiError.badRequest(
            `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB`
        );
    }
};

// Upload file to Cloudinary
const uploadFile = async (file) => {
    validateFile(file);

    try {
        const uploadResponse = await cloudinary.uploader.upload(file.path, {
            resource_type: 'auto',
            public_id: path.basename(file.path, path.extname(file.path)),
            overwrite: true,
        });

        // Clean up local file after upload
        try {
            fs.unlinkSync(file.path);
        } catch (fsErr) {
            // Log but don't throw, as upload succeeded
            console.warn('Failed to delete local file after upload:', file.path, fsErr.message);
        }

        return {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
        };
    } catch (error) {
        throw ApiError.internal(
            `Failed to upload file "${file.originalname || file.path}" to Cloudinary`,
            [error.message]
        );
    }
};

// Upload resume to cloudinary
const uploadResume = async (file) => {
    validateFile(file);

    try {
        const uploadResponse = await cloudinary.uploader.upload(file.path, {
            resource_type: 'raw',
            type: "upload",
            folder: "resumes",
            public_id: path.basename(file.originalname),
            overwrite: true,
        });

        // Clean up local file after upload
        try {
            fs.unlinkSync(file.path);
        } catch (fsErr) {
            console.warn('Failed to delete local file after upload:', file.path, fsErr.message);
        }

        return {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
        };
    } catch (error) {
        throw ApiError.internal(
            `Failed to upload resume "${file.originalname || file.path}" to Cloudinary`,
            [error.message]
        );
    }
};

// Delete file from Cloudinary
const deleteFile = async ({ public_id, resource_type }) => {
    if (!public_id || !resource_type) {
        throw ApiError.badRequest('public_id and resource_type are required to delete a file');
    }

    try {
        const result = await cloudinary.uploader.destroy(public_id, { resource_type });
        if (result.result !== 'ok' && result.result !== 'not found') {
            throw ApiError.internal(
                `Cloudinary did not confirm deletion of "${public_id}" (result: ${result.result})`
            );
        }
    } catch (error) {
        console.error('Errors: ', error);
        throw ApiError.internal(
            `Failed to delete file "${public_id}" from Cloudinary`,
            [error]
        );
    }
};

export { InitializeCloudinary, uploadFile, uploadResume, deleteFile };
