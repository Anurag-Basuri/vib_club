import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Mail, Linkedin, Github } from 'lucide-react';

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
						className="relative max-w-md w-full p-6 rounded-2xl bg-gradient-to-br from-[#0d1326] to-[#1a1f3a] border border-[#3a56c9] my-8"
						initial={{ scale: 0.8, y: 50 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.8, y: 50 }}
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-[#9ca3d4] hover:text-white transition-colors"
							aria-label="Close modal"
						>
							<X size={24} />
						</button>
						<div className="text-center">
							<div className="relative inline-block mb-4">
								<img
									src={member?.profilePicture?.url || '/default-profile.png'}
									alt={member?.fullName || 'Team member'}
									className="w-32 h-32 rounded-full object-cover border-4 border-[#3a56c9]/30 mx-auto"
									onError={(e) => {
										e.target.src = '/default-profile.png';
									}}
								/>
								<div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center">
									<Award size={16} className="text-white" />
								</div>
							</div>
							<h3 className="text-2xl font-bold text-white mb-2">
								{member?.fullName}
							</h3>
							<p className="text-[#5d7df5] font-medium mb-1">{member?.designation}</p>
							<p className="text-[#5d7df5] text-sm mb-4">{member?.department}</p>

							<div className="grid grid-cols-2 gap-4 mb-6">
								{isAuthenticated ? (
									<>
										<div className="text-left">
											<p className="text-sm text-[#9ca3d4]">LPU ID</p>
											<p className="text-white">{member?.LpuId || 'N/A'}</p>
										</div>
										<div className="text-left">
											<p className="text-sm text-[#9ca3d4]">Email</p>
											<p className="text-white">{member?.email || 'N/A'}</p>
										</div>
										<div className="text-left">
											<p className="text-sm text-[#9ca3d4]">Year</p>
											<p className="text-white">{member?.year || 'N/A'}</p>
										</div>
										<div className="text-left">
											<p className="text-sm text-[#9ca3d4]">Joined</p>
											<p className="text-white">
												{member?.joinedAt
													? new Date(member.joinedAt).toLocaleDateString()
													: 'N/A'}
											</p>
										</div>
									</>
								) : (
									<div className="text-left col-span-2">
										<p className="text-sm text-[#9ca3d4]">Program</p>
										<p className="text-white">{member?.program || 'N/A'}</p>
									</div>
								)}
							</div>

							{member?.bio && (
								<div className="p-4 bg-[#0d1326]/50 rounded-lg border border-[#2a3a72] mb-6">
									<p className="text-sm text-[#d0d5f7]">{member.bio}</p>
								</div>
							)}

							{member?.skills?.length > 0 && (
								<div className="mb-6">
									<h4 className="text-[#5d7df5] font-medium mb-2">Skills</h4>
									<div className="flex flex-wrap justify-center gap-2">
										{member.skills.map((skill, index) => (
											<span
												key={index}
												className="px-3 py-1 rounded-full bg-[#1a244f] text-xs text-[#9ca3d4] border border-[#2a3a72]"
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							)}

							<div className="flex justify-center space-x-3">
								{member?.linkedIn && (
									<a
										href={member.linkedIn}
										target="_blank"
										rel="noopener noreferrer"
										className="p-3 rounded-lg bg-[#1a244f] hover:bg-[#0A66C2] transition"
										aria-label="LinkedIn profile"
									>
										<Linkedin
											size={20}
											className="text-[#5d7df5] hover:text-white"
										/>
									</a>
								)}
								{member?.github && (
									<a
										href={member.github}
										target="_blank"
										rel="noopener noreferrer"
										className="p-3 rounded-lg bg-[#1a244f] hover:bg-[#333] transition"
										aria-label="GitHub profile"
									>
										<Github size={20} className="text-white" />
									</a>
								)}
								{isAuthenticated && member?.email && (
									<a
										href={`mailto:${member.email}`}
										className="p-3 rounded-lg bg-[#1a244f] hover:bg-[#EA4335] transition"
										aria-label="Send email"
									>
										<Mail
											size={20}
											className="text-[#5d7df5] hover:text-white"
										/>
									</a>
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
