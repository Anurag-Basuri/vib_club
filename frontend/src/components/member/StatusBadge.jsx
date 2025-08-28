import React from 'react';
import { motion } from 'framer-motion';

const StatusBadge = ({ member }) => {
	const getStatusText = (status) => {
		switch (status) {
			case 'active':
				return '✅ Active Member';
			case 'banned':
				return '🚫 Banned';
			default:
				return '⏸️ Inactive';
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: 0.3 }}
			className="mb-6 sm:mb-8"
		>
			<span
				className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${
					member.status === 'active'
						? 'bg-green-500/20 text-green-300 border-green-400/30'
						: member.status === 'banned'
							? 'bg-red-500/20 text-red-300 border-red-400/30'
							: 'bg-gray-500/20 text-gray-300 border-gray-400/30'
				}`}
			>
				{getStatusText(member.status)}
			</span>

			{member.restriction?.isRestricted && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mt-3 glass-card-error p-3 rounded-xl border border-red-400/20"
				>
					<p className="text-red-300 text-sm font-medium">⚠️ Account Restricted</p>
					<p className="text-red-200 text-xs mt-1">Reason: {member.restriction.reason}</p>
					<p className="text-red-200 text-xs">
						Until: {new Date(member.restriction.time).toLocaleDateString()}
					</p>
				</motion.div>
			)}
		</motion.div>
	);
};

export default StatusBadge;
