import React from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiShield } from 'react-icons/fi';

const SettingsSection = ({ isEditing, setShowPasswordModal }) => {
	if (!isEditing) return null;

	return (
		<motion.div
			key="settings"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-6"
		>
			<motion.div
				whileHover={{ y: -2 }}
				className="glass-card p-6 rounded-2xl border border-white/5"
			>
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
					<FiSettings className="w-5 h-5 mr-2 text-gray-400" />
					Account Settings
				</h3>

				<div className="space-y-4">
					<div className="p-4 glass-card-primary rounded-xl border border-blue-400/20">
						<h4 className="font-medium text-blue-300 mb-2">Password Reset</h4>
						<p className="text-blue-200 text-sm mb-4">
							Change your password to keep your account secure.
						</p>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => setShowPasswordModal(true)}
							className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors duration-300 border border-blue-400/20 flex items-center space-x-2"
						>
							<FiSettings className="w-4 h-4" />
							<span>Change Password</span>
						</motion.button>
					</div>

					<div className="p-4 glass-card-error rounded-xl border border-red-400/20">
						<h4 className="font-medium text-red-300 mb-2">Account Actions</h4>
						<p className="text-red-200 text-sm mb-4">
							Need to deactivate your account or have concerns? Contact the
							administrators.
						</p>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => toast('Feature coming soon! 🚀')}
							className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors duration-300 border border-red-400/20"
						>
							Contact Admin
						</motion.button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default SettingsSection;
