import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiBook, FiCalendar } from 'react-icons/fi';

const PersonalInfoSection = ({ member, isEditing, formData, handleInputChange }) => {
	const getYearSuffix = (year) => {
		if (year === 1) return 'st';
		if (year === 2) return 'nd';
		if (year === 3) return 'rd';
		return 'th';
	};

	return (
		<motion.div
			whileHover={{ y: -2 }}
			className="glass-card p-6 rounded-2xl border border-white/5"
		>
			<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
				<FiUser className="w-5 h-5 mr-2 text-blue-400" />
				Personal Information
			</h3>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">
						Full Name {isEditing && <span className="text-red-400">*</span>}
					</label>
					{isEditing ? (
						<input
							type="text"
							name="fullname"
							value={formData.fullname}
							onChange={handleInputChange}
							className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
							required
							minLength="2"
							maxLength="100"
							aria-describedby="fullname-help"
						/>
					) : (
						<p className="text-white bg-white/5 px-4 py-3 rounded-xl">
							{member.fullname}
						</p>
					)}
					{isEditing && (
						<p id="fullname-help" className="text-xs text-gray-400 mt-1">
							Minimum 2 characters, maximum 100 characters
						</p>
					)}
				</div>

				{/* LPU ID (read-only) */}
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">LPU ID</label>
					<p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
						{member.LpuId}
					</p>
				</div>

				{/* Email (read-only) */}
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
					<p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
						<FiMail className="w-4 h-4 mr-2 text-blue-400" />
						{member.email}
					</p>
					<p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">Program</label>
					{isEditing ? (
						<input
							type="text"
							name="program"
							value={formData.program}
							onChange={handleInputChange}
							className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
							placeholder="e.g., Computer Science Engineering"
							maxLength="100"
						/>
					) : (
						<p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
							<FiBook className="w-4 h-4 mr-2 text-blue-400" />
							{member.program || 'Not specified'}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
					{isEditing ? (
						<select
							name="year"
							value={formData.year}
							onChange={handleInputChange}
							className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-300"
						>
							{[1, 2, 3, 4].map((year) => (
								<option key={year} value={year} className="bg-gray-800">
									{year}
									{getYearSuffix(year)} Year
								</option>
							))}
						</select>
					) : (
						<p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
							<FiCalendar className="w-4 h-4 mr-2 text-blue-400" />
							{member.year
								? `${member.year}${getYearSuffix(member.year)} Year`
								: 'Not specified'}
						</p>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default PersonalInfoSection;
