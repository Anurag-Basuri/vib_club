import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles,
	Loader,
	Users,
	Filter,
	Search,
	UserCheck,
	UserX,
	X,
	Award,
	Layout,
	SearchX
} from 'lucide-react';
import { publicClient } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

// Import components
import UnifiedTeamCard from '../components/team/UnifiedTeamCard';
import DepartmentSection from '../components/team/DepartmentSection';
import TeamMemberModal from '../components/team/TeamMemberModal';
import FloatingParticles from '../components/team/FloatingParticles';
import TeamSkeleton from '../components/team/TeamSkeleton';

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
				console.log('Fetching team data...');
				const response = await publicClient.get('api/members/getall');
				console.log('API Response:', response.data);
				
				if (response.data && response.data.data && response.data.data.members) {
					setTeamData(response.data.data.members);
					console.log('Team data set:', response.data.data.members.length, 'members');
				} else {
					console.error('Unexpected API response structure:', response.data);
					setError('Invalid data format received from server.');
				}
				setError(null);
			} catch (error) {
				console.error('Error fetching team data:', error);
				console.error('Error details:', error.response?.data || error.message);
				setError('Failed to load team data. Please try again later.');
			} finally {
				setLoading(false);
			}
		};
		fetchTeamData();
	}, []);

	useEffect(() => {
    if (teamData.length > 0) {
        console.log('Total team data:', teamData.length);
        console.log('Sample member:', teamData[0]);
        
        // Filter team data if search query exists
        const filteredData = searchQuery
            ? teamData.filter(
                    (member) =>
                        member.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.skills?.some((skill) =>
                            skill.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                )
            : teamData;

        console.log('Filtered data:', filteredData.length);

        // Leadership members (CEO, CTO, CMO, COO) - separate from departments
        const leadershipMembers = filteredData
            .filter((member) => ['CEO', 'CTO', 'CMO', 'COO'].includes(member.designation))
            .map((member) => ({
                ...member,
                level: member.designation === 'CEO' ? 0 : 1,
            }));
        setLeadership(leadershipMembers);
        console.log('Leadership members:', leadershipMembers.length);

        // Function to exclude leadership from departments
        const excludeLeadership = (member) =>
            !leadershipMembers.some((lm) => lm._id === member._id);

        // Filter each department and include their heads
        const technicalMembers = filteredData.filter((m) => m.department === 'Technical' && excludeLeadership(m));
        const managementMembers = filteredData.filter((m) => m.department === 'Management' && excludeLeadership(m));
        const marketingMembers = filteredData.filter((m) => m.department === 'Marketing' && excludeLeadership(m));
        const socialMediaMembers = filteredData.filter((m) => m.department === 'Social Media' && excludeLeadership(m));
        const mediaMembers = filteredData.filter((m) => m.department === 'Media' && excludeLeadership(m));
        const contentWritingMembers = filteredData.filter((m) => m.department === 'Content Writing' && excludeLeadership(m));
        const designMembers = filteredData.filter((m) => m.department === 'Design' && excludeLeadership(m));
        const hrMembers = filteredData.filter((m) => m.department === 'HR' && excludeLeadership(m));
        const eventManagementMembers = filteredData.filter((m) => m.department === 'Event Management' && excludeLeadership(m));

        console.log('Department counts:', {
            technical: technicalMembers.length,
            management: managementMembers.length,
            marketing: marketingMembers.length,
            socialMedia: socialMediaMembers.length,
            media: mediaMembers.length,
            contentWriting: contentWritingMembers.length,
            design: designMembers.length,
            hr: hrMembers.length,
            eventManagement: eventManagementMembers.length
        });

        setTechnical(technicalMembers);
        setManagement(managementMembers);
        setMarketing(marketingMembers);
        setSocialMedia(socialMediaMembers);
        setMedia(mediaMembers);
        setContentWriting(contentWritingMembers);
        setDesign(designMembers);
        setHR(hrMembers);
        setEventManagement(eventManagementMembers);
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
						</div>
					</section>

					{/* Leadership Section */}
					{leadership.length > 0 && (
    <section id="leadership" className="py-8 sm:py-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
            <motion.div
                className="flex flex-col items-center mb-8 sm:mb-10"
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
                {/* CEO Card - Centered */}
                {leadership.filter((m) => m.designation === 'CEO').length > 0 && (
                    <div className="flex justify-center mb-6 sm:mb-10">
                        <div className="w-full max-w-[280px]">
                            <UnifiedTeamCard
                                member={leadership.find((m) => m.designation === 'CEO')}
                                delay={0}
                                onClick={handleMemberClick}
                                isAuthenticated={isAuthenticated}
                            />
                        </div>
                    </div>
                )}
                
                {/* Other leadership - center-aligned flexbox */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-6xl mx-auto">
                    {leadership
                        .filter((m) => m.designation !== 'CEO')
                        .map((leader, index) => (
                            <div key={leader._id || index} className="w-full max-w-[280px] xs:w-auto xs:max-w-[280px]">
                                <UnifiedTeamCard
                                    member={leader}
                                    delay={index + 1}
                                    onClick={handleMemberClick}
                                    isAuthenticated={isAuthenticated}
                                />
                            </div>
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
				</>
			)}
		</div>
	);
};

export default TeamsPage;
