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
		throw new ApiError.internal('Failed to initialize Cloudinary', [error.message]);
	}
};

// Allowed file types for uploads
const ALLOWED_FILE_TYPES = {
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/png': 'png',
	'application/pdf': 'pdf',
	'application/msword': 'doc',
};

// MAX file size in bytes (10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Validate file type and size
const validateFile = (file) => {
	if (!file || !file.mimetype || !ALLOWED_FILE_TYPES[file.mimetype]) {
		throw new ApiError.badRequest(
			'Invalid file type. Allowed types are: ' + Object.keys(ALLOWED_FILE_TYPES).join(', ')
		);
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new ApiError.badRequest(
			`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB`
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
		fs.unlinkSync(file.path);

		return {
			url: uploadResponse.secure_url,
			publicId: uploadResponse.public_id,
		};
	} catch (error) {
		throw new ApiError.internal('Failed to upload file to Cloudinary', [error.message]);
	}
};

// Delete file from Cloudinary
const deleteFile = async (publicId) => {
	if (!publicId) {
		throw new ApiError.badRequest('Public ID is required to delete a file');
	}

	try {
		await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
	} catch (error) {
		throw new ApiError.internal('Failed to delete file from Cloudinary', [error.message]);
	}
};

export { InitializeCloudinary, uploadFile, deleteFile };
