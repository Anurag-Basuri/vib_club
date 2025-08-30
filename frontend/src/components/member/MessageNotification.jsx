import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const MessageNotification = ({ message, onClose }) => {
	if (!message) return null;

	const isSuccess = message.includes('successfully');

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
				isSuccess
					? 'bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300'
					: 'bg-red-100 dark:red-500/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300'
			}`}
		>
			<div className="flex items-center gap-2">
				{isSuccess ? (
					<CheckCircle className="w-5 h-5 flex-shrink-0" />
				) : (
					<AlertTriangle className="w-5 h-5 flex-shrink-0" />
				)}
				<span className="flex-1 text-sm">{message}</span>
				<button
					onClick={onClose}
					className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex-shrink-0"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
		</motion.div>
	);
};

export default MessageNotification;
