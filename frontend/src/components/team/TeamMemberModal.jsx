import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	X,
	Award,
	Mail,
	Linkedin,
	Github,
	User,
	Calendar,
	Briefcase,
	Phone,
	Code,
	Download,
	Lock,
	FileText,
	Building,
	GraduationCap,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	Globe,
	Share2,
	Info,
	Link as LinkIcon,
	Badge,
	Hash,
	ChevronDown,
	ChevronUp,
	Sparkles,
	MapPin,
	ExternalLink,
} from 'lucide-react';

const TeamMemberModal = ({ member, isOpen, onClose, isAuthenticated }) => {
	const [expandedSections, setExpandedSections] = useState({});
	const [imageLoading, setImageLoading] = useState(true);

	// Initialize expanded sections
	useEffect(() => {
		if (isOpen) {
			setExpandedSections({
				About: true,
				Contact: true,
			});
		}
	}, [isOpen]);

	// Toggle section expansion
	const toggleSection = (section) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

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

		if (member?.linkedIn) {
			links.push({
				platform: 'LinkedIn',
				url: member.linkedIn,
				icon: Linkedin,
			});
		}

		if (member?.github) {
			links.push({
				platform: 'GitHub',
				url: member.github,
				icon: Github,
			});
		}

		if (member?.portfolio) {
			links.push({
				platform: 'Portfolio',
				url: member.portfolio,
				icon: Globe,
			});
		}

		return links;
	};

	const socialLinks = getSocialLinks();

	// Helper to get status badge styles
	const getStatusBadge = (status) => {
		switch (status) {
			case 'active':
				return {
					color: 'text-green-400',
					bg: 'bg-green-900/20',
					border: 'border-green-500/30',
					icon: <CheckCircle size={14} className="mr-1" />,
				};
			case 'banned':
				return {
					color: 'text-red-400',
					bg: 'bg-red-900/20',
					border: 'border-red-500/30',
					icon: <XCircle size={14} className="mr-1" />,
				};
			case 'inactive':
				return {
					color: 'text-yellow-400',
					bg: 'bg-yellow-900/20',
					border: 'border-yellow-500/30',
					icon: <AlertCircle size={14} className="mr-1" />,
				};
			default:
				return {
					color: 'text-blue-400',
					bg: 'bg-blue-900/20',
					border: 'border-blue-500/30',
					icon: <Info size={14} className="mr-1" />,
				};
		}
	};

	// Handle keyboard events for accessibility
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	// Collapsible section component
	const CollapsibleSection = ({ title, icon: Icon, children, defaultExpanded = false }) => {
		const isExpanded =
			expandedSections[title] !== undefined ? expandedSections[title] : defaultExpanded;

		return (
			<div className="mb-4 border-b border-white/10 pb-4 last:border-b-0">
				<button
					className="flex items-center justify-between w-full text-left group"
					onClick={() => toggleSection(title)}
					aria-expanded={isExpanded}
				>
					<div className="flex items-center">
						{Icon && (
							<Icon
								size={18}
								className="text-blue-300 mr-2 transition-colors group-hover:text-blue-200"
							/>
						)}
						<h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
							{title}
						</h3>
					</div>
					{isExpanded ? (
						<ChevronUp
							size={18}
							className="text-blue-300 group-hover:text-blue-200 transition-colors"
						/>
					) : (
						<ChevronDown
							size={18}
							className="text-blue-300 group-hover:text-blue-200 transition-colors"
						/>
					)}
				</button>

				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden"
						>
							<div className="pt-3">{children}</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	};

	if (!isOpen || !member) return null;

	const statusBadge = getStatusBadge(member?.status || 'default');

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-auto p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					role="dialog"
					aria-modal="true"
					aria-labelledby="member-profile-title"
				>
					<div className="min-h-screen w-full flex items-center justify-center">
						<motion.div
							className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/20 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ type: 'spring', damping: 25, stiffness: 300 }}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close button */}
							<button
								className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10 backdrop-blur-sm hover:scale-110"
								onClick={onClose}
								aria-label="Close modal"
							>
								<X size={20} className="text-white" />
							</button>

							{/* Header with profile banner */}
							<div className="relative h-52 bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-600 flex items-center justify-center overflow-hidden">
								{/* Animated background */}
								<div className="absolute inset-0 opacity-20">
									<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px, rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
									{[...Array(5)].map((_, i) => (
										<motion.div
											key={i}
											className="absolute bg-white/10 rounded-full"
											style={{
												width: `${Math.random() * 10 + 5}px`,
												height: `${Math.random() * 10 + 5}px`,
												left: `${Math.random() * 100}%`,
												top: `${Math.random() * 100}%`,
											}}
											animate={{
												y: [0, Math.random() * 40 - 20],
												x: [0, Math.random() * 40 - 20],
												scale: [1, Math.random() + 0.5, 1],
											}}
											transition={{
												duration: Math.random() * 10 + 5,
												repeat: Infinity,
												repeatType: 'reverse',
											}}
										/>
									))}
								</div>

								{/* Profile image */}
								<motion.div
									className="relative z-10"
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ delay: 0.2, duration: 0.5 }}
								>
									{member.profilePicture?.url ? (
										<div className="relative group">
											{/* Glow effect */}
											<motion.div
												className="absolute -inset-3 rounded-full bg-blue-400/20 blur-md group-hover:bg-indigo-400/30 transition-colors"
												animate={{
													scale: [1, 1.05, 1],
												}}
												transition={{
													duration: 3,
													repeat: Infinity,
													repeatType: 'reverse',
												}}
											/>

											{/* Image container */}
											<div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg transition-all duration-300 group-hover:border-white/30 group-hover:shadow-xl">
												<img
													src={member.profilePicture.url}
													alt={member.fullname}
													className={`w-full h-full object-cover transition-transform duration-700 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
													onError={(e) => {
														setImageLoading(false);
														e.target.onerror = null;
														e.target.src =
															'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM2NDY4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiI+JTNDJTJGdGV4dD48L3N2Zz4=';
													}}
													onLoad={() => setImageLoading(false)}
												/>

												{/* Loading indicator */}
												{imageLoading && (
													<div className="absolute inset-0 flex items-center justify-center bg-indigo-900/20">
														<motion.div
															className="w-8 h-8 border-2 border-transparent border-t-white/80 rounded-full"
															animate={{ rotate: 360 }}
															transition={{
																duration: 1,
																repeat: Infinity,
																ease: 'linear',
															}}
														/>
													</div>
												)}
											</div>
										</div>
									) : (
										<div className="relative group">
											{/* Glow effect */}
											<motion.div
												className="absolute -inset-3 rounded-full bg-blue-400/20 blur-md group-hover:bg-indigo-400/30 transition-colors"
												animate={{
													scale: [1, 1.05, 1],
												}}
												transition={{
													duration: 3,
													repeat: Infinity,
													repeatType: 'reverse',
												}}
											/>

											{/* Avatar fallback */}
											<div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center transition-all duration-300 group-hover:border-white/30 group-hover:shadow-xl">
												<span className="text-4xl font-bold text-white/90">
													{member.fullname?.charAt(0) || '?'}
												</span>
											</div>
										</div>
									)}
								</motion.div>

								{/* Status badge - Only visible to authenticated users */}
								{isAuthenticated && member.status && (
									<div className="absolute top-3 left-3 z-20">
										<div
											className={`flex items-center px-3 py-1 rounded-full ${statusBadge.bg} ${statusBadge.border} backdrop-blur-sm shadow-lg text-xs font-medium ${statusBadge.color}`}
										>
											{statusBadge.icon}
											{member.status.charAt(0).toUpperCase() +
												member.status.slice(1)}
										</div>
									</div>
								)}

								{/* Department badge */}
								<div className="absolute bottom-3 left-0 right-0 flex justify-center">
									<motion.div
										className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-sm text-white/90 flex items-center border border-white/10 shadow-lg"
										whileHover={{ y: -2 }}
									>
										<Sparkles size={14} className="mr-2 text-blue-300" />
										{member.department && <span>{member.department}</span>}
									</motion.div>
								</div>
							</div>

							{/* Basic info section */}
							<div className="p-5 bg-gradient-to-b from-blue-900/30 to-transparent border-b border-white/10">
								<h2
									id="member-profile-title"
									className="text-2xl font-bold text-white text-center"
								>
									{member.fullname}
								</h2>
								<p className="text-blue-300 font-medium mt-1 text-center">
									{member.designation}
								</p>

								{/* ID and Member Since - Only visible to authenticated users */}
								{isAuthenticated && (
									<div className="flex flex-wrap gap-2 mt-3 justify-center">
										{member.memberID && (
											<div className="px-3 py-1 bg-indigo-900/20 text-indigo-300 rounded-full text-xs border border-indigo-500/30 flex items-center backdrop-blur-sm">
												<Hash size={12} className="mr-1" />
												ID: {member.memberID.substring(0, 8)}
											</div>
										)}
										{member.LpuId && (
											<div className="px-3 py-1 bg-blue-900/20 text-blue-300 rounded-full text-xs border border-blue-500/30 flex items-center backdrop-blur-sm">
												<Badge size={12} className="mr-1" />
												LPU ID: {member.LpuId}
											</div>
										)}
										{member.joinedAt && (
											<div className="px-3 py-1 bg-purple-900/20 text-purple-300 rounded-full text-xs border border-purple-500/30 flex items-center backdrop-blur-sm">
												<Clock size={12} className="mr-1" />
												Joined: {formatDate(member.joinedAt)}
											</div>
										)}
									</div>
								)}
							</div>

							{/* Scrollable content */}
							<div className="p-5 max-h-[60vh] overflow-y-auto">
								{/* About section */}
								<CollapsibleSection
									title="About"
									icon={User}
									defaultExpanded={true}
								>
									<p className="text-white/70">
										{member.bio || 'No bio provided.'}
									</p>
								</CollapsibleSection>

								{/* Contact information */}
								{(member.email || member.phone) && (
									<CollapsibleSection
										title="Contact"
										icon={Mail}
										defaultExpanded={true}
									>
										<div className="space-y-3">
											{member.email && (
												<div className="flex items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
													<Mail
														size={18}
														className="text-blue-300 mr-3 flex-shrink-0"
													/>
													<a
														href={`mailto:${member.email}`}
														className="text-white/70 hover:text-white break-all"
													>
														{member.email}
													</a>
												</div>
											)}
											{member.phone && (
												<div className="flex items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
													<Phone
														size={18}
														className="text-blue-300 mr-3 flex-shrink-0"
													/>
													<a
														href={`tel:${member.phone}`}
														className="text-white/70 hover:text-white"
													>
														{member.phone}
													</a>
												</div>
											)}
										</div>
									</CollapsibleSection>
								)}

								{/* Social links */}
								{socialLinks.length > 0 && (
									<CollapsibleSection title="Connect" icon={Share2}>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
											{socialLinks.map((link, index) => {
												const IconComponent = link.icon || LinkIcon;
												return (
													<a
														key={index}
														href={link.url}
														target="_blank"
														rel="noreferrer"
														className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:translate-x-1"
													>
														<IconComponent
															size={18}
															className="text-blue-300 mr-3 flex-shrink-0"
														/>
														<span className="text-white/70 text-sm">
															{link.platform}
														</span>
														<ExternalLink
															size={14}
															className="ml-auto text-blue-300/70"
														/>
													</a>
												);
											})}
										</div>
									</CollapsibleSection>
								)}

								{/* Skills */}
								{member.skills && member.skills.length > 0 && (
									<CollapsibleSection title="Skills" icon={Code}>
										<div className="flex flex-wrap gap-2">
											{member.skills.map((skill, index) => (
												<motion.span
													key={index}
													className="px-3 py-1.5 bg-blue-900/40 text-blue-200 rounded-full text-sm backdrop-blur-sm border border-blue-700/30"
													whileHover={{ scale: 1.05 }}
													transition={{
														type: 'spring',
														stiffness: 400,
														damping: 10,
													}}
												>
													{skill}
												</motion.span>
											))}
										</div>
									</CollapsibleSection>
								)}

								{/* Program and Year - Visible to authenticated users */}
								{isAuthenticated && (member.program || member.year) && (
									<CollapsibleSection title="Education" icon={GraduationCap}>
										<div className="space-y-3">
											{member.program && (
												<div className="flex items-center p-2 rounded-lg bg-white/5">
													<GraduationCap
														size={18}
														className="text-blue-300 mr-3 flex-shrink-0"
													/>
													<span className="text-white/70">
														{member.program}
													</span>
												</div>
											)}
											{member.year && (
												<div className="flex items-center p-2 rounded-lg bg-white/5">
													<Calendar
														size={18}
														className="text-blue-300 mr-3 flex-shrink-0"
													/>
													<span className="text-white/70">
														Year: {member.year}
													</span>
												</div>
											)}
										</div>
									</CollapsibleSection>
								)}

								{/* Hostel Information - Visible to authenticated users */}
								{isAuthenticated && member.hosteler !== undefined && (
									<CollapsibleSection title="Residence" icon={Building}>
										<div className="flex items-center p-2 rounded-lg bg-white/5">
											<Building
												size={18}
												className="text-blue-300 mr-3 flex-shrink-0"
											/>
											<span className="text-white/70">
												{member.hosteler
													? `Hosteler ${member.hostel ? `(${member.hostel})` : ''}`
													: 'Day Scholar'}
											</span>
										</div>
									</CollapsibleSection>
								)}

								{/* Resume - Visible to authenticated users */}
								{isAuthenticated && member.resume?.url && (
									<CollapsibleSection title="Documents" icon={FileText}>
										<div className="flex items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
											<FileText
												size={18}
												className="text-blue-300 mr-3 flex-shrink-0"
											/>
											<a
												href={member.resume.url}
												target="_blank"
												rel="noreferrer"
												className="text-white/70 hover:text-white flex items-center"
											>
												View Resume
												<Download size={16} className="ml-2" />
											</a>
										</div>
									</CollapsibleSection>
								)}

								{/* Projects & Achievements - Auth only section */}
								{isAuthenticated ? (
									<>
										{/* Projects */}
										{member.projects && member.projects.length > 0 && (
											<CollapsibleSection title="Projects" icon={Briefcase}>
												<ul className="space-y-2">
													{member.projects.map((project, index) => (
														<li
															key={index}
															className="flex items-start p-2 rounded-lg bg-white/5"
														>
															<div className="bg-blue-700/30 p-1 rounded mr-3 mt-0.5">
																<Briefcase
																	size={14}
																	className="text-blue-300"
																/>
															</div>
															<span className="text-white/70 text-sm">
																{project}
															</span>
														</li>
													))}
												</ul>
											</CollapsibleSection>
										)}

										{/* Achievements */}
										{member.achievements && member.achievements.length > 0 && (
											<CollapsibleSection title="Achievements" icon={Award}>
												<ul className="space-y-2">
													{member.achievements.map(
														(achievement, index) => (
															<li
																key={index}
																className="flex items-start p-2 rounded-lg bg-white/5"
															>
																<div className="bg-yellow-700/30 p-1 rounded mr-3 mt-0.5">
																	<Award
																		size={14}
																		className="text-yellow-300"
																	/>
																</div>
																<span className="text-white/70 text-sm">
																	{achievement}
																</span>
															</li>
														)
													)}
												</ul>
											</CollapsibleSection>
										)}

										{/* Additional Information */}
										{member.additionalInfo && (
											<CollapsibleSection
												title="Additional Information"
												icon={Info}
											>
												<p className="text-white/70">
													{member.additionalInfo}
												</p>
											</CollapsibleSection>
										)}
									</>
								) : (
									<div className="mt-6 p-4 border border-blue-800/50 rounded-xl bg-blue-900/20 backdrop-blur-sm">
										<div className="flex items-center gap-3 text-blue-300 mb-2">
											<Lock size={20} />
											<p className="font-medium">Member-Only Content</p>
										</div>
										<p className="text-sm text-white/60">
											Sign in to view complete profile including education
											details, projects, achievements, and more.
										</p>
									</div>
								)}
							</div>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TeamMemberModal;
