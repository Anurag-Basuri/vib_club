import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	ChevronDown,
	Users,
	Code,
	Briefcase,
	Palette,
	Megaphone,
	Mail,
	Linkedin,
	Github,
	Sparkles,
	Star,
	Award,
	Heart,
	Target,
	Globe,
	ArrowRight,
	Loader,
} from 'lucide-react';
import { publicClient } from '../services/api.js';

// Leadership Card Component
const LeadershipCard = ({ leader, index, onClick }) => {
	return (
		<motion.div
			className="relative"
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.2, duration: 0.7 }}
			whileHover={{
				y: -10,
				scale: 1.03,
			}}
			whileTap={{ scale: 0.98 }}
			onClick={() => onClick(leader)}
		>
			<div
				className={`
        relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0a0f1f]/70 to-[#1a1f3a]/80
        border border-[#3a56c9]/50 shadow-2xl overflow-hidden cursor-pointer
        ${leader.level === 0 ? 'w-80' : 'w-72'}
      `}
			>
				{/* Animated background gradient */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0"
					whileHover={{ opacity: 0.3 }}
					transition={{ duration: 0.4 }}
				/>

				{/* Profile image */}
				<div className="relative z-10 flex flex-col items-center">
					<div className="relative mb-4">
						<img
							src={leader.profilePicture || 'default-profile.png'}
							alt={leader.fullName}
							className="w-24 h-24 rounded-full object-cover border-4 border-[#3a56c9]/30"
						/>
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10" />
					</div>

					<h3 className="text-xl font-bold text-white mb-1">{leader.fullName}</h3>
					<p className="text-[#5d7df5] font-medium mb-3">{leader.designation}</p>

					{/* Minimal bio */}
					<p className="text-[#9ca3d4] text-sm text-center leading-relaxed line-clamp-2">
						{leader.bio || 'Passionate leader driving innovation'}
					</p>

					{/* View more button */}
					<motion.button
						className="mt-4 px-4 py-2 rounded-lg bg-[#1a244f] text-[#9ca3d4] text-sm hover:bg-[#2a3a72] transition-colors"
						whileHover={{ scale: 1.05 }}
					>
						View Profile
					</motion.button>
				</div>

				{/* Connecting lines for hierarchy */}
				{leader.level === 0 && (
					<motion.div
						className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gradient-to-b from-[#5d7df5] to-transparent"
						animate={{ height: [0, 20, 0] }}
						transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
					/>
				)}
			</div>
		</motion.div>
	);
};

// Team Member Card Component
const TeamMemberCard = ({ member, delay = 0, onClick }) => {
	return (
		<motion.div
			className="h-full"
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: delay * 0.1, duration: 0.5 }}
			whileHover={{
				y: -10,
			}}
			onClick={() => onClick(member)}
		>
			<div className="relative p-6 rounded-xl backdrop-blur-xl bg-gradient-to-br from-[#0a0f1f]/70 to-[#1a1f3a]/80 border border-[#3a56c9]/50 shadow-xl overflow-hidden h-full">
				{/* Hover gradient */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0"
					whileHover={{ opacity: 0.3 }}
					transition={{ duration: 0.4 }}
				/>

				<div className="relative z-10">
					<div className="flex items-center mb-4">
						<div className="relative">
							<img
								src={member.profilePicture || 'default-profile.png'}
								alt={member.fullName}
								className="w-16 h-16 rounded-full object-cover border-3 border-[#3a56c9]/30 mr-4"
							/>
							<motion.div
								className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center"
								animate={{ rotate: [0, 10, -10, 0] }}
								transition={{ repeat: Infinity, duration: 3 }}
							>
								<Star size={12} className="text-white" />
							</motion.div>
						</div>
						<div>
							<h4 className="text-lg font-semibold text-white">{member.fullName}</h4>
							<p className="text-[#5d7df5] text-sm">{member.department}</p>
						</div>
					</div>

					{/* Skills */}
					<div className="mb-4">
						<div className="flex flex-wrap gap-2">
							{member.skills?.slice(0, 3).map((skill, index) => (
								<motion.span
									key={index}
									className="px-3 py-1 rounded-full bg-[#1a244f] text-xs text-[#9ca3d4] border border-[#2a3a72]"
									whileHover={{ scale: 1.1 }}
								>
									{skill}
								</motion.span>
							))}
							{member.skills?.length > 3 && (
								<span className="px-3 py-1 rounded-full bg-[#1a244f]/60 text-xs text-[#9ca3d4]">
									+{member.skills.length - 3}
								</span>
							)}
						</div>
					</div>

					{/* View more button */}
					<motion.button
						className="w-full px-4 py-2 rounded-lg bg-[#1a244f] text-[#9ca3d4] text-sm hover:bg-[#2a3a72] transition-colors"
						whileHover={{ scale: 1.03 }}
					>
						View Profile
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
};

// Department Section Component
const DepartmentSection = ({ department, departmentKey, members, onClick }) => {
	const departmentIcons = {
		Technical: Code,
		Management: Briefcase,
		Marketing: Megaphone,
		'Social Media': Globe,
		Media: Sparkles,
		'Content Writing': Mail,
		Design: Palette,
		HR: Users,
		'Event Management': Calendar,
	};

	const Icon = departmentIcons[department] || Users;

	return (
		members.length > 0 && (
			<motion.div
				className="mb-16"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-100px' }}
				transition={{ duration: 0.8 }}
			>
				{/* Department header */}
				<div className="flex flex-col items-center mb-8">
					<motion.div
						className="flex items-center space-x-4 p-4 rounded-2xl backdrop-blur-xl bg-[#0d1326]/70 border border-[#2a3a72] mb-4"
						whileHover={{ scale: 1.03 }}
					>
						<Icon size={32} className="text-[#5d7df5]" />
						<h3 className="text-2xl font-bold text-white">{department}</h3>
					</motion.div>
				</div>

				{/* Team members grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
					{members.map((member, index) => (
						<TeamMemberCard
							key={member._id}
							member={member}
							delay={index}
							onClick={onClick}
						/>
					))}
				</div>
			</motion.div>
		)
	);
};

// Modal Component
const Modal = ({ member, isOpen, onClose }) => {
	if (!isOpen || !member) return null;

	return (
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1f]/90 backdrop-blur-lg"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
		>
			<motion.div
				className="relative max-w-md w-full p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0d1326] to-[#1a1f3a] border border-[#3a56c9]"
				initial={{ scale: 0.8, y: 50 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.8, y: 50 }}
				onClick={(e) => e.stopPropagation()}
			>
				<motion.button
					onClick={onClose}
					className="absolute top-4 right-4 text-[#9ca3d4] hover:text-white"
					whileHover={{ rotate: 90, scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
				>
					<X size={24} />
				</motion.button>

				<div className="text-center">
					<div className="relative inline-block mb-4">
						<img
							src={member.profilePicture || 'default-profile.png'}
							alt={member.fullName}
							className="w-32 h-32 rounded-full object-cover border-4 border-[#3a56c9]/30 mx-auto"
						/>
						<div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center">
							<Award size={16} className="text-white" />
						</div>
					</div>

					<h3 className="text-2xl font-bold text-white mb-2">{member.fullName}</h3>
					<p className="text-[#5d7df5] font-medium mb-1">{member.designation}</p>
					<p className="text-[#5d7df5] text-sm mb-4">{member.department}</p>

					<div className="grid grid-cols-2 gap-4 mb-6">
						<div className="text-left">
							<p className="text-sm text-[#9ca3d4]">LPU ID</p>
							<p className="text-white">{member.LpuId || 'N/A'}</p>
						</div>
						<div className="text-left">
							<p className="text-sm text-[#9ca3d4]">Program</p>
							<p className="text-white">{member.program || 'N/A'}</p>
						</div>
						<div className="text-left">
							<p className="text-sm text-[#9ca3d4]">Year</p>
							<p className="text-white">{member.year || 'N/A'}</p>
						</div>
						<div className="text-left">
							<p className="text-sm text-[#9ca3d4]">Joined</p>
							<p className="text-white">
								{member.joinedAt
									? new Date(member.joinedAt).toLocaleDateString()
									: 'N/A'}
							</p>
						</div>
					</div>

					{member.bio && (
						<div className="p-4 bg-[#0d1326]/50 rounded-lg border border-[#2a3a72] mb-6">
							<p className="text-sm text-[#d0d5f7]">{member.bio}</p>
						</div>
					)}

					{member.skills?.length > 0 && (
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
						{member.linkedIn && (
							<motion.a
								href={member.linkedIn}
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 rounded-lg bg-[#1a244f]"
								whileHover={{ scale: 1.2, backgroundColor: '#0A66C2' }}
								whileTap={{ scale: 0.9 }}
							>
								<Linkedin size={20} className="text-[#5d7df5]" />
							</motion.a>
						)}
						{member.github && (
							<motion.a
								href={member.github}
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 rounded-lg bg-[#1a244f]"
								whileHover={{ scale: 1.2, backgroundColor: '#333' }}
								whileTap={{ scale: 0.9 }}
							>
								<Github size={20} className="text-white" />
							</motion.a>
						)}
						{member.email && (
							<motion.a
								href={`mailto:${member.email}`}
								className="p-3 rounded-lg bg-[#1a244f]"
								whileHover={{ scale: 1.2, backgroundColor: '#EA4335' }}
								whileTap={{ scale: 0.9 }}
							>
								<Mail size={20} className="text-[#5d7df5]" />
							</motion.a>
						)}
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

// Floating Particles Background
const FloatingParticles = () => {
	return (
		<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
			{[...Array(30)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute rounded-full"
					style={{
						width: `${Math.random() * 10 + 2}px`,
						height: `${Math.random() * 10 + 2}px`,
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						backgroundColor:
							i % 3 === 0 ? '#3a56c9' : i % 3 === 1 ? '#5d7df5' : '#0ea5e9',
						opacity: 0.15,
					}}
					animate={{
						x: [0, Math.random() * 100 - 50],
						y: [0, Math.random() * 100 - 50],
					}}
					transition={{
						duration: Math.random() * 10 + 10,
						repeat: Infinity,
						repeatType: 'reverse',
						ease: 'easeInOut',
					}}
				/>
			))}
		</div>
	);
};

// Main Component
const TeamsPage = () => {
	const [selectedMember, setSelectedMember] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [teamData, setTeamData] = useState([]);
	const [leadership, setLeadership] = useState([]);
	const [technical, setTechnical] = useState([]);
	const [management, setManagement] = useState([]);
	const [marketing, setMarketing] = useState([]);
	const [socialMedia, setSocialMedia] = useState([]);
	const [media, setMedia] = useState([]);
	const [contentWriting, setContentWriting] = useState([]);
	const [design, setDesign] = useState([]);
	const [hr, setHR] = useState([]);
	const [eventManagement, setEventManagement] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTeamData = async () => {
			try {
				setLoading(true);
				const response = await publicClient.get('api/members/getall');
				setTeamData(response.data);
				setError(null);
			} catch (error) {
				console.error('Error fetching team data:', error);
				setError('Failed to load team data. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchTeamData();
	}, []);

	useEffect(() => {
		if (teamData.length > 0) {
			// Get leadership members (CEO, CTO, CMO, COO)
			const leadershipMembers = teamData
				.filter((member) => ['CEO', 'CTO', 'CMO', 'COO'].includes(member.designation))
				.map((member) => ({
					...member,
					level: member.designation === 'CEO' ? 0 : 1,
				}));

			setLeadership(leadershipMembers);

			// Filter other departments
			setTechnical(
				teamData.filter(
					(member) =>
						member.department === 'Technical' && !leadershipMembers.includes(member)
				)
			);

			setManagement(
				teamData.filter(
					(member) =>
						member.department === 'Management' && !leadershipMembers.includes(member)
				)
			);

			setMarketing(
				teamData.filter(
					(member) =>
						member.department === 'Marketing' && !leadershipMembers.includes(member)
				)
			);

			setSocialMedia(
				teamData.filter(
					(member) =>
						member.department === 'Social Media' && !leadershipMembers.includes(member)
				)
			);

			setMedia(
				teamData.filter(
					(member) => member.department === 'Media' && !leadershipMembers.includes(member)
				)
			);

			setContentWriting(
				teamData.filter(
					(member) =>
						member.department === 'Content Writing' &&
						!leadershipMembers.includes(member)
				)
			);

			setDesign(
				teamData.filter(
					(member) =>
						member.department === 'Design' && !leadershipMembers.includes(member)
				)
			);

			setHR(
				teamData.filter(
					(member) => member.department === 'HR' && !leadershipMembers.includes(member)
				)
			);

			setEventManagement(
				teamData.filter(
					(member) =>
						member.department === 'Event Management' &&
						!leadershipMembers.includes(member)
				)
			);
		}
	}, [teamData]);

	const handleMemberClick = (member) => {
		setSelectedMember(member);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setSelectedMember(null);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a1f3a] to-[#0d1326] text-white overflow-x-hidden">
			<FloatingParticles />

			{/* Loading state */}
			{loading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1f]/90 backdrop-blur-lg">
					<div className="text-center">
						<Loader className="w-16 h-16 text-[#5d7df5] animate-spin mx-auto mb-4" />
						<p className="text-xl text-[#d0d5f7]">Loading Team Data...</p>
					</div>
				</div>
			)}

			{/* Error state */}
			{error && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1f]/90 backdrop-blur-lg">
					<div className="text-center p-8 rounded-2xl bg-[#0d1326] border border-[#ff5555]/30 max-w-md">
						<div className="w-16 h-16 bg-[#ff5555]/20 rounded-full flex items-center justify-center mx-auto mb-4">
							{/* <X className="w-8 h-8 text-[#ff5555]" /> */}
						</div>
						<h3 className="text-2xl font-bold text-[#ff5555] mb-2">
							Error Loading Data
						</h3>
						<p className="text-[#d0d5f7] mb-6">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] text-white font-medium"
						>
							Try Again
						</button>
					</div>
				</div>
			)}

			{/* Creative Introduction */}
			<section className="relative w-full pt-28 pb-16 px-4 flex flex-col items-center justify-center text-center">
				<div className="absolute inset-0 pointer-events-none z-0">
					<div className="absolute top-10 left-1/4 w-80 h-80 bg-[#3a56c9]/20 rounded-full blur-3xl animate-pulse-slow" />
					<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5d7df5]/20 rounded-full blur-3xl animate-pulse-slow" />
					<div
						className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#0ea5e9]/20 rounded-full blur-3xl animate-pulse-slow"
						style={{ transform: 'translate(-50%, -50%)' }}
					/>
				</div>

				<div className="relative z-10 max-w-4xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="flex flex-col items-center"
					>
						<motion.h1
							className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#5d7df5] via-[#3a56c9] to-[#0ea5e9] bg-clip-text text-transparent tracking-tight mb-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.8 }}
						>
							Meet Our Team
						</motion.h1>

						<motion.p
							className="text-xl md:text-2xl text-[#d0d5f7] font-light mb-6 max-w-3xl"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.8 }}
						>
							<Sparkles
								className="inline-block text-[#5d7df5] animate-pulse mr-2"
								size={24}
							/>
							<span>
								Where{' '}
								<span className="font-semibold text-[#5d7df5]">creativity</span>{' '}
								meets{' '}
								<span className="font-semibold text-[#3a56c9]">technology</span> and{' '}
								<span className="font-semibold text-[#0ea5e9]">collaboration</span>{' '}
								sparks innovation.
							</span>
						</motion.p>

						<motion.div
							className="flex justify-center mt-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.8 }}
						>
							<motion.a
								href="#leadership"
								className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] text-white font-semibold shadow-lg group"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<span>Explore Our Leaders</span>
								<motion.div
									animate={{ y: [0, 5, 0] }}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										repeatType: 'loop',
									}}
								>
									<ChevronDown className="group-hover:animate-bounce" size={24} />
								</motion.div>
							</motion.a>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Leadership Section */}
			{leadership.length > 0 && (
				<section id="leadership" className="py-16 px-4 relative z-10">
					<div className="max-w-6xl mx-auto">
						<motion.h2
							className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] bg-clip-text text-transparent"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							Leadership Team
						</motion.h2>

						<div className="relative">
							{/* CEO */}
							{leadership.filter((m) => m.designation === 'CEO').length > 0 && (
								<div className="flex justify-center mb-10">
									<LeadershipCard
										leader={leadership.find((m) => m.designation === 'CEO')}
										index={0}
										onClick={handleMemberClick}
									/>
								</div>
							)}

							{/* Other leadership */}
							<div className="flex flex-wrap justify-center gap-8">
								{leadership
									.filter((m) => m.designation !== 'CEO')
									.map((leader, index) => (
										<LeadershipCard
											key={leader._id}
											leader={leader}
											index={index + 1}
											onClick={handleMemberClick}
										/>
									))}
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Departments Sections */}
			<section id="departments" className="py-16 px-4 relative z-10">
				<div className="max-w-7xl mx-auto">
					<motion.h2
						className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-[#0ea5e9] to-[#5d7df5] bg-clip-text text-transparent"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
					>
						Our Departments
					</motion.h2>

					<div className="space-y-20">
						{technical.length > 0 && (
							<DepartmentSection
								department="Technical"
								members={technical}
								onClick={handleMemberClick}
							/>
						)}

						{management.length > 0 && (
							<DepartmentSection
								department="Management"
								members={management}
								onClick={handleMemberClick}
							/>
						)}

						{marketing.length > 0 && (
							<DepartmentSection
								department="Marketing"
								members={marketing}
								onClick={handleMemberClick}
							/>
						)}

						{socialMedia.length > 0 && (
							<DepartmentSection
								department="Social Media"
								members={socialMedia}
								onClick={handleMemberClick}
							/>
						)}

						{media.length > 0 && (
							<DepartmentSection
								department="Media"
								members={media}
								onClick={handleMemberClick}
							/>
						)}

						{contentWriting.length > 0 && (
							<DepartmentSection
								department="Content Writing"
								members={contentWriting}
								onClick={handleMemberClick}
							/>
						)}

						{design.length > 0 && (
							<DepartmentSection
								department="Design"
								members={design}
								onClick={handleMemberClick}
							/>
						)}

						{hr.length > 0 && (
							<DepartmentSection
								department="HR"
								members={hr}
								onClick={handleMemberClick}
							/>
						)}

						{eventManagement.length > 0 && (
							<DepartmentSection
								department="Event Management"
								members={eventManagement}
								onClick={handleMemberClick}
							/>
						)}
					</div>
				</div>
			</section>

			{/* Modal */}
			<Modal member={selectedMember} isOpen={modalOpen} onClose={closeModal} />
		</div>
	);
};

export default TeamsPage;
