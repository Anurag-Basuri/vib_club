import nodemailer from 'nodemailer';
import { ApiError } from '../utils/apiError.js';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'vibranta.studorg@gmail.com',
		pass: 'rptzttqyzsxwewhj',
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
		throw new ApiError(500, 'Failed to send registration email: ' + error.message);
	}
};

export const sendPasswordResetEmail = async (email, token) => {
	const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

	const mailOptions = {
		from: `"Vibranta Club" <${process.env.MAIL_USER}>`,
		to: email,
		subject: 'Password Reset Request',
		html: `
			<h3>Password Reset</h3>
			<p>Click the link below to reset your password. This link is valid for 15 minutes:</p>
			<a href="${resetUrl}" target="_blank">${resetUrl}</a>
			<br /><br />
			<p>If you did not request this, please ignore this email.</p>
		`
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		throw new ApiError(500, 'Failed to send password reset email');
	}
};

