import mongoose from "mongoose"
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

const tiketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    lpuID: {
        type: Number,
        required: [true, 'LPU ID is required'],
        validate: {
            validator: function(v) {
                return /^\d{8}$/.test(v);
            },
            message: 'LPU ID must be 8 digits'
        }
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})