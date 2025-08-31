import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader } from 'lucide-react';
import { publicClient } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

// Import components
import LeadershipCard from '../components/team/LeadershipCard';
import DepartmentSection from '../components/team/DepartmentSection';
import TeamMemberModal from '../components/team/TeamMemberModal';

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
		setTimeout(() => setSelectedMember(null), 300); // Clear after animation
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a1f3a] to-[#0d1326] text-white overflow-x-hidden">
			{loading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1f]/90 backdrop-blur-lg">
					<div className="text-center">
						<Loader className="w-12 h-12 sm:w-16 sm:h-16 text-[#5d7df5] animate-spin mx-auto mb-4" />
						<p className="text-lg sm:text-xl text-[#d0d5f7]">Loading Team Data...</p>
					</div>
				</div>
			)}

			{error && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1f]/90 backdrop-blur-lg p-4">
					<div className="text-center p-6 sm:p-8 rounded-2xl bg-[#0d1326] border border-[#ff5555]/30 max-w-md">
						<h3 className="text-xl sm:text-2xl font-bold text-[#ff5555] mb-2">
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
				<section id="leadership" className="py-10 sm:py-16 px-4 relative z-10">
					<div className="max-w-6xl mx-auto">
						<motion.h2
							className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-14 bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] bg-clip-text text-transparent"
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
					<motion.h2
						className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-14 bg-gradient-to-r from-[#0ea5e9] to-[#5d7df5] bg-clip-text text-transparent"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
					>
						Our Departments
					</motion.h2>
					<div className="space-y-16 sm:space-y-20">
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
			<TeamMemberModal
				member={selectedMember}
				isOpen={modalOpen}
				onClose={closeModal}
				isAuthenticated={isAuthenticated}
			/>
		</div>
	);
};

export default TeamsPage;
