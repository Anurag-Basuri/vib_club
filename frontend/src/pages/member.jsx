import React, { useState, useEffect, useRef } from 'react';
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

const MemberProfile = () => {
    // Custom hooks
    const {
        getCurrentMember,
        member,
        loading: memberLoading,
        error: memberError,
    } = useGetCurrentMember();
    const { 
        updateProfile,
        loading: updateLoading,
        error: updateError
    } = useUpdateProfile();
    const {
        uploadProfilePicture,
        loading: uploadLoading,
        error: uploadError,
    } = useUploadProfilePicture();
    const {
        uploadResume,
        loading: uploadResumeLoading,
        error: uploadResumeError,
    } = useUploadResume();
    const {
        resetPassword,
        loading: resetLoading,
        error: resetError
    } = useResetPassword();

    // Local state
    const [isEditing, setIsEditing] = useState(false);
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

    // Image editing state
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [originalFile, setOriginalFile] = useState(null);

    // Upload progress state
    const [uploadProgress, setUploadProgress] = useState(null);

    const fileInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    // Auto-clear message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Fetch current member on component mount
    useEffect(() => {
        const fetchMember = async () => {
            try {
                await getCurrentMember();
            } catch (error) {
                console.error('Error fetching member:', error);
                setMessage('Failed to load member data. Please refresh the page.');
            }
        };
        
        fetchMember();
    }, []);

    // Update form data when member data is loaded
    useEffect(() => {
        if (member) {
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

    // Handle errors and success messages
    useEffect(() => {
        if (memberError || updateError || uploadError || uploadResumeError || resetError) {
            setMessage(
                memberError || updateError || uploadError || uploadResumeError || resetError
            );
        }
    }, [memberError, updateError, uploadError, uploadResumeError, resetError]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSocialLinkChange = (index, field, value) => {
        const updatedLinks = [...formData.socialLinks];
        updatedLinks[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            socialLinks: updatedLinks,
        }));
    };

    const addSocialLink = () => {
        if (formData.socialLinks.length < 5) {
            setFormData((prev) => ({
                ...prev,
                socialLinks: [...prev.socialLinks, { platform: '', url: '' }],
            }));
        }
    };

    const removeSocialLink = (index) => {
        setFormData((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index),
        }));
    };

    const addSkill = () => {
        if (
            newSkill.trim() &&
            formData.skills.length < 10 &&
            !formData.skills.includes(newSkill.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (index) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateProfile(member._id, formData);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            await getCurrentMember();
        } catch (error) {
            setMessage('Failed to update profile. Please try again.');
            console.error('Profile update error:', error);
        }
    };

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        e.target.value = '';

        const validation = validateFile(file, 'image');
        if (!validation.isValid) {
            setMessage(validation.errors[0]);
            return;
        }

        try {
            setOriginalFile(file);
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setShowImageEditor(true);
        } catch (error) {
            setMessage('Failed to process image. Please try again.');
            console.error('Image processing error:', error);
        }
    };

    const handleImageSave = async (croppedBlob) => {
        try {
            setShowImageEditor(false);
            
            if (selectedImage) {
                URL.revokeObjectURL(selectedImage);
                setSelectedImage(null);
            }

            setUploadProgress({
                fileName: originalFile?.name || 'profile-picture.jpg',
                progress: 0,
                type: 'image'
            });

            const progressInterval = simulateProgress((progress) => {
                setUploadProgress((prev) => prev ? { ...prev, progress } : null);
            });

            const formDataToUpload = new FormData();
            formDataToUpload.append('profilePicture', croppedBlob, originalFile?.name || 'profile-picture.jpg');

            await uploadProfilePicture(member._id, formDataToUpload);

            clearInterval(progressInterval);
            setUploadProgress((prev) => prev ? { ...prev, progress: 100 } : null);
            
            setTimeout(() => {
                setUploadProgress(null);
                setOriginalFile(null);
            }, 1000);
            
            setMessage('Profile picture updated successfully!');
            await getCurrentMember();

        } catch (error) {
            setUploadProgress(null);
            setMessage('Failed to upload profile picture. Please try again.');
            console.error('Upload error:', error);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        e.target.value = '';

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

            const progressInterval = simulateProgress((progress) => {
                setUploadProgress((prev) => prev ? { ...prev, progress } : null);
            });

            const formDataToUpload = new FormData();
            formDataToUpload.append('resume', file);

            await uploadResume(member._id, formDataToUpload);

            clearInterval(progressInterval);
            setUploadProgress((prev) => prev ? { ...prev, progress: 100 } : null);
            
            setTimeout(() => {
                setUploadProgress(null);
            }, 1000);
            
            setMessage('Resume uploaded successfully!');
            await getCurrentMember();

        } catch (error) {
            setUploadProgress(null);
            setMessage('Failed to upload resume. Please try again.');
            console.error('Upload error:', error);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

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
            setMessage('Failed to reset password');
            console.error('Password reset error:', error);
        }
    };

    const handleImageEditorCancel = () => {
        setShowImageEditor(false);
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage);
            setSelectedImage(null);
        }
        setOriginalFile(null);
    };

    // Loading state
    if (memberLoading) {
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

    // Error state
    if (!member && !memberLoading) {
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
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                        Profile Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {memberError || 'We encountered an issue loading your profile. Please try refreshing the page.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-lg"
                    >
                        Reload Page
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
            {/* Page Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Member Profile
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                            Manage your profile information, upload documents, and keep your details up to date.
                        </p>
                    </motion.div>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MessageNotification message={message} onClose={() => setMessage('')} />

                <AnimatePresence>
                    {uploadProgress && (
                        <UploadProgress
                            progress={uploadProgress.progress}
                            fileName={uploadProgress.fileName}
                            type={uploadProgress.type}
                            onCancel={() => setUploadProgress(null)}
                        />
                    )}
                </AnimatePresence>

                {member && (
                    <div className="space-y-8">
                        <ProfileHeader
                            member={member}
                            onEditToggle={() => setIsEditing(!isEditing)}
                            onPasswordReset={() => setShowPasswordReset(true)}
                            onImageSelect={handleImageSelect}
                            onResumeUpload={handleResumeUpload}
                            uploadLoading={uploadLoading}
                            uploadResumeLoading={uploadResumeLoading}
                            fileInputRef={fileInputRef}
                            resumeInputRef={resumeInputRef}
                            isEditing={isEditing}
                        />

                        <AnimatePresence>
                            {isEditing && (
                                <ProfileForm
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
                                    onCancel={() => setIsEditing(false)}
                                    isLoading={updateLoading}
                                />
                            )}
                        </AnimatePresence>

                        {!isEditing && (
                            <ProfileDisplay
                                member={member}
                                onEditToggle={() => setIsEditing(true)}
                                onResumeUpload={handleResumeUpload}
                                uploadResumeLoading={uploadResumeLoading}
                                resumeInputRef={resumeInputRef}
                            />
                        )}

                        <PasswordResetModal
                            isOpen={showPasswordReset}
                            onClose={() => setShowPasswordReset(false)}
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
                    </div>
                )}

                <AnimatePresence>
                    {showImageEditor && selectedImage && (
                        <ImageEditor
                            image={selectedImage}
                            onSave={handleImageSave}
                            onCancel={handleImageEditorCancel}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MemberProfile;
