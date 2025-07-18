import mongoose, { Mongoose } from "mongoose";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [5, 'Description must be at least 5 characters'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        validate: {
            validator: function(v) {
                return v >= new Date(); // Event date must be in the future
            },
            message: 'Event date must be in the future'
        }
    },
    venue: {
        type: String,
        required: [true, 'Venue is required'],
        trim: true,
        minlength: [2, 'Venue must be at least 2 characters'],
        maxlength: [100, 'Venue cannot exceed 100 characters']
    },
    organizer: {
        type: String,
        required: [true, 'Organizer is required'],
        trim: true,
        minlength: [2, 'Organizer must be at least 2 characters'],
        maxlength: [100, 'Organizer cannot exceed 100 characters']
    },
    sponser: {
        type: String,
        required: [true, 'Sponsor is required'],
        trim: true,
        minlength: [2, 'Sponsor must be at least 2 characters'],
        maxlength: [100, 'Sponsor cannot exceed 100 characters'],
        default: 'Not Applicable'
    },
    posters: {
        type: [String],
        validate: {
            validator: function(v) {
                if (!v || v.length === 0) return true; // Optional field
                return v.every(url => /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(url));
            },
            message: 'All posters must be valid image URLs'
        }
    },

    ticketPrice: {
        type: Number,
        required: [true, 'Ticket price is required'],
        min: [0, 'Ticket price cannot be negative']
    },
    registrations: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: [true, 'Registrations are required'],
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: props => `${props.value} is not a valid registration ID!`
        }
    },
    status: {
        type: String,
        enum: {
            values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
            message: 'Status must be either upcoming, ongoing, completed, or cancelled'
        },
        default: 'upcoming'
    }
}, {
    timestamps: true,
});

EventSchema.index({ date: 1, title: 1 });
// Automatically set status to 'ongoing' if the event date is today or in the future
EventSchema.pre('save', function(next) {
    if (this.isModified('date') && this.date < new Date()) {
        return next(new Error('Event date must be in the future'));
    }
    next();
});

// Automatically set status to 'completed' if the event date is in the past
EventSchema.pre('findOneAndUpdate', function(next) {
    if (this._update.date && this._update.date < new Date()) {
        this._update.status = 'completed';
    }
    next();
});

const Event = mongoose.model('Event', EventSchema);

export default Event;