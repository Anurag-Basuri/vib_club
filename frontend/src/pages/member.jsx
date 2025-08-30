import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useGetCurrentMember,
    useUpdateProfile,
    useUploadProfilePicture,
    useUploadResume,
    useResetPassword,
} from '../hooks/useMembers.js';
import ImageEditor from '../components/member/ImageEditor.jsx';
import UploadProgress from '../components/member/UploadProgress.jsx';
import ProfileHeader from '../components/member/ProfileHeader.jsx';
import ProfileForm from '../components/member/ProfileForm.jsx';
import ProfileDisplay from '../components/member/ProfileDisplay.jsx';
import PasswordResetModal from '../components/member/PasswordResetModal.jsx';
import MessageNotification from '../components/member/MessageNotification.jsx';
import { validateFile, simulateProgress } from '../utils/fileUtils.js';

// Minimal ProfilePictureView modal
const ProfilePictureView = ({ image, onClose, onUploadNew }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 max-w-lg w-full flex flex-col items-center">
            <img src={image} alt="Profile" className="rounded-xl max-h-[60vh] object-contain mb-4" />
            <div className="flex gap-4 mt-2">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold"
                >
                    Close
                </button>
                <button
                    onClick={onUploadNew}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                    Upload New
                </button>
            </div>
        </div>
    </div>
);

const MemberProfile = () => {
    // --- HOOKS ---
    const { getCurrentMember, member, loading: memberLoading, error: memberError } = useGetCurrentMember();
    const { updateProfile, loading: updateLoading, error: updateError } = useUpdateProfile();
    const { uploadProfilePicture, loading: uploadLoading, error: uploadError } = useUploadProfilePicture();
    const { uploadResume, loading: uploadResumeLoading, error: uploadResumeError } = useUploadResume();
    const { resetPassword, loading: resetLoading, error: resetError } = useResetPassword();

    // --- STATE ---
    const [isEditing, setIsEditing] = useState(false);
    const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        program: '',
        year: '',
        hosteler: false,
        hostel: '',
        socialLinks: [],
        bio: '',
        skills: [],
    });
    const [message, setMessage] = useState('');
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    // Profile picture workflow
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [editorImage, setEditorImage] = useState(null); // string (URL)
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [originalFile, setOriginalFile] = useState(null);
    const [showProfilePictureView, setShowProfilePictureView] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);

    // --- REFS ---
    const fileInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    // --- DATA FETCHING & STATE SYNC ---
    useEffect(() => {
        if (!hasInitiallyFetched) {
            setHasInitiallyFetched(true);
            getCurrentMember().catch((err) => {
                console.error("Failed to fetch member data:", err);
                setMessage('Failed to load member data. Please try again.');
            });
        }
    }, [getCurrentMember, hasInitiallyFetched]);

    useEffect(() => {
        if (member?._id) {
            setFormData({
                email: member.email || '',
                phone: member.phone || '',
                program: member.program || '',
                year: member.year || '',
                hosteler: member.hosteler || false,
                hostel: member.hostel || '',
                socialLinks: member.socialLinks || [],
                bio: member.bio || '',
                skills: member.skills || [],
            });
        }
    }, [member]);

    useEffect(() => {
        const errors = [memberError, updateError, uploadError, uploadResumeError, resetError].filter(Boolean);
        if (errors.length > 0) {
            setMessage(errors[0]);
        }
    }, [memberError, updateError, uploadError, uploadResumeError, resetError]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // --- PROFILE PICTURE HANDLERS ---
    // Open profile picture view modal
    const handleProfilePictureView = useCallback(() => {
        setShowProfilePictureView(true);
    }, []);

    // Open image editor for cropping (from file input)
    const handleImageSelect = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = '';
        if (editorImage) {
            URL.revokeObjectURL(editorImage);
        }
        const url = URL.createObjectURL(file);
        setOriginalFile(file);
        setEditorImage(url);
        setIsEditingImage(true);
        setShowImageEditor(true);
    }, [editorImage]);

    // Open image editor for viewing (from clicking profile picture)
    const handleProfilePictureClick = useCallback((imageUrl) => {
        if (!imageUrl) return;
        setEditorImage(imageUrl);
        setIsEditingImage(false);
        setShowImageEditor(true);
    }, []);

    // Save/crop/upload
    const handleImageSave = useCallback(async (croppedBlob) => {
        if (!croppedBlob) return;
        try {
            setShowImageEditor(false);
            if (editorImage && isEditingImage) {
                URL.revokeObjectURL(editorImage);
            }
            setUploadProgress({
                fileName: originalFile?.name || 'profile.jpg',
                progress: 0,
                type: 'image'
            });
            const progressInterval = simulateProgress(p =>
                setUploadProgress(prev => prev ? { ...prev, progress: p } : null)
            );
            const formDataToUpload = new FormData();
            formDataToUpload.append('profilePicture', croppedBlob, originalFile?.name || 'profile.jpg');
            await uploadProfilePicture(member._id, formDataToUpload);
            clearInterval(progressInterval);
            setUploadProgress(prev => prev ? { ...prev, progress: 100 } : null);
            setTimeout(() => {
                setUploadProgress(null);
                setOriginalFile(null);
            }, 1000);
            setMessage('Profile picture updated successfully!');
            await getCurrentMember();
        } catch (error) {
            console.error('Upload error:', error);
            setMessage('Failed to upload profile picture. Please try again.');
            setUploadProgress(null);
        }
    }, [member?._id, originalFile, editorImage, isEditingImage, uploadProfilePicture, getCurrentMember]);

    // Close image editor
    const handleImageEditorCancel = useCallback(() => {
        setShowImageEditor(false);
        if (editorImage && isEditingImage) {
            URL.revokeObjectURL(editorImage);
        }
        setOriginalFile(null);
    }, [editorImage, isEditingImage]);

    // --- OTHER HANDLERS ---
    const handleEditToggle = useCallback(() => setIsEditing(prev => !prev), []);
    const handleCancelEdit = useCallback(() => setIsEditing(false), []);
    const handlePasswordResetOpen = useCallback(() => setShowPasswordReset(true), []);
    const handlePasswordResetClose = useCallback(() => setShowPasswordReset(false), []);
    const handleMessageClose = useCallback(() => setMessage(''), []);
    const handleUploadProgressCancel = useCallback(() => setUploadProgress(null), []);

    // Resume upload
    const handleResumeUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = '';
        if (!member?._id) {
            setMessage('Unable to upload resume. Please refresh and try again.');
            return;
        }
        const validation = validateFile(file, 'document');
        if (!validation.isValid) {
            setMessage(validation.errors[0]);
            return;
        }
        try {
            setUploadProgress({
                fileName: file.name,
                progress: 0,
                type: 'document'
            });
            const progressInterval = simulateProgress(p =>
                setUploadProgress(prev => prev ? { ...prev, progress: p } : null)
            );
            const formDataToUpload = new FormData();
            formDataToUpload.append('resume', file);
            await uploadResume(member._id, formDataToUpload);
            clearInterval(progressInterval);
            setUploadProgress(prev => prev ? { ...prev, progress: 100 } : null);
            setTimeout(() => setUploadProgress(null), 1000);
            setMessage('Resume uploaded successfully!');
            await getCurrentMember();
        } catch (error) {
            console.error('Upload error:', error);
            setMessage('Failed to upload resume. Please try again.');
            setUploadProgress(null);
        }
    }, [member?._id, uploadResume, getCurrentMember]);

    // Password reset
    const handlePasswordReset = useCallback(async (e) => {
        e.preventDefault();
        if (!member?.LpuId) {
            setMessage('Unable to reset password. Please refresh and try again.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            setMessage('Password must be at least 8 characters long');
            return;
        }
        try {
            await resetPassword(member.LpuId, newPassword);
            setMessage('Password reset successfully!');
            setShowPasswordReset(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Password reset error:', error);
            setMessage('Failed to reset password. Please try again.');
        }
    }, [member?.LpuId, newPassword, confirmPassword, resetPassword]);

    // --- EARLY RETURNS ---
    if (memberLoading && !member) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="relative mb-6">
                        <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900 rounded-full mx-auto"></div>
                        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Loading Profile</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your information...</p>
                </motion.div>
            </div>
        );
    }

    if (!member && hasInitiallyFetched && !memberLoading) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Profile Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {memberError || 'We encountered an issue loading your profile. Please try refreshing the page.'}
                    </p>
                    <button
                        onClick={() => {
                            setHasInitiallyFetched(false);
                            setMessage('');
                        }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-lg"
                    >
                        Try Again
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MessageNotification message={message} onClose={handleMessageClose} />

                <AnimatePresence>
                    {uploadProgress && (
                        <UploadProgress
                            progress={uploadProgress.progress}
                            fileName={uploadProgress.fileName}
                            type={uploadProgress.type}
                            onCancel={handleUploadProgressCancel}
                        />
                    )}
                </AnimatePresence>

                {member && (
                    <div className="space-y-8">
                        <ProfileHeader
                            member={member}
                            isEditing={isEditing}
                            onEditToggle={handleEditToggle}
                            onPasswordReset={handlePasswordResetOpen}
                            onProfilePictureClick={handleProfilePictureClick}
                            uploadLoading={uploadLoading}
                            uploadResumeLoading={uploadResumeLoading}
                            fileInputRef={fileInputRef}
                            onImageSelect={handleImageSelect}
                            onResumeUpload={handleResumeUpload}
                        />

                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <ProfileForm
                                    key="profile-form"
                                    formData={formData}
                                    onInputChange={handleInputChange}
                                    onSocialLinkChange={handleSocialLinkChange}
                                    onAddSocialLink={addSocialLink}
                                    onRemoveSocialLink={removeSocialLink}
                                    onAddSkill={addSkill}
                                    onRemoveSkill={removeSkill}
                                    newSkill={newSkill}
                                    setNewSkill={setNewSkill}
                                    onSubmit={handleSubmit}
                                    onCancel={handleCancelEdit}
                                    isLoading={updateLoading}
                                />
                            ) : (
                                <ProfileDisplay
                                    key="profile-display"
                                    member={member}
                                    onEditToggle={handleEditToggle}
                                    onProfilePictureView={handleProfilePictureView}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Password modal */}
                <PasswordResetModal
                    isOpen={showPasswordReset}
                    onClose={handlePasswordResetClose}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    onSubmit={handlePasswordReset}
                    isLoading={resetLoading}
                />

                {/* Image Editor Modal */}
                <AnimatePresence>
                    {showImageEditor && editorImage && (
                        <ImageEditor
                            image={editorImage}
                            onSave={isEditingImage ? handleImageSave : undefined}
                            onCancel={handleImageEditorCancel}
                            isEditing={isEditingImage}
                            onUploadNew={() => fileInputRef.current?.click()}
                        />
                    )}
                </AnimatePresence>

                {/* Profile Picture View Modal */}
                <AnimatePresence>
                    {showProfilePictureView && member?.profilePicture?.url && (
                        <ProfilePictureView
                            image={member.profilePicture.url}
                            onClose={() => setShowProfilePictureView(false)}
                            onUploadNew={() => {
                                setShowProfilePictureView(false);
                                setTimeout(() => fileInputRef.current?.click(), 200);
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MemberProfile;
