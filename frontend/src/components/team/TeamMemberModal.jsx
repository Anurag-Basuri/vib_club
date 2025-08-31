import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Mail, Linkedin, Github, User, Calendar, BookOpen, Briefcase, ChevronRight } from 'lucide-react';

const TeamMemberModal = ({ member, isOpen, onClose, isAuthenticated }) => {
	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1f]/90 backdrop-blur-lg overflow-y-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className="relative max-w-md w-full p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d1326] to-[#1a1f3a] border border-[#3a56c9] my-8"
						initial={{ scale: 0.8, y: 50 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.8, y: 50 }}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Decorative blurred circles */}
						<div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-[#3a56c9]/20 blur-3xl"></div>
						<div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-[#5d7df5]/20 blur-3xl"></div>
						
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-[#9ca3d4] hover:text-white transition-colors z-10 bg-[#1a244f]/70 p-2 rounded-full backdrop-blur-sm"
							aria-label="Close modal"
						>
							<X size={20} />
						</button>
						
						<div className="text-center relative z-10">
							<div className="relative inline-block mb-6">
								{/* Avatar glow */}
								<div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] blur-md opacity-70"></div>
								
								<img
									src={member?.profilePicture?.url || '/default-profile.png'}
									alt={member?.fullName || 'Team member'}
									className="w-32 h-32 rounded-full object-cover border-4 border-[#3a56c9]/30 mx-auto relative z-10"
									onError={(e) => {
										e.target.src = '/default-profile.png';
									}}
								/>
								
								<motion.div 
									className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center shadow-lg"
									animate={{ 
										rotate: [0, 360],
										scale: [1, 1.1, 1]
									}}
									transition={{ 
										rotate: { duration: 6, repeat: Infinity, ease: "linear" },
										scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
									}}
								>
									<Award size={20} className="text-white" />
								</motion.div>
							</div>
							
							<h3 className="text-2xl font-bold text-white mb-2">
								{member?.fullName}
							</h3>
							
							<div className="flex justify-center gap-2 mb-4">
								<span className="px-3 py-1 rounded-full bg-[#1a244f] text-sm text-[#5d7df5] border border-[#2a3a72]">
									{member?.designation}
								</span>
								<span className="px-3 py-1 rounded-full bg-[#1a244f] text-sm text-[#9ca3d4] border border-[#2a3a72]">
									{member?.department}
								</span>
							</div>

							<div className="grid grid-cols-2 gap-4 mb-6 bg-[#0a0f1f]/50 rounded-xl p-4 border border-[#2a3a72]/50">
								{isAuthenticated ? (
									<>
										<div className="text-left flex items-center gap-2">
											<User size={16} className="text-[#5d7df5]" />
											<div>
												<p className="text-xs text-[#9ca3d4]">LPU ID</p>
												<p className="text-sm text-white">{member?.LpuId || 'N/A'}</p>
											</div>
										</div>
										<div className="text-left flex items-center gap-2">
											<Mail size={16} className="text-[#5d7df5]" />
											<div>
												<p className="text-xs text-[#9ca3d4]">Email</p>
												<p className="text-sm text-white truncate max-w-[120px]">{member?.email || 'N/A'}</p>
											</div>
										</div>
										<div className="text-left flex items-center gap-2">
											<BookOpen size={16} className="text-[#5d7df5]" />
											<div>
												<p className="text-xs text-[#9ca3d4]">Year</p>
												<p className="text-sm text-white">{member?.year || 'N/A'}</p>
											</div>
										</div>
										<div className="text-left flex items-center gap-2">
											<Calendar size={16} className="text-[#5d7df5]" />
											<div>
												<p className="text-xs text-[#9ca3d4]">Joined</p>
												<p className="text-sm text-white">
													{member?.joinedAt
														? new Date(member.joinedAt).toLocaleDateString()
														: 'N/A'}
												</p>
											</div>
										</div>
									</>
								) : (
									<div className="text-left col-span-2 flex items-center gap-2">
										<Briefcase size={16} className="text-[#5d7df5]" />
										<div>
											<p className="text-xs text-[#9ca3d4]">Program</p>
											<p className="text-sm text-white">{member?.program || 'N/A'}</p>
										</div>
									</div>
								)}
							</div>

							{member?.bio && (
								<div className="p-4 bg-[#0d1326]/50 rounded-lg border border-[#2a3a72] mb-6 text-left relative overflow-hidden">
									<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3a56c9] to-[#5d7df5]"></div>
									<p className="text-sm text-[#d0d5f7] leading-relaxed">{member.bio}</p>
								</div>
							)}

							{member?.skills?.length > 0 && (
								<div className="mb-6">
									<h4 className="text-[#5d7df5] font-medium mb-3 flex items-center justify-center">
										<ChevronRight size={16} className="mr-1" /> Skills
									</h4>
									<div className="flex flex-wrap justify-center gap-2">
										{member.skills.map((skill, index) => (
											<motion.span
												key={index}
												className="px-3 py-1 rounded-full bg-[#1a244f] text-xs text-[#9ca3d4] border border-[#2a3a72]"
												whileHover={{ scale: 1.05, backgroundColor: '#243260' }}
											>
												{skill}
											</motion.span>
										))}
									</div>
								</div>
							)}

							<div className="flex justify-center space-x-3 pt-2 border-t border-[#2a3a72]/30">
								{member?.linkedIn && (
									<motion.a
										href={member.linkedIn}
										target="_blank"
										rel="noopener noreferrer"
										className="p-3 rounded-lg bg-[#1a244f] hover:bg-[#0A66C2] transition-colors"
										aria-label="LinkedIn profile"
										whileHover={{ y: -3 }}
									>
										<Linkedin size={20} className="text-[#5d7df5] hover:text-white" />
									</motion.a>
								)}
								{member?.github && (
									<motion.a
										href={member.github}
										target="_blank"
										rel="noopener noreferrer"
										className="p-3 rounded-lg bg-[#1a244f] hover:bg-[#333] transition-colors"
										aria-label="GitHub profile"
										whileHover={{ y: -3 }}
									>
										<Github size={20} className="text-white" />
									</motion.a>
								)}
								{isAuthenticated && member?.email && (
									<motion.a
										href={`mailto:${member.email}`}
										className="p-3 rounded-lg bg-[#1a244f] hover:bg-[#EA4335] transition-colors"
										aria-label="Send email"
										whileHover={{ y: -3 }}
									>
										<Mail size={20} className="text-[#5d7df5] hover:text-white" />
									</motion.a>
								)}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TeamMemberModal;
