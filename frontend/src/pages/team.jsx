import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
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
	Loader,
	Calendar,
	X,
	ArrowRight,
} from 'lucide-react';
import { publicClient } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

// Leadership Card
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
			className={`relative p-6 rounded-2xl bg-gradient-to-br from-[#0a0f1f]/80 to-[#1a1f3a]/90 border border-[#3a56c9]/40 shadow-xl cursor-pointer ${leader.level === 0 ? 'w-80' : 'w-72'}`}
		>
			<div className="flex flex-col items-center">
				<div className="relative mb-4">
					<img
						src={leader.profilePicture || 'default-profile.png'}
						alt={leader.fullName}
						className="w-24 h-24 rounded-full object-cover border-4 border-[#3a56c9]/40"
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
				<motion.button
					className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3a56c9]/30 to-[#5d7df5]/30 text-[#9ca3d4] text-sm hover:text-white hover:from-[#3a56c9]/50 hover:to-[#5d7df5]/50 transition-all"
					whileHover={{ scale: 1.05 }}
				>
					<span className="flex items-center gap-2">
						View Profile <ArrowRight size={14} />
					</span>
				</motion.button>
			</div>
		</div>
	</motion.div>
);

// Team Member Card
const TeamMemberCard = ({ member, delay = 0, onClick }) => (
	<motion.div
		className="h-full group"
		initial={{ opacity: 0, y: 30 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: delay * 0.1, duration: 0.5 }}
		whileHover={{ y: -10 }}
		onClick={() => onClick(member)}
	>
		<div className="relative p-6 rounded-xl bg-gradient-to-br from-[#0a0f1f]/80 to-[#1a1f3a]/90 border border-[#3a56c9]/40 shadow-lg h-full">
			<div className="flex items-center mb-4">
				<div className="relative">
					<img
						src={member.profilePicture || 'default-profile.png'}
						alt={member.fullName}
						className="w-16 h-16 rounded-full object-cover border-3 border-[#3a56c9]/30"
					/>
					<div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center shadow-lg">
						<Star size={12} className="text-white" />
					</div>
				</div>
				<div>
					<h4 className="text-lg font-semibold text-white group-hover:text-[#5d7df5] transition-colors">
						{member.fullName}
					</h4>
					<p className="text-[#5d7df5] text-sm">{member.designation}</p>
				</div>
			</div>
			<div className="mb-4 flex flex-wrap gap-2">
				{member.skills?.slice(0, 3).map((skill, idx) => (
					<span
						key={idx}
						className="px-3 py-1 rounded-full bg-[#1a244f] text-xs text-[#9ca3d4] border border-[#2a3a72]"
					>
						{skill}
					</span>
				))}
				{member.skills?.length > 3 && (
					<span className="px-3 py-1 rounded-full bg-[#1a244f]/60 text-xs text-[#9ca3d4]">
						+{member.skills.length - 3}
					</span>
				)}
			</div>
			<motion.button
				className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#3a56c9]/30 to-[#5d7df5]/30 text-[#9ca3d4] text-sm hover:text-white hover:from-[#3a56c9]/50 hover:to-[#5d7df5]/50 transition-all"
				whileHover={{ scale: 1.03 }}
			>
				<span className="flex items-center justify-center gap-2">
					View Profile <ArrowRight size={14} />
				</span>
			</motion.button>
		</div>
	</motion.div>
);

// Department Section
const DepartmentSection = ({ department, members, onClick }) => {
	const designationGroups = members.reduce((acc, member) => {
		if (!acc[member.designation]) acc[member.designation] = [];
		acc[member.designation].push(member);
		return acc;
	}, {});

	return Object.entries(designationGroups).map(
		([designation, membersInDesignation]) =>
			membersInDesignation.length > 0 && (
				<motion.div
					key={designation}
					className="mb-16"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-100px' }}
					transition={{ duration: 0.8 }}
				>
					<div className="flex flex-col items-center mb-8">
						<motion.div
							className="flex items-center space-x-4 p-4 rounded-2xl bg-[#0d1326]/70 border border-[#2a3a72] mb-4"
							whileHover={{ scale: 1.03 }}
						>
							<h3 className="text-2xl font-bold text-white">{designation}</h3>
						</motion.div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{membersInDesignation.map((member, index) => (
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

// Modal
const Modal = ({ member, isOpen, onClose }) => {
	const { isAuthenticated } = useAuth();
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
				className="relative max-w-md w-full p-6 rounded-2xl bg-gradient-to-br from-[#0d1326] to-[#1a1f3a] border border-[#3a56c9]"
				initial={{ scale: 0.8, y: 50 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.8, y: 50 }}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-[#9ca3d4] hover:text-white"
				>
					<X size={24} />
				</button>
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
						{isAuthenticated ? (
							<>
								<div className="text-left">
									<p className="text-sm text-[#9ca3d4]">LPU ID</p>
									<p className="text-white">{member.LpuId || 'N/A'}</p>
								</div>
								<div className="text-left">
									<p className="text-sm text-[#9ca3d4]">Email</p>
									<p className="text-white">{member.email || 'N/A'}</p>
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
							</>
						) : (
							<div className="text-left col-span-2">
								<p className="text-sm text-[#9ca3d4]">Program</p>
								<p className="text-white">{member.program || 'N/A'}</p>
							</div>
						)}
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
							<a
								href={member.linkedIn}
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 rounded-lg bg-[#1a244f] hover:bg-[#0A66C2] transition"
							>
								<Linkedin size={20} className="text-[#5d7df5]" />
							</a>
						)}
						{member.github && (
							<a
								href={member.github}
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 rounded-lg bg-[#1a244f] hover:bg-[#333] transition"
							>
								<Github size={20} className="text-white" />
							</a>
						)}
						{isAuthenticated && member.email && (
							<a
								href={`mailto:${member.email}`}
								className="p-3 rounded-lg bg-[#1a244f] hover:bg-[#EA4335] transition"
							>
								<Mail size={20} className="text-[#5d7df5]" />
							</a>
						)}
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

// Floating Particles
const FloatingParticles = () => (
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
					backgroundColor: i % 3 === 0 ? '#3a56c9' : i % 3 === 1 ? '#5d7df5' : '#0ea5e9',
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
				setTeamData(response.data.data.members);
				setError(null);
			} catch (error) {
				setError('Failed to load team data. Please try again later.');
			} finally {
				setLoading(false);
			}
		};
		fetchTeamData();
	}, []);

	useEffect(() => {
		if (teamData.length > 0) {
			const leadershipMembers = teamData
				.filter((member) => ['CEO', 'CTO', 'CMO', 'COO'].includes(member.designation))
				.map((member) => ({
					...member,
					level: member.designation === 'CEO' ? 0 : 1,
				}));
			setLeadership(leadershipMembers);

			const excludeLeadership = (member) =>
				!leadershipMembers.some((lm) => lm._id === member._id);

			setTechnical(
				teamData.filter((m) => m.department === 'Technical' && excludeLeadership(m))
			);
			setManagement(
				teamData.filter((m) => m.department === 'Management' && excludeLeadership(m))
			);
			setMarketing(
				teamData.filter((m) => m.department === 'Marketing' && excludeLeadership(m))
			);
			setSocialMedia(
				teamData.filter((m) => m.department === 'Social Media' && excludeLeadership(m))
			);
			setMedia(teamData.filter((m) => m.department === 'Media' && excludeLeadership(m)));
			setContentWriting(
				teamData.filter((m) => m.department === 'Content Writing' && excludeLeadership(m))
			);
			setDesign(teamData.filter((m) => m.department === 'Design' && excludeLeadership(m)));
			setHR(teamData.filter((m) => m.department === 'HR' && excludeLeadership(m)));
			setEventManagement(
				teamData.filter((m) => m.department === 'Event Management' && excludeLeadership(m))
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

			{loading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1f]/90 backdrop-blur-lg">
					<div className="text-center">
						<Loader className="w-16 h-16 text-[#5d7df5] animate-spin mx-auto mb-4" />
						<p className="text-xl text-[#d0d5f7]">Loading Team Data...</p>
					</div>
				</div>
			)}

			{error && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1f]/90 backdrop-blur-lg">
					<div className="text-center p-8 rounded-2xl bg-[#0d1326] border border-[#ff5555]/30 max-w-md">
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

			{/* Hero Section */}
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
							Where <span className="font-semibold text-[#5d7df5]">creativity</span>{' '}
							meets <span className="font-semibold text-[#3a56c9]">technology</span>{' '}
							and <span className="font-semibold text-[#0ea5e9]">collaboration</span>{' '}
							sparks innovation.
						</span>
					</motion.p>
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
							{leadership.filter((m) => m.designation === 'CEO').length > 0 && (
								<div className="flex justify-center mb-10">
									<LeadershipCard
										leader={leadership.find((m) => m.designation === 'CEO')}
										index={0}
										onClick={handleMemberClick}
									/>
								</div>
							)}
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
