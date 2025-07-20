import mongoose from "mongoose"
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        default: uuidv4,
        unique: true
    },

    fullname: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters'],
        maxlength: [50, 'Full name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format'
        }
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
    isUsed: {
        type: Boolean,
        default: false,
        required: true
    },

    qrCode: {
        url: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^https?:\/\/.*\.(png|jpg|jpeg)$/.test(v);
                },
                message: 'QR Code must be a valid image URL'
            },
            publicId: {
                type: String,
                unique: true
            }
        }
    },

    isCancelled: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

ticketSchema.index({ eventId: 1, createdAt: -1 });
ticketSchema.pre('save', function(next) {
    if (this.isModified('email') && !validator.isEmail(this.email)) {
        return next(new Error('Invalid email format'));
    }
    next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
