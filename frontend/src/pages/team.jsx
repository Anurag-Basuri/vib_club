import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader, Users, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
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
  const [showAuthMessage, setShowAuthMessage] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedDepartment, setExpandedDepartment] = useState(null);

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
      // Leadership members (CEO, CTO, CMO, COO) - separate from departments
      const leadershipMembers = teamData
        .filter((member) => ['CEO', 'CTO', 'CMO', 'COO'].includes(member.designation))
        .map((member) => ({
          ...member,
          level: member.designation === 'CEO' ? 0 : 1,
        }));
      setLeadership(leadershipMembers);

      // Function to exclude leadership from departments
      const excludeLeadership = (member) =>
        !leadershipMembers.some((lm) => lm._id === member._id);

      // Filter each department and include their heads
      setTechnical(teamData.filter((m) => m.department === 'Technical' && excludeLeadership(m)));
      setManagement(teamData.filter((m) => m.department === 'Management' && excludeLeadership(m)));
      setMarketing(teamData.filter((m) => m.department === 'Marketing' && excludeLeadership(m)));
      setSocialMedia(teamData.filter((m) => m.department === 'Social Media' && excludeLeadership(m)));
      setMedia(teamData.filter((m) => m.department === 'Media' && excludeLeadership(m)));
      setContentWriting(teamData.filter((m) => m.department === 'Content Writing' && excludeLeadership(m)));
      setDesign(teamData.filter((m) => m.department === 'Design' && excludeLeadership(m)));
      setHR(teamData.filter((m) => m.department === 'HR' && excludeLeadership(m)));
      setEventManagement(teamData.filter((m) => m.department === 'Event Management' && excludeLeadership(m)));
      setPR(teamData.filter((m) => m.department === 'PR' && excludeLeadership(m)));
      setCoordinator(teamData.filter((m) => m.department === 'Coordinator' && excludeLeadership(m)));
    }
  }, [teamData]);

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
    setTimeout(() => setSelectedMember(null), 300);
  };

  // Mobile navigation to departments
  const scrollToDepartment = (departmentId) => {
    const element = document.getElementById(departmentId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Departments available for quick navigation
  const departments = [
    { id: 'leadership', name: 'Leadership', count: leadership.length },
    { id: 'technical', name: 'Technical', count: technical.length },
    { id: 'management', name: 'Management', count: management.length },
    { id: 'marketing', name: 'Marketing', count: marketing.length },
    { id: 'socialMedia', name: 'Social Media', count: socialMedia.length },
    { id: 'media', name: 'Media', count: media.length },
    { id: 'contentWriting', name: 'Content', count: contentWriting.length },
    { id: 'design', name: 'Design', count: design.length },
    { id: 'hr', name: 'HR', count: hr.length },
    { id: 'eventManagement', name: 'Events', count: eventManagement.length },
    { id: 'pr', name: 'PR', count: pr.length },
    { id: 'coordinator', name: 'Coordinators', count: coordinator.length },
  ].filter(dept => dept.count > 0);

  // Toggle department expansion on mobile
  const toggleDepartment = (departmentId) => {
    setExpandedDepartment(expandedDepartment === departmentId ? null : departmentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080b17] via-[#0f1228] to-[#0a0c20] text-white overflow-x-hidden">
      {/* Background particles */}
      <FloatingParticles />

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-lg lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-[#0d1326] border-l border-[#3a56c9]/30 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-[#3a56c9]/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Departments</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-[#1a244f] text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => scrollToDepartment(dept.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1a244f]/50 hover:bg-[#2a3460] transition-colors"
                    >
                      <span className="text-white font-medium">{dept.name}</span>
                      <span className="text-[#5d7df5] bg-[#1a244f] px-2 py-1 rounded-full text-xs">
                        {dept.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
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
          {/* Enhanced Hero Section */}
          <section className="relative w-full pt-16 pb-4 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-blue-900/20"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto w-full">
              <motion.div
                className="mb-6 flex justify-center"
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="relative">
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 opacity-80 blur-lg"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div 
                    className="relative p-4 rounded-full bg-slate-800/80 backdrop-blur-xl border border-white/20 shadow-2xl"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Users size={28} className="text-white" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h1
                className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent tracking-tight mb-4 leading-tight px-2"
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
                className="text-base md:text-lg text-white/80 font-light mb-6 max-w-3xl mx-auto leading-relaxed px-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <Sparkles className="text-blue-400" size={18} />
                </motion.span>
                Where creativity meets technology and collaboration sparks innovation.
              </motion.p>

              {/* Quick Department Navigation for Mobile */}
              <motion.div
                className="mt-4 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a244f] text-[#d0d5f7] rounded-lg text-sm"
                >
                  <Menu size={16} />
                  <span>Browse Departments</span>
                </button>
              </motion.div>
            </div>
          </section>

          {/* Leadership Section - Mobile Optimized */}
          {leadership.length > 0 && (
            <section id="leadership" className="py-8 px-4 relative z-10">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  className="flex flex-col items-center mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.h2 
                    className="text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-[#5d7df5] via-[#3a56c9] to-[#5d7df5] bg-clip-text text-transparent px-4 leading-tight"
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
                    <div className="w-20 h-1 bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] rounded-full"></div>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] rounded-full blur-sm"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>

                <div className="relative">
                  {/* CEO Card */}
                  {leadership.filter((m) => m.designation === 'CEO').length > 0 && (
                    <motion.div 
                      className="flex justify-center mb-8"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    >
                      <div className="w-full max-w-xs md:max-w-sm px-2">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto px-2">
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
                          <div className="w-full max-w-xs">
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

          {/* Departments Section - Mobile Optimized */}
          <section id="departments" className="py-6 px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="flex flex-col items-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 bg-gradient-to-r from-[#0ea5e9] to-[#5d7df5] bg-clip-text text-transparent px-4">
                  Our Departments
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#0ea5e9] to-[#5d7df5] rounded-full"></div>
              </motion.div>

              <div className="space-y-8 md:space-y-12">
                {/* Department sections with mobile optimizations */}
                {technical.length > 0 && (
                  <DepartmentSection
                    department="Technical"
                    members={technical}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'technical'}
                    onToggle={() => toggleDepartment('technical')}
                  />
                )}

                {management.length > 0 && (
                  <DepartmentSection
                    department="Management"
                    members={management}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'management'}
                    onToggle={() => toggleDepartment('management')}
                  />
                )}

                {marketing.length > 0 && (
                  <DepartmentSection
                    department="Marketing"
                    members={marketing}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'marketing'}
                    onToggle={() => toggleDepartment('marketing')}
                  />
                )}

                {socialMedia.length > 0 && (
                  <DepartmentSection
                    department="Social Media"
                    members={socialMedia}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'socialMedia'}
                    onToggle={() => toggleDepartment('socialMedia')}
                  />
                )}

                {media.length > 0 && (
                  <DepartmentSection
                    department="Media"
                    members={media}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'media'}
                    onToggle={() => toggleDepartment('media')}
                  />
                )}

                {contentWriting.length > 0 && (
                  <DepartmentSection
                    department="Content Writing"
                    members={contentWriting}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'contentWriting'}
                    onToggle={() => toggleDepartment('contentWriting')}
                  />
                )}

                {design.length > 0 && (
                  <DepartmentSection
                    department="Design"
                    members={design}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'design'}
                    onToggle={() => toggleDepartment('design')}
                  />
                )}

                {hr.length > 0 && (
                  <DepartmentSection
                    department="HR"
                    members={hr}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'hr'}
                    onToggle={() => toggleDepartment('hr')}
                  />
                )}

                {eventManagement.length > 0 && (
                  <DepartmentSection
                    department="Event Management"
                    members={eventManagement}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'eventManagement'}
                    onToggle={() => toggleDepartment('eventManagement')}
                  />
                )}

                {pr.length > 0 && (
                  <DepartmentSection
                    department="PR"
                    members={pr}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'pr'}
                    onToggle={() => toggleDepartment('pr')}
                  />
                )}

                {coordinator.length > 0 && (
                  <DepartmentSection
                    department="Coordinator"
                    members={coordinator}
                    onClick={handleMemberClick}
                    isAuthenticated={isAuthenticated}
                    isExpanded={expandedDepartment === 'coordinator'}
                    onToggle={() => toggleDepartment('coordinator')}
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
        </>
      )}
    </div>
  );
};

export default TeamsPage;