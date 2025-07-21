import Ticket from '../models/ticket.model.js';
import Event from '../models/event.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateTicketQR } from '../services/qrcode.service.js';
import { sendRegistrationEmail } from '../services/email.service.js';
import { v4 as uuidv4 } from 'uuid';
import { deleteFile } from '../utils/cloudinary.js';

// Create a new ticket
const createTicket = asyncHandler(async (req, res) => {
	const { fullName, email, LpuId, eventId } = req.body;

	if (!fullName || !email || !LpuId || !eventId) {
		throw new ApiError(400, 'All fields are required');
	}

	const event = await Event.findById(eventId);
	if (!event) {
		throw new ApiError(404, 'Event not found');
	}

	const existingTicket = await Ticket.findOne({ LpuId, eventId });
	if (existingTicket) {
		throw new ApiError(409, 'You have already registered for this event');
	}

	const ticket = new Ticket({
		ticketId: uuidv4(),
		fullName,
		email,
		LpuId,
		eventId,
		isUsed: false,
		isCancelled: false
	});

	await ticket.save();

	let qrCode;
	try {
		qrCode = await generateTicketQR(ticket);

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
			to: email,
			name: fullName,
			eventName: event.name,
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

	return res
		.status(201)
		.json(
			new ApiResponse(
				201,
				'Ticket created successfully',
				ticket
			)
		);
});

// Get ticket by ID
const getTicketById = asyncHandler(async (req, res) => {
	const { ticketId } = req.params;

	const ticket = await Ticket.findById(ticketId).populate('eventId', 'name date');
	if (!ticket) {
		throw new ApiError(404, 'Ticket not found');
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				'Ticket retrieved successfully',
				ticket
			)
		);
});

// Update ticket status (used/cancelled)
const updateTicketStatus = asyncHandler(async (req, res) => {
	const { ticketId } = req.params;
	const { isUsed, isCancelled } = req.body;

	if (isUsed === undefined && isCancelled === undefined) {
		throw new ApiError(400, 'At least one status field must be provided');
	}

	const ticket = await Ticket.findById(ticketId);
	if (!ticket) {
		throw new ApiError(404, 'Ticket not found');
	}

	if (isUsed !== undefined) ticket.isUsed = isUsed;
	if (isCancelled !== undefined) ticket.isCancelled = isCancelled;

	await ticket.save();

	return res
		.status(200)
		.json(
			new ApiResponse(200, 'Ticket status updated successfully', ticket)
		);
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

	return res
		.status(200)
		.json(
			new ApiResponse(200, 'Tickets retrieved successfully', tickets)
		);
});


const deleteTicket = asyncHandler(async (req, res) => {
	const { ticketId } = req.params;

	const ticket = await Ticket.findByIdAndDelete(ticketId);
	if (!ticket) {
		throw new ApiError(404, 'Ticket not found or already deleted');
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200, 'Ticket deleted successfully')
		);
});

export {
    createTicket,
    getTicketById,
    updateTicketStatus,
    getTicketsByEvent,
    deleteTicket
};