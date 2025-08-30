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
        getCurrentMember();
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
        }
    };

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset file input
        e.target.value = '';

        // Validate file
        const validation = validateFile(file, 'image');
        if (!validation.isValid) {
            setMessage(validation.errors[0]);
            return;
        }

        try {
            // Store original file and create preview
            setOriginalFile(file);
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setShowImageEditor(true);
        } catch (error) {
            setMessage('Failed to process image. Please try again.');
        }
    };

    const handleImageSave = async (croppedBlob) => {
        try {
            setShowImageEditor(false);
            
            // Cleanup image URL
            if (selectedImage) {
                URL.revokeObjectURL(selectedImage);
                setSelectedImage(null);
            }

            // Start upload progress simulation
            setUploadProgress({
                fileName: originalFile?.name || 'profile-picture.jpg',
                progress: 0,
                type: 'image'
            });

            const progressInterval = simulateProgress((progress) => {
                setUploadProgress((prev) => prev ? { ...prev, progress } : null);
            });

            // Create FormData with proper field name
            const formData = new FormData();
            formData.append('profilePicture', croppedBlob, originalFile?.name || 'profile-picture.jpg');

            // Upload using the hook
            await uploadProfilePicture(member._id, formData);

            // Complete progress and cleanup
            clearInterval(progressInterval);
            setUploadProgress(null);
            setOriginalFile(null);
            
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

        // Reset file input
        e.target.value = '';

        // Validate file
        const validation = validateFile(file, 'document');
        if (!validation.isValid) {
            setMessage(validation.errors[0]);
            return;
        }

        try {
            // Start upload progress
            setUploadProgress({
                fileName: file.name,
                progress: 0,
                type: 'document'
            });

            const progressInterval = simulateProgress((progress) => {
                setUploadProgress((prev) => prev ? { ...prev, progress } : null);
            });

            // Create FormData with proper field name
            const formData = new FormData();
            formData.append('resume', file);

            // Upload using the hook
            await uploadResume(member._id, formData);

            // Complete progress and cleanup
            clearInterval(progressInterval);
            setUploadProgress(null);
            
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

    // Loading state with modern design
    if (memberLoading || !member) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-4 font-medium">Loading your profile...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            ></div>
            
            <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
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
        </div>
    );
};

export default MemberProfile;
