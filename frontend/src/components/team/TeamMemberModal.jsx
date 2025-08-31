import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	X,
	Award,
	Mail,
	Linkedin,
	Github,
	User,
	Calendar,
	BookOpen,
	Briefcase,
	ChevronRight,
	Phone,
	MapPin,
	Code,
	Download,
	ExternalLink,
	Lock,
	Sparkles,
	UserCheck,
} from 'lucide-react';

const TeamMemberModal = ({ member, isOpen, onClose, isAuthenticated }) => {
	const [activeTab, setActiveTab] = useState('about');

	if (!isOpen) return null;

	// Format joined date with better readability
	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(date);
	};

	// Extract social media links from member data
	const getSocialLinks = () => {
		const links = [];

		if (member?.socialLinks?.length > 0) {
			return member.socialLinks;
		}

		// Add some fallback detection for LinkedIn/Github if not in socialLinks array
		if (member?.linkedIn) {
			links.push({
				platform: 'LinkedIn',
				url: member.linkedIn,
			});
		}

		if (member?.github) {
			links.push({
				platform: 'GitHub',
				url: member.github,
			});
		}

		return links;
	};

	const socialLinks = getSocialLinks();

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0a0f1f]/90 backdrop-blur-lg overflow-y-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className="relative max-w-lg w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d1326] to-[#1a1f3a] border border-[#3a56c9] my-2 sm:my-8 max-h-[95vh] overflow-y-auto"
						initial={{ scale: 0.8, y: 50 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.8, y: 50 }}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Enhanced blur effects */}
						<div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-[#3a56c9]/20 blur-3xl"></div>
						<div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-[#5d7df5]/20 blur-3xl"></div>

						{/* Close button with improved touch target */}
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-[#9ca3d4] hover:text-white transition-colors z-10 bg-[#1a244f]/70 p-2 rounded-full backdrop-blur-sm w-8 h-8 flex items-center justify-center"
							aria-label="Close modal"
						>
							<X size={18} />
						</button>

						{/* Authentication badge */}
						{isAuthenticated && (
							<div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 rounded-full bg-[#1a244f]/70 text-[#5d7df5] text-xs backdrop-blur-sm border border-[#3a56c9]/30">
								<UserCheck size={12} />
								<span>Authenticated View</span>
							</div>
						)}

						<div className="flex flex-col items-center">
							<div className="relative inline-block">
								{/* Avatar glow */}
								<div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] blur-md opacity-70"></div>

								<img
									src={member?.profilePicture?.url || '/default-profile.png'}
									alt={member?.fullName || 'Team member'}
									className="w-28 h-28 rounded-full object-cover border-4 border-[#3a56c9]/30 relative z-10"
									onError={(e) => {
										e.target.src = '/default-profile.png';
									}}
								/>

								<motion.div
									className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center shadow-lg"
									animate={{
										rotate: [0, 360],
										scale: [1, 1.1, 1],
									}}
									transition={{
										rotate: {
											duration: 6,
											repeat: Infinity,
											ease: 'linear',
										},
										scale: {
											duration: 3,
											repeat: Infinity,
											ease: 'easeInOut',
										},
									}}
								>
									<Award size={20} className="text-white" />
								</motion.div>
							</div>

							<h3 className="text-2xl font-bold text-white mt-4 mb-1">
								{member?.fullName}
							</h3>

							<div className="flex flex-wrap justify-center gap-2 mb-2">
								<span className="px-3 py-1 rounded-full bg-[#1a244f] text-sm text-[#5d7df5] border border-[#2a3a72]">
									{member?.designation}
								</span>
								<span className="px-3 py-1 rounded-full bg-[#1a244f] text-sm text-[#9ca3d4] border border-[#2a3a72]">
									{member?.department}
								</span>
							</div>
						</div>
					</motion.div>

					{/* Content section */}
					<div className="relative -mt-10 rounded-t-3xl bg-gradient-to-br from-[#0d1326] to-[#1a1f3a] p-6">
						{/* Navigation tabs with better mobile layout */}
						<div className="flex justify-center gap-1 -mt-2 mb-6 overflow-x-auto pb-2 px-2">
							<button
								onClick={() => setActiveTab('about')}
								className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors flex-1 max-w-[100px] ${
									activeTab === 'about'
										? 'bg-[#3a56c9] text-white'
										: 'bg-[#1a244f] text-[#9ca3d4] hover:bg-[#243260]'
								}`}
							>
								About
							</button>
							<button
								onClick={() => setActiveTab('skills')}
								className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors flex-1 max-w-[100px] ${
									activeTab === 'skills'
										? 'bg-[#3a56c9] text-white'
										: 'bg-[#1a244f] text-[#9ca3d4] hover:bg-[#243260]'
								}`}
							>
								Skills
							</button>
							<button
								onClick={() => setActiveTab('contact')}
								className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors flex-1 max-w-[100px] ${
									activeTab === 'contact'
										? 'bg-[#3a56c9] text-white'
										: 'bg-[#1a244f] text-[#9ca3d4] hover:bg-[#243260]'
								}`}
							>
								Contact
							</button>
						</div>

						{/* About tab content */}
						{activeTab === 'about' && (
							<div className="space-y-4">
								{/* Bio */}
								{member?.bio && (
									<div className="p-4 bg-[#0d1326]/50 rounded-lg border border-[#2a3a72] text-left relative overflow-hidden">
										<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3a56c9] to-[#5d7df5]"></div>
										<p className="text-sm text-[#d0d5f7] leading-relaxed">
											{member.bio}
										</p>
									</div>
								)}

								{/* Member details */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0a0f1f]/50 rounded-xl p-4 border border-[#2a3a72]/50">
									{/* Program (visible to all) */}
									<div className="text-left flex items-start gap-2">
										<Briefcase size={16} className="text-[#5d7df5] mt-0.5" />
										<div>
											<p className="text-xs text-[#9ca3d4]">Program</p>
											<p className="text-sm text-white">
												{member?.program || 'N/A'}
											</p>
										</div>
									</div>

									{/* Year (visible to all) */}
									<div className="text-left flex items-start gap-2">
										<BookOpen size={16} className="text-[#5d7df5] mt-0.5" />
										<div>
											<p className="text-xs text-[#9ca3d4]">Year</p>
											<p className="text-sm text-white">
												{member?.year || 'N/A'}
											</p>
										</div>
									</div>

									{/* Joined date (visible to all) */}
									<div className="text-left flex items-start gap-2">
										<Calendar size={16} className="text-[#5d7df5] mt-0.5" />
										<div>
											<p className="text-xs text-[#9ca3d4]">Joined</p>
											<p className="text-sm text-white">
												{member?.joinedAt
													? formatDate(member.joinedAt)
													: 'N/A'}
											</p>
										</div>
									</div>

									{/* LPU ID (visible only to authenticated users) */}
									<div className="text-left flex items-start gap-2">
										<User
											size={16}
											className={`${isAuthenticated ? 'text-[#5d7df5]' : 'text-[#5d7df5]/40'} mt-0.5`}
										/>
										<div>
											<p className="text-xs text-[#9ca3d4]">LPU ID</p>
											{isAuthenticated ? (
												<p className="text-sm text-white">
													{member?.LpuId || 'N/A'}
												</p>
											) : (
												<div className="flex items-center gap-1 text-[#9ca3d4]/60 text-sm">
													<Lock size={12} />
													<span>Authenticated only</span>
												</div>
											)}
										</div>
									</div>

									{/* Hostel info (visible only to authenticated users) */}
									{isAuthenticated && member?.hosteler && (
										<div className="text-left flex items-start gap-2 col-span-2">
											<MapPin size={16} className="text-[#5d7df5] mt-0.5" />
											<div>
												<p className="text-xs text-[#9ca3d4]">Hostel</p>
												<p className="text-sm text-white">
													{member?.hostel || 'N/A'}
												</p>
											</div>
										</div>
									)}
								</div>

								{/* Resume download (authenticated only) */}
								{isAuthenticated && member?.resume?.url && (
									<motion.a
										href={member.resume.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-[#1a244f] border border-[#2a3a72] text-[#d0d5f7] transition-colors hover:bg-[#243260]"
										whileHover={{ y: -3 }}
									>
										<Download size={16} />
										<span>Download Resume</span>
									</motion.a>
								)}
							</div>
						)}

						{/* Skills tab content */}
						{activeTab === 'skills' && (
							<div className="space-y-4">
								{member?.skills?.length > 0 ? (
									<div>
										<div className="mb-4 flex items-center gap-2">
											<Code size={16} className="text-[#5d7df5]" />
											<h4 className="text-[#d0d5f7] font-medium">
												Technical Skills
											</h4>
										</div>
										<div className="flex flex-wrap gap-2">
											{member.skills.map((skill, index) => (
												<motion.div
													key={index}
													className="group relative"
													whileHover={{ scale: 1.05 }}
												>
													{/* Skill pill with hover effect */}
													<div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
													<div className="relative px-3 py-1.5 rounded-full bg-[#1a244f] text-sm text-[#9ca3d4] border border-[#2a3a72] group-hover:border-[#5d7df5]/70 transition-colors">
														{skill}
													</div>
												</motion.div>
											))}
										</div>
									</div>
								) : (
									<div className="flex flex-col items-center justify-center py-6 text-[#9ca3d4]">
										<Sparkles size={24} className="mb-2 text-[#5d7df5]/50" />
										<p>No skills listed yet</p>
									</div>
								)}
							</div>
						)}

						{/* Contact tab content */}
						{activeTab === 'contact' && (
							<div className="space-y-4">
								{/* Email (limited view for non-authenticated) */}
								<div className="p-3 rounded-lg bg-[#0a0f1f]/50 border border-[#2a3a72]/50 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="p-2 rounded-full bg-[#1a244f]">
											<Mail size={16} className="text-[#5d7df5]" />
										</div>
										<div>
											<p className="text-xs text-[#9ca3d4]">Email</p>
											{isAuthenticated ? (
												<p className="text-sm text-white">
													{member?.email || 'N/A'}
												</p>
											) : (
												<div className="flex items-center gap-1">
													<p className="text-sm text-[#9ca3d4]">
														{member?.email
															? `${member.email.substring(0, 3)}•••@•••${member.email.substring(member.email.lastIndexOf('.'))}`
															: 'N/A'}
													</p>
													<Lock size={12} className="text-[#5d7df5]/40" />
												</div>
											)}
										</div>
									</div>

									{isAuthenticated && member?.email && (
										<motion.a
											href={`mailto:${member.email}`}
											className="p-2 rounded-lg bg-[#1a244f] text-[#5d7df5] hover:bg-[#243260] transition-colors"
											whileHover={{ scale: 1.05 }}
										>
											<Mail size={16} />
										</motion.a>
									)}
								</div>

								{/* Phone (authenticated only) */}
								<div className="p-3 rounded-lg bg-[#0a0f1f]/50 border border-[#2a3a72]/50 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="p-2 rounded-full bg-[#1a244f]">
											<Phone size={16} className="text-[#5d7df5]" />
										</div>
										<div>
											<p className="text-xs text-[#9ca3d4]">Phone</p>
											{isAuthenticated ? (
												<p className="text-sm text-white">
													{member?.phone || 'N/A'}
												</p>
											) : (
												<div className="flex items-center gap-1">
													<p className="text-sm text-[#9ca3d4]">
														{member?.phone
															? '••• ••• ' + member.phone.slice(-4)
															: 'N/A'}
													</p>
													<Lock size={12} className="text-[#5d7df5]/40" />
												</div>
											)}
										</div>
									</div>

									{isAuthenticated && member?.phone && (
										<motion.a
											href={`tel:${member.phone}`}
											className="p-2 rounded-lg bg-[#1a244f] text-[#5d7df5] hover:bg-[#243260] transition-colors"
											whileHover={{ scale: 1.05 }}
										>
											<Phone size={16} />
										</motion.a>
									)}
								</div>

								{/* Social links */}
								{socialLinks.length > 0 && (
									<div className="mt-6">
										<h4 className="text-[#d0d5f7] font-medium mb-3 flex items-center">
											<ChevronRight size={16} className="text-[#5d7df5]" />
											<span>Social Profiles</span>
										</h4>

										<div className="grid grid-cols-1 gap-3">
											{socialLinks.map((link, index) => (
												<motion.a
													key={index}
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-between p-3 rounded-lg bg-[#1a244f] text-[#d0d5f7] hover:bg-[#243260] transition-colors"
													whileHover={{ x: 5 }}
												>
													<div className="flex items-center gap-2">
														{link.platform
															.toLowerCase()
															.includes('linkedin') && (
															<Linkedin
																size={16}
																className="text-[#0A66C2]"
															/>
														)}
														{link.platform
															.toLowerCase()
															.includes('github') && (
															<Github
																size={16}
																className="text-white"
															/>
														)}
														{!link.platform
															.toLowerCase()
															.includes('linkedin') &&
															!link.platform
																.toLowerCase()
																.includes('github') && (
																<ExternalLink
																	size={16}
																	className="text-[#5d7df5]"
																/>
															)}
														<span>{link.platform}</span>
													</div>
													<ExternalLink
														size={14}
														className="text-[#5d7df5]"
													/>
												</motion.a>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TeamMemberModal;
