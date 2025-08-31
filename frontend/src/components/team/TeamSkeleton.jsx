import React from 'react';
import { motion } from 'framer-motion';

const TeamSkeleton = () => {
	const skeletonItems = Array(6).fill(null);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
			{skeletonItems.map((_, index) => (
				<motion.div
					key={index}
					className="p-4 rounded-xl bg-[#1a244f]/30 border border-[#3a56c9]/20"
					initial={{ opacity: 0.5 }}
					animate={{ opacity: [0.5, 0.8, 0.5] }}
					transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
				>
					<div className="flex items-center mb-4">
						<div className="w-14 h-14 rounded-full bg-[#3a56c9]/20"></div>
						<div className="ml-3">
							<div className="h-4 w-24 bg-[#3a56c9]/20 rounded-md mb-2"></div>
							<div className="h-3 w-16 bg-[#3a56c9]/20 rounded-md"></div>
						</div>
					</div>
					<div className="flex gap-2 mb-4">
						{[1, 2].map((i) => (
							<div key={i} className="h-6 w-16 rounded-full bg-[#3a56c9]/20"></div>
						))}
					</div>
					<div className="h-3 w-full bg-[#3a56c9]/20 rounded-md"></div>
				</motion.div>
			))}
		</div>
	);
};

export default TeamSkeleton;
