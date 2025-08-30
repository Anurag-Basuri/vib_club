import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
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
import { validateFile, simulateProgress } from '../components/member/utils.jsx';

const MemberProfile = () => {
	// Custom hooks
	const {
		getCurrentMember,
		member,
		loading: memberLoading,
		error: memberError,
	} = useGetCurrentMember();
	const { updateProfile,
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

		// Validate file
		const errors = await validateFile(file, 'image');
		if (errors.length > 0) {
			setMessage(errors[0]);
			return;
		}

		// Create image URL for editor
		const imageUrl = URL.createObjectURL(file);
		setSelectedImage(imageUrl);
		setShowImageEditor(true);
	};

	const handleImageSave = async (croppedBlob) => {
		try {
			setShowImageEditor(false);

			// Start upload progress simulation
			setUploadProgress({
				fileName: 'profile-picture.jpg',
				progress: 0,
			});

			const progressInterval = simulateProgress((progress) => {
				setUploadProgress((prev) => ({ ...prev, progress }));
			});

			const formData = new FormData();
			formData.append('profilePicture', croppedBlob, 'profile-picture.jpg');

			await uploadProfilePicture(member._id, formData);

			clearInterval(progressInterval);
			setUploadProgress(null);
			setMessage('Profile picture updated successfully!');
			await getCurrentMember();

			// Clear the file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		} catch (error) {
			setUploadProgress(null);
			setMessage('Failed to upload profile picture');
		}
	};

	const handleResumeUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file
		const errors = validateFile(file, 'document');
		if (errors.length > 0) {
			setMessage(errors[0]);
			return;
		}

		try {
			// Start upload progress
			setUploadProgress({
				fileName: file.name,
				progress: 0,
			});

			const progressInterval = simulateProgress((progress) => {
				setUploadProgress((prev) => ({ ...prev, progress }));
			});

			const formData = new FormData();
			formData.append('resume', file);

			await uploadResume(member._id, formData);

			clearInterval(progressInterval);
			setUploadProgress(null);
			setMessage('Resume uploaded successfully!');
			await getCurrentMember();

			// Clear the file input
			if (resumeInputRef.current) {
				resumeInputRef.current.value = '';
			}
		} catch (error) {
			setUploadProgress(null);
			setMessage('Failed to upload resume');
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

	// Loading state
	if (memberLoading || !member) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<MessageNotification message={message} onClose={() => setMessage('')} />

				<AnimatePresence>
					{uploadProgress && (
						<UploadProgress
							progress={uploadProgress.progress}
							fileName={uploadProgress.fileName}
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

				{showImageEditor && (
					<ImageEditor
						image={selectedImage}
						onSave={handleImageSave}
						onCancel={() => {
							setShowImageEditor(false);
							setSelectedImage(null);
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default MemberProfile;
