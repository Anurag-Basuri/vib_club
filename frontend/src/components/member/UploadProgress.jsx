import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const UploadProgress = ({ progress, fileName, onCancel }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg z-40 min-w-[300px]"
		>
			<div className="flex items-center justify-between mb-2">
				<span className="text-gray-800 dark:text-white font-medium truncate mr-2">
					{fileName}
				</span>
				<button
					onClick={onCancel}
					className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
			<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
				<div
					className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<div className="text-sm text-gray-500 dark:text-gray-400">{progress}% uploaded</div>
		</motion.div>
	);
};

export default UploadProgress;
