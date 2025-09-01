import React, { useState } from 'react';
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
} from 'lucide-react';

const TeamMemberModal = ({ member, isOpen, onClose, isAuthenticated }) => {
    const [activeTab, setActiveTab] = useState('about');

    if (!isOpen) return null;

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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-4xl bg-gradient-to-br from-[#141b38] to-[#0f172a] rounded-2xl overflow-hidden shadow-xl my-8"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                            onClick={onClose}
                        >
                            <X size={20} className="text-white" />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            {/* Profile image section */}
                            <div className="md:w-2/5 relative">
                                <div className="h-64 md:h-full bg-gradient-to-br from-[#1e2d5f] via-[#3a56c9] to-[#5d7df5] flex items-center justify-center relative overflow-hidden">
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <defs>
                                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                                                </pattern>
                                            </defs>
                                            <rect width="100" height="100" fill="url(#grid)" />
                                        </svg>
                                    </div>
                                    
                                    {/* Profile image with fallback */}
                                    <motion.div 
                                        className="relative z-10"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                    >
                                        {member.profilePicture?.url ? (
                                            <div className="relative">
                                                {/* Subtle glow behind image */}
                                                <div className="absolute -inset-2 rounded-full bg-blue-400/30 blur-md"></div>
                                                
                                                {/* Image with border */}
                                                <div className="relative h-40 w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                                                    <img
                                                        src={member.profilePicture.url}
                                                        alt={member.fullname}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                {/* Subtle glow behind avatar */}
                                                <div className="absolute -inset-2 rounded-full bg-blue-400/30 blur-md"></div>
                                                
                                                {/* Styled avatar fallback */}
                                                <div className="relative h-40 w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 rounded-full overflow-hidden border-4 border-white/20 shadow-lg bg-gradient-to-br from-[#2a3a6a] to-[#364680] flex items-center justify-center">
                                                    <span className="text-5xl font-bold text-white/90">
                                                        {member.fullname?.charAt(0) || '?'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Decorative elements */}
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                                        <div className="px-4 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/70 flex items-center">
                                            {member.department && (
                                                <span>{member.department}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Status badge - Only visible to authenticated users */}
                                {isAuthenticated && member.status && (
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className={`flex items-center px-3 py-1 rounded-full ${statusBadge.bg} ${statusBadge.border} backdrop-blur-sm shadow-lg text-xs font-medium ${statusBadge.color}`}>
                                            {statusBadge.icon}
                                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Member's name overlay at bottom - only on mobile */}
                                <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <h2 className="text-xl font-bold text-white truncate">
                                        {member.fullname}
                                    </h2>
                                    <p className="text-blue-300 font-medium text-sm truncate">
                                        {member.designation}
                                    </p>
                                </div>
                            </div>

                            {/* Details section */}
                            <div className="md:w-3/5 p-6 md:p-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-white">
                                    {member.fullname}
                                </h2>
                                <p className="text-blue-300 font-medium mt-1">
                                    {member.designation}
                                </p>
                                <p className="text-indigo-200 mt-1">{member.department}</p>

                                {/* ID and Member Since - Only visible to authenticated users */}
                                {isAuthenticated && (
                                    <div className="flex flex-wrap gap-2 mt-3">
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

                                {/* Basic information - visible to everyone */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-white/90 mb-3">
                                        About
                                    </h3>
                                    <p className="text-white/70">{member.bio || "No bio provided."}</p>
                                </div>

                                {/* Contact information - visible to everyone */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-white/90 mb-3">
                                        Contact
                                    </h3>
                                    <div className="space-y-2">
                                        {member.email && (
                                            <div className="flex items-center">
                                                <Mail size={18} className="text-blue-300 mr-3" />
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="text-white/70 hover:text-white"
                                                >
                                                    {member.email}
                                                </a>
                                            </div>
                                        )}
                                        {member.phone && (
                                            <div className="flex items-center">
                                                <Phone size={18} className="text-blue-300 mr-3" />
                                                <a
                                                    href={`tel:${member.phone}`}
                                                    className="text-white/70 hover:text-white"
                                                >
                                                    {member.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Social links - visible to everyone */}
                                {socialLinks.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold text-white/90 mb-3">
                                            Connect
                                        </h3>
                                        <div className="space-y-2">
                                            {socialLinks.map((link, index) => {
                                                let Icon = LinkIcon;
                                                if (link.platform.toLowerCase().includes('linkedin')) Icon = Linkedin;
                                                if (link.platform.toLowerCase().includes('github')) Icon = Github;
                                                if (link.platform.toLowerCase().includes('website') || link.platform.toLowerCase().includes('portfolio')) Icon = Globe;
                                                
                                                return (
                                                    <div key={index} className="flex items-center">
                                                        <Icon size={18} className="text-blue-300 mr-3" />
                                                        <a
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-white/70 hover:text-white"
                                                        >
                                                            {link.platform}
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Skills - visible to everyone */}
                                {member.skills && member.skills.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-white/90 mb-3">
                                            Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {member.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-900/40 text-blue-200 rounded-full text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Program and Year - Visible to authenticated users */}
                                {isAuthenticated && (member.program || member.year) && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-white/90 mb-3">
                                            Education
                                        </h3>
                                        <div className="space-y-2">
                                            {member.program && (
                                                <div className="flex items-center">
                                                    <GraduationCap size={18} className="text-blue-300 mr-3" />
                                                    <span className="text-white/70">
                                                        Program: {member.program}
                                                    </span>
                                                </div>
                                            )}
                                            {member.year && (
                                                <div className="flex items-center">
                                                    <Calendar size={18} className="text-blue-300 mr-3" />
                                                    <span className="text-white/70">
                                                        Year: {member.year}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Hostel Information - Visible to authenticated users */}
                                {isAuthenticated && member.hosteler && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-white/90 mb-3">
                                            Residence
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Building size={18} className="text-blue-300 mr-3" />
                                                <span className="text-white/70">
                                                    {member.hosteler ? `Hosteler (${member.hostel || 'Hostel not specified'})` : 'Day Scholar'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Resume - Visible to authenticated users */}
                                {isAuthenticated && member.resume?.url && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-white/90 mb-3">
                                            Documents
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <FileText size={18} className="text-blue-300 mr-3" />
                                                <a
                                                    href={member.resume.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-white/70 hover:text-white flex items-center"
                                                >
                                                    View Resume
                                                    <Download size={14} className="ml-2" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Projects & Achievements - Auth only section */}
                                {isAuthenticated ? (
                                    <>
                                        {/* Projects */}
                                        {member.projects && member.projects.length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="text-lg font-semibold text-white/90 mb-3">
                                                    Projects
                                                </h3>
                                                <ul className="list-disc list-inside text-white/70 space-y-1">
                                                    {member.projects.map((project, index) => (
                                                        <li key={index}>{project}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Achievements */}
                                        {member.achievements && member.achievements.length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="text-lg font-semibold text-white/90 mb-3">
                                                    Achievements
                                                </h3>
                                                <ul className="list-disc list-inside text-white/70 space-y-1">
                                                    {member.achievements.map((achievement, index) => (
                                                        <li key={index}>{achievement}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Additional Information */}
                                        {member.additionalInfo && (
                                            <div className="mt-6">
                                                <h3 className="text-lg font-semibold text-white/90 mb-3">
                                                    Additional Information
                                                </h3>
                                                <p className="text-white/70">{member.additionalInfo}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="mt-8 p-4 border border-blue-800/50 rounded-lg bg-blue-900/20">
                                        <div className="flex items-center gap-2 text-blue-300">
                                            <Lock size={18} />
                                            <p className="font-medium">
                                                Additional information is only visible to authenticated members
                                            </p>
                                        </div>
                                        <p className="mt-2 text-sm text-white/60">
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
