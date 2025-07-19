import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { ApiError } from '../utils/apiError.js';

export const generateTicketQR = async details => {
    try {
        const {
            ticketId,
            fullName,
            email,
            lpuID,
            eventName,
            eventId,
            isUsed,
            isCancelled,
        } = details;

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

        // Define directory and file path
        const qrDir = path.resolve('public', 'qrcodes');
        if (!fs.existsSync(qrDir)) {
            fs.mkdirSync(qrDir, { recursive: true });
        }
        const fileName = `ticket_${ticketId}_${Date.now()}.png`;
        const filePath = path.join(qrDir, fileName);

        // Generate and save QR code
        await QRCode.toFile(filePath, qrData, {
            type: 'png',
            errorCorrectionLevel: 'H',
            scale: 8,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });

        // Return the file path (relative to server root)
        return `/public/qrcodes/${fileName}`;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new ApiError(500, 'Failed to generate QR code');
    }
};
