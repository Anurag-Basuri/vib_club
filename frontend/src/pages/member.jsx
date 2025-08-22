import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const { user, isAuthenticated, loading: authLoading, logoutMember } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Hooks for API calls with proper error states
    const { 
        getCurrentMember, 
        member: currentUser, 
        loading: userLoading, 
        error: userError,
        reset: resetUserError 
    } = useGetCurrentMember();
    
    const { 
        updateProfile, 
        member: updatedMember, 
        loading: updateLoading, 
        error: updateError,
        reset: resetUpdateError 
    } = useUpdateProfile();
    
    const { 
        resetPassword, 
        loading: resetLoading, 
        error: resetError,
        reset: resetPasswordError 
    } = useResetPassword();
    
    const { 
        sendResetPasswordEmail, 
        loading: emailLoading, 
        error: emailError,
        reset: resetEmailError 
    } = useSendResetPasswordEmail();
    
    const { 
        uploadProfilePicture, 
        member: uploadedMember, 
        loading: uploadLoading, 
        error: uploadError,
        reset: resetUploadError 
    } = useUploadProfilePicture();

    // Local state
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [LpuId, setLpuId] = useState('');
    const [updateProfileData, setUpdateProfileData] = useState({
        fullName: '',
        email: '',
        program: '',
        year: '',
        linkedIn: '',
        github: '',
        bio: '',
    });

    // UI state
    const [showResetForm, setShowResetForm] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Get the most current user data
    const displayUser = currentUser || updatedMember || uploadedMember || user;

    // Form validation
    const validateProfileForm = () => {
        const errors = [];
        
        if (!updateProfileData.fullName.trim()) {
            errors.push('Full name is required');
        }
        
        if (!updateProfileData.email.trim()) {
            errors.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(updateProfileData.email)) {
            errors.push('Email format is invalid');
        }
        
        if (updateProfileData.linkedIn && !updateProfileData.linkedIn.startsWith('https://')) {
            errors.push('LinkedIn URL must start with https://');
        }
        
        if (updateProfileData.github && !updateProfileData.github.startsWith('https://')) {
            errors.push('GitHub URL must start with https://');
        }
        
        return errors;
    };

    const validatePasswordForm = () => {
        const errors = [];
        
        if (!LpuId.trim()) {
            errors.push('LPU ID is required');
        }
        
        if (!newPassword.trim()) {
            errors.push('New password is required');
        } else if (newPassword.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        
        if (newPassword !== confirmPassword) {
            errors.push('Passwords do not match');
        }
        
        return errors;
    };

    // Show error message helper
    const showError = useCallback((message) => {
        setStatusMessage({ text: message, type: 'error' });
    }, []);

    // Show success message helper
    const showSuccess = useCallback((message) => {
        setStatusMessage({ text: message, type: 'success' });
    }, []);

    // Show info message helper
    const showInfo = useCallback((message) => {
        setStatusMessage({ text: message, type: 'info' });
    }, []);

    // Clear all hook errors
    const clearAllErrors = useCallback(() => {
        resetUserError();
        resetUpdateError();
        resetPasswordError();
        resetEmailError();
        resetUploadError();
    }, [resetUserError, resetUpdateError, resetPasswordError, resetEmailError, resetUploadError]);

    // Authentication redirect
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/auth');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Fetch current user data
    useEffect(() => {
        if (isAuthenticated) {
            clearAllErrors();
            getCurrentMember();
        }
    }, [isAuthenticated, getCurrentMember, clearAllErrors]);

    // Update form data when user data changes
    useEffect(() => {
        if (displayUser) {
            const newData = {
                fullName: displayUser.fullname || '',
                email: displayUser.email || '',
                program: displayUser.program || '',
                year: displayUser.year || '',
                linkedIn: displayUser.linkedIn || '',
                github: displayUser.github || '',
                bio: displayUser.bio || '',
            };
            setUpdateProfileData(newData);
            setHasUnsavedChanges(false);
        }
    }, [displayUser]);

    // Handle errors from hooks
    useEffect(() => {
        if (userError) showError(userError);
    }, [userError, showError]);

    useEffect(() => {
        if (updateError) showError(updateError);
    }, [updateError, showError]);

    useEffect(() => {
        if (resetError) showError(resetError);
    }, [resetError, showError]);

    useEffect(() => {
        if (emailError) showError(emailError);
    }, [emailError, showError]);

    useEffect(() => {
        if (uploadError) showError(uploadError);
    }, [uploadError, showError]);

    // Auto-clear status messages
    useEffect(() => {
        if (statusMessage.text) {
            const timer = setTimeout(() => {
                setStatusMessage({ text: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    // Track form changes
    const handleProfileChange = useCallback((e) => {
        const { name, value } = e.target;
        setUpdateProfileData((prev) => ({ ...prev, [name]: value }));
        setHasUnsavedChanges(true);
        clearAllErrors();
    }, [clearAllErrors]);

    // Send reset password email
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (!resetEmail.trim()) {
            showError('Email is required');
            return;
        }

        try {
            showInfo('Sending reset email...');
            await sendResetPasswordEmail(resetEmail);
            showSuccess('Password reset email sent! Check your inbox.');
            setShowResetForm(false);
            setResetEmail('');
        } catch (error) {
            // Error is handled by useEffect
        }
    };

    // Reset password
    const handleNewPassword = async (e) => {
        e.preventDefault();
        
        const errors = validatePasswordForm();
        if (errors.length > 0) {
            showError(errors.join(', '));
            return;
        }

        try {
            showInfo('Updating password...');
            await resetPassword(LpuId, newPassword);
            showSuccess('Password updated successfully!');
            setShowPasswordReset(false);
            setNewPassword('');
            setConfirmPassword('');
            setLpuId('');
        } catch (error) {
            // Error is handled by useEffect
        }
    };

    // Update profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        const errors = validateProfileForm();
        if (errors.length > 0) {
            showError(errors.join(', '));
            return;
        }

        if (!displayUser?._id) {
            showError('User ID not found. Please refresh the page.');
            return;
        }

        try {
            showInfo('Updating profile...');
            await updateProfile(displayUser._id, updateProfileData);
            showSuccess('Profile updated successfully!');
            setHasUnsavedChanges(false);
            // Refresh current user data
            await getCurrentMember();
        } catch (error) {
            // Error is handled by useEffect
        }
    };

    // Logout member
    const handleLogout = async () => {
        if (hasUnsavedChanges) {
            const confirm = window.confirm('You have unsaved changes. Are you sure you want to logout?');
            if (!confirm) return;
        }

        try {
            await logoutMember();
            navigate('/auth');
        } catch (error) {
            showError('Logout failed. Please try again.');
        }
    };

    // Upload profile picture
    const handleUploadProfilePicture = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            showError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        if (file.size > maxSize) {
            showError('File size must be less than 5MB');
            return;
        }

        if (!displayUser?._id) {
            showError('User ID not found. Please refresh the page.');
            return;
        }

        try {
            showInfo('Uploading profile picture...');
            const formData = new FormData();
            formData.append('profilePicture', file);
            
            await uploadProfilePicture(displayUser._id, formData);
            showSuccess('Profile picture updated successfully!');
            // Refresh current user data
            await getCurrentMember();
        } catch (error) {
            // Error is handled by useEffect
        } finally {
            e.target.value = null;
        }
    };

    // Reset all forms
    const resetAllForms = () => {
        setShowResetForm(false);
        setShowPasswordReset(false);
        setResetEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setLpuId('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        clearAllErrors();
    };

    // Tab change handler
    const handleTabChange = (tab) => {
        if (hasUnsavedChanges && tab !== 'edit') {
            const confirm = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
            if (!confirm) return;
        }
        
        setActiveTab(tab);
        resetAllForms();
    };

    // File input trigger
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Status message component
    const StatusMessage = ({ message }) => {
        if (!message.text) return null;

        const config = {
            success: {
                bg: 'bg-green-900/30 border border-green-700/50',
                text: 'text-green-300',
                icon: '✓'
            },
            error: {
                bg: 'bg-red-900/30 border border-red-700/50',
                text: 'text-red-300',
                icon: '✕'
            },
            info: {
                bg: 'bg-blue-900/30 border border-blue-700/50',
                text: 'text-blue-300',
                icon: 'ℹ'
            }
        };

        const { bg, text, icon } = config[message.type] || config.info;

        return (
            <motion.div
                className={`${bg} ${text} p-3 rounded-lg mb-4 flex items-center gap-2`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
            >
                <span className="font-bold">{icon}</span>
                <span>{message.text}</span>
                <button
                    onClick={() => setStatusMessage({ text: '', type: '' })}
                    className="ml-auto text-lg hover:opacity-70"
                >
                    ×
                </button>
            </motion.div>
        );
    };

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] to-[#0f172a] text-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-300">Loading your profile...</p>
            </div>
        </div>
    );

    // Authentication guard
    if (authLoading || userLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] to-[#0f172a] text-white flex items-center justify-center">
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Authentication Required
                    </h1>
                    <p className="text-blue-300 mb-6">Please log in to view your profile</p>
                    <button 
                        onClick={() => navigate('/auth')}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                        Go to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    // Main render
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] to-[#0f172a] text-white overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-indigo-500/12 blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto p-4 pt-6">
                {/* Header */}
                <motion.div 
                    className="flex justify-between items-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Member Profile
                    </h1>
                    <div className="flex gap-3">
                        {hasUnsavedChanges && (
                            <span className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-300 rounded-full">
                                Unsaved changes
                            </span>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-red-700/50 hover:bg-red-700/70 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>
                </motion.div>

                <AnimatePresence>
                    <StatusMessage message={statusMessage} />
                </AnimatePresence>

                {/* Profile card */}
                <motion.div
                    className="bg-blue-900/20 backdrop-blur-lg rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/20 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Profile header */}
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
                                        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-full h-full flex items-center justify-center">
                                            <span className="text-4xl font-bold">
                                                {displayUser?.fullname?.charAt(0)?.toUpperCase() || 'U'}
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
                                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Upload profile picture"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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
                                <h2 className="text-2xl font-bold">{displayUser?.fullname || 'Unknown User'}</h2>
                                <p className="text-blue-300">
                                    {displayUser?.designation || 'Member'} • {displayUser?.department || 'Unknown'}
                                </p>
                                <p className="text-blue-400 text-sm mt-1">
                                    LPU ID: {displayUser?.LpuId || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-blue-500/30">
                        {['profile', 'security', 'edit'].map((tab) => (
                            <button
                                key={tab}
                                className={`flex-1 py-4 text-center capitalize transition-colors ${
                                    activeTab === tab 
                                        ? 'text-white border-b-2 border-blue-400 bg-blue-500/10' 
                                        : 'text-blue-300 hover:text-white hover:bg-blue-500/5'
                                }`}
                                onClick={() => handleTabChange(tab)}
                            >
                                {tab === 'edit' ? 'Edit Profile' : tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {[
                                            { label: 'Email', value: displayUser?.email },
                                            { label: 'Program', value: displayUser?.program },
                                            { label: 'Year', value: displayUser?.year ? `${displayUser.year}${displayUser.year === '1' ? 'st' : displayUser.year === '2' ? 'nd' : displayUser.year === '3' ? 'rd' : 'th'} Year` : null },
                                            { label: 'Joined', value: displayUser?.joinedAt ? new Date(displayUser.joinedAt).toLocaleDateString() : null }
                                        ].map(({ label, value }, index) => (
                                            <div key={index} className="bg-blue-900/30 p-4 rounded-xl">
                                                <h3 className="text-blue-300 text-sm mb-1">{label}</h3>
                                                <p className="font-medium">{value || 'Not provided'}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Social Links */}
                                    <div className="mb-6">
                                        <h3 className="text-blue-300 text-sm mb-3">Social Links</h3>
                                        <div className="flex space-x-4">
                                            {displayUser?.linkedIn && (
                                                <a
                                                    href={displayUser.linkedIn}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-blue-900/50 rounded-lg hover:bg-blue-800 transition-all duration-200 hover:scale-110"
                                                    title="LinkedIn Profile"
                                                >
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {displayUser?.github && (
                                                <a
                                                    href={displayUser.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-blue-900/50 rounded-lg hover:bg-blue-800 transition-all duration-200 hover:scale-110"
                                                    title="GitHub Profile"
                                                >
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {!displayUser?.linkedIn && !displayUser?.github && (
                                                <p className="text-blue-400 italic">No social links added</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <h3 className="text-blue-300 text-sm mb-3">Bio</h3>
                                        <div className="bg-blue-900/30 p-4 rounded-xl min-h-[100px]">
                                            <p className="whitespace-pre-wrap">
                                                {displayUser?.bio || 'No bio provided. Add one by editing your profile!'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {!showPasswordReset ? (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-xl mb-4">Password Settings</h3>
                                                <button
                                                    onClick={() => setShowPasswordReset(true)}
                                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold transition-all duration-200 hover:scale-105"
                                                >
                                                    Reset Password
                                                </button>
                                            </div>

                                            <div>
                                                <h3 className="text-xl mb-4">Account Status</h3>
                                                <div className="bg-blue-900/30 p-4 rounded-xl space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span>Status:</span>
                                                        <span
                                                            className={`px-3 py-1 rounded-full font-medium ${
                                                                displayUser?.status === 'active'
                                                                    ? 'bg-green-500/20 text-green-400'
                                                                    : displayUser?.status === 'banned'
                                                                        ? 'bg-red-500/20 text-red-400'
                                                                        : 'bg-gray-500/20 text-gray-400'
                                                            }`}
                                                        >
                                                            {(displayUser?.status || 'Unknown').toUpperCase()}
                                                        </span>
                                                    </div>

                                                    {displayUser?.restriction?.isRestricted && (
                                                        <div className="border-t border-blue-500/20 pt-4">
                                                            <div className="flex justify-between mb-2">
                                                                <span>Restricted Until:</span>
                                                                <span className="text-red-400">
                                                                    {new Date(displayUser.restriction.time).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span>Reason:</span>
                                                                <p className="mt-1 bg-red-500/20 p-2 rounded">
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
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl">Reset Password</h3>
                                                <button
                                                    onClick={() => setShowPasswordReset(false)}
                                                    className="text-blue-300 hover:text-white"
                                                >
                                                    ← Back
                                                </button>
                                            </div>

                                            {!showResetForm ? (
                                                <form onSubmit={handleNewPassword} className="space-y-4">
                                                    <div>
                                                        <label className="block text-blue-300 mb-2">LPU ID</label>
                                                        <input
                                                            type="text"
                                                            value={LpuId}
                                                            onChange={(e) => setLpuId(e.target.value)}
                                                            placeholder="Your LPU ID"
                                                            className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-blue-300 mb-2">New Password</label>
                                                        <div className="relative">
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                placeholder="Enter new password (min 6 characters)"
                                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                                                required
                                                                minLength={6}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? '👁️' : '👁️‍🗨️'}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-blue-300 mb-2">Confirm Password</label>
                                                        <div className="relative">
                                                            <input
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                placeholder="Confirm new password"
                                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            >
                                                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={resetLoading}
                                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                    >
                                                        {resetLoading ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Updating...
                                                            </span>
                                                        ) : (
                                                            'Update Password'
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowResetForm(true)}
                                                        className="w-full text-blue-300 hover:text-blue-100 mt-4"
                                                    >
                                                        Forgot your LPU ID? Reset via email
                                                    </button>
                                                </form>
                                            ) : (
                                                <form onSubmit={handleResetPassword} className="space-y-4">
                                                    <p className="text-blue-300 mb-4">
                                                        Enter your email to receive a password reset link:
                                                    </p>

                                                    <div>
                                                        <label className="block text-blue-300 mb-2">Email</label>
                                                        <input
                                                            type="email"
                                                            value={resetEmail}
                                                            onChange={(e) => setResetEmail(e.target.value)}
                                                            placeholder="Your registered email"
                                                            className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                                            required
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={emailLoading}
                                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                    >
                                                        {emailLoading ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Sending...
                                                            </span>
                                                        ) : (
                                                            'Send Reset Link'
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowResetForm(false)}
                                                        className="w-full text-blue-300 hover:text-blue-100 mt-4"
                                                    >
                                                        Back to password reset
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Edit Profile Tab */}
                            {activeTab === 'edit' && (
                                <motion.div
                                    key="edit"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-blue-300 mb-2">
                                                    Full Name <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={updateProfileData.fullName}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-blue-300 mb-2">
                                                    Email <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={updateProfileData.email}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
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
                                                    placeholder="e.g., Computer Science"
                                                    className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-blue-300 mb-2">Year</label>
                                                <select
                                                    name="year"
                                                    value={updateProfileData.year}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                                >
                                                    <option value="">Select Year</option>
                                                    <option value="1">1st Year</option>
                                                    <option value="2">2nd Year</option>
                                                    <option value="3">3rd Year</option>
                                                    <option value="4">4th Year</option>
                                                    <option value="5">5th Year</option>
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
                                                    className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
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
                                                    className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-blue-300 mb-2">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={updateProfileData.bio}
                                                onChange={handleProfileChange}
                                                placeholder="Tell us about yourself..."
                                                className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 min-h-[150px] transition-colors resize-none"
                                                maxLength="500"
                                            />
                                            <p className="text-right text-blue-400 text-sm mt-1">
                                                {updateProfileData.bio.length}/500 characters
                                            </p>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                disabled={updateLoading || !hasUnsavedChanges}
                                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                {updateLoading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Updating...
                                                    </span>
                                                ) : (
                                                    'Update Profile'
                                                )}
                                            </button>
                                            
                                            {hasUnsavedChanges && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setUpdateProfileData({
                                                            fullName: displayUser?.fullname || '',
                                                            email: displayUser?.email || '',
                                                            program: displayUser?.program || '',
                                                            year: displayUser?.year || '',
                                                            linkedIn: displayUser?.linkedIn || '',
                                                            github: displayUser?.github || '',
                                                            bio: displayUser?.bio || '',
                                                        });
                                                        setHasUnsavedChanges(false);
                                                    }}
                                                    className="px-6 py-3 rounded-xl border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 transition-all duration-200"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MemberProfile;
