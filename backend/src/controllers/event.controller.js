import Event from '../models/event.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { uploadFile, deleteFile } from '../utils/cloudinary.js';
import mongoose from 'mongoose';

// Controller to create a new event
const createEvent = asyncHandler(async (req, res) => {
    const {title, description, date, venue, organizer, sponsor, ticketPrice, status} = req.body;
    const posters = req.files ? await Promise.all(req.files.map(file => uploadFile(file))) : [];

    // Validate required fields
    if( !title || !description || !date || !venue) {
        throw new ApiError.badRequest('All fields are required');
    }

    // Create new event
    const newEvent = Event.create({
        title,
        description,
        date: new Date(date),
        venue,
        organizer,
        sponsor: sponsor || 'Not Applicable',
        posters: posters.map(p => p.url),
        ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
        status: status || 'upcoming'
    });

    res.status(201).json(new ApiResponse('Event created successfully', newEvent));
});

// Update event controller
const updateEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, date, venue, organizer, sponsor, ticketPrice, status } = req.body;
    const posters = req.files ? await Promise.all(req.files.map(file => uploadFile(file))) : [];

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError.badRequest('Invalid event ID');
    }

    // Delete existing posters if any
    const existingEvent = await Event.findById(id);
    if (existingEvent) {
        await Promise.all(existingEvent.posters.map(poster => deleteFile(poster)));
    }

    // Build update object only with provided fields
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (date !== undefined) updateFields.date = new Date(date);
    if (venue !== undefined) updateFields.venue = venue;
    if (organizer !== undefined) updateFields.organizer = organizer;
    if (sponsor !== undefined) updateFields.sponsor = sponsor;
    if (ticketPrice !== undefined) updateFields.ticketPrice = parseFloat(ticketPrice);
    if (status !== undefined) updateFields.status = status;
    if (posters && posters.length > 0) updateFields.posters = posters.map(p => p.url);

    // Find and update the event
    const updatedEvent = await Event.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
    );

    if (!updatedEvent) {
        throw new ApiError.notFound('Event not found');
    }

    res.status(200).json(new ApiResponse('Event updated successfully', updatedEvent));
});
