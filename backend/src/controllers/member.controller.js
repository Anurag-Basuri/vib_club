import Member from '../models/member.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadFile, deleteFile } from '../utils/cloudinary.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

// Register a new member
const registerMember = asyncHandler(async (req, res) => {
    const { fullname, LpuId, email, password, department, designation } = req.body;
    if (!fullname || !LpuId || !password || !department || !designation) {
        return res.status(400).json(ApiResponse.badRequest('Full name, LPU ID, password, department, and designation are required'));
    }

    const existingMember = await Member.findOne({ LpuId });
    if (existingMember) {
        return res.status(400).json(ApiResponse.conflict('Member with this LPU ID already exists'));
    }

    const member = await Member.create({
        fullname,
        LpuId,
        email,
        password,
        department,
        designation,
    });

    const accessToken = member.generateAuthToken();
    const refreshToken = member.generateRefreshToken();

    return res.status(201).json(
        ApiResponse.created(
            { member: member.toJSON() },
            'Member registered successfully',
            { accessToken, refreshToken }
        )
    );
});

// Login member
const loginMember = asyncHandler(async (req, res) => {
    const { LpuId, email, password } = req.body;
    if ((!LpuId && !email) || !password) {
        return res.status(400).json(ApiResponse.badRequest('LPU ID or email and password are required'));
    }

    const query = LpuId ? { LpuId } : { email };
    const member = await Member.findOne(query).select('+password +refreshToken');
    if (!member) {
        return res.status(404).json(ApiResponse.notFound('Member not found'));
    }

    // Block login if banned or removed
    if (member.status === 'banned') {
        return res.status(403).json(ApiResponse.forbidden(
            `Your account is banned. Reason: ${member.restriction?.reason || 'No reason provided'}. Review at: ${member.restriction?.time ? new Date(member.restriction.time).toLocaleString() : 'N/A'}`
        ));
    }
    if (member.status === 'removed') {
        return res.status(403).json(ApiResponse.forbidden(
            `Your account has been removed. Reason: ${member.restriction?.reason || 'No reason provided'}.`
        ));
    }

    if (!await member.comparePassword(password)) {
        return res.status(401).json(ApiResponse.unauthorized('Incorrect Password'));
    }

    const accessToken = await member.generateAuthToken();
    const refreshToken = await member.generateRefreshToken();

    const user = await Member.findById(member._id).select('-password -refreshToken');
    if (!user) {
        return res.status(404).json(ApiResponse.notFound('User not found'));
    }

    return res.status(200).json(
        ApiResponse.success(
            { member: user.toJSON(),
              accessToken,
              refreshToken
            },
            'Login successful',
        )
    );
});

// Ban member (admin only)
const banMember = asyncHandler(async (req, res) => {
    const { reason, reviewTime } = req.body;
    const member = await Member.findById(req.params.id);
    if (!member) {
        return res.status(404).json(ApiResponse.notFound('Member not found'));
    }
    await member.ban(reason, reviewTime);
    return res.status(200).json(
        ApiResponse.success(
            { member: member.toJSON() },
            'Member banned successfully'
        )
    );
});

// Remove member (admin only)
const removeMember = asyncHandler(async (req, res) => {
    const { reason, reviewTime } = req.body;
    const member = await Member.findById(req.params.id);
    if (!member) {
        return res.status(404).json(ApiResponse.notFound('Member not found'));
    }
    await member.removeMember(reason, reviewTime);
    return res.status(200).json(
        ApiResponse.success(
            { member: member.toJSON() },
            'Member removed successfully'
        )
    );
});

// Unban member (admin only)
const unbanMember = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id);
    if (!member) {
        return res.status(404).json(ApiResponse.notFound('Member not found'));
    }
    await member.unban();
    return res.status(200).json(
        ApiResponse.success(
            { member: member.toJSON() },
            'Member unbanned successfully'
        )
    );
});

// Logout member
const logoutMember = asyncHandler(async (req, res) => {
    const member = req.member;
    if (!member) {
        return res.status(401).json(ApiResponse.unauthorized('Unauthorized access'));
    }

    member.refreshToken = null;
    await member.save();

    return res.status(200).json(ApiResponse.success(null, 'Logout successful'));
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { LpuId, newPassword } = req.body;
    if (!LpuId || !newPassword) {
        return res.status(400).json(ApiResponse.badRequest('LPU ID and new password are required'));
    }

    const member = await Member.findOne({ LpuId });
    if (!member) {
        return res.status(404).json(ApiResponse.notFound('Member not found'));
    }

    member.password = newPassword;
    await member.save();

    return res.status(200).json(
        ApiResponse.success(
            { member: member.toJSON() },
            'Password reset successfully'
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
        return res.status(404).json(ApiResponse.notFound('Member not found'));
    }

    member.fullName = fullName || member.fullName;
    member.gmail = email || member.gmail;
    member.program = program || member.program;
    member.year = year || member.year;
    member.linkedIn = linkedIn || member.linkedIn;
    member.github = github || member.github;
    member.bio = bio || member.bio;

    await member.save();

    return res.status(200).json(
        ApiResponse.success(
            { member: member.toJSON() },
            'Profile updated successfully'
        )
    );
});

// Update by admin
const updateMemberByAdmin = asyncHandler(async (req, res) => {
    const { department, designation, LpuId } = req.body;

    const member = await Member.findById(req.params.id);
    if (!member) {
        return res.status(404).json(ApiResponse.notFound('Member not found'));
    }

    member.department = department || member.department;
    member.designation = designation || member.designation;
    member.LpuId = LpuId || member.LpuId;

    await member.save();

    return res.status(200).json(
        ApiResponse.success(
            { member: member.toJSON() },
            'Member updated successfully'
        )
    );
});

// Upload profile picture
const uploadProfilePicture = asyncHandler(async (req, res) => {
    const file = req.files;
    if (!file || file.length === 0) {
        return res.status(400).json(ApiResponse.badRequest('No files uploaded'));
    }

    const member = await Member.findById(req.id);
    if (!member) {
        return res.status(404).json(ApiResponse.notFound('Member not found'));
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

    return res.status(200).json(
        ApiResponse.success(
            { member: member.toJSON() },
            'Profile picture uploaded successfully'
        )
    );
});

// Get current member
const getCurrentMember = asyncHandler(async (req, res) => {
    const member = req.member;
    if (!member) {
        return res.status(401).json(ApiResponse.unauthorized('Unauthorized access'));
    }

    return res.status(200).json(
        ApiResponse.success(
            { member: member.toJSON() },
            'Current member retrieved successfully'
        )
    );
});

// get the leaders
const getLeaders = asyncHandler(async (req, res) => {
    const members = await Member.find({designation: { $in: ['CEO', 'CTO', 'CMO', 'COO'] }})

    if (!members || members.length === 0) {
        return res.status(404).json(ApiResponse.notFound('No leaders found'));
    }

    return res.status(200).json(
        ApiResponse.success(
            { members: members.map(member => member.toJSON()) },
            'Leaders retrieved successfully'
        )
    );
});

// Send password reset email
const sendResetPasswordEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json(ApiResponse.badRequest('Email is required'));
    }

    const member = await Member.findOne({ email });
    if (!member) {
        return res.status(404).json(ApiResponse.notFound('Member not found'));
    }

    // Generate reset token
    const resetToken = member.generateResetToken();
    await member.save();

    // Send the reset email
    await sendPasswordResetEmail(email, resetToken);

    return res.status(200).json(
        ApiResponse.success(
            null,
            'Password reset email sent successfully'
        )
    );
});

// Get all members
const getAllMembers = asyncHandler(async (req, res) => {
    const currentUser = req.user;

    const members = await Member.find().select('-password -refreshToken');
    const totalMembers = await Member.countDocuments();

    return res.status(200).json(
        ApiResponse.success(
            { members, totalMembers },
            'Members retrieved successfully'
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
    getLeaders,
    sendResetPasswordEmail,
    getAllMembers,
    banMember,
    removeMember,
    unbanMember
};