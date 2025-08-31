import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader, Users, Filter, Search, UserCheck, UserX, X } from 'lucide-react';
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
		<div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a1f3a] to-[#0d1326] text-white overflow-x-hidden">
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
								className="mb-6 flex justify-center"
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								<div className="relative">
									<div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] blur-md"></div>
									<div className="relative p-4 rounded-full bg-[#1a244f] border-2 border-[#3a56c9]/40">
										<Users size={40} className="text-[#5d7df5]" />
									</div>
								</div>
							</motion.div>

							<motion.h1
								className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#5d7df5] via-[#3a56c9] to-[#0ea5e9] bg-clip-text text-transparent tracking-tight mb-6"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.8 }}
							>
								Meet Our Team
							</motion.h1>
							<motion.p
								className="text-lg sm:text-xl md:text-2xl text-[#d0d5f7] font-light mb-6 max-w-3xl"
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
									<span className="font-semibold text-[#3a56c9]">technology</span>{' '}
									and{' '}
									<span className="font-semibold text-[#0ea5e9]">
										collaboration
									</span>{' '}
									sparks innovation.
								</span>
							</motion.p>

							{/* Search bar with enhanced mobile experience */}
							<motion.div
								className="max-w-md w-full mx-auto mb-6 sm:mb-8 px-4 sm:px-0"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6, duration: 0.5 }}
							>
								<div className="relative">
									<input
										type="text"
										placeholder="Search by name, department, skills..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full px-4 py-2 sm:py-3 pl-10 bg-[#1a244f]/70 border border-[#3a56c9]/40 rounded-xl text-white placeholder-[#9ca3d4] focus:outline-none focus:border-[#5d7df5] transition-colors text-sm sm:text-base"
									/>
									<Search
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5d7df5]"
										size={16}
									/>
									{searchQuery && (
										<button
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9ca3d4] hover:text-white transition-colors"
											onClick={() => setSearchQuery('')}
										>
											<X size={16} />
										</button>
									)}
								</div>
							</motion.div>

							{/* Team stats */}
							<motion.div
								className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-2"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6, duration: 0.8 }}
							>
								<motion.div
									className="bg-[#1a244f]/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-[#3a56c9]/30 flex-1 min-w-[100px] max-w-[150px]"
									whileHover={{ y: -5, backgroundColor: 'rgba(30, 47, 96, 0.6)' }}
								>
									<div className="text-2xl sm:text-3xl font-bold text-[#5d7df5]">
										{teamData.length}
									</div>
									<div className="text-xs sm:text-sm text-[#9ca3d4]">
										Team Members
									</div>
								</motion.div>
								<motion.div
									className="bg-[#1a244f]/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-[#3a56c9]/30 flex-1 min-w-[100px] max-w-[150px]"
									whileHover={{ y: -5, backgroundColor: 'rgba(30, 47, 96, 0.6)' }}
								>
									<div className="text-2xl sm:text-3xl font-bold text-[#5d7df5]">
										{
											Object.keys(
												teamData.reduce(
													(acc, m) => ({ ...acc, [m.department]: true }),
													{}
												)
											).length
										}
									</div>
									<div className="text-xs sm:text-sm text-[#9ca3d4]">
										Departments
									</div>
								</motion.div>
								<motion.div
									className="bg-[#1a244f]/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-[#3a56c9]/30 flex-1 min-w-[100px] max-w-[150px]"
									whileHover={{ y: -5, backgroundColor: 'rgba(30, 47, 96, 0.6)' }}
								>
									<div className="text-2xl sm:text-3xl font-bold text-[#5d7df5]">
										{leadership.length}
									</div>
									<div className="text-xs sm:text-sm text-[#9ca3d4]">Leaders</div>
								</motion.div>
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
