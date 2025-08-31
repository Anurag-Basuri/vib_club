import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';

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
			className={`relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0a0f1f]/80 to-[#1a1f3a]/90 border border-[#3a56c9]/40 shadow-xl cursor-pointer hover:shadow-[0_0_30px_rgba(93,125,245,0.2)] hover:border-[#5d7df5]/60 transition-all duration-300 ${
				leader.level === 0 ? 'w-[260px] sm:w-80' : 'w-[220px] sm:w-72'
			}`}
		>
			{/* Enhanced glow effect */}
			<div className="absolute -inset-0.5 bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>

			{/* Leader badge with animation */}
			{leader.level === 0 && (
				<motion.div
					className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full"
					animate={{ y: [0, -3, 0] }}
					transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
				>
					Club Lead
				</motion.div>
			)}

			<div className="flex flex-col items-center relative z-10">
				<div className="relative mb-4">
					{/* Avatar glow */}
					<div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>

					<img
						src={leader?.profilePicture?.url || '/default-profile.png'}
						alt={leader?.fullName}
						className="relative z-10 w-24 h-24 rounded-full object-cover border-4 border-[#3a56c9]/40"
						onError={(e) => {
							e.target.src = '/default-profile.png';
						}}
					/>

					<motion.div
						className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center shadow-lg"
						animate={{
							rotate: [0, 360],
							scale: [1, 1.1, 1],
						}}
						transition={{
							rotate: { duration: 5, repeat: Infinity, ease: 'linear' },
							scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
						}}
					>
						<Star size={16} className="text-white" />
					</motion.div>
				</div>

				<h3 className="text-xl font-bold text-white mb-1">{leader.fullName}</h3>

				<div className="relative mb-2">
					<span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] blur-md opacity-30"></span>
					<p className="relative px-3 py-1 text-[#5d7df5] font-medium rounded-full text-center bg-[#1a244f]/80 border border-[#3a56c9]/30">
						{leader.designation}
					</p>
				</div>

				<p className="text-[#9ca3d4] text-sm text-center mb-4 max-w-[220px] line-clamp-2">
					{leader.bio || 'Passionate leader driving innovation'}
				</p>

				<motion.div
					className="flex items-center justify-center text-[#5d7df5] text-sm font-medium mt-2"
					whileHover={{ x: 3 }}
				>
					View Profile <ChevronRight size={16} className="ml-1" />
				</motion.div>
			</div>
		</div>
	</motion.div>
);

export default LeadershipCard;
