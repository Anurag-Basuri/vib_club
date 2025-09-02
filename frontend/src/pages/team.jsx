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
	const [pr, setPR] = useState([]);
	const [coordinator, setCoordinator] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [showAuthMessage, setShowAuthMessage] = useState(true);

	useEffect(() => {
		const fetchTeamData = async () => {
			try {
				setLoading(true);
				const response = await publicClient.get('api/members/getall');
				
				if (response.data && response.data.data && response.data.data.members) {
					setTeamData(response.data.data.members);
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
        console.log('Total team length:', teamData.length);
        console.log('Total team data:', teamData);

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
		const prMembers = filteredData.filter((m) => m.department === 'PR' && excludeLeadership(m));
		const coordinatorMembers = filteredData.filter((m) => m.department === 'Coordinator' && excludeLeadership(m));

        console.log('Department counts:', {
            technical: technicalMembers.length,
            management: managementMembers.length,
            marketing: marketingMembers.length,
            socialMedia: socialMediaMembers.length,
            media: mediaMembers.length,
            contentWriting: contentWritingMembers.length,
            design: designMembers.length,
            hr: hrMembers.length,
            eventManagement: eventManagementMembers.length,
            pr: prMembers.length,
            coordinator: coordinatorMembers.length,
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
        setPR(prMembers);
        setCoordinator(coordinatorMembers);
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
					{/* Enhanced Hero Section - Mobile-First */}
<section className="relative w-full pt-16 sm:pt-20 md:pt-28 pb-8 sm:pb-12 md:pb-16 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-blue-900/20"></div>
    
    <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
            className="mb-6 sm:mb-8 flex justify-center"
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <div className="relative">
                {/* Enhanced glow effect */}
                <motion.div 
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 opacity-80 blur-lg"
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                    className="relative p-4 sm:p-5 rounded-full bg-slate-800/80 backdrop-blur-xl border border-white/20 shadow-2xl"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.8 }}
                >
                    <Users size={32} className="sm:w-10 sm:h-10 text-white" />
                </motion.div>
            </div>
        </motion.div>

        <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r 
                from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent 
                tracking-tight mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            Meet Our{" "}
            <motion.span 
                className="italic bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text"
                animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                Incredible
            </motion.span>{" "}
            Team
        </motion.h1>
        
        <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 font-light 
                mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
        >
            <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="inline-block mr-2"
            >
                <Sparkles className="text-blue-400" size={20} />
            </motion.span>
            <span>
                Where{" "}
                <span className="font-semibold text-blue-300 hover:text-blue-200 transition-colors">
                    creativity
                </span>{" "}
                meets{" "}
                <span className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">
                    technology
                </span>{" "}
                and{" "}
                <span className="font-semibold text-purple-300 hover:text-purple-200 transition-colors">
                    collaboration
                </span>{" "}
                sparks innovation.
            </span>
        </motion.p>

        {/* Stats or additional info for mobile */}
        <motion.div
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
        >
            {{
                label: "Team Members", value: "50+" },
                { label: "Departments", value: "10+" },
                { label: "Projects", value: "100+" }
            ].map((stat, index) => (
                <motion.div
                    key={stat.label}
                    className="text-center p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
                </motion.div>
            ))}
        </motion.div>
    </div>
</section>

					{/* Leadership Section - Enhanced Mobile-First */}
					{leadership.length > 0 && (
    <section id="leadership" className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
            <motion.div
                className="flex flex-col items-center mb-8 sm:mb-10 md:mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <motion.h2 
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 
                        bg-gradient-to-r from-[#5d7df5] via-[#3a56c9] to-[#5d7df5] bg-clip-text text-transparent px-4
                        leading-tight"
                    animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    Leadership Team
                </motion.h2>
                
                <motion.div 
                    className="relative"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] rounded-full"></div>
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] rounded-full blur-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>

            {/* Rest of leadership section remains the same but with enhanced spacing */}
            <div className="relative">
                {/* CEO Card */}
                {leadership.filter((m) => m.designation === 'CEO').length > 0 && (
                    <motion.div 
                        className="flex justify-center mb-8 sm:mb-10 md:mb-12"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div className="w-full max-w-[320px] px-2">
                            <UnifiedTeamCard
                                member={leadership.find((m) => m.designation === 'CEO')}
                                delay={0}
                                onClick={handleMemberClick}
                                isAuthenticated={isAuthenticated}
                            />
                        </div>
                    </motion.div>
                )}
                
                {/* Other leadership with staggered animation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto px-2">
                    {leadership
                        .filter((m) => m.designation !== 'CEO')
                        .map((leader, index) => (
                            <motion.div
                                key={leader._id || index}
                                className="flex justify-center"
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: '-20px' }}
                                transition={{ 
                                    delay: index * 0.1, 
                                    duration: 0.6,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                            >
                                <div className="w-full max-w-[320px]">
                                    <UnifiedTeamCard
                                        member={leader}
                                        delay={index * 0.03}
                                        onClick={handleMemberClick}
                                        isAuthenticated={isAuthenticated}
                                    />
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>
        </div>
    </section>
					)}

					{/* Departments Section Header - Mobile Optimized */}
					<section id="departments" className="py-6 sm:py-10 md:py-16 px-3 sm:px-4 relative z-10">
    <div className="max-w-7xl mx-auto">
        <motion.div
            className="flex flex-col items-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 
                bg-gradient-to-r from-[#0ea5e9] to-[#5d7df5] bg-clip-text text-transparent px-4">
                Our Departments
            </h2>
            <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-[#0ea5e9] to-[#5d7df5] rounded-full"></div>
        </motion.div>

        {/* Search results message - Mobile Optimized */}
        {searchQuery && (
            <div className="mb-6 sm:mb-8 text-center px-2">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1a244f]/70 rounded-lg border border-[#3a56c9]/40 text-sm">
                    <Filter size={14} className="text-[#5d7df5]" />
                    <span className="text-[#d0d5f7]">
                        Results for "{searchQuery}"
                    </span>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 sm:ml-2 text-[#5d7df5] hover:text-white transition-colors text-sm"
                    >
                        Clear
                    </button>
                </div>
            </div>
        )}

        <div className="space-y-12 sm:space-y-16">
            {/* Keep all your existing department sections as they are */}
            {/* Technical Department */}
            {technical.length > 0 && (
                <DepartmentSection
                    department="Technical"
                    members={technical}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* Management Department */}
            {management.length > 0 && (
                <DepartmentSection
                    department="Management"
                    members={management}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* Marketing Department */}
            {marketing.length > 0 && (
                <DepartmentSection
                    department="Marketing"
                    members={marketing}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* Social Media Department */}
            {socialMedia.length > 0 && (
                <DepartmentSection
                    department="Social Media"
                    members={socialMedia}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* Media Department */}
            {media.length > 0 && (
                <DepartmentSection
                    department="Media"
                    members={media}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* Content Writing Department */}
            {contentWriting.length > 0 && (
                <DepartmentSection
                    department="Content Writing"
                    members={contentWriting}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* Design Department */}
            {design.length > 0 && (
                <DepartmentSection
                    department="Design"
                    members={design}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* HR Department */}
            {hr.length > 0 && (
                <DepartmentSection
                    department="HR"
                    members={hr}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* Event Management Department */}
            {eventManagement.length > 0 && (
                <DepartmentSection
                    department="Event Management"
                    members={eventManagement}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* PR Department */}
            {pr.length > 0 && (
                <DepartmentSection
                    department="PR"
                    members={pr}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}

            {/* Coordinator Department */}
            {coordinator.length > 0 && (
                <DepartmentSection
                    department="Coordinator"
                    members={coordinator}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </div>

        {/* No results message - Mobile Optimized */}
        {searchQuery &&
            technical.length === 0 &&
            management.length === 0 &&
            marketing.length === 0 &&
            socialMedia.length === 0 &&
            media.length === 0 &&
            contentWriting.length === 0 &&
            design.length === 0 &&
            hr.length === 0 &&
            eventManagement.length === 0 &&
            pr.length === 0 &&
            coordinator.length === 0 && (
                <div className="text-center py-12 sm:py-16 max-w-sm mx-auto px-4">
                    <div className="bg-[#1a244f]/70 rounded-xl p-6 sm:p-8 border border-[#3a56c9]/40">
                        <SearchX size={40} className="text-[#5d7df5]/70 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                            No Results Found
                        </h3>
                        <p className="text-[#9ca3d4] mb-4 text-sm sm:text-base">
                            No team members match "{searchQuery}"
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="px-4 py-2 bg-[#3a56c9] hover:bg-[#5d7df5] text-white rounded-lg transition-colors text-sm"
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
