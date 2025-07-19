import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

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

		const qrBuffer = await QRCode.toBuffer(qrData, {
			type: 'png',
			errorCorrectionLevel: 'H',
			scale: 6,
			margin: 2,
		});

		// Optional: Save to a file
		const outputDir = path.join(process.cwd(), 'qrcodes');
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir);
		}

		const filePath = path.join(outputDir, `${ticketId}.png`);
		fs.writeFileSync(filePath, qrBuffer);

		return qrBuffer;
	} catch (err) {
		console.error('QR Generation Failed:', err);
		throw new Error('Failed to generate QR code');
	}
};
