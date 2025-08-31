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
					className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0a0f1f]/80 backdrop-blur-lg overflow-y-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className="relative max-w-lg w-full my-2 sm:my-8 max-h-[95vh] overflow-y-auto"
						initial={{ scale: 0.8, y: 50 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.8, y: 50 }}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Top section with profile info */}
						<div className="relative rounded-t-2xl bg-gradient-to-b from-[#161a36]/95 to-[#0f1225]/95 p-6 pb-20 border-t border-l border-r border-indigo-500/30 overflow-hidden">
							{/* Background effects */}
							<div className="absolute -top-40 left-0 right-0 h-80 bg-gradient-to-b from-indigo-600/20 via-blue-600/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2"></div>
							<div className="absolute -top-40 right-0 h-80 w-full bg-gradient-to-b from-blue-600/20 via-indigo-600/20 to-transparent rounded-full blur-3xl transform translate-x-1/2"></div>

							{/* Close button */}
							<button
								onClick={onClose}
								className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-white/10 p-2 rounded-full backdrop-blur-sm w-8 h-8 flex items-center justify-center border border-white/20"
								aria-label="Close modal"
							>
								<X size={18} />
							</button>

							{/* Authentication badge */}
							{isAuthenticated && (
								<div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600/30 text-blue-200 text-xs backdrop-blur-sm border border-indigo-500/30">
									<UserCheck size={12} />
									<span>Authenticated View</span>
								</div>
							)}

							<div className="flex flex-col items-center relative z-10">
								{/* Profile image */}
								<div className="relative inline-block group">
									<div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-400 blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
									<div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>

									<img
										src={member?.profilePicture?.url || '/default-profile.png'}
										alt={member?.fullName || 'Team member'}
										className="w-32 h-32 rounded-full object-cover border-2 border-white/10 relative z-10"
										onError={(e) => {
											e.target.src = '/default-profile.png';
										}}
									/>

									<motion.div
										className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg border border-white/10"
										animate={{
											rotate: [0, 360],
											scale: [1, 1.1, 1],
										}}
										transition={{
											rotate: {
												duration: 8,
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

								<h3 className="text-2xl font-bold text-white mt-5 mb-2">
									{member?.fullName}
								</h3>

								<div className="flex flex-wrap justify-center gap-2 mb-4">
									<span className="px-3 py-1 rounded-full bg-indigo-600/30 text-sm text-blue-200 border border-indigo-500/30">
										{member?.designation}
									</span>
									<span className="px-3 py-1 rounded-full bg-blue-600/20 text-sm text-blue-200 border border-blue-500/20">
										{member?.department}
									</span>
								</div>
							</div>
						</div>

						{/* Content section with frosted glass effect */}
						<div className="relative rounded-b-2xl bg-gradient-to-b from-[#161a36]/80 to-[#0f1225]/80 backdrop-blur-lg p-6 -mt-16 border border-indigo-500/30 border-t-transparent">
							{/* Modern tab navigation */}
							<div className="flex justify-center gap-2 mb-6 bg-[#0c1028]/50 p-1 rounded-xl border border-indigo-500/20">
								{['about', 'skills', 'contact'].map((tab) => (
									<button
										key={tab}
										onClick={() => setActiveTab(tab)}
										className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
											activeTab === tab
												? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
												: 'text-white/60 hover:text-white hover:bg-white/5'
										}`}
									>
										{tab.charAt(0).toUpperCase() + tab.slice(1)}
									</button>
								))}
							</div>

							{/* Tab content with modern styling */}
							{activeTab === 'about' && (
								<div className="space-y-5">
									{/* Bio */}
									{member?.bio && (
										<div className="p-5 bg-indigo-600/10 rounded-xl border border-indigo-500/20 text-left relative overflow-hidden">
											<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
											<p className="text-white/80 leading-relaxed">
												{member.bio}
											</p>
										</div>
									)}

									{/* Member details with modern cards */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[
											{ label: 'Program', value: member?.program, icon: Briefcase },
											{ label: 'Year', value: member?.year, icon: BookOpen },
											{ label: 'Joined', value: formatDate(member?.joinedAt), icon: Calendar },
											{
												label: 'LPU ID',
												value: isAuthenticated ? member?.LpuId : null,
												restricted: !isAuthenticated,
												icon: User,
											},
											...(isAuthenticated && member?.hosteler
												? [
														{
															label: 'Hostel',
															value: member?.hostel,
															icon: MapPin,
															colSpan: true,
														},
												  ]
												: []),
										].map((item, index) => (
											<div
												key={index}
												className={`p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-start gap-3 ${
													item.colSpan ? 'md:col-span-2' : ''
												}`}
											>
												<div className="p-2 rounded-lg bg-indigo-600/20 text-blue-300">
													<item.icon size={16} />
												</div>
												<div>
													<p className="text-xs text-blue-300/70">{item.label}</p>
													{item.restricted ? (
														<div className="flex items-center gap-1 text-white/50 text-sm mt-1">
															<Lock size={12} />
															<span>Authenticated only</span>
														</div>
													) : (
														<p className="text-sm text-white mt-1">
															{item.value || 'N/A'}
														</p>
													)}
												</div>
											</div>
										))}
									</div>

									{/* Resume download (authenticated only) */}
									{isAuthenticated && member?.resume?.url && (
										<motion.a
											href={member.resume.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg border border-white/10"
											whileHover={{
												y: -3,
												boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5)',
											}}
										>
											<Download size={16} />
											<span>Download Resume</span>
										</motion.a>
									)}
								</div>
							)}

							{/* Skills tab content */}
							{activeTab === 'skills' && (
								<div className="p-5 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
									{member?.skills?.length > 0 ? (
										<div>
											<div className="mb-5 flex items-center gap-3">
												<div className="p-2 rounded-lg bg-indigo-600/20 text-blue-300">
													<Code size={16} />
												</div>
												<h4 className="text-white font-medium">Technical Skills</h4>
											</div>
											<div className="flex flex-wrap gap-2">
												{member.skills.map((skill, index) => (
													<motion.div
														key={index}
														className="group relative"
														whileHover={{ scale: 1.05 }}
													>
														<div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
														<div className="relative px-3 py-1.5 rounded-full bg-indigo-600/20 text-sm text-blue-200 border border-indigo-500/30 group-hover:border-indigo-500/50 transition-colors">
															{skill}
														</div>
													</motion.div>
												))}
											</div>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center py-10 text-white/60">
											<Sparkles size={24} className="mb-3 text-blue-400/50" />
											<p>No skills listed yet</p>
										</div>
									)}
								</div>
							)}

							{/* Contact tab content */}
							{activeTab === 'contact' && (
								<div className="space-y-4">
									{/* Email card */}
									<div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-indigo-600/20 text-blue-300">
												<Mail size={16} />
											</div>
											<div>
												<p className="text-xs text-blue-300/70">Email</p>
												{isAuthenticated ? (
													<p className="text-sm text-white">
														{member?.email || 'N/A'}
													</p>
												) : (
													<div className="flex items-center gap-1">
														<p className="text-sm text-white/50 font-mono">
															{member?.email
																? `${member.email.substring(0, 3)}•••@•••${member.email.substring(
																		member.email.lastIndexOf('.')
																  )}`
																: 'N/A'}
														</p>
														<Lock size={12} className="text-blue-400/40" />
													</div>
												)}
											</div>
										</div>

										{isAuthenticated && member?.email && (
											<motion.a
												href={`mailto:${member.email}`}
												className="p-2 rounded-lg bg-indigo-600/30 text-blue-300 hover:bg-indigo-600/50 transition-colors border border-indigo-500/30"
												whileHover={{ scale: 1.1 }}
											>
												<Mail size={16} />
											</motion.a>
										)}
									</div>

									{/* Phone card */}
									<div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-indigo-600/20 text-blue-300">
												<Phone size={16} />
											</div>
											<div>
												<p className="text-xs text-blue-300/70">Phone</p>
												{isAuthenticated ? (
													<p className="text-sm text-white font-mono">
														{member?.phone || 'N/A'}
													</p>
												) : (
													<div className="flex items-center gap-1">
														<p className="text-sm text-white/50 font-mono">
															{member?.phone
																? '••• ••• ' + member.phone.slice(-4)
																: 'N/A'}
														</p>
														<Lock size={12} className="text-blue-400/40" />
													</div>
												)}
											</div>
										</div>

										{isAuthenticated && member?.phone && (
											<motion.a
												href={`tel:${member.phone}`}
												className="p-2 rounded-lg bg-indigo-600/30 text-blue-300 hover:bg-indigo-600/50 transition-colors border border-indigo-500/30"
												whileHover={{ scale: 1.1 }}
											>
												<Phone size={16} />
											</motion.a>
										)}
									</div>

									{/* Social links */}
									{socialLinks.length > 0 && (
										<div className="mt-6">
											<h4 className="text-white font-medium mb-4 flex items-center gap-2">
												<div className="w-1 h-4 bg-gradient-to-b from-indigo-400 to-blue-600 rounded-full"></div>
												<span>Social Profiles</span>
											</h4>

											<div className="grid grid-cols-1 gap-3">
												{socialLinks.map((link, index) => (
													<motion.a
														key={index}
														href={link.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center justify-between p-4 rounded-xl bg-indigo-600/10 text-white hover:bg-indigo-600/20 transition-colors border border-indigo-500/20"
														whileHover={{ x: 5 }}
													>
														<div className="flex items-center gap-3">
															<div className="p-2 rounded-lg bg-indigo-600/20">
																{link.platform.toLowerCase().includes('linkedin') && (
																	<Linkedin size={16} className="text-[#0A66C2]" />
																)}
																{link.platform.toLowerCase().includes('github') && (
																	<Github size={16} className="text-white" />
																)}
																{!link.platform.toLowerCase().includes('linkedin') &&
																	!link.platform.toLowerCase().includes('github') && (
																		<ExternalLink size={16} className="text-blue-300" />
																	)}
															</div>
															<span>{link.platform}</span>
														</div>
														<ExternalLink size={14} className="text-blue-300" />
													</motion.a>
												))}
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TeamMemberModal;
