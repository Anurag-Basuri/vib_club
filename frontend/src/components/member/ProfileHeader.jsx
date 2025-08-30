import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
	User,
	Camera,
	Upload,
	Edit3,
	Lock,
	Shield,
	Hash,
	Calendar,
	AlertTriangle,
} from 'lucide-react';
import { getDesignationColor, getDepartmentIcon, getStatusColor } from './utils';

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
			className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700"
		>
			<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
				<div className="relative group">
					<div className="w-28 h-28 rounded-full overflow-hidden border-4 border-cyan-100 dark:border-cyan-500/30 shadow-md">
						{member.profilePicture?.url ? (
							<img
								src={member.profilePicture.url}
								alt={member.fullname}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
								<User className="w-12 h-12 text-white" />
							</div>
						)}
					</div>

					<div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
						<button
							onClick={() => fileInputRef.current?.click()}
							disabled={uploadLoading}
							className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							title="Upload new profile picture"
						>
							{uploadLoading ? (
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							) : (
								<Camera className="w-4 h-4" />
							)}
						</button>
					</div>

					{uploadLoading && (
						<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
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
					<div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
						<h1 className="text-2xl font-bold text-gray-800 dark:text-white">
							{member.fullname}
						</h1>
						<div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
							<span
								className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}
							>
								{member.status.charAt(0).toUpperCase() + member.status.slice(1)}
							</span>
							{member.restriction?.isRestricted && (
								<span className="px-2.5 py-1 rounded-full text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30">
									Restricted
								</span>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div className="flex items-center gap-3">
							<div
								className={`p-2 rounded-lg ${getDesignationColor(member.designation)}`}
							>
								<Shield className="w-4 h-4 text-white" />
							</div>
							<div>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Designation
								</p>
								<p className="text-gray-800 dark:text-white font-medium">
									{member.designation}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-600">
								<DepartmentIcon className="w-4 h-4 text-white" />
							</div>
							<div>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Department
								</p>
								<p className="text-gray-800 dark:text-white font-medium">
									{member.department}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600">
								<Hash className="w-4 h-4 text-white" />
							</div>
							<div>
								<p className="text-xs text-gray-500 dark:text-gray-400">LPU ID</p>
								<p className="text-gray-800 dark:text-white font-medium">
									{member.LpuId}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600">
								<Calendar className="w-4 h-4 text-white" />
							</div>
							<div>
								<p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
								<p className="text-gray-800 dark:text-white font-medium">
									{new Date(
										member.joinedAt || member.createdAt
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<button
							onClick={onEditToggle}
							className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm"
						>
							<Edit3 className="w-4 h-4" />
							Edit Profile
						</button>

						<button
							onClick={onPasswordReset}
							className="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors text-sm"
						>
							<Lock className="w-4 h-4" />
							Reset Password
						</button>

						<div className="relative">
							<button
								onClick={() => resumeInputRef.current?.click()}
								disabled={uploadResumeLoading}
								className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm disabled:opacity-50"
							>
								{uploadResumeLoading ? (
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								) : (
									<Upload className="w-4 h-4" />
								)}
								{member.resume?.url ? 'Update Resume' : 'Upload Resume'}
							</button>

							{member.resume?.url && (
								<div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
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
					className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg"
				>
					<div className="flex items-center gap-2 mb-1">
						<AlertTriangle className="w-4 h-4 text-amber-500" />
						<span className="text-amber-700 dark:text-amber-400 font-medium text-sm">
							Account Restriction
						</span>
					</div>
					<p className="text-amber-600 dark:text-amber-300 text-xs">
						{member.restriction.reason}
					</p>
					{member.restriction.time && (
						<p className="text-amber-500 dark:text-amber-400 text-xs mt-1">
							Restricted on: {new Date(member.restriction.time).toLocaleDateString()}
						</p>
					)}
				</motion.div>
			)}
		</motion.div>
	);
};

export default ProfileHeader;
