import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize transporter
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: process.env.SMTP_SECURE === 'true',
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const generateQRCodeBuffer = async qrData => {
	try {
		return await QRCode.toBuffer(qrData, {
			type: 'png',
			width: 300,
			errorCorrectionLevel: 'H',
		});
	} catch (err) {
		throw new Error('Failed to generate QR Code');
	}
};

export const sendTicketEmail = async ({
	to,
	subject,
	eventName,
	eventDate,
	eventLocation,
	qrData,
	ticketId = uuidv4(),
}) => {
	try {
		const qrBuffer = await generateQRCodeBuffer(qrData);

		const html = `
			<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
				<h2 style="color: #4CAF50;">🎫 ${eventName} – Your Ticket</h2>
				<p><strong>📅 Date & Time:</strong> ${eventDate}</p>
				<p><strong>📍 Location:</strong> ${eventLocation}</p>
				<p><strong>🆔 Ticket ID:</strong> ${ticketId}</p>
				<p>Present the QR code below at the entrance:</p>
				<img src="cid:qrcode" alt="QR Code" style="width: 200px; margin-top: 10px;" />
				<p style="margin-top: 20px;">You can also download the ticket using the attachment below.</p>
				<hr/>
				<p style="font-size: 0.9rem; color: #777;">If you have any questions, reply to this email.</p>
				<p>– Team Club</p>
			</div>
		`;

		const mailOptions = {
			from: `"Club Events" <${process.env.EMAIL_FROM}>`,
			to,
			subject,
			html,
			attachments: [
				{
					filename: `Ticket-${ticketId}.png`,
					content: qrBuffer,
					cid: 'qrcode', // Inline QR display
				},
				{
					filename: `Ticket-${ticketId}.png`,
					content: qrBuffer,
					contentType: 'image/png',
				},
			],
		};

		const info = await transporter.sendMail(mailOptions);
		console.log(`✅ Ticket email sent to ${to} – Message ID: ${info.messageId}`);
		return {
			success: true,
			message: 'Ticket email sent successfully',
			messageId: info.messageId,
		};
	} catch (err) {
		console.error('❌ Failed to send ticket email:', err.message);
		throw new Error('Could not send ticket email');
	}
};

export const sendPasswordResetEmail = async (to, resetLink) => {
  const subject = 'Password Reset Request';
  const html = `
    <p>You requested a password reset.</p>
    <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;
  return sendEmail(to, subject, html);
};
