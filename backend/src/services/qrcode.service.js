import QRCode from 'qrcode';
import { ApiError } from '../utils/apiError.js';
import { v4 as uuidv4 } from 'uuid';
import streamifier from 'streamifier';
import { InitializeCloudinary as cloudinary } from '../utils/cloudinary.js';

export const generateTicketQR = async (details) => {
	try {
		const {
            ticketId,
             fullName,
             email,
             lpuID,
             eventName,
             eventId,
             isUsed,
             isCancelled } = details;

		// Prepare data to encode in the QR
		const qrData = JSON.stringify({
			ticketId,
			fullName,
			email,
			lpuID,
			eventName,
			eventId,
			isUsed,
			isCancelled,
		});

		// Generate QR code as a buffer
		const qrBuffer = await QRCode.toBuffer(qrData, { type: 'png' });

		// Upload buffer directly to Cloudinary
		const uploadResult = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: 'tickets/qr-codes',
					public_id: `ticket_${uuidv4()}`,
					resource_type: 'image',
				},
				(error, result) => {
					if (error) return reject(error);
					resolve(result);
				}
			);

			streamifier.createReadStream(qrBuffer).pipe(uploadStream);
		});

		return uploadResult; // contains url, public_id, etc.
	} catch (error) {
		console.error('Error generating QR code:', error);
		throw new ApiError(500, 'Failed to generate QR code');
	}
};
