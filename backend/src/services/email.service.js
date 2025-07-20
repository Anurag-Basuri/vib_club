import nodemailer from 'nodemailer';
import { ApiError } from '../utils/apiError.js';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAIL_USER, // your Gmail
		pass: process.env.MAIL_PASS, // App Password from Gmail settings
	},
});

export const sendRegistrationEmail = async ({ to, name, eventName, eventDate, qrUrl }) => {
	const mailOptions = {
		from: `"Event Organizer" <${process.env.MAIL_USER}>`,
		to,
		subject: `🎟️ Registration Confirmed for ${eventName}`,
		html: `
		<h2>Hi ${name},</h2>
		<p>You're successfully registered for <strong>${eventName}</strong> happening on <strong>${eventDate}</strong>.</p>
		<p>Please find your ticket QR code below. Show it at the entrance:</p>
		<img src="${qrUrl}" alt="QR Code" style="width:200px; height:auto;" />
		<br />
		<p>Looking forward to seeing you!</p>
		<p>— Team Event Organizer</p>
		`,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		throw new ApiError(500, 'Failed to send registration email');
	}
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
	const mailOptions = {
		from: `"Support" <${process.env.MAIL_USER}>`,
		to,
		subject: '🔐 Reset Your Password',
		html: `
		<h2>Hello ${name},</h2>
		<p>We received a request to reset your password. Click the button below to proceed:</p>
		<a href="${resetUrl}" style="padding:10px 20px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">Reset Password</a>
		<p>If you didn't request this, you can ignore the email.</p>
		<p>— Support Team</p>
		`,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		throw new ApiError(500, 'Failed to send reset password email');
	}
};
