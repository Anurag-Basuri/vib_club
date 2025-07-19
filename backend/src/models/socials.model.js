import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const SocialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        maxlength: [1000, 'Content cannot exceed 1000 characters']
    },
    images: {
        type: [String],
        validate: {
            validator: function(v) {
                if (!v || v.length === 0) return true; // Optional field
                return v.every(url => /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(url));
            },
            message: 'All images must be valid image URLs'
        }
    },
    videos: {
        type: [String],
        validate: {
            validator: function(v) {
                if (!v || v.length === 0) return true; // Optional field
                return v.every(url => /^https?:\/\/.*\.(mp4|webm|ogg)$/i.test(url));
            },
            message: 'All videos must be valid video URLs'
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

SocialSchema.index({ userId: 1, createdAt: -1 });

SocialSchema.pre('save', function(next) {
    if (this.isModified('content') && this.content.length > 1000) {
        return next(new Error('Content cannot exceed 1000 characters'));
    }
    next();
});

SocialSchema.plugin(mongooseAggregatePaginate);
SocialSchema.statics.getPaginatedSocials = async function(page = 1, limit = 10) {
    const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { createdAt: -1 },
        populate: { path: 'userId', select: 'name profilePicture' }
    };

    return this.aggregatePaginate(this.find(), options);
};

const Social = mongoose.model('Social', SocialSchema);

export default Social;
