import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const memberSchema = new mongoose.Schema({
    memberID: {
        type: String,
        default: () => uuidv4(),
        unique: true,
    },

    profilePicture: {
        url: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^https?:\/\/.*\.(png|jpg|jpeg)$/.test(v);
                },
                message: 'Profile picture must be a valid image URL'
            }
        },
        publicId: {
            type: String,
        }
    },
    fullname: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters'],
        maxlength: [50, 'Full name cannot exceed 50 characters']
    },
    LpuId: {
        type: String,
        required: [true, 'LPU ID is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{8}$/.test(v);
            },
            message: 'LPU ID must be 8 digits'
        }
    },
    email: {
        type: String,
        default: uuidv4(),
    },
    program: {
        type: String,
        trim: true,
    },
    year: {
        type: Number,
        enum: {
            values: [1, 2, 3, 4],
            message: 'Year must be between 1 and 4'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        maxlength: [128, 'Password cannot exceed 128 characters'],
        select: false,
    },
    linkedIn: {
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true; // Optional field
                return /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(v);
            },
            message: props => `${props.value} is not a valid LinkedIn URL!`
        },
    },
    github: {
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true; // Optional field
                return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/.test(v);
            },
            message: props => `${props.value} is not a valid GitHub URL!`
        },
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: {
            values: ['HR', 'Technical', 'Marketing', 'Management', 'Content Writing', 'Event Management', 'Media', 'Design', 'Coordinator'],
            message: 'Please select a valid department'
        }
    },
    designation: {
        type: String,
        enum: {
            values: ['CEO', 'CTO', 'CFO', 'CMO', 'COO','Head','member'],
            message: 'Please select a valid designation'
        },
        default: 'member',
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        trim: true
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'banned', 'removed'],
        default: 'active',
    },
    restriction: {
        time: {
            type: Date,
            default: null,
        },
        reason: {
            type: String,
            trim: true,
            maxlength: [200, 'Restriction reason cannot exceed 200 characters'],
            default: null,
        },
        isRestricted: {
            type: Boolean,
            default: false,
        }
    },

    refreshToken: {
        type: String,
        select: false,
        default: null,
    },
    resetPasswordToken: {
        type: String,
        select: false

    },
    resetPasswordExpires: {
        type: Date,
        select: false
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

memberSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

memberSchema.methods.comparePassword = async function(password) {
    const check = await bcrypt.compare(password, this.password);
    return check;
};

memberSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash and store in DB (you can choose to store plain, but hashed is safer)
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expiration time (e.g., 15 mins)
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

memberSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

memberSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

memberSchema.statics.findByLpuID = async function(lpuID) {
    return this.findOne({ lpuID }).exec();
};

memberSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { id: this._id, memberID: this.memberID },
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_EXPIRY ? { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } : {}
    );
};

memberSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_EXPIRY ? { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } : {}
    );
};

// Helper methods
memberSchema.methods.ban = function(reason, reviewTime) {
    this.status = 'banned';
    this.restriction.isRestricted = true;
    this.restriction.reason = reason;
    this.restriction.time = reviewTime || Date.now();
    return this.save();
};

memberSchema.methods.removeMember = function(reason, reviewTime) {
    this.status = 'removed';
    this.restriction.isRestricted = true;
    this.restriction.reason = reason;
    this.restriction.time = reviewTime || Date.now();
    return this.save();
};

memberSchema.methods.unban = function() {
    this.status = 'active';
    this.restriction.isRestricted = false;
    this.restriction.reason = null;
    this.restriction.time = null;
    return this.save();
};

const Member = mongoose.model('Member', memberSchema);

export default Member;