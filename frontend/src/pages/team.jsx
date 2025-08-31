import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader, Users, Filter, Search, UserCheck, UserX, X, Award, Layout, SearchX } from 'lucide-react';
import { publicClient } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

// Import components
import LeadershipCard from '../components/team/LeadershipCard';
import DepartmentSection from '../components/team/DepartmentSection';
import TeamMemberModal from '../components/team/TeamMemberModal';
import FloatingParticles from '../components/team/FloatingParticles';
import TeamSkeleton from '../components/team/TeamSkeleton';
import ScrollToTopButton from '../components/team/ScrollToTopButton';

const TeamsPage = () => {
	const { isAuthenticated } = useAuth();

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
	const [searchQuery, setSearchQuery] = useState('');
	const [showAuthMessage, setShowAuthMessage] = useState(true);

	useEffect(() => {
		const fetchTeamData = async () => {
			try {
				setLoading(true);
				const response = await publicClient.get('api/members/getall');
				setTeamData(response.data.data.members);
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
			// Filter team data if search query exists
			const filteredData = searchQuery
				? teamData.filter(
						(member) =>
							member.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
							member.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
							member.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
							member.skills?.some((skill) =>
								skill.toLowerCase().includes(searchQuery.toLowerCase())
							)
					)
				: teamData;

			const leadershipMembers = filteredData
				.filter((member) => ['CEO', 'CTO', 'CMO', 'COO'].includes(member.designation))
				.map((member) => ({
					...member,
					level: member.designation === 'CEO' ? 0 : 1,
				}));
			setLeadership(leadershipMembers);

			const excludeLeadership = (member) =>
				!leadershipMembers.some((lm) => lm._id === member._id);

			setTechnical(
				filteredData.filter((m) => m.department === 'Technical' && excludeLeadership(m))
			);
			setManagement(
				filteredData.filter((m) => m.department === 'Management' && excludeLeadership(m))
			);
			setMarketing(
				filteredData.filter((m) => m.department === 'Marketing' && excludeLeadership(m))
			);
			setSocialMedia(
				filteredData.filter((m) => m.department === 'Social Media' && excludeLeadership(m))
			);
			setMedia(filteredData.filter((m) => m.department === 'Media' && excludeLeadership(m)));
			setContentWriting(
				filteredData.filter(
					(m) => m.department === 'Content Writing' && excludeLeadership(m)
				)
			);
			setDesign(
				filteredData.filter((m) => m.department === 'Design' && excludeLeadership(m))
			);
			setHR(filteredData.filter((m) => m.department === 'HR' && excludeLeadership(m)));
			setEventManagement(
				filteredData.filter(
					(m) => m.department === 'Event Management' && excludeLeadership(m)
				)
			);
		}
	}, [teamData, searchQuery]);

	// Auto-hide auth message after 5 seconds
	useEffect(() => {
		if (showAuthMessage) {
			const timer = setTimeout(() => {
				setShowAuthMessage(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [showAuthMessage]);

	const handleMemberClick = (member) => {
		setSelectedMember(member);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setTimeout(() => setSelectedMember(null), 300); // Clear after animation
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#080b17] via-[#0f1228] to-[#0a0c20] text-white overflow-x-hidden">
			{/* Background particles */}
			<FloatingParticles />

			{/* Authentication Status Banner */}
			<AnimatePresence>
				{showAuthMessage && (
					<motion.div
						className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-md border ${
							isAuthenticated
								? 'bg-[#1e2f60]/80 border-[#3a56c9] text-[#d0d5f7]'
								: 'bg-[#1e2f60]/80 border-[#3a56c9]/50 text-[#9ca3d4]'
						}`}
						initial={{ y: -50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -50, opacity: 0 }}
					>
						{isAuthenticated ? (
							<>
								<UserCheck size={16} className="text-[#5d7df5]" />
								<span className="text-sm">Viewing as authenticated member</span>
							</>
						) : (
							<>
								<UserX size={16} className="text-[#5d7df5]/70" />
								<span className="text-sm">
									Some details are hidden for non-members
								</span>
							</>
						)}
						<button
							className="ml-2 text-[#5d7df5] hover:text-[#3a56c9] transition-colors"
							onClick={() => setShowAuthMessage(false)}
						>
							<X size={14} />
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			{loading ? (
				<div className="py-10">
					<div className="text-center mb-8">
						<Loader className="w-10 h-10 text-[#5d7df5] animate-spin mx-auto mb-3" />
						<p className="text-lg text-[#d0d5f7]">Loading amazing people...</p>
					</div>
					<TeamSkeleton />
				</div>
			) : error ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1f]/90 backdrop-blur-lg p-4">
					<motion.div
						className="text-center p-6 sm:p-8 rounded-2xl bg-[#0d1326] border border-[#ff5555]/30 max-w-md"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.3 }}
					>
						<h3 className="text-xl sm:text-2xl font-bold text-[#ff5555] mb-2">
							Error Loading Data
						</h3>
						<p className="text-[#d0d5f7] mb-6">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] text-white font-medium hover:opacity-90 transition-opacity"
						>
							Try Again
						</button>
					</motion.div>
				</div>
			) : (
				<>
					{/* Hero Section */}
					<section className="relative w-full pt-20 md:pt-28 pb-12 md:pb-16 px-4 flex flex-col items-center justify-center text-center">
						{/* Modern geometric background */}
						<div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
							<div className="absolute -top-20 -left-20 w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/30 blur-[120px] animate-pulse-slow" />
							<div className="absolute -bottom-40 -right-20 w-[50vw] h-[50vw] rounded-full bg-gradient-to-l from-blue-500/20 to-sky-400/20 blur-[100px] animate-pulse-slow" />
							<div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[70vw] h-[30vw] bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-transparent rounded-[100%] blur-[80px] animate-pulse-slow" />
						</div>

						<div className="relative z-10 max-w-4xl mx-auto">
							<motion.div
								className="mb-8 flex justify-center"
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.6, ease: "easeOut" }}
							>
								<div className="relative">
									{/* Modern glow effect */}
									<div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-400 opacity-80 blur-md"></div>
									<div className="relative p-4 rounded-full bg-[#1a1f3f]/70 backdrop-blur-md border border-white/10 shadow-lg">
										<Users size={42} className="text-white" />
									</div>
								</div>
							</motion.div>

							<motion.h1
								className="text-4xl sm:text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent tracking-tight mb-6"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.8 }}
							>
								Meet Our <span className="italic">Incredible</span> Team
							</motion.h1>
							
							<motion.p
								className="text-lg sm:text-xl md:text-2xl text-white/80 font-light mb-8 max-w-3xl"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.8 }}
							>
								<Sparkles className="inline-block text-blue-400 mr-2" size={24} />
								<span>
									Where <span className="font-semibold text-blue-300">creativity</span> meets <span className="font-semibold text-indigo-300">technology</span> and <span className="font-semibold text-sky-300">collaboration</span> sparks innovation.
								</span>
							</motion.p>
							
							{/* Modern glassmorphic search */}
							<motion.div
								className="max-w-md w-full mx-auto mb-8 px-4 sm:px-0"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6, duration: 0.5 }}
							>
								<div className="relative group">
									<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
									<div className="relative overflow-hidden bg-[#161a36]/70 backdrop-filter backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
										<input
											type="text"
											placeholder="Search by name, department, skills..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="w-full px-4 py-3 pl-11 bg-transparent text-white placeholder-white/50 focus:outline-none focus:placeholder-white/30 text-sm sm:text-base transition-all"
										/>
										<Search
											className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/70 group-hover:text-white transition-colors"
											size={18}
										/>
										{searchQuery && (
											<button
												className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
												onClick={() => setSearchQuery('')}
											>
												<X size={16} />
											</button>
										)}
									</div>
								</div>
							</motion.div>

							{/* Team stats */}
							<motion.div
								className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 px-2"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.7, duration: 0.8 }}
							>
								{[
									{ value: teamData.length, label: 'Team Members', icon: Users },
									{ 
										value: Object.keys(teamData.reduce((acc, m) => ({ ...acc, [m.department]: true }), {})).length, 
										label: 'Departments', 
										icon: Layout 
									},
									{ value: leadership.length, label: 'Leaders', icon: Award }
								].map((stat, index) => (
									<motion.div
										key={index}
										className="relative group"
										whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
									>
										<div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-blue-600/80 to-sky-400/80 rounded-2xl blur-sm opacity-0 group-hover:opacity-70 transition-opacity"></div>
										<div className="relative flex flex-col items-center px-6 py-4 rounded-2xl bg-[#161a36]/70 backdrop-filter backdrop-blur-xl border border-white/10 shadow-lg min-w-[140px]">
											<div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
												{stat.value}
											</div>
											<div className="text-sm text-blue-100/80">{stat.label}</div>
											<div className="absolute -top-3 -right-3 p-1.5 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg">
												<stat.icon size={14} className="text-white" />
											</div>
										</div>
									</motion.div>
								))}
							</motion.div>
						</div>
					</section>

					{/* Leadership Section */}
					{leadership.length > 0 && (
						<section id="leadership" className="py-10 sm:py-16 px-4 relative z-10">
							<div className="max-w-6xl mx-auto">
								<motion.div
									className="flex flex-col items-center mb-10"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.8 }}
								>
									<h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] bg-clip-text text-transparent">
										Leadership Team
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] rounded-full"></div>
								</motion.div>

								<div className="relative">
									{leadership.filter((m) => m.designation === 'CEO').length >
										0 && (
										<div className="flex justify-center mb-10">
											<LeadershipCard
												leader={leadership.find(
													(m) => m.designation === 'CEO'
												)}
												index={0}
												onClick={handleMemberClick}
											/>
										</div>
									)}
									<div className="flex flex-wrap justify-center gap-4 sm:gap-8">
										{leadership
											.filter((m) => m.designation !== 'CEO')
											.map((leader, index) => (
												<LeadershipCard
													key={leader._id || index}
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
					<section id="departments" className="py-10 sm:py-16 px-4 relative z-10">
						<div className="max-w-7xl mx-auto">
							<motion.div
								className="flex flex-col items-center mb-10"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
							>
								<h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#0ea5e9] to-[#5d7df5] bg-clip-text text-transparent">
									Our Departments
								</h2>
								<div className="w-20 h-1 bg-gradient-to-r from-[#0ea5e9] to-[#5d7df5] rounded-full"></div>
							</motion.div>

							{/* Search results message */}
							{searchQuery && (
								<div className="mb-8 text-center">
									<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a244f]/70 rounded-lg border border-[#3a56c9]/40">
										<Filter size={16} className="text-[#5d7df5]" />
										<span className="text-[#d0d5f7]">
											Showing results for "{searchQuery}"
										</span>
										<button
											onClick={() => setSearchQuery('')}
											className="ml-2 text-[#5d7df5] hover:text-white transition-colors"
										>
											Clear
										</button>
									</div>
								</div>
							)}

							<div className="space-y-16 sm:space-y-20">
								{technical.length > 0 && (
									<DepartmentSection
										department="Technical"
										members={technical}
										onClick={handleMemberClick}
										isAuthenticated={isAuthenticated}
									/>
								)}
								{management.length > 0 && (
									<DepartmentSection
										department="Management"
										members={management}
										onClick={handleMemberClick}
										isAuthenticated={isAuthenticated}
									/>
								)}
								{marketing.length > 0 && (
									<DepartmentSection
										department="Marketing"
										members={marketing}
										onClick={handleMemberClick}
										isAuthenticated={isAuthenticated}
									/>
								)}
								{socialMedia.length > 0 && (
									<DepartmentSection
										department="Social Media"
										members={socialMedia}
										onClick={handleMemberClick}
										isAuthenticated={isAuthenticated}
									/>
								)}
								{media.length > 0 && (
									<DepartmentSection
										department="Media"
										members={media}
										onClick={handleMemberClick}
										isAuthenticated={isAuthenticated}
									/>
								)}
								{contentWriting.length > 0 && (
									<DepartmentSection
										department="Content Writing"
										members={contentWriting}
										onClick={handleMemberClick}
										isAuthenticated={isAuthenticated}
									/>
								)}
								{design.length > 0 && (
									<DepartmentSection
										department="Design"
										members={design}
										onClick={handleMemberClick}
										isAuthenticated={isAuthenticated}
									/>
								)}
								{hr.length > 0 && (
									<DepartmentSection
										department="HR"
										members={hr}
										onClick={handleMemberClick}
										isAuthenticated={isAuthenticated}
									/>
								)}
								{eventManagement.length > 0 && (
									<DepartmentSection
										department="Event Management"
										members={eventManagement}
										onClick={handleMemberClick}
										isAuthenticated={isAuthenticated}
									/>
								)}
							</div>

							{/* No results message */}
							{searchQuery &&
								technical.length === 0 &&
								management.length === 0 &&
								marketing.length === 0 &&
								socialMedia.length === 0 &&
								media.length === 0 &&
								contentWriting.length === 0 &&
								design.length === 0 &&
								hr.length === 0 &&
								eventManagement.length === 0 && (
									<div className="text-center py-16 max-w-md mx-auto">
										<div className="bg-[#1a244f]/70 rounded-xl p-8 border border-[#3a56c9]/40">
											<SearchX
												size={48}
												className="text-[#5d7df5]/70 mx-auto mb-4"
											/>
											<h3 className="text-xl font-semibold text-white mb-2">
												No Results Found
											</h3>
											<p className="text-[#9ca3d4] mb-4">
												We couldn't find any team members matching "
												{searchQuery}"
											</p>
											<button
												onClick={() => setSearchQuery('')}
												className="px-4 py-2 bg-[#3a56c9] hover:bg-[#5d7df5] text-white rounded-lg transition-colors"
											>
												Clear Search
											</button>
										</div>
									</div>
								)}
						</div>
					</section>

					{/* Modal */}
					<TeamMemberModal
						member={selectedMember}
						isOpen={modalOpen}
						onClose={closeModal}
						isAuthenticated={isAuthenticated}
					/>

					{/* Add the scroll to top button */}
					<ScrollToTopButton />
				</>
			)}
		</div>
	);
};

export default TeamsPage;
