import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import {
	useGetCurrentMember,
	useUpdateProfile,
	useUploadProfilePicture,
	useResetPassword,
} from '../hooks/useMembers';
import toast from 'react-hot-toast';

// Components
import {
	FloatingBackground,
	StatCard,
	LoadingScreen,
	ErrorScreen,
	ConfirmationDialog,
	PasswordChangeModal,
	ProfileHeader,
	ProfileTabs,
	PersonalInfoSection,
	ClubInfoSection,
	BioSection,
	SocialLinksSection,
	SettingsSection,
	MemberInfo,
	StatusBadge,
	UnsavedChangesWarning,
	MemberStats,
} from '../components/member/';

// Constants
const HOSTELS = [
	'BH-1',
	'BH-2',
	'BH-3',
	'BH-4',
	'BH-5',
	'BH-6',
	'BH-7',
	'GH-1',
	'GH-2',
	'GH-3',
	'GH-4',
	'GH-5',
];

const SOCIAL_PLATFORMS = [
	'LinkedIn',
	'GitHub',
	'Instagram',
	'Twitter',
	'Facebook',
	'LeetCode',
	'Codeforces',
	'CodeChef',
	'YouTube',
	'Medium',
];

const MAX_BIO_LENGTH = 500;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// Main component
const MemberProfilePage = () => {
	const { user, logoutMember: logout } = useAuth();
	const { getCurrentMember, member, loading, error } = useGetCurrentMember();
	const { updateProfile, loading: updating } = useUpdateProfile();
	const { uploadProfilePicture, loading: uploading } = useUploadProfilePicture();
	const { resetPassword, loading: resettingPassword } = useResetPassword();

	// State management
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState('profile');
	const [formData, setFormData] = useState({
		fullname: '',
		program: '',
		year: 1,
		hosteler: false,
		hostel: '',
		department: '',
		designation: '',
		bio: '',
	});
	const [socialLinks, setSocialLinks] = useState([]);
	const [profileImage, setProfileImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);

	const fileInputRef = useRef(null);

	// Initialize form data
	const initializeFormData = useCallback((memberData) => {
		if (!memberData) return;

		setFormData({
			fullname: memberData.fullname || '',
			program: memberData.program || '',
			year: memberData.year || 1,
			hosteler: memberData.hosteler || false,
			hostel: memberData.hostel || '',
			department: memberData.department || '',
			designation: memberData.designation || '',
			bio: memberData.bio || '',
		});

		setSocialLinks(memberData.socialLinks ? [...memberData.socialLinks] : []);
		setHasUnsavedChanges(false);
	}, []);

	// Fetch member data on mount
	useEffect(() => {
		if (user?.memberID) {
			getCurrentMember();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.memberID]);

	// Update form data when member data loads
	useEffect(() => {
		initializeFormData(member);
	}, [member, initializeFormData]);

	// Handle input changes with unsaved changes tracking
	const handleInputChange = useCallback((e) => {
		const { name, value, type, checked } = e.target;
		const newValue = type === 'checkbox' ? checked : value;

		setFormData((prev) => ({
			...prev,
			[name]: newValue,
		}));

		setHasUnsavedChanges(true);
	}, []);

	// Handle social links
	const handleSocialLinkChange = useCallback(
		(index, field, value) => {
			const updatedLinks = [...socialLinks];
			updatedLinks[index][field] = value;
			setSocialLinks(updatedLinks);
			setHasUnsavedChanges(true);
		},
		[socialLinks]
	);

	const addSocialLink = useCallback(() => {
		setSocialLinks((prev) => [...prev, { platform: '', url: '' }]);
		setHasUnsavedChanges(true);
		toast.success('Social link field added!', { icon: '➕' });
	}, []);

	const removeSocialLink = useCallback((index) => {
		setSocialLinks((prev) => prev.filter((_, i) => i !== index));
		setHasUnsavedChanges(true);
		toast.success('Social link removed!', { icon: '🗑️' });
	}, []);

	// Handle profile image
	const handleImageSelect = useCallback((e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const validation = validateImageFile(file);
		if (!validation.isValid) {
			toast.error(validation.error, { icon: '❌' });
			return;
		}

		setProfileImage(file);

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => setImagePreview(e.target.result);
		reader.onerror = () => toast.error('Failed to read image file');
		reader.readAsDataURL(file);

		toast.success('Image selected! Click Save to upload.', { icon: '📸' });
	}, []);

	const handleImageUpload = useCallback(async () => {
		if (!profileImage || !member?._id) return;

		const uploadPromise = new Promise((resolve, reject) => {
			(async () => {
				try {
					const formDataToSend = new FormData();
					formDataToSend.append('profilePicture', profileImage);

					await uploadProfilePicture(member._id, formDataToSend);
					setProfileImage(null);
					setImagePreview(null);
					await getCurrentMember();
					resolve();
				} catch (error) {
					reject(error);
				}
			})();
		});

		toast.promise(uploadPromise, {
			loading: 'Uploading profile picture...',
			success: 'Profile picture updated successfully! 🎉',
			error: (err) => `Failed to upload: ${err.message || 'Unknown error'}`,
		});
	}, [profileImage, member?._id, uploadProfilePicture, getCurrentMember]);

	const cancelImageUpload = useCallback(() => {
		setProfileImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		toast('Image upload cancelled', { icon: '❌' });
	}, []);

	// Handle profile update
	const handleProfileUpdate = useCallback(
		async (e) => {
			e.preventDefault();
			if (!member?._id) return;

			// Validate form
			const validationErrors = validateForm(formData);
			if (validationErrors.length > 0) {
				validationErrors.forEach((error) => toast.error(error, { icon: '❌' }));
				return;
			}

			// Validate social links
			const invalidSocialLinks = socialLinks.filter(
				(link) => (link.platform && !link.url) || (!link.platform && link.url)
			);

			if (invalidSocialLinks.length > 0) {
				toast.error('Please complete all social link fields or remove empty ones', {
					icon: '❌',
				});
				return;
			}

			// Filter out empty social links
			const validSocialLinks = socialLinks.filter((link) => link.platform && link.url);

			const updatePromise = new Promise((resolve, reject) => {
				(async () => {
					try {
						await updateProfile(member._id, {
							...formData,
							socialLinks: validSocialLinks,
						});
						setIsEditing(false);
						setActiveTab('profile');
						setHasUnsavedChanges(false);
						await getCurrentMember();
						resolve();
					} catch (error) {
						reject(error);
					}
				})();
			});

			toast.promise(updatePromise, {
				loading: 'Updating profile...',
				success: 'Profile updated successfully! ✨',
				error: (err) => `Failed to update profile: ${err.message || 'Unknown error'}`,
			});
		},
		[member?._id, formData, socialLinks, updateProfile, getCurrentMember]
	);

	// Handle logout
	const handleLogout = useCallback(async () => {
		if (hasUnsavedChanges) {
			const confirmed = window.confirm(
				'You have unsaved changes. Are you sure you want to logout?'
			);
			if (!confirmed) return;
		}
		logout();
		toast.success('Logged out successfully! 👋');
	}, [hasUnsavedChanges, logout]);

	// Handle cancel edit
	const handleCancelEdit = useCallback(() => {
		if (hasUnsavedChanges) {
			const confirmed = window.confirm(
				'You have unsaved changes. Are you sure you want to cancel?'
			);
			if (!confirmed) return;
		}

		setIsEditing(false);
		setActiveTab('profile');
		initializeFormData(member);

		toast('Changes cancelled', { icon: '↩️' });
	}, [hasUnsavedChanges, member, initializeFormData]);

	// Handle tab change
	const handleTabChange = useCallback((tabId) => {
		setActiveTab(tabId);
	}, []);

	// Prevent navigation if unsaved changes
	useEffect(() => {
		const handleBeforeUnload = (e) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [hasUnsavedChanges]);

	// Handle password change
	const handlePasswordChange = async (oldPassword, newPassword) => {
		// Optionally, you can verify oldPassword on the frontend before sending
		if (!member?.LpuId) {
			toast.error('LPU ID not found. Cannot reset password.');
			return;
		}
		try {
			await resetPassword(member.LpuId, newPassword);
			toast.success('Password reset successfully!');
		} catch (err) {
			console.error('Failed to reset password:', err);
			toast.error('Failed to reset password.');
		}
	};

	// Show loading state
	if (loading) return <LoadingScreen />;

	// Show error state
	if (error) return <ErrorScreen error={error} onRetry={getCurrentMember} />;

	// Show error if no member data
	if (!member) {
		return <ErrorScreen error="Member data not found" onRetry={getCurrentMember} />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] text-white relative overflow-hidden">
			<FloatingBackground />
			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				<UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />

				<MemberStats member={member} />

				{/* Main Profile Card */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
				>
					<ProfileHeader
						member={member}
						isEditing={isEditing}
						setIsEditing={setIsEditing}
						handleCancelEdit={handleCancelEdit}
						updating={updating}
						handleProfileUpdate={handleProfileUpdate}
						setShowLogoutDialog={setShowLogoutDialog}
						profileImage={profileImage}
						imagePreview={imagePreview}
						fileInputRef={fileInputRef}
						handleImageSelect={handleImageSelect}
						handleImageUpload={handleImageUpload}
						cancelImageUpload={cancelImageUpload}
						uploading={uploading}
					/>

					{/* Profile Content */}
					<div className="pt-16 sm:pt-20 pb-6 sm:pb-8 px-6 sm:px-8">
						<MemberInfo member={member} />
						<StatusBadge member={member} />

						<ProfileTabs
							activeTab={activeTab}
							handleTabChange={handleTabChange}
							isEditing={isEditing}
						/>

						{/* Tab Content */}
						<AnimatePresence mode="wait">
							{/* Profile Tab */}
							{(!isEditing || activeTab === 'profile') && (
								<motion.div
									key="profile"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									className="space-y-6"
								>
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										<PersonalInfoSection
											member={member}
											isEditing={isEditing}
											formData={formData}
											handleInputChange={handleInputChange}
										/>

										<ClubInfoSection
											member={member}
											isEditing={isEditing}
											formData={formData}
											handleInputChange={handleInputChange}
										/>
									</div>

									<BioSection
										member={member}
										isEditing={isEditing}
										formData={formData}
										handleInputChange={handleInputChange}
									/>
								</motion.div>
							)}

							{/* Social Links Tab */}
							{isEditing && activeTab === 'social' && (
								<SocialLinksSection
									isEditing={isEditing}
									socialLinks={socialLinks}
									handleSocialLinkChange={handleSocialLinkChange}
									addSocialLink={addSocialLink}
									removeSocialLink={removeSocialLink}
									member={member}
								/>
							)}

							{/* Settings Tab */}
							{isEditing && activeTab === 'settings' && (
								<SettingsSection
									isEditing={isEditing}
									setShowPasswordModal={setShowPasswordModal}
								/>
							)}
						</AnimatePresence>

						{/* Display Social Links (when not editing) */}
						{!isEditing && (
							<SocialLinksSection
								isEditing={isEditing}
								socialLinks={socialLinks}
								handleSocialLinkChange={handleSocialLinkChange}
								addSocialLink={addSocialLink}
								removeSocialLink={removeSocialLink}
								member={member}
							/>
						)}
					</div>
				</motion.div>
			</div>

			{/* Confirmation Dialog for Logout */}
			<ConfirmationDialog
				open={showLogoutDialog}
				onCancel={() => setShowLogoutDialog(false)}
				onConfirm={handleLogout}
				title="Confirm Logout"
				message="Are you sure you want to logout?"
			/>

			{/* Password Change Modal */}
			<PasswordChangeModal
				isOpen={showPasswordModal}
				onClose={() => setShowPasswordModal(false)}
				onChangePassword={handlePasswordChange}
				loading={resettingPassword}
			/>
		</div>
	);
};

// Validation utilities
const validateForm = (formData) => {
	const errors = [];
	if (!formData.fullname?.trim()) {
		errors.push('Full name is required');
	}
	if (formData.fullname?.trim().length < 2) {
		errors.push('Full name must be at least 2 characters');
	}
	if (formData.bio && formData.bio.length > MAX_BIO_LENGTH) {
		errors.push(`Bio must be less than ${MAX_BIO_LENGTH} characters`);
	}
	return errors;
};

const validateImageFile = (file) => {
	if (!file) return { isValid: false, error: 'No file selected' };
	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
		return {
			isValid: false,
			error: 'Please select a valid image (JPEG, PNG, JPG, WebP)',
		};
	}
	if (file.size > MAX_FILE_SIZE) {
		return {
			isValid: false,
			error: 'Image size must be less than 5MB',
		};
	}
	return { isValid: true };
};

export default MemberProfilePage;
