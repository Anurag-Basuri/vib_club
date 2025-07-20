import Contact from '../models/contact.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const sendContact = asyncHandler(async (req, res) => {
	const { name, email, phone, lpuID, subject, message } = req.body;

	// Validate required fields
	if (!name || !email || !phone || !lpuID || !subject || !message) {
		throw new ApiError.badRequest('All fields are required');
	}

	// Create a new contact entry
	const contact = await Contact.create({
		name,
		email,
		phone,
		lpuID,
		subject,
		message,
	});

	// Send success response
	res.status(201).json(new ApiResponse(201, 'Contact created successfully', contact));
});

const getAllContacts = asyncHandler(async (req, res) => {
	const options = {
		page: parseInt(req.query.page) || 1,
		limit: parseInt(req.query.limit) || 10,
		sort: req.query.sort || '-createdAt',
	};

	// Fetch paginated contacts
	const contacts = await Contact.getPaginatedContacts(options);
	if (!contacts || contacts.length === 0) {
		throw new ApiError.notFound('No contacts found');
	}

	// Check if contacts is an object with results
	if (typeof contacts !== 'object' || !contacts.docs) {
		throw new ApiError.notFound('No contacts found');
	}

	// Send success response
	res.status(200).json(new ApiResponse(200, 'Contacts retrieved successfully', contacts));
});

const getContactById = asyncHandler(async (req, res) => {
	const contactId = req.params.id;

	// Validate contact ID
	if (!contactId) {
		throw new ApiError.badRequest('Contact ID is required');
	}

	// Fetch contact by ID
	const contact = await Contact.findById(contactId);
	if (!contact) {
		throw new ApiError.notFound('Contact not found');
	}

	// Send success response
	res.status(200).json(new ApiResponse(200, 'Contact retrieved successfully', contact));
});

const markContactAsResolved = asyncHandler(async (req, res) => {
	const contactId = req.params.id;

	// Validate contact ID
	if (!contactId) {
		throw new ApiError.badRequest('Contact ID is required');
	}

	// Update contact status to resolved
	const contact = await Contact.findByIdAndUpdate(
		contactId,
		{ status: 'resolved' },
		{ new: true }
	);
	if (!contact) {
		throw new ApiError.notFound('Contact not found');
	}

	// Send success response
	res.status(200).json(new ApiResponse(200, 'Contact marked as resolved', contact));
});

export { sendContact, getAllContacts, getContactById, markContactAsResolved };
