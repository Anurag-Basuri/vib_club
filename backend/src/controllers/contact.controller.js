import Contact from '../models/contact.model.js';
import { ApiError } from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';

const sendContact = asyncHandler(async (req, res) => {
    const {name, email, phone, lpuID, subject, message} = req.body;

    // Validate required fields
    if (!name || !email || !phone || !lpuID || !subject || !message) {
        throw new ApiError.badRequest('All fields are required');
    }

    // Create a new contact entry
    const contact = await Contact.create(
        {
            name, 
            email,
            phone,
            lpuID,
            subject,
            message
        }
    );

    // Send success response
    res
        .status(201)
        .json(
            new ApiResponse(
                201,
                'Contact created successfully',
                contact
            )
        );
});