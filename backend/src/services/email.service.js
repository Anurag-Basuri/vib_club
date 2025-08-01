import nodemailer from 'nodemailer';
import { ApiError } from '../utils/ApiError.js';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'vibranta.studorg@gmail.com',
		pass: 'rptzttqyzsxwewhj',
	},
});

export const sendRegistrationEmail = async ({ to, name, eventName, eventDate, eventTime, qrUrl }) => {
    const mailOptions = {
        from: `"RaveYard 2025" <${process.env.MAIL_USER}>`,
        to,
        subject: `💀 Your Soul Pass for ${eventName} is Confirmed!`,
        html: `
        <div style="background: radial-gradient(circle at 30% 40%, #2d1b69 0%, #1a0630 40%, #0a0015 70%, #000000 100%); color: #fff; font-family: 'Segoe UI', 'Arial', sans-serif; padding: 32px 0;">
            <div style="max-width: 480px; margin: 0 auto; background: rgba(20,0,30,0.95); border-radius: 18px; box-shadow: 0 0 24px #2d1b69; border: 2px solid #8B4513; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #8B0000 0%, #2d1b69 100%); padding: 24px 0 12px 0;">
                    <h1 style="margin: 0; font-size: 2.2rem; font-weight: bold; letter-spacing: 2px; color: #fff;">
                        <span style="color: #ff1744;">RaveYard 2025</span> <span style="font-size:1.5rem;">💀</span>
                    </h1>
                    <h2 style="margin: 0; font-size: 1.2rem; color: #ffb3b3; font-weight: 600;">The Haunted Resurrection</h2>
                </div>
                <div style="padding: 28px 32px 18px 32px;">
                    <p style="font-size: 1.1rem; color: #ffb3b3;">Hi <b>${name}</b>,</p>
                    <p style="font-size: 1.1rem; color: #fff;">
                        You have <b>successfully claimed your Soul Pass</b> for <span style="color:#ff1744;">${eventName}</span>!
                    </p>
                    <p style="font-size: 1rem; color: #ffb3b3;">
                        <strong>Event Date:</strong> <span style="color:#fff;">${eventDate}</span><br>
                        <strong>Time:</strong> <span style="color:#fff;">${eventTime || '5:00 PM'}</span>
                    </p>
                    <div style="margin: 24px 0; text-align: center;">
                        <div style="background: #1a0630; border-radius: 12px; padding: 18px 0;">
                            <p style="color: #ff1744; font-weight: bold; margin-bottom: 10px;">Show this QR code at the crypt gates:</p>
                            <img src="${qrUrl}" alt="QR Code" style="width:180px; height:auto; border: 4px solid #ff1744; border-radius: 12px; background: #fff;" />
                        </div>
                    </div>
                    <p style="font-size: 1rem; color: #ffb3b3;">
                        Prepare for a night of haunted beats, ghostly lights, and unforgettable memories.<br>
                        <span style="color:#ff1744;">Entry is sealed once the souls are full!</span>
                    </p>
                    <p style="font-size: 1rem; color: #fff; margin-top: 24px;">
                        See you in the shadows,<br>
                        <span style="color:#ff1744; font-weight:bold;">— Team RaveYard</span>
                    </p>
                </div>
                <div style="background: linear-gradient(90deg, #8B0000 0%, #2d1b69 100%); padding: 10px 0; text-align: center;">
                    <span style="color: #ffb3b3; font-size: 0.95rem;">#RaveYard2025 &nbsp;|&nbsp; Glow. Scream. Survive.</span>
                </div>
            </div>
        </div>
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
