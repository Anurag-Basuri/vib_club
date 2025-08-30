import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Edit3,
	Save,
	X,
	Upload,
	FileText,
	Camera,
	Shield,
	Award,
	Clock,
	AlertTriangle,
	CheckCircle,
	Plus,
	Trash2,
	Eye,
	EyeOff,
	Building,
	GraduationCap,
	Hash,
	Users,
	Settings,
	Lock,
	ImageIcon,
	RotateCcw,
	ZoomIn,
	ZoomOut,
	Move,
	Crop,
	Download,
} from 'lucide-react';
import {
	useGetCurrentMember,
	useUpdateProfile,
	useUploadProfilePicture,
	useUploadResume,
	useResetPassword,
} from '../hooks/useMembers.js';
import { useAuth } from '../hooks/useAuth.js';

// Sub-components
const ImageEditor = ({ image, onSave, onCancel }) => {
	const canvasRef = useRef(null);
	const [scale, setScale] = useState(1);
	const [rotation, setRotation] = useState(0);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	useEffect(() => {
		drawImage();
	}, [scale, rotation, position, image]);

	const drawImage = () => {
		const canvas = canvasRef.current;
		if (!canvas || !image) return;

		const ctx = canvas.getContext('2d');
		const img = new Image();

		img.onload = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.rotate((rotation * Math.PI) / 180);
			ctx.scale(scale, scale);
			ctx.translate(position.x, position.y);
			ctx.drawImage(img, -img.width / 2, -img.height / 2);
			ctx.restore();

			// Draw crop circle overlay
			ctx.beginPath();
			ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI);
			ctx.strokeStyle = '#00bcd4';
			ctx.lineWidth = 2;
			ctx.stroke();
		};

		img.src = image;
	};

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setDragStart({
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		});
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		setPosition({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y,
		});
	};

	const handleMouseUp = () => setIsDragging(false);

	const handleSave = () => {
		const canvas = canvasRef.current;
		const croppedCanvas = document.createElement('canvas');
		const croppedCtx = croppedCanvas.getContext('2d');

		croppedCanvas.width = 200;
		croppedCanvas.height = 200;

		croppedCtx.beginPath();
		croppedCtx.arc(100, 100, 100, 0, 2 * Math.PI);
		croppedCtx.clip();

		croppedCtx.drawImage(
			canvas,
			canvas.width / 2 - 100,
			canvas.height / 2 - 100,
			200,
			200,
			0,
			0,
			200,
			200
		);

		croppedCanvas.toBlob(
			(blob) => {
				onSave(blob);
			},
			'image/jpeg',
			0.9
		);
	};

	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-[#0d1326] rounded-2xl p-6 max-w-2xl w-full">
				<h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
					<Crop className="w-5 h-5 text-cyan-400" />
					Edit Profile Picture
				</h3>

				<div className="flex flex-col lg:flex-row gap-6">
					<div className="flex-1">
						<canvas
							ref={canvasRef}
							width={300}
							height={300}
							className="border border-gray-600 rounded-lg cursor-move bg-gray-800"
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseUp}
						/>
					</div>

					<div className="space-y-4 min-w-[200px]">
						<div>
							<label className="block text-gray-300 mb-2 text-sm">Zoom</label>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setScale(Math.max(0.5, scale - 0.1))}
									className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
								>
									<ZoomOut className="w-4 h-4" />
								</button>
								<input
									type="range"
									min="0.5"
									max="3"
									step="0.1"
									value={scale}
									onChange={(e) => setScale(parseFloat(e.target.value))}
									className="flex-1"
								/>
								<button
									onClick={() => setScale(Math.min(3, scale + 0.1))}
									className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
								>
									<ZoomIn className="w-4 h-4" />
								</button>
							</div>
						</div>

						<div>
							<label className="block text-gray-300 mb-2 text-sm">Rotation</label>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setRotation(rotation - 15)}
									className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
								>
									<RotateCcw className="w-4 h-4" />
								</button>
								<input
									type="range"
									min="0"
									max="360"
									value={rotation}
									onChange={(e) => setRotation(parseInt(e.target.value))}
									className="flex-1"
								/>
								<span className="text-gray-300 text-sm w-8">{rotation}°</span>
							</div>
						</div>

						<button
							onClick={() => {
								setScale(1);
								setRotation(0);
								setPosition({ x: 0, y: 0 });
							}}
							className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
						>
							<RotateCcw className="w-4 h-4" />
							Reset
						</button>
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<button
						onClick={onCancel}
						className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:scale-105 transition-transform"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

const UploadProgress = ({ progress, fileName, onCancel }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			className="fixed bottom-4 right-4 bg-[#0d1326] border border-gray-600 rounded-xl p-4 shadow-xl z-40 min-w-[300px]"
		>
			<div className="flex items-center justify-between mb-2">
				<span className="text-white font-medium truncate mr-2">{fileName}</span>
				<button onClick={onCancel} className="text-gray-400 hover:text-white">
					<X className="w-4 h-4" />
				</button>
			</div>
			<div className="w-full bg-gray-700 rounded-full h-2 mb-2">
				<div
					className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<div className="text-sm text-gray-400">{progress}% uploaded</div>
		</motion.div>
	);
};

const ProfileHeader = ({
	member,
	onEditToggle,
	onPasswordReset,
	onImageSelect,
	onResumeUpload,
	uploadLoading,
	uploadResumeLoading,
}) => {
	const fileInputRef = useRef(null);
	const resumeInputRef = useRef(null);
	const DepartmentIcon = getDepartmentIcon(member.department);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="glass-card rounded-3xl p-8 mb-8"
		>
			<div className="flex flex-col md:flex-row items-center md:items-start gap-8">
				<div className="relative group">
					<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-xl">
						{member.profilePicture?.url ? (
							<img
								src={member.profilePicture.url}
								alt={member.fullname}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
								<User className="w-16 h-16 text-white" />
							</div>
						)}
					</div>

					<div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
						<button
							onClick={() => fileInputRef.current?.click()}
							disabled={uploadLoading}
							className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full transform hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
							title="Upload new profile picture"
						>
							{uploadLoading ? (
								<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							) : (
								<Camera className="w-5 h-5" />
							)}
						</button>
					</div>

					{uploadLoading && (
						<div className="absolute -bottom-2 -right-2 w-3 h-3 bg-green-500 rounded-full"></div>
					)}

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={onImageSelect}
						className="hidden"
					/>
				</div>

				<div className="flex-1 text-center md:text-left">
					<div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
						<h1 className="text-3xl font-bold text-white">{member.fullname}</h1>
						<div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}
							>
								{member.status.charAt(0).toUpperCase() + member.status.slice(1)}
							</span>
							{member.restriction?.isRestricted && (
								<span className="px-3 py-1 rounded-full text-sm font-medium text-orange-400 bg-orange-500/20 border border-orange-500/30">
									Restricted
								</span>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div className="flex items-center gap-3">
							<div
								className={`p-2 rounded-lg bg-gradient-to-r ${getDesignationColor(member.designation)}`}
							>
								<Shield className="w-5 h-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Designation</p>
								<p className="text-white font-medium">{member.designation}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
								<DepartmentIcon className="w-5 h-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Department</p>
								<p className="text-white font-medium">{member.department}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
								<Hash className="w-5 h-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-gray-400">LPU ID</p>
								<p className="text-white font-medium">{member.LpuId}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
								<Calendar className="w-5 h-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Joined</p>
								<p className="text-white font-medium">
									{new Date(
										member.joinedAt || member.createdAt
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>

					<div className="flex flex-wrap gap-3">
						<button
							onClick={onEditToggle}
							className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:scale-105 transition-transform"
						>
							<Edit3 className="w-4 h-4" />
							Edit Profile
						</button>

						<button
							onClick={onPasswordReset}
							className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:scale-105 transition-transform"
						>
							<Lock className="w-4 h-4" />
							Reset Password
						</button>

						<div className="relative">
							<button
								onClick={() => resumeInputRef.current?.click()}
								disabled={uploadResumeLoading}
								className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
							>
								{uploadResumeLoading ? (
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								) : (
									<Upload className="w-4 h-4" />
								)}
								{member.resume?.url ? 'Update Resume' : 'Upload Resume'}
							</button>

							{member.resume?.url && (
								<div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full"></div>
							)}

							<input
								ref={resumeInputRef}
								type="file"
								accept=".pdf,.doc,.docx"
								onChange={onResumeUpload}
								className="hidden"
							/>
						</div>
					</div>
				</div>
			</div>

			{member.restriction?.isRestricted && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mt-6 p-4 bg-orange-500/20 border border-orange-500 rounded-xl"
				>
					<div className="flex items-center gap-2 mb-2">
						<AlertTriangle className="w-5 h-5 text-orange-400" />
						<span className="text-orange-300 font-medium">Account Restriction</span>
					</div>
					<p className="text-orange-200 text-sm">{member.restriction.reason}</p>
					{member.restriction.time && (
						<p className="text-orange-300 text-xs mt-1">
							Restricted on: {new Date(member.restriction.time).toLocaleDateString()}
						</p>
					)}
				</motion.div>
			)}
		</motion.div>
	);
};

const ProfileForm = ({
	member,
	formData,
	onInputChange,
	onSocialLinkChange,
	onAddSocialLink,
	onRemoveSocialLink,
	onAddSkill,
	onRemoveSkill,
	newSkill,
	setNewSkill,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: 'auto' }}
			exit={{ opacity: 0, height: 0 }}
			className="glass-card rounded-3xl p-8 mb-8"
		>
			<form onSubmit={onSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-gray-300 mb-2 font-medium">
							<Mail className="w-4 h-4 inline mr-2" />
							Email
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={onInputChange}
							className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
							placeholder="Enter your email"
						/>
					</div>

					<div>
						<label className="block text-gray-300 mb-2 font-medium">
							<Phone className="w-4 h-4 inline mr-2" />
							Phone Number
						</label>
						<input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={onInputChange}
							pattern="[0-9]{10}"
							className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
							placeholder="10-digit phone number"
						/>
					</div>

					<div>
						<label className="block text-gray-300 mb-2 font-medium">
							<GraduationCap className="w-4 h-4 inline mr-2" />
							Program
						</label>
						<input
							type="text"
							name="program"
							value={formData.program}
							onChange={onInputChange}
							className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
							placeholder="e.g., B.Tech CSE"
						/>
					</div>

					<div>
						<label className="block text-gray-300 mb-2 font-medium">
							<Calendar className="w-4 h-4 inline mr-2" />
							Year
						</label>
						<select
							name="year"
							value={formData.year}
							onChange={onInputChange}
							className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
						>
							<option value="">Select Year</option>
							<option value="1">1st Year</option>
							<option value="2">2nd Year</option>
							<option value="3">3rd Year</option>
							<option value="4">4th Year</option>
						</select>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<label className="flex items-center gap-2 text-gray-300">
						<input
							type="checkbox"
							name="hosteler"
							checked={formData.hosteler}
							onChange={onInputChange}
							className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500"
						/>
						<Building className="w-4 h-4" />
						Are you a hosteler?
					</label>
				</div>

				{formData.hosteler && (
					<div>
						<label className="block text-gray-300 mb-2 font-medium">
							<MapPin className="w-4 h-4 inline mr-2" />
							Hostel
						</label>
						<select
							name="hostel"
							value={formData.hostel}
							onChange={onInputChange}
							className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
						>
							<option value="">Select Hostel</option>
							<option value="BH-1">BH-1</option>
							<option value="BH-2">BH-2</option>
							<option value="BH-3">BH-3</option>
							<option value="BH-4">BH-4</option>
							<option value="BH-5">BH-5</option>
							<option value="BH-6">BH-6</option>
							<option value="BH-7">BH-7</option>
							<option value="GH-1">GH-1</option>
							<option value="GH-2">GH-2</option>
							<option value="GH-3">GH-3</option>
							<option value="GH-4">GH-4</option>
							<option value="GH-5">GH-5</option>
						</select>
					</div>
				)}

				<div>
					<label className="block text-gray-300 mb-2 font-medium">
						<Award className="w-4 h-4 inline mr-2" />
						Skills (Max 10)
					</label>
					<div className="flex flex-wrap gap-2 mb-3">
						{formData.skills.map((skill, index) => (
							<motion.span
								key={index}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
							>
								{skill}
								<button
									type="button"
									onClick={() => onRemoveSkill(index)}
									className="text-cyan-400 hover:text-cyan-200"
								>
									<X className="w-3 h-3" />
								</button>
							</motion.span>
						))}
					</div>
					{formData.skills.length < 10 && (
						<div className="flex gap-2">
							<input
								type="text"
								value={newSkill}
								onChange={(e) => setNewSkill(e.target.value)}
								onKeyPress={(e) =>
									e.key === 'Enter' && (e.preventDefault(), onAddSkill())
								}
								className="flex-1 px-4 py-2 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
								placeholder="Add a skill"
							/>
							<button
								type="button"
								onClick={onAddSkill}
								className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
							>
								<Plus className="w-4 h-4" />
							</button>
						</div>
					)}
				</div>

				<div>
					<label className="block text-gray-300 mb-2 font-medium">
						Social Links (Max 5)
					</label>
					<div className="space-y-3">
						{formData.socialLinks.map((link, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								className="flex gap-3"
							>
								<input
									type="text"
									value={link.platform}
									onChange={(e) =>
										onSocialLinkChange(index, 'platform', e.target.value)
									}
									className="w-1/3 px-4 py-2 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
									placeholder="Platform"
								/>
								<input
									type="url"
									value={link.url}
									onChange={(e) =>
										onSocialLinkChange(index, 'url', e.target.value)
									}
									className="flex-1 px-4 py-2 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
									placeholder="https://..."
								/>
								<button
									type="button"
									onClick={() => onRemoveSocialLink(index)}
									className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</motion.div>
						))}
					</div>
					{formData.socialLinks.length < 5 && (
						<button
							type="button"
							onClick={onAddSocialLink}
							className="mt-3 flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-xl hover:bg-cyan-500/30 transition-colors"
						>
							<Plus className="w-4 h-4" />
							Add Social Link
						</button>
					)}
				</div>

				<div>
					<label className="block text-gray-300 mb-2 font-medium">
						Bio (Max 500 characters)
					</label>
					<textarea
						name="bio"
						value={formData.bio}
						onChange={onInputChange}
						maxLength={500}
						rows={4}
						className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none"
						placeholder="Tell us about yourself..."
					/>
					<p className="text-gray-400 text-sm mt-1">
						{formData.bio.length}/500 characters
					</p>
				</div>

				<div className="flex justify-end gap-4">
					<button
						type="button"
						onClick={onCancel}
						className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
					>
						{isLoading ? (
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Saving...
							</div>
						) : (
							<div className="flex items-center gap-2">
								<Save className="w-4 h-4" />
								Save Changes
							</div>
						)}
					</button>
				</div>
			</form>
		</motion.div>
	);
};

const ProfileDisplay = ({ member, onEditToggle, onResumeUpload, uploadResumeLoading }) => {
	const resumeInputRef = useRef(null);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="grid grid-cols-1 md:grid-cols-2 gap-8"
		>
			<div className="glass-card rounded-3xl p-6">
				<h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
					<Mail className="w-5 h-5 text-cyan-400" />
					Contact Information
				</h3>
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<Mail className="w-5 h-5 text-cyan-400" />
						<div>
							<p className="text-gray-400 text-sm">Email</p>
							<p className="text-white">{member.email || 'Not provided'}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Phone className="w-5 h-5 text-green-400" />
						<div>
							<p className="text-gray-400 text-sm">Phone</p>
							<p className="text-white">{member.phone || 'Not provided'}</p>
						</div>
					</div>
				</div>
			</div>

			<div className="glass-card rounded-3xl p-6">
				<h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
					<GraduationCap className="w-5 h-5 text-purple-400" />
					Academic Information
				</h3>
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<GraduationCap className="w-5 h-5 text-purple-400" />
						<div>
							<p className="text-gray-400 text-sm">Program</p>
							<p className="text-white">{member.program || 'Not provided'}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Calendar className="w-5 h-5 text-orange-400" />
						<div>
							<p className="text-gray-400 text-sm">Year</p>
							<p className="text-white">
								{member.year
									? `${member.year}${member.year === 1 ? 'st' : member.year === 2 ? 'nd' : member.year === 3 ? 'rd' : 'th'} Year`
									: 'Not provided'}
							</p>
						</div>
					</div>
					{member.hosteler && (
						<div className="flex items-center gap-3">
							<Building className="w-5 h-5 text-blue-400" />
							<div>
								<p className="text-gray-400 text-sm">Hostel</p>
								<p className="text-white">{member.hostel || 'Not specified'}</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{member.skills && member.skills.length > 0 && (
				<div className="glass-card rounded-3xl p-6">
					<h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
						<Award className="w-5 h-5 text-yellow-400" />
						Skills
					</h3>
					<div className="flex flex-wrap gap-2">
						{member.skills.map((skill, index) => (
							<span
								key={index}
								className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30"
							>
								{skill}
							</span>
						))}
					</div>
				</div>
			)}

			{member.socialLinks && member.socialLinks.length > 0 && (
				<div className="glass-card rounded-3xl p-6">
					<h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
						<Users className="w-5 h-5 text-pink-400" />
						Social Links
					</h3>
					<div className="space-y-3">
						{member.socialLinks.map((link, index) => (
							<a
								key={index}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
							>
								<div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
								<div>
									<p className="text-white font-medium">{link.platform}</p>
									<p className="text-gray-400 text-sm truncate">{link.url}</p>
								</div>
							</a>
						))}
					</div>
				</div>
			)}

			{member.bio && (
				<div className="glass-card rounded-3xl p-6 md:col-span-2">
					<h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
						<FileText className="w-5 h-5 text-emerald-400" />
						About
					</h3>
					<p className="text-gray-300 leading-relaxed">{member.bio}</p>
				</div>
			)}

			{member.resume?.url && (
				<div className="glass-card rounded-3xl p-6">
					<h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
						<FileText className="w-5 h-5 text-red-400" />
						Resume
					</h3>
					<div className="space-y-3">
						<a
							href={member.resume.url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl hover:from-red-500/30 hover:to-pink-500/30 transition-colors border border-red-500/30"
						>
							<FileText className="w-8 h-8 text-red-400" />
							<div className="flex-1">
								<p className="text-white font-medium">View Resume</p>
								<p className="text-gray-400 text-sm">Click to open in new tab</p>
							</div>
							<div className="flex gap-2">
								<div className="w-2 h-2 bg-red-400 rounded-full"></div>
								<span className="text-xs text-red-400">PDF</span>
							</div>
						</a>

						<button
							onClick={() => resumeInputRef.current?.click()}
							className="w-full flex items-center justify-center gap-2 p-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
						>
							<Download className="w-5 h-5 text-gray-400" />
							Download Resume
						</button>
						<input
							ref={resumeInputRef}
							type="file"
							accept=".pdf,.doc,.docx"
							onChange={onResumeUpload}
							className="hidden"
						/>
					</div>
				</div>
			)}
		</motion.div>
	);
};

const PasswordResetModal = ({
	isOpen,
	onClose,
	newPassword,
	setNewPassword,
	confirmPassword,
	setConfirmPassword,
	showPassword,
	setShowPassword,
	showConfirmPassword,
	setShowConfirmPassword,
	onSubmit,
	isLoading,
}) => {
	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				onClick={(e) => e.stopPropagation()}
				className="glass-card rounded-3xl p-8 w-full max-w-md"
			>
				<h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
					<Lock className="w-6 h-6 text-purple-400" />
					Reset Password
				</h3>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="block text-gray-300 mb-2">New Password</label>
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all pr-12"
								placeholder="Enter new password"
								required
								minLength={8}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
							>
								{showPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					<div>
						<label className="block text-gray-300 mb-2">Confirm Password</label>
						<div className="relative">
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all pr-12"
								placeholder="Confirm new password"
								required
								minLength={8}
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
							>
								{showConfirmPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					<div className="flex gap-4 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
						>
							{isLoading ? (
								<div className="flex items-center justify-center gap-2">
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Resetting...
								</div>
							) : (
								'Reset Password'
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

const MessageNotification = ({ message, onClose }) => {
	if (!message) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={`fixed top-20 right-4 p-4 rounded-xl shadow-lg z-50 max-w-sm ${
				message.includes('successfully')
					? 'bg-green-500/20 border border-green-500 text-green-300'
					: 'bg-red-500/20 border border-red-500 text-red-300'
			}`}
		>
			<div className="flex items-center gap-2">
				{message.includes('successfully') ? (
					<CheckCircle className="w-5 h-5 flex-shrink-0" />
				) : (
					<AlertTriangle className="w-5 h-5 flex-shrink-0" />
				)}
				<span className="flex-1">{message}</span>
				<button
					onClick={onClose}
					className="ml-2 text-gray-400 hover:text-white flex-shrink-0"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
		</motion.div>
	);
};

// Helper functions
const getDesignationColor = (designation) => {
	const colors = {
		CEO: 'from-purple-500 to-pink-500',
		CTO: 'from-blue-500 to-cyan-500',
		CFO: 'from-green-500 to-emerald-500',
		CMO: 'from-orange-500 to-red-500',
		COO: 'from-indigo-500 to-purple-500',
		Head: 'from-yellow-500 to-orange-500',
		member: 'from-gray-500 to-slate-500',
	};
	return colors[designation] || colors['member'];
};

const getDepartmentIcon = (department) => {
	const icons = {
		HR: Users,
		Technical: Settings,
		Marketing: Award,
		Management: Building,
		'Content Writing': FileText,
		'Event Management': Calendar,
		Media: Camera,
		Design: Edit3,
		Coordinator: User,
		PR: Mail,
	};
	return icons[department] || User;
};

const getStatusColor = (status) => {
	const colors = {
		active: 'text-green-400 bg-green-500/20',
		banned: 'text-red-400 bg-red-500/20',
		removed: 'text-gray-400 bg-gray-500/20',
	};
	return colors[status] || colors['active'];
};

const validateFile = (file, type) => {
	const errors = [];

	if (type === 'image') {
		if (!file.type.startsWith('image/')) {
			errors.push('Please select a valid image file');
			return errors;
		}

		if (file.size > 5 * 1024 * 1024) {
			errors.push('Image size must be less than 5MB');
			return errors;
		}

		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				if (img.width < 100 || img.height < 100) {
					errors.push('Image must be at least 100x100 pixels');
				}
				resolve(errors);
			};
			img.src = URL.createObjectURL(file);
		});
	} else if (type === 'document') {
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		];

		if (!allowedTypes.includes(file.type)) {
			errors.push('Please select a valid document file (PDF, DOC, DOCX)');
			return errors;
		}

		if (file.size > 10 * 1024 * 1024) {
			errors.push('File size must be less than 10MB');
			return errors;
		}
	}

	return errors;
};

const simulateProgress = (onProgress) => {
	let progress = 0;
	const interval = setInterval(() => {
		progress += Math.random() * 15;
		if (progress >= 100) {
			progress = 100;
			clearInterval(interval);
		}
		onProgress(progress);
	}, 200);
	return interval;
};

// Main component
const MemberProfile = () => {
	// Custom hooks
	const {
		getCurrentMember,
		member,
		loading: memberLoading,
		error: memberError,
	} = useGetCurrentMember();
	const { updateProfile, loading: updateLoading, error: updateError } = useUpdateProfile();
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
	const { resetPassword, loading: resetLoading, error: resetError } = useResetPassword();
	const { user } = useAuth();

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

	const canvasRef = useRef(null);
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
			<div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] to-[#1a1f3a] flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-300 text-lg">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] to-[#1a1f3a] relative overflow-hidden">
			<div className="relative z-10 container mx-auto px-4 py-8 pt-24">
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

				<div className="max-w-4xl mx-auto">
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
								member={member}
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
				</div>
			</div>

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
	);
};

export default MemberProfile;
