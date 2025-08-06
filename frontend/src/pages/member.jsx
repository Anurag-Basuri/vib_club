import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	User,
	Mail,
	BookOpen,
	Edit,
	Globe,
	Linkedin,
	Github,
	Lock,
	Upload,
	Check,
	Eye,
	EyeOff,
	X,
	Copy,
} from 'lucide-react';

const MemberProfile = () => {
	const [user, setUser] = useState({
		name: 'Alex Johnson',
		lpuId: 'LPU123456',
		email: 'alex.johnson@example.com',
		program: 'B.Tech Computer Science',
		year: '3rd Year',
		bio: 'Passionate about AI and machine learning. Currently working on a computer vision project.',
		social: {
			linkedin: 'https://linkedin.com/in/alexjohnson',
			github: 'https://github.com/alexjohnson',
		},
	});

	const [isEditing, setIsEditing] = useState(false);
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [showUpload, setShowUpload] = useState(false);
	const [tempUser, setTempUser] = useState({ ...user });
	const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [successMessage, setSuccessMessage] = useState('');
	const [profileImage, setProfileImage] = useState(null);
	const [copied, setCopied] = useState({ linkedin: false, github: false });
	const fileInputRef = useRef(null);

	// Calculate password strength
	useEffect(() => {
		if (!password.new) {
			setPasswordStrength(0);
			return;
		}

		let strength = 0;
		if (password.new.length >= 8) strength += 1;
		if (/[A-Z]/.test(password.new)) strength += 1;
		if (/[0-9]/.test(password.new)) strength += 1;
		if (/[^A-Za-z0-9]/.test(password.new)) strength += 1;

		setPasswordStrength(strength);
	}, [password.new]);

	const handleEditToggle = () => {
		if (isEditing) {
			// Save changes
			setUser({ ...tempUser });
			setIsEditing(false);
			setSuccessMessage('Profile updated successfully!');
			setTimeout(() => setSuccessMessage(''), 3000);
		} else {
			setTempUser({ ...user });
			setIsEditing(true);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setTempUser((prev) => ({ ...prev, [name]: value }));
	};

	const handleSocialChange = (e) => {
		const { name, value } = e.target;
		setTempUser((prev) => ({
			...prev,
			social: { ...prev.social, [name]: value },
		}));
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPassword((prev) => ({ ...prev, [name]: value }));
	};

	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		// Validate passwords match
		if (password.new !== password.confirm) {
			setSuccessMessage('Passwords do not match');
			setTimeout(() => setSuccessMessage(''), 3000);
			return;
		}

		// Reset form
		setPassword({ current: '', new: '', confirm: '' });
		setShowPasswordForm(false);
		setSuccessMessage('Password updated successfully!');
		setTimeout(() => setSuccessMessage(''), 3000);
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfileImage(reader.result);
				setSuccessMessage('Profile picture updated!');
				setTimeout(() => setSuccessMessage(''), 3000);
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	const copyToClipboard = (text, type) => {
		navigator.clipboard.writeText(text);
		setCopied({ ...copied, [type]: true });
		setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#050A30] to-[#0d0d1f] text-white p-4 md:p-8">
			{/* Success message */}
			<AnimatePresence>
				{successMessage && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
					>
						<Check size={20} />
						<span>{successMessage}</span>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Hero Banner */}
			<div className="relative rounded-2xl overflow-hidden mb-8">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-md"></div>
				<div className="absolute inset-0 bg-grid-white/[0.05]"></div>

				<div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
					<div className="text-center md:text-left mb-6 md:mb-0">
						<motion.h1
							className="text-3xl md:text-4xl font-bold mb-2"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							Welcome back,{' '}
							<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
								{user.name}
							</span>
							!
						</motion.h1>
						<motion.p
							className="text-blue-300 max-w-md"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							Your profile is looking great. Keep up the amazing work!
						</motion.p>
					</div>

					<motion.div
						className="relative"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.3, type: 'spring' }}
					>
						<div className="relative group">
							<div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20 relative">
								{profileImage ? (
									<img
										src={profileImage}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="bg-gray-700 w-full h-full flex items-center justify-center">
										<User size={64} className="text-gray-400" />
									</div>
								)}
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full group-hover:opacity-100 opacity-0 transition-opacity"></div>
							</div>

							{/* Glowing border animation */}
							<motion.div
								className="absolute inset-0 rounded-full border-4 border-transparent"
								animate={{
									borderColor: [
										'rgba(59, 130, 246, 0)',
										'rgba(59, 130, 246, 0.5)',
										'rgba(59, 130, 246, 0)',
									],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									repeatType: 'loop',
								}}
							/>

							{/* Ripple effect */}
							<motion.div
								className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100"
								animate={{
									scale: [1, 1.2],
									opacity: [0, 0.5, 0],
								}}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									repeatType: 'loop',
								}}
							/>

							<button
								onClick={() => setShowUpload(true)}
								className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-2 shadow-lg hover:scale-105 transition-transform"
							>
								<Edit size={16} />
							</button>
						</div>
					</motion.div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
				{/* Left column - Profile Summary */}
				<div className="lg:col-span-2 space-y-8">
					{/* Profile Summary Card */}
					<motion.div
						className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<div className="flex justify-between items-start mb-6">
							<h2 className="text-xl font-bold flex items-center gap-2">
								<User size={20} />
								Profile Summary
							</h2>
							<button
								onClick={handleEditToggle}
								className="flex items-center gap-1 text-sm bg-gradient-to-r from-blue-600 to-indigo-700 px-3 py-1 rounded-lg hover:scale-105 transition-transform"
							>
								<Edit size={16} />
								{isEditing ? 'Save' : 'Edit'}
							</button>
						</div>

						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="text-blue-300 text-sm">Full Name</label>
									{isEditing ? (
										<input
											type="text"
											name="name"
											value={tempUser.name}
											onChange={handleInputChange}
											className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 mt-1"
										/>
									) : (
										<p className="text-lg">{user.name}</p>
									)}
								</div>

								<div>
									<label className="text-blue-300 text-sm">LPU ID</label>
									<p className="text-lg">{user.lpuId}</p>
								</div>
							</div>

							<div>
								<label className="text-blue-300 text-sm">Email</label>
								{isEditing ? (
									<input
										type="email"
										name="email"
										value={tempUser.email}
										onChange={handleInputChange}
										className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 mt-1"
									/>
								) : (
									<p className="text-lg">{user.email}</p>
								)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="text-blue-300 text-sm">Program</label>
									{isEditing ? (
										<input
											type="text"
											name="program"
											value={tempUser.program}
											onChange={handleInputChange}
											className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 mt-1"
										/>
									) : (
										<p className="text-lg">{user.program}</p>
									)}
								</div>

								<div>
									<label className="text-blue-300 text-sm">Year</label>
									{isEditing ? (
										<select
											name="year"
											value={tempUser.year}
											onChange={handleInputChange}
											className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 mt-1"
										>
											<option value="1st Year">1st Year</option>
											<option value="2nd Year">2nd Year</option>
											<option value="3rd Year">3rd Year</option>
											<option value="4th Year">4th Year</option>
										</select>
									) : (
										<p className="text-lg">{user.year}</p>
									)}
								</div>
							</div>

							<div>
								<label className="text-blue-300 text-sm">Bio</label>
								{isEditing ? (
									<textarea
										name="bio"
										value={tempUser.bio}
										onChange={handleInputChange}
										rows="3"
										className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 mt-1"
									/>
								) : (
									<p className="text-gray-300 mt-1">{user.bio}</p>
								)}
							</div>
						</div>
					</motion.div>

					{/* Social Links Section */}
					<motion.div
						className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
							<Globe size={20} />
							Social Links
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="group">
								<div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl border border-white/10 group-hover:border-blue-400 transition-colors">
									<div className="flex items-center gap-3">
										<div className="bg-blue-500/10 p-2 rounded-lg">
											<Linkedin size={24} className="text-blue-400" />
										</div>
										<div>
											<h3 className="font-medium">LinkedIn</h3>
											{isEditing ? (
												<input
													type="text"
													name="linkedin"
													value={tempUser.social.linkedin}
													onChange={handleSocialChange}
													className="w-full bg-transparent text-sm text-gray-300 mt-1 border-b border-white/20 focus:border-blue-400 outline-none"
												/>
											) : (
												<p className="text-sm text-gray-300 truncate max-w-[150px]">
													{user.social.linkedin}
												</p>
											)}
										</div>
									</div>

									{!isEditing && (
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() =>
												copyToClipboard(user.social.linkedin, 'linkedin')
											}
											className="text-gray-400 hover:text-white"
										>
											{copied.linkedin ? (
												<Check size={18} />
											) : (
												<Copy size={18} />
											)}
										</motion.button>
									)}
								</div>
							</div>

							<div className="group">
								<div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl border border-white/10 group-hover:border-blue-400 transition-colors">
									<div className="flex items-center gap-3">
										<div className="bg-blue-500/10 p-2 rounded-lg">
											<Github size={24} className="text-white" />
										</div>
										<div>
											<h3 className="font-medium">GitHub</h3>
											{isEditing ? (
												<input
													type="text"
													name="github"
													value={tempUser.social.github}
													onChange={handleSocialChange}
													className="w-full bg-transparent text-sm text-gray-300 mt-1 border-b border-white/20 focus:border-blue-400 outline-none"
												/>
											) : (
												<p className="text-sm text-gray-300 truncate max-w-[150px]">
													{user.social.github}
												</p>
											)}
										</div>
									</div>

									{!isEditing && (
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() =>
												copyToClipboard(user.social.github, 'github')
											}
											className="text-gray-400 hover:text-white"
										>
											{copied.github ? (
												<Check size={18} />
											) : (
												<Copy size={18} />
											)}
										</motion.button>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Right column - Actions */}
				<div className="space-y-8">
					{/* Upload Profile Picture */}
					<motion.div
						className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
							<Upload size={20} />
							Profile Picture
						</h2>

						<button
							onClick={triggerFileInput}
							className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
						>
							<Upload size={18} />
							Upload New Photo
						</button>

						<input
							type="file"
							ref={fileInputRef}
							onChange={handleImageUpload}
							className="hidden"
							accept="image/*"
						/>

						<p className="text-gray-400 text-sm mt-4 text-center">
							JPG, PNG or GIF. Max size 5MB.
						</p>
					</motion.div>

					{/* Reset Password */}
					<motion.div
						className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 }}
					>
						<div className="flex justify-between items-start mb-6">
							<h2 className="text-xl font-bold flex items-center gap-2">
								<Lock size={20} />
								Password & Security
							</h2>
							<button
								onClick={() => setShowPasswordForm(!showPasswordForm)}
								className="text-sm bg-gradient-to-r from-blue-600 to-indigo-700 px-3 py-1 rounded-lg hover:scale-105 transition-transform"
							>
								{showPasswordForm ? 'Cancel' : 'Change'}
							</button>
						</div>

						<AnimatePresence>
							{showPasswordForm && (
								<motion.form
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									onSubmit={handlePasswordSubmit}
									className="overflow-hidden"
								>
									<div className="space-y-4">
										<div>
											<label className="text-blue-300 text-sm mb-1 block">
												Current Password
											</label>
											<div className="relative">
												<input
													type={showCurrentPassword ? 'text' : 'password'}
													name="current"
													value={password.current}
													onChange={handlePasswordChange}
													className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
												/>
												<button
													type="button"
													onClick={() =>
														setShowCurrentPassword(!showCurrentPassword)
													}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
												>
													{showCurrentPassword ? (
														<EyeOff size={18} />
													) : (
														<Eye size={18} />
													)}
												</button>
											</div>
										</div>

										<div>
											<label className="text-blue-300 text-sm mb-1 block">
												New Password
											</label>
											<div className="relative">
												<input
													type={showNewPassword ? 'text' : 'password'}
													name="new"
													value={password.new}
													onChange={handlePasswordChange}
													className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
												/>
												<button
													type="button"
													onClick={() =>
														setShowNewPassword(!showNewPassword)
													}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
												>
													{showNewPassword ? (
														<EyeOff size={18} />
													) : (
														<Eye size={18} />
													)}
												</button>
											</div>

											{/* Password strength meter */}
											{password.new && (
												<div className="mt-2">
													<div className="flex gap-1 mb-1">
														{[1, 2, 3, 4].map((i) => (
															<div
																key={i}
																className={`h-1 flex-1 rounded-full ${
																	passwordStrength >= i
																		? i > 2
																			? 'bg-green-500'
																			: 'bg-yellow-500'
																		: 'bg-gray-700'
																}`}
															></div>
														))}
													</div>
													<p className="text-xs text-gray-400">
														{passwordStrength === 0
															? 'Very weak'
															: passwordStrength === 1
																? 'Weak'
																: passwordStrength === 2
																	? 'Medium'
																	: passwordStrength === 3
																		? 'Strong'
																		: 'Very strong'}
													</p>
												</div>
											)}
										</div>

										<div>
											<label className="text-blue-300 text-sm mb-1 block">
												Confirm New Password
											</label>
											<div className="relative">
												<input
													type={showConfirmPassword ? 'text' : 'password'}
													name="confirm"
													value={password.confirm}
													onChange={handlePasswordChange}
													className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
												/>
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword(!showConfirmPassword)
													}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
												>
													{showConfirmPassword ? (
														<EyeOff size={18} />
													) : (
														<Eye size={18} />
													)}
												</button>
											</div>
										</div>

										<button
											type="submit"
											className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 transition-all mt-2"
										>
											Update Password
										</button>
									</div>
								</motion.form>
							)}
						</AnimatePresence>
					</motion.div>

					{/* Program Information */}
					<motion.div
						className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
					>
						<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
							<BookOpen size={20} />
							Program Information
						</h2>

						<div className="space-y-4">
							<div className="p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl border border-white/10">
								<h3 className="text-blue-300 text-sm">Program</h3>
								<p className="font-medium">{user.program}</p>
							</div>

							<div className="p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl border border-white/10">
								<h3 className="text-blue-300 text-sm">Year</h3>
								<p className="font-medium">{user.year}</p>
							</div>

							<div className="p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl border border-white/10">
								<h3 className="text-blue-300 text-sm">LPU ID</h3>
								<p className="font-medium">{user.lpuId}</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Upload Profile Picture Modal */}
			<AnimatePresence>
				{showUpload && (
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowUpload(false)}
					>
						<motion.div
							className="bg-gradient-to-br from-[#0d0d1f] to-[#050A30] border border-white/10 rounded-2xl max-w-md w-full p-6"
							initial={{ scale: 0.8, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.8, y: -20 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-xl font-bold">Upload Profile Picture</h3>
								<button
									onClick={() => setShowUpload(false)}
									className="p-2 rounded-full hover:bg-white/10"
								>
									<X size={20} />
								</button>
							</div>

							<div
								className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center mb-6 cursor-pointer hover:border-blue-400 transition-colors"
								onClick={triggerFileInput}
							>
								<Upload size={48} className="mx-auto text-blue-400 mb-3" />
								<p className="font-medium">Click to upload or drag and drop</p>
								<p className="text-gray-400 text-sm mt-1">
									SVG, PNG, JPG or GIF (max. 5MB)
								</p>
							</div>

							<input
								type="file"
								ref={fileInputRef}
								onChange={handleImageUpload}
								className="hidden"
								accept="image/*"
							/>

							<div className="flex justify-end gap-3">
								<button
									onClick={() => setShowUpload(false)}
									className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={triggerFileInput}
									className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 transition-all"
								>
									Select Image
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MemberProfile;
