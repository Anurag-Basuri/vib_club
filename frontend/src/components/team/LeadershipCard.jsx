import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const LeadershipCard = ({ leader, index, onClick }) => (
	<motion.div
		className="relative"
		initial={{ opacity: 0, y: 50 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: index * 0.2, duration: 0.7 }}
		whileHover={{ y: -10, scale: 1.03 }}
		whileTap={{ scale: 0.98 }}
		onClick={() => onClick(leader)}
	>
		<div
			className={`relative p-6 rounded-2xl bg-gradient-to-br from-[#0a0f1f]/80 to-[#1a1f3a]/90 border border-[#3a56c9]/40 shadow-xl cursor-pointer ${leader.level === 0 ? 'w-full sm:w-80' : 'w-full sm:w-72'}`}
		>
			<div className="flex flex-col items-center">
				<div className="relative mb-4">
					<img
						src={leader?.profilePicture?.url || '/default-profile.png'}
						alt={leader?.fullName}
						className="w-24 h-24 rounded-full object-cover border-4 border-[#3a56c9]/40"
						onError={(e) => {
							e.target.src = '/default-profile.png';
						}}
					/>
					<div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center shadow-lg">
						<Star size={16} className="text-white" />
					</div>
				</div>
				<h3 className="text-xl font-bold text-white mb-1">{leader.fullName}</h3>
				<p className="text-[#5d7df5] font-medium mb-2">{leader.designation}</p>
				<p className="text-[#9ca3d4] text-sm text-center mb-4">
					{leader.bio || 'Passionate leader driving innovation'}
				</p>
			</div>
		</div>
	</motion.div>
);

export default LeadershipCard;
