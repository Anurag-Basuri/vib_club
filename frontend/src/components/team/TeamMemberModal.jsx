import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	X,
	Mail,
	Linkedin,
	Github,
	Globe,
	Phone,
	Code,
	Award,
	Briefcase,
	GraduationCap,
	Building,
	FileText,
	Heart,
	Lock,
	User,
	CheckCircle,
	XCircle,
	AlertCircle,
	Info,
	ExternalLink,
	Download,
	Calendar,
	Hash,
	Badge,
	Clock,
	Sparkles,
} from 'lucide-react';

const TeamMemberModal = ({ member, isOpen, onClose, isAuthenticated }) => {
	const [activeTab, setActiveTab] = useState('about');
	const [imageError, setImageError] = useState(false);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			setActiveTab('about'); // Reset to about tab when modal opens
			setImageError(false);
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	// Handle keyboard events
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen || !member) return null;

	// Dynamic tabs based on available data
	const tabs = [
		{ id: 'about', label: 'About', icon: User, show: true },
		{
			id: 'contact',
			label: 'Contact',
			icon: Mail,
			show: member.email || member.phone,
		},
		{
			id: 'skills',
			label: 'Skills',
			icon: Code,
			show: member.skills && member.skills.length > 0,
		},
		{
			id: 'social',
			label: 'Social',
			icon: Globe,
			show: member.linkedIn || member.github || member.portfolio,
		},
		{
			id: 'extra',
			label: 'More',
			icon: Info,
			show:
				isAuthenticated &&
				(member.program ||
					member.year ||
					member.hosteler !== undefined ||
					member.projects?.length > 0 ||
					member.achievements?.length > 0),
		},
	].filter((tab) => tab.show);

	const initials =
		member.fullname
			?.split(' ')
			.map((n) => n[0])
			.join('')
			.substring(0, 2)
			.toUpperCase() || '??';

	// Status badge configuration
	const getStatusBadge = () => {
		if (!isAuthenticated || !member.status) return null;

		const statusConfig = {
			active: {
				color: 'text-green-400',
				bg: 'bg-green-900/20',
				border: 'border-green-500/30',
				icon: CheckCircle,
			},
			banned: {
				color: 'text-red-400',
				bg: 'bg-red-900/20',
				border: 'border-red-500/30',
				icon: XCircle,
			},
			inactive: {
				color: 'text-yellow-400',
				bg: 'bg-yellow-900/20',
				border: 'border-yellow-500/30',
				icon: AlertCircle,
			},
			default: {
				color: 'text-blue-400',
				bg: 'bg-blue-900/20',
				border: 'border-blue-500/30',
				icon: Info,
			},
		};

		const config = statusConfig[member.status] || statusConfig.default;
		const IconComponent = config.icon;

		return (
			<div
				className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg} ${config.border} border`}
			>
				<IconComponent size={12} className="mr-1" />
				{member.status.charAt(0).toUpperCase() + member.status.slice(1)}
			</div>
		);
	};

	// Format date helper
	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		try {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		} catch {
			return 'Invalid date';
		}
	};

	// Render tab content
	const renderTabContent = () => {
		switch (activeTab) {
			case 'about':
				return (
					<div className="space-y-4">
						<div>
							<h3 className="text-lg font-semibold text-white mb-3 flex items-center">
								<User size={18} className="mr-2 text-blue-400" />
								About
							</h3>
							<div className="bg-white/5 rounded-lg p-4 border border-white/10">
								<p className="text-gray-300 leading-relaxed text-sm">
									{member.bio || 'No bio provided.'}
								</p>
							</div>
						</div>

						{/* Basic info for authenticated users */}
						{isAuthenticated && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{member.memberID && (
									<div className="bg-white/5 rounded-lg p-3 border border-white/10">
										<div className="flex items-center text-xs text-gray-400 mb-1">
											<Hash size={12} className="mr-1" />
											Member ID
										</div>
										<div className="text-white font-medium text-sm">
											{member.memberID}
										</div>
									</div>
								)}
								{member.LpuId && (
									<div className="bg-white/5 rounded-lg p-3 border border-white/10">
										<div className="flex items-center text-xs text-gray-400 mb-1">
											<Badge size={12} className="mr-1" />
											LPU ID
										</div>
										<div className="text-white font-medium text-sm">
											{member.LpuId}
										</div>
									</div>
								)}
								{member.joinedAt && (
									<div className="bg-white/5 rounded-lg p-3 border border-white/10 sm:col-span-2">
										<div className="flex items-center text-xs text-gray-400 mb-1">
											<Clock size={12} className="mr-1" />
											Joined
										</div>
										<div className="text-white font-medium text-sm">
											{formatDate(member.joinedAt)}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				);

			case 'contact':
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-white mb-3 flex items-center">
							<Mail size={18} className="mr-2 text-blue-400" />
							Contact Information
						</h3>
						<div className="space-y-3">
							{member.email && (
								<a
									href={`mailto:${member.email}`}
									className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
								>
									<Mail size={16} className="text-blue-400 mr-3 flex-shrink-0" />
									<span className="text-gray-300 group-hover:text-white text-sm break-all">
										{member.email}
									</span>
								</a>
							)}
							{member.phone && (
								<a
									href={`tel:${member.phone}`}
									className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
								>
									<Phone size={16} className="text-blue-400 mr-3 flex-shrink-0" />
									<span className="text-gray-300 group-hover:text-white text-sm">
										{member.phone}
									</span>
								</a>
							)}
						</div>
					</div>
				);

			case 'skills':
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-white mb-3 flex items-center">
							<Code size={18} className="mr-2 text-blue-400" />
							Skills & Technologies
						</h3>
						<div className="flex flex-wrap gap-2">
							{member.skills?.map((skill, index) => (
								<motion.span
									key={index}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: index * 0.05 }}
									className="px-3 py-1.5 bg-blue-900/40 text-blue-200 rounded-full text-sm border border-blue-700/30 backdrop-blur-sm"
								>
									{skill}
								</motion.span>
							))}
						</div>
					</div>
				);

			case 'social':
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-white mb-3 flex items-center">
							<Globe size={18} className="mr-2 text-blue-400" />
							Social Links
						</h3>
						<div className="space-y-3">
							{member.linkedIn && (
								<a
									href={
										member.linkedIn.startsWith('http')
											? member.linkedIn
											: `https://${member.linkedIn}`
									}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
								>
									<div className="flex items-center">
										<Linkedin size={16} className="text-blue-400 mr-3" />
										<span className="text-gray-300 group-hover:text-white text-sm">
											LinkedIn
										</span>
									</div>
									<ExternalLink size={14} className="text-gray-500" />
								</a>
							)}
							{member.github && (
								<a
									href={
										member.github.startsWith('http')
											? member.github
											: `https://${member.github}`
									}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
								>
									<div className="flex items-center">
										<Github size={16} className="text-purple-400 mr-3" />
										<span className="text-gray-300 group-hover:text-white text-sm">
											GitHub
										</span>
									</div>
									<ExternalLink size={14} className="text-gray-500" />
								</a>
							)}
							{member.portfolio && (
								<a
									href={
										member.portfolio.startsWith('http')
											? member.portfolio
											: `https://${member.portfolio}`
									}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
								>
									<div className="flex items-center">
										<Globe size={16} className="text-green-400 mr-3" />
										<span className="text-gray-300 group-hover:text-white text-sm">
											Portfolio
										</span>
									</div>
									<ExternalLink size={14} className="text-gray-500" />
								</a>
							)}
						</div>
					</div>
				);

			case 'extra':
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-white mb-3 flex items-center">
							<Info size={18} className="mr-2 text-blue-400" />
							Additional Details
						</h3>

						{/* Education */}
						{(member.program || member.year) && (
							<div className="bg-white/5 rounded-lg p-4 border border-white/10">
								<h4 className="flex items-center text-sm font-medium text-blue-300 mb-2">
									<GraduationCap size={14} className="mr-2" />
									Education
								</h4>
								<div className="space-y-1 text-sm text-gray-300">
									{member.program && <div>Program: {member.program}</div>}
									{member.year && <div>Year: {member.year}</div>}
								</div>
							</div>
						)}

						{/* Residence */}
						{member.hosteler !== undefined && (
							<div className="bg-white/5 rounded-lg p-4 border border-white/10">
								<h4 className="flex items-center text-sm font-medium text-blue-300 mb-2">
									<Building size={14} className="mr-2" />
									Residence
								</h4>
								<div className="text-sm text-gray-300">
									{member.hosteler
										? `Hosteler${member.hostel ? ` (${member.hostel})` : ''}`
										: 'Day Scholar'}
								</div>
							</div>
						)}

						{/* Projects */}
						{member.projects && member.projects.length > 0 && (
							<div className="bg-white/5 rounded-lg p-4 border border-white/10">
								<h4 className="flex items-center text-sm font-medium text-blue-300 mb-2">
									<Briefcase size={14} className="mr-2" />
									Projects ({member.projects.length})
								</h4>
								<div className="space-y-2 max-h-24 overflow-y-auto">
									{member.projects.slice(0, 3).map((project, index) => (
										<div
											key={index}
											className="text-sm text-gray-300 leading-relaxed"
										>
											• {project}
										</div>
									))}
									{member.projects.length > 3 && (
										<div className="text-xs text-gray-500">
											+{member.projects.length - 3} more
										</div>
									)}
								</div>
							</div>
						)}

						{/* Achievements */}
						{member.achievements && member.achievements.length > 0 && (
							<div className="bg-white/5 rounded-lg p-4 border border-white/10">
								<h4 className="flex items-center text-sm font-medium text-yellow-300 mb-2">
									<Award size={14} className="mr-2" />
									Achievements ({member.achievements.length})
								</h4>
								<div className="space-y-2 max-h-24 overflow-y-auto">
									{member.achievements.slice(0, 3).map((achievement, index) => (
										<div
											key={index}
											className="text-sm text-gray-300 leading-relaxed"
										>
											• {achievement}
										</div>
									))}
									{member.achievements.length > 3 && (
										<div className="text-xs text-gray-500">
											+{member.achievements.length - 3} more
										</div>
									)}
								</div>
							</div>
						)}

						{/* Resume */}
						{member.resume?.url && (
							<a
								href={member.resume.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
							>
								<div className="flex items-center">
									<FileText size={16} className="text-blue-400 mr-3" />
									<span className="text-gray-300 group-hover:text-white text-sm">
										View Resume
									</span>
								</div>
								<Download size={14} className="text-gray-500" />
							</a>
						)}
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className="relative w-full max-w-4xl max-h-[95vh] bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/20 rounded-2xl border border-white/10 overflow-hidden flex flex-col"
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="relative bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-600 p-4 sm:p-6 flex-shrink-0">
							{/* Background decoration */}
							<div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>

							{/* Close button */}
							<button
								onClick={onClose}
								className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
								aria-label="Close modal"
							>
								<X size={20} className="text-white" />
							</button>

							{/* Profile section */}
							<div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
								{/* Profile image */}
								<div className="relative flex-shrink-0">
									<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
										{!imageError && member.profilePicture?.url ? (
											<img
												src={member.profilePicture.url}
												alt={member.fullname}
												className="w-full h-full object-cover"
												onError={() => setImageError(true)}
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-800">
												<span className="text-white font-bold text-lg sm:text-xl">
													{initials}
												</span>
											</div>
										)}
									</div>
								</div>

								{/* Profile info */}
								<div className="flex-1 text-center sm:text-left min-w-0">
									<h2
										className="text-xl sm:text-2xl font-bold text-white mb-1 truncate"
										title={member.fullname}
									>
										{member.fullname}
									</h2>
									<p
										className="text-blue-200 font-medium mb-2 text-sm sm:text-base truncate"
										title={member.designation}
									>
										{member.designation}
									</p>

									{/* Department and status */}
									<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
										{member.department && (
											<div className="inline-flex items-center px-2 py-1 bg-indigo-900/30 text-indigo-200 rounded-full text-xs border border-indigo-500/30">
												<Sparkles size={10} className="mr-1" />
												{member.department}
											</div>
										)}
										{getStatusBadge()}
									</div>
								</div>
							</div>
						</div>

						{/* Tabs */}
						<div className="flex border-b border-white/10 bg-gray-900/50 flex-shrink-0 overflow-x-auto">
							{tabs.map((tab) => {
								const IconComponent = tab.icon;
								return (
									<button
										key={tab.id}
										className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
											activeTab === tab.id
												? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/20'
												: 'text-gray-400 hover:text-white hover:bg-white/5'
										}`}
										onClick={() => setActiveTab(tab.id)}
									>
										<IconComponent size={14} />
										<span className="hidden sm:inline">{tab.label}</span>
									</button>
								);
							})}
						</div>

						{/* Tab content */}
						<div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0">
							<motion.div
								key={activeTab}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.2 }}
								className="h-full"
							>
								{renderTabContent()}
							</motion.div>

							{/* Auth notice for non-authenticated users */}
							{!isAuthenticated && (
								<div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/50 flex items-start gap-3">
									<Lock
										size={16}
										className="text-blue-400 mt-0.5 flex-shrink-0"
									/>
									<div>
										<p className="text-blue-300 font-medium text-sm mb-1">
											Member-Only Content
										</p>
										<p className="text-blue-200/70 text-xs leading-relaxed">
											Sign in to access complete profiles, contact details,
											education information, and more.
										</p>
									</div>
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
