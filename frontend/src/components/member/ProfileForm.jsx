import React from 'react';
import { motion } from 'framer-motion';
import {
	Mail,
	Phone,
	GraduationCap,
	Calendar,
	Building,
	MapPin,
	Award,
	Users,
	FileText,
	Save,
	X,
	Plus,
	Trash2,
} from 'lucide-react';

const ProfileForm = ({
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
			className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700"
		>
			<form onSubmit={onSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
							<Mail className="w-4 h-4 inline mr-2" />
							Email
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={onInputChange}
							className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
							placeholder="Enter your email"
						/>
					</div>

					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
							<Phone className="w-4 h-4 inline mr-2" />
							Phone Number
						</label>
						<input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={onInputChange}
							pattern="[0-9]{10}"
							className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
							placeholder="10-digit phone number"
						/>
					</div>

					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
							<GraduationCap className="w-4 h-4 inline mr-2" />
							Program
						</label>
						<input
							type="text"
							name="program"
							value={formData.program}
							onChange={onInputChange}
							className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
							placeholder="e.g., B.Tech CSE"
						/>
					</div>

					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
							<Calendar className="w-4 h-4 inline mr-2" />
							Year
						</label>
						<select
							name="year"
							value={formData.year}
							onChange={onInputChange}
							className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
						>
							<option value="">Select Year</option>
							<option value="1">1st Year</option>
							<option value="2">2nd Year</option>
							<option value="3">3rd Year</option>
							<option value="4">4th Year</option>
							<option value="5">5th Year</option>
						</select>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
						<input
							type="checkbox"
							name="hosteler"
							checked={formData.hosteler}
							onChange={onInputChange}
							className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
						/>
						<Building className="w-4 h-4" />
						Are you a hosteler?
					</label>
				</div>

				{formData.hosteler && (
					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
							<MapPin className="w-4 h-4 inline mr-2" />
							Hostel
						</label>
						<select
							name="hostel"
							value={formData.hostel}
							onChange={onInputChange}
							className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
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
					<label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
						<Award className="w-4 h-4 inline mr-2" />
						Skills (Max 10)
					</label>
					<div className="flex flex-wrap gap-2 mb-3">
						{formData.skills.map((skill, index) => (
							<motion.span
								key={index}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								className="flex items-center gap-1 px-2.5 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 rounded-full text-xs"
							>
								{skill}
								<button
									type="button"
									onClick={() => onRemoveSkill(index)}
									className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200"
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
								className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
								placeholder="Add a skill"
							/>
							<button
								type="button"
								onClick={onAddSkill}
								className="px-3 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm"
							>
								<Plus className="w-4 h-4" />
							</button>
						</div>
					)}
				</div>

				<div>
					<label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
						<Users className="w-4 h-4 inline mr-2" />
						Social Links (Max 5)
					</label>
					<div className="space-y-3">
						{formData.socialLinks.map((link, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								className="flex gap-2"
							>
								<input
									type="text"
									value={link.platform}
									onChange={(e) =>
										onSocialLinkChange(index, 'platform', e.target.value)
									}
									className="w-1/3 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
									placeholder="Platform"
								/>
								<input
									type="url"
									value={link.url}
									onChange={(e) =>
										onSocialLinkChange(index, 'url', e.target.value)
									}
									className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
									placeholder="https://..."
								/>
								<button
									type="button"
									onClick={() => onRemoveSocialLink(index)}
									className="px-2.5 py-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
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
							className="mt-3 flex items-center gap-2 px-3 py-2 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-500/30 transition-colors text-sm"
						>
							<Plus className="w-4 h-4" />
							Add Social Link
						</button>
					)}
				</div>

				<div>
					<label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
						<FileText className="w-4 h-4 inline mr-2" />
						Bio (Max 500 characters)
					</label>
					<textarea
						name="bio"
						value={formData.bio}
						onChange={onInputChange}
						maxLength={500}
						rows={4}
						className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none text-sm"
						placeholder="Tell us about yourself..."
					/>
					<p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
						{formData.bio.length}/500 characters
					</p>
				</div>

				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm disabled:opacity-50"
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

export default ProfileForm;
