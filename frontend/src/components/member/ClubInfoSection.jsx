import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiHome, FiCalendar } from 'react-icons/fi';

const ClubInfoSection = ({ member, isEditing, formData, handleInputChange }) => {
	return (
		<motion.div
			whileHover={{ y: -2 }}
			className="glass-card p-6 rounded-2xl border border-white/5"
		>
			<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
				<FiAward className="w-5 h-5 mr-2 text-purple-400" />
				Club Information
			</h3>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">Hosteler</label>
					{isEditing ? (
						<div className="flex items-center">
							<input
								type="checkbox"
								name="hosteler"
								checked={formData.hosteler}
								onChange={handleInputChange}
								className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/5"
							/>
							<span className="ml-3 text-white">Resides in hostel</span>
						</div>
					) : (
						<p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
							<FiHome className="w-4 h-4 mr-2 text-blue-400" />
							{member.hosteler ? 'Yes' : 'No'}
						</p>
					)}
				</div>

				{(formData.hosteler || member.hosteler) && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
					>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Hostel
						</label>
						{isEditing ? (
							<select
								name="hostel"
								value={formData.hostel}
								onChange={handleInputChange}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-300"
							>
								<option value="" className="bg-gray-800">
									Select Hostel
								</option>
								{HOSTELS.map((hostel) => (
									<option key={hostel} value={hostel} className="bg-gray-800">
										{hostel}
									</option>
								))}
							</select>
						) : (
							<p className="text-white bg-white/5 px-4 py-3 rounded-xl">
								{member.hostel || 'Not specified'}
							</p>
						)}
					</motion.div>
				)}

				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">
						Member Since
					</label>
					<p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
						<FiCalendar className="w-4 h-4 mr-2 text-blue-400" />
						{new Date(member.joinedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				</div>
			</div>
		</motion.div>
	);
};

export default ClubInfoSection;
