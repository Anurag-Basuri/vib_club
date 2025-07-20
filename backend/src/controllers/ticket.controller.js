import Ticket from '../models/ticket.model.js';
import Event from '../models/event.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateTicketQR } from '../services/qrcode.service.js';
import { sendRegistrationEmail } from '../services/email.service.js';

// Create a new ticket
export const createTicket = asyncHandler(async (req, res) => {
	const { fullname, email, lpuID, eventId } = req.body;

	// Validate request data
	if (!fullname || !email || !lpuID || !eventId) {
		throw new ApiError(400, 'All fields are required');
	}

	// Check if event exists
	const event = await Event.findById(eventId);
	if (!event) {
		throw new ApiError(404, 'Event not found');
	}

	// Create a new ticket in DB (initially without QR)
	let ticket = await Ticket.create({
		fullname,
		email,
		lpuID,
		eventId
	});

	// Generate QR code (image + publicId) and update ticket
	const qrCode = await generateTicketQR(ticket);

	ticket.qrCode = {
		url: qrCode.url,
		publicId: qrCode.publicId
	};

	await ticket.save();

	// Send registration email
	await sendRegistrationEmail({
		to: email,
		name: fullname,
		eventName: event.name,
		eventDate: event.date,
		qrUrl: qrCode.url
	});

	// Return success response
	res
        .status(201)
        .json(
            new ApiResponse(201, 'Ticket created successfully', ticket)
        );
});
