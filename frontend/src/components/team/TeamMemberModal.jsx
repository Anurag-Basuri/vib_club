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
    BookOpen,
    Briefcase,
    ChevronRight,
    Phone,
    MapPin,
    Code,
    Download,
    ExternalLink,
    Lock,
    Sparkles,
    UserCheck,
    Home,
    FileText,
    Building,
    GraduationCap,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    Globe,
    Share2,
    Info,
    Link as LinkIcon,
    Badge,
    Hash,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

const TeamMemberModal = ({ member, isOpen, onClose, isAuthenticated }) => {
    const [activeTab, setActiveTab] = useState('about');
    const [expandedSections, setExpandedSections] = useState({});
    const [imageLoading, setImageLoading] = useState(true);

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
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

        // Add some fallback detection for LinkedIn/Github if not in socialLinks array
        if (member?.linkedIn) {
            links.push({
                platform: 'LinkedIn',
                url: member.linkedIn,
            });
        }

        if (member?.github) {
            links.push({
                platform: 'GitHub',
                url: member.github,
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
            case 'removed':
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

    // Specific status badge for this member
    const statusBadge = getStatusBadge(member.status);

    // Collapsible section component
    const CollapsibleSection = ({ title, icon: Icon, children, defaultExpanded = false }) => {
        const isExpanded = expandedSections[title] !== undefined ? expandedSections[title] : defaultExpanded;
        
        return (
            <div className="mt-4 border-b border-white/10 pb-4">
                <button 
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => toggleSection(title)}
                >
                    <div className="flex items-center">
                        {Icon && <Icon size={18} className="text-blue-300 mr-2" />}
                        <h3 className="text-lg font-semibold text-white/90">
                            {title}
                        </h3>
                    </div>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
                            <div className="pt-3">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    // Add this effect to handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="member-profile-title"
                >
                    <motion.div
                        className="relative w-full max-w-4xl bg-gradient-to-br from-[#141b38] to-[#0f172a] rounded-2xl overflow-hidden shadow-xl my-4 max-h-[95vh] overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button with improved tap target for mobile */}
                        <button
                            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 backdrop-blur-sm"
                            onClick={onClose}
                        >
                            <X size={18} className="text-white" />
                        </button>

                        {/* Header with profile image and basic info */}
                        <div className="flex flex-col">
                            <div className="relative h-64 bg-gradient-to-br from-[#1e2d5f] via-[#3a56c9] to-[#5d7df5] flex items-center justify-center overflow-hidden">
                                {/* Enhanced background pattern with animation */}
                                <div className="absolute inset-0 opacity-10">
                                    <motion.div
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                                        className="w-full h-full"
                                    >
                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <defs>
                                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                                                </pattern>
                                            </defs>
                                            <rect width="100" height="100" fill="url(#grid)" />
                                        </svg>
                                    </motion.div>
                                </div>
                                
                                {/* Decorative geometric elements */}
                                <div className="absolute inset-0 overflow-hidden opacity-20">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute bg-white/30 rounded-full"
                                            style={{
                                                width: `${Math.random() * 10 + 5}px`,
                                                height: `${Math.random() * 10 + 5}px`,
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                            }}
                                            animate={{
                                                y: [0, Math.random() * 50 - 25],
                                                x: [0, Math.random() * 50 - 25],
                                                scale: [1, Math.random() + 0.5, 1],
                                            }}
                                            transition={{
                                                duration: Math.random() * 5 + 10,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                            }}
                                        />
                                    ))}
                                </div>
                                
                                {/* Profile image with enhanced styling */}
                                <motion.div 
                                    className="relative z-10"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                >
                                    {member.profilePicture?.url ? (
                                        <div className="relative group">
                                            {/* Multi-layered glow effect */}
                                            <motion.div 
                                                className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600/40 via-indigo-500/40 to-purple-600/40 blur-xl opacity-70 group-hover:opacity-100"
                                                animate={{ 
                                                    scale: [1, 1.05, 1],
                                                }}
                                                transition={{ 
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatType: "reverse"
                                                }}
                                            />
                                            <div className="absolute -inset-2 rounded-full bg-blue-400/30 blur-md"></div>
                                            
                                            {/* Enhanced image container */}
                                            <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300 group-hover:border-white/30 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                                                <img
                                                    src={member.profilePicture.url}
                                                    alt={member.fullname}
                                                    className={`w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                                                    onError={(e) => {
                                                        setImageLoading(false);
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                                                    }}
                                                    onLoad={() => setImageLoading(false)}
                                                />
                                                
                                                {/* Subtle overlay for better text contrast */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            
                                            {/* Decorative orbit effect */}
                                            <motion.div 
                                                className="absolute -inset-6 rounded-full border border-indigo-500/30 border-dashed opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            {/* Multi-layered glow effect for avatar */}
                                            <motion.div 
                                                className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600/40 via-indigo-500/40 to-purple-600/40 blur-xl opacity-70 group-hover:opacity-100"
                                                animate={{ 
                                                    scale: [1, 1.05, 1],
                                                }}
                                                transition={{ 
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatType: "reverse"
                                                }}
                                            />
                                            <div className="absolute -inset-2 rounded-full bg-blue-400/30 blur-md"></div>
                                            
                                            {/* Enhanced avatar container */}
                                            <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_0_20px_rgba(79,70,229,0.3)] bg-gradient-to-br from-[#2a3a6a] to-[#364680] flex items-center justify-center transition-all duration-300 group-hover:border-white/30 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                                                <motion.span 
                                                    className="text-5xl font-bold text-white/90"
                                                    animate={{ 
                                                        textShadow: [
                                                            "0 0 5px rgba(255,255,255,0.5)",
                                                            "0 0 15px rgba(255,255,255,0.5)",
                                                            "0 0 5px rgba(255,255,255,0.5)"
                                                        ]
                                                    }}
                                                    transition={{ 
                                                        duration: 3,
                                                        repeat: Infinity
                                                    }}
                                                >
                                                    {member.fullname?.charAt(0) || '?'}
                                                </motion.span>
                                                
                                                {/* Dynamic background particles */}
                                                {Array.from({ length: 8 }).map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="absolute bg-white/10 rounded-full"
                                                        style={{
                                                            width: `${Math.random() * 6 + 2}px`,
                                                            height: `${Math.random() * 6 + 2}px`,
                                                            left: `${Math.random() * 100}%`,
                                                            top: `${Math.random() * 100}%`,
                                                        }}
                                                        animate={{
                                                            y: [0, Math.random() * 30 - 15],
                                                            x: [0, Math.random() * 30 - 15],
                                                            opacity: [0.3, 0.8, 0.3],
                                                        }}
                                                        transition={{
                                                            duration: Math.random() * 5 + 5,
                                                            repeat: Infinity,
                                                            repeatType: "reverse",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            
                                            {/* Decorative orbit effect */}
                                            <motion.div 
                                                className="absolute -inset-6 rounded-full border border-indigo-500/30 border-dashed opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>
                                    )}
                                </motion.div>

                                {/* Status badge - Only visible to authenticated users */}
                                {isAuthenticated && member.status && (
                                    <div className="absolute top-3 left-3 z-20">
                                        <div className={`flex items-center px-2 py-1 rounded-full ${statusBadge.bg} ${statusBadge.border} backdrop-blur-sm shadow-lg text-xs font-medium ${statusBadge.color}`}>
                                            {statusBadge.icon}
                                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Enhanced department badge */}
                                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                                    <motion.div 
                                        className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-sm text-white/90 flex items-center border border-white/10 shadow-lg"
                                        whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                                    >
                                        {member.department && (
                                            <span>{member.department}</span>
                                        )}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Basic info section */}
                            <div className="p-5 bg-[#0f172a] border-b border-white/10">
                                <h2 id="member-profile-title" className="text-xl font-bold text-white text-center">
                                    {member.fullname}
                                </h2>
                                <p className="text-blue-300 font-medium mt-1 text-center">
                                    {member.designation}
                                </p>
                                
                                {/* ID and Member Since - Only visible to authenticated users */}
                                {isAuthenticated && (
                                    <div className="flex flex-wrap gap-2 mt-3 justify-center">
                                        {member.memberID && (
                                            <div className="px-2 py-1 bg-indigo-900/20 text-indigo-300 rounded-md text-xs border border-indigo-500/30 flex items-center">
                                                <Hash size={12} className="mr-1" />
                                                ID: {member.memberID.substring(0, 8)}
                                            </div>
                                        )}
                                        {member.LpuId && (
                                            <div className="px-2 py-1 bg-blue-900/20 text-blue-300 rounded-md text-xs border border-blue-500/30 flex items-center">
                                                <Badge size={12} className="mr-1" />
                                                LPU ID: {member.LpuId}
                                            </div>
                                        )}
                                        {member.joinedAt && (
                                            <div className="px-2 py-1 bg-purple-900/20 text-purple-300 rounded-md text-xs border border-purple-500/30 flex items-center">
                                                <Clock size={12} className="mr-1" />
                                                Joined: {formatDate(member.joinedAt)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Details section with collapsible content */}
                            <div className="p-4 md:p-6 overflow-y-auto max-h-[50vh]">
                                {/* About section */}
                                <CollapsibleSection title="About" icon={User} defaultExpanded={true}>
                                    <p className="text-white/70">{member.bio || "No bio provided."}</p>
                                </CollapsibleSection>

                                {/* Contact information */}
                                {(member.email || member.phone) && (
                                    <CollapsibleSection title="Contact" icon={Mail}>
                                        <div className="space-y-2">
                                            {member.email && (
                                                <div className="flex items-center">
                                                    <Mail size={16} className="text-blue-300 mr-3" />
                                                    <a
                                                        href={`mailto:${member.email}`}
                                                        className="text-white/70 hover:text-white text-sm break-all"
                                                    >
                                                        {member.email}
                                                    </a>
                                                </div>
                                            )}
                                            {member.phone && (
                                                <div className="flex items-center">
                                                    <Phone size={16} className="text-blue-300 mr-3" />
                                                    <a
                                                        href={`tel:${member.phone}`}
                                                        className="text-white/70 hover:text-white text-sm"
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
                                        <div className="grid grid-cols-2 gap-2">
                                            {socialLinks.map((link, index) => {
                                                let Icon = LinkIcon;
                                                if (link.platform.toLowerCase().includes('linkedin')) Icon = Linkedin;
                                                if (link.platform.toLowerCase().includes('github')) Icon = Github;
                                                if (link.platform.toLowerCase().includes('website') || link.platform.toLowerCase().includes('portfolio')) Icon = Globe;
                                                
                                                return (
                                                    <a
                                                        key={index}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                    >
                                                        <Icon size={16} className="text-blue-300 mr-2" />
                                                        <span className="text-white/70 text-sm truncate">{link.platform}</span>
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
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-900/40 text-blue-200 rounded-full text-xs"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </CollapsibleSection>
                                )}

                                {/* Program and Year - Visible to authenticated users */}
                                {isAuthenticated && (member.program || member.year) && (
                                    <CollapsibleSection title="Education" icon={GraduationCap}>
                                        <div className="space-y-2">
                                            {member.program && (
                                                <div className="flex items-center">
                                                    <GraduationCap size={16} className="text-blue-300 mr-3" />
                                                    <span className="text-white/70 text-sm">
                                                        Program: {member.program}
                                                    </span>
                                                </div>
                                            )}
                                            {member.year && (
                                                <div className="flex items-center">
                                                    <Calendar size={16} className="text-blue-300 mr-3" />
                                                    <span className="text-white/70 text-sm">
                                                        Year: {member.year}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CollapsibleSection>
                                )}

                                {/* Hostel Information - Visible to authenticated users */}
                                {isAuthenticated && member.hosteler && (
                                    <CollapsibleSection title="Residence" icon={Building}>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Building size={16} className="text-blue-300 mr-3" />
                                                <span className="text-white/70 text-sm">
                                                    {member.hosteler ? `Hosteler (${member.hostel || 'Hostel not specified'})` : 'Day Scholar'}
                                                </span>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                )}

                                {/* Resume - Visible to authenticated users */}
                                {isAuthenticated && member.resume?.url && (
                                    <CollapsibleSection title="Documents" icon={FileText}>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <FileText size={16} className="text-blue-300 mr-3" />
                                                <a
                                                    href={member.resume.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-white/70 hover:text-white flex items-center text-sm"
                                                >
                                                    View Resume
                                                    <Download size={12} className="ml-2" />
                                                </a>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                )}

                                {/* Projects & Achievements - Auth only section */}
                                {isAuthenticated ? (
                                    <>
                                        {/* Projects */}
                                        {member.projects && member.projects.length > 0 && (
                                            <CollapsibleSection title="Projects" icon={Briefcase}>
                                                <ul className="list-disc list-inside text-white/70 space-y-1 text-sm">
                                                    {member.projects.map((project, index) => (
                                                        <li key={index}>{project}</li>
                                                    ))}
                                                </ul>
                                            </CollapsibleSection>
                                        )}

                                        {/* Achievements */}
                                        {member.achievements && member.achievements.length > 0 && (
                                            <CollapsibleSection title="Achievements" icon={Award}>
                                                <ul className="list-disc list-inside text-white/70 space-y-1 text-sm">
                                                    {member.achievements.map((achievement, index) => (
                                                        <li key={index}>{achievement}</li>
                                                    ))}
                                                </ul>
                                            </CollapsibleSection>
                                        )}

                                        {/* Additional Information */}
                                        {member.additionalInfo && (
                                            <CollapsibleSection title="Additional Information" icon={Info}>
                                                <p className="text-white/70 text-sm">{member.additionalInfo}</p>
                                            </CollapsibleSection>
                                        )}
                                    </>
                                ) : (
                                    <div className="mt-4 p-3 border border-blue-800/50 rounded-lg bg-blue-900/20">
                                        <div className="flex items-center gap-2 text-blue-300">
                                            <Lock size={16} />
                                            <p className="font-medium text-sm">
                                                Additional information is only visible to authenticated members
                                            </p>
                                        </div>
                                        <p className="mt-2 text-xs text-white/60">
                                            Sign in to view complete details including education, projects, achievements, and more.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TeamMemberModal;