import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {ApiError} from '../utils/apiError.js';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_FILE_TYPES = {
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/png': 'png',
	'application/pdf': 'pdf',
    'application/msword': 'doc',
};

// MAX_FILE_SIZE is set to 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Configure multer storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: (req, file, cb) => {
		const fileExtension = ALLOWED_FILE_TYPES[file.mimetype];
		if (!fileExtension) {
			return cb(new ApiError(400, 'Invalid file type'), false);
		}
		cb(null, `${uuidv4()}.${fileExtension}`);
	},
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Invalid file type'), false);
    }
}

// Create the multer upload instance
const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: MAX_FILE_SIZE,
	},
});

// Middleware to handle file uploads
export const uploadFile = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return next(new ApiError(400, `Multer error: ${err.message}`));
            } else if (err) {
                return next(new ApiError(400, `File upload error: ${err.message}`));
            }
            next();
        });
    };
}