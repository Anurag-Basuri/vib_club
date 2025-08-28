import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

const UnsavedChangesWarning = ({ hasUnsavedChanges }) => {
	if (!hasUnsavedChanges) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="mb-6 glass-card-error p-4 rounded-xl border border-orange-400/20 flex items-center space-x-3"
		>
			<FiAlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
			<p className="text-orange-200 text-sm">
				You have unsaved changes. Don't forget to save your updates!
			</p>
		</motion.div>
	);
};

export default UnsavedChangesWarning;
