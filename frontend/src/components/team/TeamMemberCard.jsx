import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Lock } from 'lucide-react';

const TeamMemberCard = ({ member, delay = 0, onClick, isAuthenticated }) => (
	<motion.div
		className="h-full group"
		initial={{ opacity: 0, y: 30 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: delay * 0.1, duration: 0.5 }}
		whileHover={{ y: -10 }}
		onClick={() => onClick(member)}
	>
		<div className="relative p-4 sm:p-6 rounded-xl bg-gradient-to-br from-[#0a0f1f]/80 to-[#1a1f3a]/90 border border-[#3a56c9]/40 shadow-lg h-full cursor-pointer group-hover:shadow-[0_0_25px_rgba(93,125,245,0.15)] group-hover:border-[#5d7df5]/60 transition-all duration-300">
			{/* Glowing effect on hover */}
			<div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>

			<div className="relative z-10">
				<div className="flex items-center mb-3">
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
						<img
							src={member?.profilePicture?.url || '/default-profile.png'}
							alt={member?.fullName}
							className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#3a56c9]/30 relative z-10"
							onError={(e) => {
								e.target.src = '/default-profile.png';
							}}
							loading="lazy"
						/>
						<motion.div
							className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center shadow-lg"
							initial={{ rotate: 0 }}
							animate={{ rotate: 360 }}
							transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
						>
							<Star size={10} className="text-white" />
						</motion.div>
					</div>
					<div className="ml-2 sm:ml-3">
						<h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-[#5d7df5] transition-colors line-clamp-1">
							{member.fullName}
						</h4>
						<p className="text-[#5d7df5] text-xs">{member.designation}</p>
					</div>
				</div>

				{/* Conditionally show LPU ID with authentication indicator */}
				<div className="mb-3 flex items-center text-xs">
					{isAuthenticated ? (
						<span className="text-[#9ca3d4]">
							ID: <span className="text-white">{member.LpuId || 'N/A'}</span>
						</span>
					) : (
						<span className="flex items-center gap-1 text-[#9ca3d4]/60">
							<Lock size={10} />
							<span>Member ID hidden</span>
						</span>
					)}
				</div>

				<div className="mb-4 flex flex-wrap gap-1.5 sm:gap-2">
					{member.skills?.slice(0, 3).map((skill, idx) => (
						<motion.span
							key={idx}
							className="px-2 sm:px-3 py-1 rounded-full bg-[#1a244f] text-xs text-[#9ca3d4] border border-[#2a3a72] group-hover:border-[#5d7df5]/50 transition-colors"
							whileHover={{ scale: 1.05 }}
						>
							{skill}
						</motion.span>
					))}
					{member.skills?.length > 3 && (
						<motion.span
							className="px-2 sm:px-3 py-1 rounded-full bg-[#1a244f]/60 text-xs text-[#9ca3d4]"
							whileHover={{ scale: 1.05 }}
						>
							+{member.skills.length - 3}
						</motion.span>
					)}
				</div>

				<motion.div
					className="flex items-center justify-end text-[#5d7df5]/70 text-xs font-medium mt-2 group-hover:text-[#5d7df5] transition-colors"
					initial={{ x: 0 }}
					whileHover={{ x: 3 }}
				>
					View Profile <ChevronRight size={14} className="ml-1" />
				</motion.div>
			</div>
		</div>
	</motion.div>
);

export default TeamMemberCard;
