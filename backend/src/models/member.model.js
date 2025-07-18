import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const memberSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
        default: 'default-profile.png',
        validate: {
            validator: function(v) {
                // Allow default value and valid URLs or file paths
                return v === 'default-profile.png' || 
                       /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(v) ||
                       /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
            },
            message: props => `${props.value} is not a valid profile picture!`
        },
    },
    fullname: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters'],
        maxlength: [50, 'Full name cannot exceed 50 characters']
    },
    lpuID: {
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
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    program: {
        type: String,
        required: [true, 'Program is required'],
        enum: {
            values: ['Computer Science', 'Information Technology', 'Software Engineering', 
                    'Data Science', 'Cybersecurity', 'Digital Marketing', 'Business Administration', 
                    'Engineering', 'Other'],
            message: 'Please select a valid program'
        }
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
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
    designation: {
        type: String,
        enum: {
            values: ['volunteer', 'CEO', 'CTO', 'CFO', 'CMO', 'COO', 'Manager', 'Member'],
            message: 'Please select a valid designation'
        },
        default: 'volunteer',
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

memberSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
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

const Member = mongoose.model('Member', memberSchema);

export default Member;