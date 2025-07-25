import Member from '../models/member.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';
import { uploadFile, deleteFile } from '../utils/cloudinary.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

//  Register a new member
const registerMember = asyncHandler(async (req, res) => {
    const {fullName, LpuId, password, department, designation, program} = req.body;
    if (!fullName || !LpuId || !password) {
        throw new ApiError(400, 'Full name, LPU ID, email, and password are required');
    }

    const existingMember = await Member.findOne({ LpuId });
    if (existingMember) {
        throw new ApiError(400, 'Member with this LPU ID already exists');
    }

    const member = await Member.create({
        fullName,
        LpuId,
        password,
        department,
        designation,
        program,
    });

    const accessToken = member.generateAuthToken();
    const refreshToken = member.generateRefreshToken();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                'Member registered successfully',
                { member: member.toJSON() },
                { accessToken, refreshToken }
            )
        );
});

// Login member
const loginMember = asyncHandler(async (req, res) => {
    const { LpuId, email, password } = req.body;
    if ((!LpuId && !email) || !password) {
        throw new ApiError(400, 'LPU ID or email and password are required');
    }

    const query = LpuId ? { LpuId } : { email };
    const member = await Member.findOne(query).select('');
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }

    if (!await member.comparePassword(password)) {
        throw new ApiError(401, 'Incorrect Password');
    }

    const accessToken = await member.generateAuthToken();
    const refreshToken = await member.generateRefreshToken();

    const user = await Member.findById(member._id).select('-password -refreshToken');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Login successful',
                { member: user.toJSON() },
                { accessToken, refreshToken }
            )
        );
});

// Logout member
const logoutMember = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required');
    }

    const member = await Member.findOne({ refreshToken });
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }
    member.refreshToken = null;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Logout successful'
            )
        );
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const {LpuId, newPassword} = req.body;
    if (!LpuId || !newPassword) {
        throw new ApiError(400, 'LPU ID and new password are required');
    }

    const member = await Member.findOne({ LpuId });
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }

    member.password = newPassword;
    await member.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Password reset successfully',
            { member: member.toJSON() }
        )
    );
});

// Update member profile
const updateProfile = asyncHandler(async (req, res) => {
    const {
        fullName,
        email,
        program,
        year,
        linkedIn,
        github,
        bio,
    } = req.body;

    const member = await Member.findById(req.params.id);
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }

    member.fullName = fullName || member.fullName;
    member.gmail = email || member.gmail;
    member.program = program || member.program;
    member.year = year || member.year;
    member.linkedIn = linkedIn || member.linkedIn;
    member.github = github || member.github;
    member.bio = bio || member.bio;

    await member.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Profile updated successfully',
            { member: member.toJSON() }
        )
    );
});

// Update by admin
const updateMemberByAdmin = asyncHandler(async (req, res) => {
    const { department, designation, LpuId } = req.body;

    const member = await Member.findById(req.params.id);
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }

    member.department = department || member.department;
    member.designation = designation || member.designation;
    member.LpuId = LpuId || member.LpuId;

    await member.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Member updated successfully',
                { member: member.toJSON() }
            )
        );
});

// Upload profile picture
const uploadProfilePicture = asyncHandler(async (req, res) => {
    const file = req.files;
    if (!file || file.length === 0) {
        throw new ApiError(400, 'No files uploaded');
    }

    const member = await Member.findById(req.id);
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }

    // Delete old profile picture from Cloudinary
    if (member.profilePicture) {
        await deleteFile(member.profilePicture.publicId);
    }

    // Upload new profile picture to Cloudinary
    const uploadResponse = await uploadFile(file[0]);
    member.profilePicture = {
        url: uploadResponse.url,
        publicId: uploadResponse.publicId,
    };
    await member.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Profile picture uploaded successfully',
                { member: member.toJSON() }
            )
    );
});

// Get current member
const getCurrentMember = asyncHandler(async (req, res) => {
    const id = req.id;
    if (!id) {
        throw new ApiError(401, 'Unauthorized access');
    }
    const member = await Member.findById(id).select('-password -refreshToken');
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Current member retrieved successfully',
            { member: member.toJSON() }
        )
    );
});

// Get member by ID
const getMemberById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new ApiError(400, 'Member ID is required');
    }

    const currentUser = req.user;
    if (currentUser.role !== 'admin' && currentUser.role !== 'member') {
        const member = await Member.findById(id).select('-password -refreshToken');
        if (!member) {
            throw new ApiError(404, 'Member not found');
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    'Member retrieved successfully',
                { member: member.toJSON() }
            )
        );
    }

    const member = await Member.findById(id).select('-password -refreshToken -LpuId -email -joinedAt');
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Member retrieved successfully',
            { member: member.toJSON() }
        )
    );
});

// Send password reset email
const sendResetPasswordEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const member = await Member.findOne({ email });
    if (!member) {
        throw new ApiError(404, 'Member not found');
    }

    // Generate reset token
    const resetToken = member.generateResetToken();
    await member.save();

    // Send the reset email
    await sendPasswordResetEmail(email, resetToken);

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            'Password reset email sent successfully'
        )
    );
});

export {
    registerMember,
    loginMember,
    logoutMember,
    resetPassword,
    updateProfile,
    updateMemberByAdmin,
    uploadProfilePicture,
    getCurrentMember,
    getMemberById,
    sendResetPasswordEmail
};