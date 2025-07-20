import Event from '../models/event.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { uploadFile, deleteFile } from '../utils/cloudinary.js';
import mongoose from 'mongoose';

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
