import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel }) => {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 30 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 30 }}
				className="glass-card p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-blue-400/20 relative"
			>
				<div className="flex items-center mb-4">
					<div className="bg-blue-500/20 text-blue-400 rounded-full p-2 mr-3">
						<FiAlertCircle className="w-6 h-6" />
					</div>
					<h3 className="text-lg font-bold text-blue-200">{title}</h3>
				</div>
				<p className="mb-6 text-blue-100">{message}</p>
				<div className="flex justify-end space-x-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onCancel}
						className="px-4 py-2 rounded-lg bg-gray-700/60 hover:bg-gray-600 text-gray-200 border border-gray-500/30 transition-all duration-200"
					>
						Cancel
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onConfirm}
						className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow border border-blue-400/30 transition-all duration-200"
					>
						Confirm
					</motion.button>
				</div>
				<button
					onClick={onCancel}
					className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
					aria-label="Close dialog"
				>
					<FiX className="w-5 h-5" />
				</button>
			</motion.div>
		</div>
	);
};

export default ConfirmationDialog;
