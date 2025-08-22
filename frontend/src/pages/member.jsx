import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { 
    useGetCurrentMember,
    useUpdateProfile,
    useResetPassword,
    useSendResetPasswordEmail,
    useUploadProfilePicture
} from '../hooks/useMembers.js';
import { useNavigate } from 'react-router-dom';

const MemberProfile = () => {
    const { user, isAuthenticated, loading: authLoading, logoutMember } = useAuth(); // Removed token since it's not in AuthContext
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Hooks for API calls
    const { getCurrentMember, member: currentUser, loading: userLoading } = useGetCurrentMember();
    const { updateProfile, member: updatedMember, loading: updateLoading } = useUpdateProfile();
    const { resetPassword, loading: resetLoading } = useResetPassword();
    const { sendResetPasswordEmail, loading: emailLoading } = useSendResetPasswordEmail();
    const { uploadProfilePicture, member: uploadedMember, loading: uploadLoading } = useUploadProfilePicture();

    // Password reset states
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [LpuId, setLpuId] = useState('');

    // Profile update state
    const [updateProfileData, setUpdateProfileData] = useState({
        fullName: '',
        email: '',
        program: '',
        year: '',
        linkedIn: '',
        github: '',
        bio: '',
    });

    // Show/hide forms
    const [showResetForm, setShowResetForm] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

    // Use the current user from hooks or fallback to auth user
    const displayUser = currentUser || updatedMember || uploadedMember || user;

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/auth');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Fetch current user data when component mounts
    useEffect(() => {
        if (isAuthenticated) {
            getCurrentMember(); // No token needed - handled by apiClient interceptor
        }
    }, [isAuthenticated, getCurrentMember]);

    // Update form data when user data changes
    useEffect(() => {
        if (displayUser) {
            setUpdateProfileData({
                fullName: displayUser.fullname || '',
                email: displayUser.email || '',
                program: displayUser.program || '',
                year: displayUser.year || '',
                linkedIn: displayUser.linkedIn || '',
                github: displayUser.github || '',
                bio: displayUser.bio || '',
            });
        }
    }, [displayUser]);

    // Clear status message after 5 seconds
    useEffect(() => {
        if (statusMessage.text) {
            const timer = setTimeout(() => {
                setStatusMessage({ text: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    // Send reset password email
    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            setStatusMessage({ text: 'Sending reset email...', type: 'info' });
            await sendResetPasswordEmail(resetEmail);
            setStatusMessage({
                text: 'Password reset email sent! Check your inbox.',
                type: 'success',
            });
            setShowResetForm(false);
            setResetEmail('');
        } catch (error) {
            setStatusMessage({
                text: 'Failed to send reset email. Please try again.',
                type: 'error',
            });
        }
    };

    // Reset password
    const handleNewPassword = async (e) => {
        e.preventDefault();
        try {
            setStatusMessage({ text: 'Updating password...', type: 'info' });
            await resetPassword(LpuId, newPassword);
            setStatusMessage({ text: 'Password updated successfully!', type: 'success' });
            setShowPasswordReset(false);
            setNewPassword('');
            setLpuId('');
        } catch (error) {
            setStatusMessage({
                text: 'Failed to update password. Please try again.',
                type: 'error',
            });
        }
    };

    // Update profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setStatusMessage({ text: 'Updating profile...', type: 'info' });
            await updateProfile(displayUser._id, updateProfileData); // No token needed
            setStatusMessage({ text: 'Profile updated successfully!', type: 'success' });
            // Refresh current user data
            getCurrentMember();
        } catch (error) {
            setStatusMessage({
                text: 'Failed to update profile. Please try again.',
                type: 'error',
            });
        }
    };

    // Logout member
    const handleLogout = async () => {
        try {
            await logoutMember();
            navigate('/auth');
        } catch (error) {
            setStatusMessage({ text: 'Logout failed. Please try again.', type: 'error' });
        }
    };

    // Upload profile picture
    const handleUploadProfilePicture = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setStatusMessage({ text: 'Uploading profile picture...', type: 'info' });
            const formData = new FormData();
            formData.append('profilePicture', file);
            
            await uploadProfilePicture(displayUser._id, formData); // No token needed
            setStatusMessage({ text: 'Profile picture updated successfully!', type: 'success' });
            // Refresh current user data
            getCurrentMember();
        } catch (error) {
            setStatusMessage({ text: 'Failed to upload profile picture.', type: 'error' });
        } finally {
            e.target.value = null;
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Handle profile update form changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUpdateProfileData((prev) => ({ ...prev, [name]: value }));
    };

    // Status message component
    const StatusMessage = ({ message }) => {
        if (!message.text) return null;

        const bgColor = {
            success: 'bg-green-900/30 border border-green-700/50',
            error: 'bg-red-900/30 border border-red-700/50',
            info: 'bg-blue-900/30 border border-blue-700/50',
        }[message.type];

        const textColor = {
            success: 'text-green-300',
            error: 'text-red-300',
            info: 'text-blue-300',
        }[message.type];

        return (
            <motion.div
                className={`${bgColor} ${textColor} p-3 rounded-lg mb-4`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {message.text}
            </motion.div>
        );
    };

    // Show loading if still fetching user data
    if (authLoading || userLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] to-[#0f172a] text-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If not authenticated, show message
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] to-[#0f172a] text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
                    <button 
                        onClick={() => navigate('/auth')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] to-[#0f172a] text-white overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-indigo-500/12 blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto p-4 pt-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Member Profile
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg bg-red-700/50 hover:bg-red-700/70 backdrop-blur-sm transition"
                    >
                        Logout
                    </button>
                </div>

                <StatusMessage message={statusMessage} />

                {/* Profile card */}
                <motion.div
                    className="bg-blue-900/20 backdrop-blur-lg rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/20 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Profile header with picture */}
                    <div className="relative p-6 border-b border-blue-500/30">
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/50">
                                    {displayUser?.profilePicture?.url ? (
                                        <img
                                            src={displayUser.profilePicture.url}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="bg-blue-900/50 w-full h-full flex items-center justify-center">
                                            <span className="text-4xl">
                                                {displayUser?.fullname?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                    )}

                                    {uploadLoading && (
                                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={triggerFileInput}
                                    disabled={uploadLoading}
                                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleUploadProfilePicture}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold">{displayUser?.fullname}</h2>
                                <p className="text-blue-300">
                                    {displayUser?.designation} • {displayUser?.department}
                                </p>
                                <p className="text-blue-400 text-sm mt-1">
                                    LPU ID: {displayUser?.LpuId}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-blue-500/30">
                        <button
                            className={`flex-1 py-4 text-center ${activeTab === 'profile' ? 'text-white border-b-2 border-blue-400' : 'text-blue-300'}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        <button
                            className={`flex-1 py-4 text-center ${activeTab === 'security' ? 'text-white border-b-2 border-blue-400' : 'text-blue-300'}`}
                            onClick={() => setActiveTab('security')}
                        >
                            Security
                        </button>
                        <button
                            className={`flex-1 py-4 text-center ${activeTab === 'edit' ? 'text-white border-b-2 border-blue-400' : 'text-blue-300'}`}
                            onClick={() => setActiveTab('edit')}
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-900/30 p-4 rounded-xl">
                                        <h3 className="text-blue-300 text-sm mb-1">Email</h3>
                                        <p>{displayUser?.email || 'Not provided'}</p>
                                    </div>
                                    <div className="bg-blue-900/30 p-4 rounded-xl">
                                        <h3 className="text-blue-300 text-sm mb-1">Program</h3>
                                        <p>{displayUser?.program || 'Not provided'}</p>
                                    </div>
                                    <div className="bg-blue-900/30 p-4 rounded-xl">
                                        <h3 className="text-blue-300 text-sm mb-1">Year</h3>
                                        <p>{displayUser?.year || 'Not provided'}</p>
                                    </div>
                                    <div className="bg-blue-900/30 p-4 rounded-xl">
                                        <h3 className="text-blue-300 text-sm mb-1">Joined</h3>
                                        <p>
                                            {displayUser?.joinedAt ? new Date(displayUser.joinedAt).toLocaleDateString() : 'Unknown'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-blue-300 text-sm mb-1">Social Links</h3>
                                    <div className="flex space-x-4">
                                        {displayUser?.linkedIn && (
                                            <a
                                                href={displayUser.linkedIn}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-blue-900/50 rounded-lg hover:bg-blue-800 transition"
                                            >
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                </svg>
                                            </a>
                                        )}
                                        {displayUser?.github && (
                                            <a
                                                href={displayUser.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-blue-900/50 rounded-lg hover:bg-blue-800 transition"
                                            >
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </a>
                                        )}
                                        {!displayUser?.linkedIn && !displayUser?.github && (
                                            <p className="text-blue-400">No social links added</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-blue-300 text-sm mb-1">Bio</h3>
                                    <p className="bg-blue-900/30 p-4 rounded-xl min-h-[100px]">
                                        {displayUser?.bio || 'No bio provided'}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {!showPasswordReset ? (
                                    <div>
                                        <h3 className="text-xl mb-4">Password Settings</h3>

                                        <button
                                            onClick={() => setShowPasswordReset(true)}
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold mb-4"
                                        >
                                            Reset Password
                                        </button>

                                        <div className="mt-6">
                                            <h3 className="text-xl mb-4">Account Status</h3>
                                            <div className="bg-blue-900/30 p-4 rounded-xl">
                                                <div className="flex justify-between items-center">
                                                    <span>Status:</span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full ${
                                                            displayUser?.status === 'active'
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : displayUser?.status === 'banned'
                                                                    ? 'bg-red-500/20 text-red-400'
                                                                    : 'bg-gray-500/20'
                                                        }`}
                                                    >
                                                        {displayUser?.status || 'Unknown'}
                                                    </span>
                                                </div>

                                                {displayUser?.restriction?.isRestricted && (
                                                    <div className="mt-4">
                                                        <div className="flex justify-between mb-2">
                                                            <span>Restricted Until:</span>
                                                            <span>
                                                                {new Date(displayUser.restriction.time).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span>Reason:</span>
                                                            <p className="mt-1 bg-blue-900/50 p-2 rounded">
                                                                {displayUser.restriction.reason}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-xl mb-4">Reset Password</h3>

                                        {!showResetForm ? (
                                            <div>
                                                <p className="mb-4">Enter your new password below:</p>

                                                <form onSubmit={handleNewPassword}>
                                                    <div className="mb-4">
                                                        <label className="block text-blue-300 mb-2">LPU ID</label>
                                                        <input
                                                            type="text"
                                                            value={LpuId}
                                                            onChange={(e) => setLpuId(e.target.value)}
                                                            placeholder="Your LPU ID"
                                                            className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="block text-blue-300 mb-2">New Password</label>
                                                        <div className="relative">
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                placeholder="Enter new password"
                                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? '👁️' : '👁️‍🗨️'}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={resetLoading}
                                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold disabled:opacity-50"
                                                    >
                                                        {resetLoading ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                </form>

                                                <button
                                                    onClick={() => setShowResetForm(true)}
                                                    className="text-blue-300 hover:text-blue-100 mt-4"
                                                >
                                                    Forgot your LPU ID?
                                                </button>

                                                <button
                                                    onClick={() => setShowPasswordReset(false)}
                                                    className="text-blue-300 hover:text-blue-100 block mt-2"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="mb-4">Enter your email to receive a password reset link:</p>

                                                <form onSubmit={handleResetPassword}>
                                                    <div className="mb-4">
                                                        <label className="block text-blue-300 mb-2">Email</label>
                                                        <input
                                                            type="email"
                                                            value={resetEmail}
                                                            onChange={(e) => setResetEmail(e.target.value)}
                                                            placeholder="Your registered email"
                                                            className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
                                                            required
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={emailLoading}
                                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold disabled:opacity-50"
                                                    >
                                                        {emailLoading ? 'Sending...' : 'Send Reset Link'}
                                                    </button>
                                                </form>

                                                <button
                                                    onClick={() => setShowResetForm(false)}
                                                    className="text-blue-300 hover:text-blue-100 mt-4"
                                                >
                                                    Back to password reset
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Edit Profile Tab */}
                        {activeTab === 'edit' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-blue-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={updateProfileData.fullName}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-blue-300 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={updateProfileData.email}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-blue-300 mb-2">Program</label>
                                            <input
                                                type="text"
                                                name="program"
                                                value={updateProfileData.program}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-blue-300 mb-2">Year</label>
                                            <select
                                                name="year"
                                                value={updateProfileData.year}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
                                            >
                                                <option value="">Select Year</option>
                                                <option value="1">1st Year</option>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                                <option value="4">4th Year</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-blue-300 mb-2">LinkedIn</label>
                                            <input
                                                type="url"
                                                name="linkedIn"
                                                value={updateProfileData.linkedIn}
                                                onChange={handleProfileChange}
                                                placeholder="https://linkedin.com/in/yourname"
                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-blue-300 mb-2">GitHub</label>
                                            <input
                                                type="url"
                                                name="github"
                                                value={updateProfileData.github}
                                                onChange={handleProfileChange}
                                                placeholder="https://github.com/yourname"
                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-blue-300 mb-2">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={updateProfileData.bio}
                                            onChange={handleProfileChange}
                                            placeholder="Tell us about yourself..."
                                            className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 min-h-[150px]"
                                            maxLength="500"
                                        ></textarea>
                                        <p className="text-right text-blue-400 text-sm mt-1">
                                            {updateProfileData.bio.length}/500 characters
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold disabled:opacity-50"
                                    >
                                        {updateLoading ? 'Updating...' : 'Update Profile'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MemberProfile;
