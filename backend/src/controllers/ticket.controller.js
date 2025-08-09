import Ticket from '../models/ticket.model.js';
import Event from '../models/event.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateTicketQR } from '../services/qrcode.service.js';
import { sendRegistrationEmail } from '../services/email.service.js';
import { v4 as uuidv4 } from 'uuid';
import { deleteFile } from '../utils/cloudinary.js';

// Create a new ticket
const createTicket = asyncHandler(async (req, res) => {
	const { fullName, email, lpuId, eventId, eventName, gender, hosteler, hostel, course } = req.body;

	if (!fullName || !email || !lpuId || !eventId || !eventName || !gender || !hosteler || !hostel || !course) {
		throw new ApiError(400, 'All fields are required');
	}

	const event = await Event.findById(eventId);
	if (!event) {
		throw new ApiError(404, 'Event not found');
	}

	// Check for duplicate ticket by email or lpuId for this event
	const existingTicket = await Ticket.findOne({
		eventId,
		$or: [
			{ email: email.trim().toLowerCase() },
			{ lpuId: typeof lpuId === 'string' ? lpuId.trim() : lpuId },
		],
	});
	if (existingTicket) {
		throw new ApiError(409, 'You have already registered for this event');
	}

	const ticket = new Ticket({
		ticketId: uuidv4(),
		fullName,
		email: email.trim().toLowerCase(),
		lpuId: typeof lpuId === 'string' ? lpuId.trim() : lpuId,
		eventId,
		eventName,
		gender,
		hosteler,
		hostel,
		course,
		isUsed: false,
		isCancelled: false,
	});

	await ticket.save();

	let qrCode;
	try {
		qrCode = await generateTicketQR(ticket.ticketId);

		if (!qrCode || !qrCode.url || !qrCode.public_id) {
			throw new Error('Invalid QR code generated');
		}

		ticket.qrCode = {
			url: qrCode.url,
			publicId: qrCode.public_id,
		};

		await ticket.save();
	} catch (qrErr) {
		// Cleanup: remove ticket and QR if QR failed
		await Ticket.findByIdAndDelete(ticket._id);
		if (qrCode?.public_id && qrCode.url) {
			await deleteFile({ public_id: qrCode.public_id, resource_type: 'image' });
		}
		throw new ApiError(500, 'Failed to generate QR code for the ticket');
	}

	try {
		await sendRegistrationEmail({
			to: email.trim().toLowerCase(),
			name: fullName,
			eventName: eventName,
			eventDate: event.date,
			qrUrl: qrCode.url,
		});
	} catch (emailErr) {
		// Cleanup: delete ticket and QR if email fails
		await Ticket.findByIdAndDelete(ticket._id);
		if (qrCode?.public_id && qrCode.url) {
			await deleteFile({ public_id: qrCode.public_id, resource_type: 'image' });
		}
		throw new ApiError(500, 'Failed to send registration email, ticket deleted');
	}

	return res.status(201).json(new ApiResponse(201, ticket, 'Ticket created successfully'));
});

// Get ticket by ID
const getTicketById = asyncHandler(async (req, res) => {
	const ticketId = req.params.ticketId || req.body.ticketId;

	const ticket = await Ticket.findById(ticketId);
	if (!ticket) {
		throw new ApiError(404, 'Ticket not found');
	}

	return res.status(200).json(new ApiResponse(200, ticket, 'Ticket retrieved successfully'));
});

// Update ticket status (used/cancelled)
const updateTicketStatus = asyncHandler(async (req, res) => {
	const { ticketId } = req.params;
	const { isUsed } = req.body;

	if (isUsed === undefined) {
		throw new ApiError(400, 'At least one status field must be provided');
	}

	const ticket = await Ticket.findById(ticketId);
	if (!ticket) {
		throw new ApiError(404, 'Ticket not found');
	}

	if (isUsed !== undefined) ticket.isUsed = isUsed;

	await ticket.save();

	return res.status(200).json(new ApiResponse(200, ticket, 'Ticket status updated successfully'));
});

// Get all tickets for an event
const getTicketsByEvent = asyncHandler(async (req, res) => {
	const { eventId } = req.params;

	if (!eventId) {
		throw new ApiError(400, 'Event ID is required');
	}

	const tickets = await Ticket.find({ eventId }).sort({ createdAt: -1 });

	if (!tickets.length) {
		throw new ApiError(404, 'No tickets found for this event');
	}

	return res.status(200).json(new ApiResponse(200, tickets, 'Tickets retrieved successfully'));
});

// Delete a ticket
const deleteTicket = asyncHandler(async (req, res) => {
	const { ticketId } = req.params;

	const ticket = await Ticket.findByIdAndDelete(ticketId);
	if (!ticket) {
		throw new ApiError(404, 'Ticket not found or already deleted');
	}

	return res.status(200).json(new ApiResponse(200, null, 'Ticket deleted successfully'));
});

// Check email and LPU ID availability for an event
const checkEmailAvailability = asyncHandler(async (req, res) => {
	const { email, eventId = '68859a199ec482166f0e8523', lpuId } = req.body;

	const trimmedEmail = email.toLowerCase().trim();

	// Check if email already exists for this event
	const existingTicketByEmail = await Ticket.findOne({
		email: trimmedEmail,
		eventId: eventId,
	});

	if (existingTicketByEmail) {
		throw new ApiError(
			409,
			'A ticket has already been purchased with this email address for this event'
		);
	}

	// Also check LPU ID if provided
	if (lpuId) {
		const existingTicketByLpu = await Ticket.findOne({
			lpuId: typeof lpuId === 'string' ? lpuId.trim() : lpuId,
			eventId: eventId,
		});

		if (existingTicketByLpu) {
			throw new ApiError(
				409,
				'A ticket has already been purchased with this LPU ID for this event'
			);
		}
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ available: true, email: trimmedEmail, eventId: eventId },
				'Email and LPU ID are available for registration'
			)
		);
});

export {
	createTicket,
	getTicketById,
	updateTicketStatus,
	getTicketsByEvent,
	deleteTicket,
	checkEmailAvailability,
};
