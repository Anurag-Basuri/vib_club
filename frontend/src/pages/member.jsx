import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

const MemberProfile = () => {
	const { user, loading, logoutMember } = useAuth();
	const [currentUser, setCurrentUser] = useState({});
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	// Password reset states
	const [resetEmail, setResetEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [LpuId, setLpuId] = useState('');

	// Profile update state
	const [updateProfile, setUpdateProfile] = useState({
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
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [activeTab, setActiveTab] = useState('profile');
	const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
	const [isUploading, setIsUploading] = useState(false);

	// Redirect if not logged in
	useEffect(() => {
		if (!user && !loading) {
			navigate('/auth');
		}
	}, [user, loading, navigate]);

	// Fetch current user data
	useEffect(() => {
		if (user) {
			setCurrentUser(user);
			setUpdateProfile({
				fullName: user.fullname || '',
				email: user.email || '',
				program: user.program || '',
				year: user.year || '',
				linkedIn: user.linkedIn || '',
				github: user.github || '',
				bio: user.bio || '',
			});
		}
	}, [user]);

	// Send reset password email
	const handleResetPassword = async (e) => {
		e.preventDefault();
		try {
			setStatusMessage({ text: 'Sending reset email...', type: 'info' });
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setStatusMessage({
				text: 'Password reset email sent! Check your inbox.',
				type: 'success',
			});
			setShowResetForm(false);
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
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
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
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setStatusMessage({ text: 'Profile updated successfully!', type: 'success' });
			setShowUpdateForm(false);
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
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));
			logoutMember();
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
			setIsUploading(true);
			setStatusMessage({ text: 'Uploading profile picture...', type: 'info' });
			// Simulate upload process
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Create a temporary URL for the uploaded image
			const tempUrl = URL.createObjectURL(file);

			setCurrentUser((prev) => ({
				...prev,
				profilePicture: { url: tempUrl, publicId: `temp-${Date.now()}` },
			}));

			setStatusMessage({ text: 'Profile picture updated successfully!', type: 'success' });
		} catch (error) {
			setStatusMessage({ text: 'Failed to upload profile picture.', type: 'error' });
		} finally {
			setIsUploading(false);
			e.target.value = null; // Reset file input
		}
	};

	// Trigger file input click
	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	// Handle profile update form changes
	const handleProfileChange = (e) => {
		const { name, value } = e.target;
		setUpdateProfile((prev) => ({ ...prev, [name]: value }));
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

	// Floating particles background
	useEffect(() => {
		const container = document.querySelector('.floating-particles');
		if (!container) return;

		const particles = [];
		const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

		for (let i = 0; i < 20; i++) {
			const particle = document.createElement('div');
			particle.className = 'absolute rounded-full';
			const size = Math.random() * 10 + 3;
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;
			const color = colors[Math.floor(Math.random() * colors.length)];
			particle.style.background = color;
			particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
			particle.style.left = `${Math.random() * 100}%`;
			particle.style.top = `${Math.random() * 100}%`;
			particle.style.opacity = `${Math.random() * 0.4 + 0.1}`;
			container.appendChild(particle);
			particles.push(particle);

			const duration = 8000 + Math.random() * 8000;
			particle.animate(
				[
					{ transform: 'translate(0, 0)' },
					{
						transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`,
					},
					{ transform: 'translate(0, 0)' },
				],
				{
					duration,
					iterations: Infinity,
					easing: 'ease-in-out',
				}
			);
		}

		return () => {
			particles.forEach((p) => p.remove());
		};
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0e17] to-[#0f172a] text-white overflow-hidden">
			{/* Animated background elements */}
			<div className="floating-particles fixed inset-0 w-full h-full z-0 pointer-events-none" />

			<div className="absolute inset-0 z-0">
				<div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow" />
				<div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl animate-pulse-slow" />
				<div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-indigo-500/12 blur-3xl animate-pulse-slow" />
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
									{currentUser.profilePicture?.url ? (
										<img
											src={currentUser.profilePicture.url}
											alt="Profile"
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="bg-blue-900/50 w-full h-full flex items-center justify-center">
											<span className="text-4xl">
												{currentUser.fullname?.charAt(0) || 'U'}
											</span>
										</div>
									)}

									{isUploading && (
										<div className="absolute inset-0 bg-black/70 flex items-center justify-center">
											<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
										</div>
									)}
								</div>

								<button
									onClick={triggerFileInput}
									className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
								<h2 className="text-xl font-bold">{currentUser.fullname}</h2>
								<p className="text-blue-300">
									{currentUser.designation} • {currentUser.department}
								</p>
								<p className="text-blue-400 text-sm mt-1">
									LPU ID: {currentUser.LpuId}
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
										<p>{currentUser.email || 'Not provided'}</p>
									</div>
									<div className="bg-blue-900/30 p-4 rounded-xl">
										<h3 className="text-blue-300 text-sm mb-1">Program</h3>
										<p>{currentUser.program || 'Not provided'}</p>
									</div>
									<div className="bg-blue-900/30 p-4 rounded-xl">
										<h3 className="text-blue-300 text-sm mb-1">Year</h3>
										<p>{currentUser.year || 'Not provided'}</p>
									</div>
									<div className="bg-blue-900/30 p-4 rounded-xl">
										<h3 className="text-blue-300 text-sm mb-1">Joined</h3>
										<p>
											{new Date(currentUser.joinedAt).toLocaleDateString() ||
												'Unknown'}
										</p>
									</div>
								</div>

								<div className="mb-6">
									<h3 className="text-blue-300 text-sm mb-1">Social Links</h3>
									<div className="flex space-x-4">
										{currentUser.linkedIn && (
											<a
												href={currentUser.linkedIn}
												target="_blank"
												rel="noopener noreferrer"
												className="p-2 bg-blue-900/50 rounded-lg hover:bg-blue-800 transition"
											>
												<svg
													className="w-6 h-6"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
												</svg>
											</a>
										)}
										{currentUser.github && (
											<a
												href={currentUser.github}
												target="_blank"
												rel="noopener noreferrer"
												className="p-2 bg-blue-900/50 rounded-lg hover:bg-blue-800 transition"
											>
												<svg
													className="w-6 h-6"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
												</svg>
											</a>
										)}
										{!currentUser.linkedIn && !currentUser.github && (
											<p className="text-blue-400">No social links added</p>
										)}
									</div>
								</div>

								<div>
									<h3 className="text-blue-300 text-sm mb-1">Bio</h3>
									<p className="bg-blue-900/30 p-4 rounded-xl min-h-[100px]">
										{currentUser.bio || 'No bio provided'}
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
															currentUser.status === 'active'
																? 'bg-green-500/20 text-green-400'
																: currentUser.status === 'banned'
																	? 'bg-red-500/20 text-red-400'
																	: 'bg-gray-500/20'
														}`}
													>
														{currentUser.status || 'Unknown'}
													</span>
												</div>

												{currentUser.restriction?.isRestricted && (
													<div className="mt-4">
														<div className="flex justify-between mb-2">
															<span>Restricted Until:</span>
															<span>
																{new Date(
																	currentUser.restriction.time
																).toLocaleString()}
															</span>
														</div>
														<div>
															<span>Reason:</span>
															<p className="mt-1 bg-blue-900/50 p-2 rounded">
																{currentUser.restriction.reason}
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
												<p className="mb-4">
													Enter your new password below:
												</p>

												<form onSubmit={handleNewPassword}>
													<div className="mb-4">
														<label className="block text-blue-300 mb-2">
															LPU ID
														</label>
														<input
															type="text"
															value={LpuId}
															onChange={(e) =>
																setLpuId(e.target.value)
															}
															placeholder="Your LPU ID"
															className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
															required
														/>
													</div>

													<div className="mb-4">
														<label className="block text-blue-300 mb-2">
															New Password
														</label>
														<div className="relative">
															<input
																type={
																	showPassword
																		? 'text'
																		: 'password'
																}
																value={newPassword}
																onChange={(e) =>
																	setNewPassword(e.target.value)
																}
																placeholder="Enter new password"
																className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
																required
															/>
															<button
																type="button"
																className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300"
																onClick={() =>
																	setShowPassword(!showPassword)
																}
															>
																{showPassword ? (
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="h-5 w-5"
																		viewBox="0 0 20 20"
																		fill="currentColor"
																	>
																		<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
																		<path
																			fillRule="evenodd"
																			d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
																			clipRule="evenodd"
																		/>
																	</svg>
																) : (
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="h-5 w-5"
																		viewBox="0 0 20 20"
																		fill="currentColor"
																	>
																		<path
																			fillRule="evenodd"
																			d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
																			clipRule="evenodd"
																		/>
																		<path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
																	</svg>
																)}
															</button>
														</div>
													</div>

													<button
														type="submit"
														className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold"
													>
														Update Password
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
												<p className="mb-4">
													Enter your email to receive a password reset
													link:
												</p>

												<form onSubmit={handleResetPassword}>
													<div className="mb-4">
														<label className="block text-blue-300 mb-2">
															Email
														</label>
														<input
															type="email"
															value={resetEmail}
															onChange={(e) =>
																setResetEmail(e.target.value)
															}
															placeholder="Your registered email"
															className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
															required
														/>
													</div>

													<button
														type="submit"
														className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold"
													>
														Send Reset Link
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
											<label className="block text-blue-300 mb-2">
												Full Name
											</label>
											<input
												type="text"
												name="fullName"
												value={updateProfile.fullName}
												onChange={handleProfileChange}
												className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
												required
											/>
										</div>

										<div>
											<label className="block text-blue-300 mb-2">
												Email
											</label>
											<input
												type="email"
												name="email"
												value={updateProfile.email}
												onChange={handleProfileChange}
												className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
												required
											/>
										</div>

										<div>
											<label className="block text-blue-300 mb-2">
												Program
											</label>
											<input
												type="text"
												name="program"
												value={updateProfile.program}
												onChange={handleProfileChange}
												className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
											/>
										</div>

										<div>
											<label className="block text-blue-300 mb-2">Year</label>
											<select
												name="year"
												value={updateProfile.year}
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
											<label className="block text-blue-300 mb-2">
												LinkedIn
											</label>
											<input
												type="url"
												name="linkedIn"
												value={updateProfile.linkedIn}
												onChange={handleProfileChange}
												placeholder="https://linkedin.com/in/yourname"
												className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400"
											/>
										</div>

										<div>
											<label className="block text-blue-300 mb-2">
												GitHub
											</label>
											<input
												type="url"
												name="github"
												value={updateProfile.github}
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
											value={updateProfile.bio}
											onChange={handleProfileChange}
											placeholder="Tell us about yourself..."
											className="w-full px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-white focus:outline-none focus:border-blue-400 min-h-[150px]"
											maxLength="500"
										></textarea>
										<p className="text-right text-blue-400 text-sm mt-1">
											{updateProfile.bio.length}/500 characters
										</p>
									</div>

									<button
										type="submit"
										className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold"
									>
										Update Profile
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
