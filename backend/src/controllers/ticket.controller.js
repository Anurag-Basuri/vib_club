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

// Get ticket by ID
export const getTicketById = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;

    // Find ticket by ID
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new ApiError(404, 'Ticket not found');
    }

    // Return success response
    res
        .status(200)
        .json(
            new ApiResponse(200, 'Ticket retrieved successfully', ticket)
        );
});

// Update ticket status (used/cancelled)
export const updateTicketStatus = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;
    const { isUsed, isCancelled } = req.body;

    // Validate request data
    if (isUsed === undefined && isCancelled === undefined) {
        throw new ApiError(400, 'At least one status field must be provided');
    }

    // Find ticket by ID
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new ApiError(404, 'Ticket not found');
    }

    // Update ticket status
    if (isUsed !== undefined) {
        ticket.isUsed = isUsed;
    }
    if (isCancelled !== undefined) {
        ticket.isCancelled = isCancelled;
    }

    await ticket.save();

    // Return success response
    res
        .status(200)
        .json(
            new ApiResponse(200, 'Ticket status updated successfully', ticket)
        );
});

// Get all tickets for an event
export const getTicketsByEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    // Validate event ID
    if (!eventId) {
        throw new ApiError(400, 'Event ID is required');
    }

    // Find tickets for the event
    const tickets = await Ticket.find({ eventId }).populate('eventId', 'name date');

    if (!tickets.length) {
        throw new ApiError(404, 'No tickets found for this event');
    }

    // Return success response
    res
        .status(200)
        .json(
            new ApiResponse(200, 'Tickets retrieved successfully', tickets)
        );
});