import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Mail,
    Linkedin,
    Github,
    Globe,
    Phone,
    Code,
    Award,
    Briefcase,
    GraduationCap,
    Building,
    FileText,
    User,
    ExternalLink,
    Download,
    Calendar,
    Badge,
    Clock,
    Sparkles,
    MapPin,
    School,
} from 'lucide-react';

const TeamMemberModal = ({ member, isOpen, onClose, isAuthenticated }) => {
    const [activeTab, setActiveTab] = useState('about');
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setActiveTab('about');
            setImageError(false);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
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

    if (!isOpen || !member) return null;

    // Dynamic tabs based on available data
    const tabs = [
        { id: 'about', label: 'About', icon: User, show: true },
        {
            id: 'contact',
            label: 'Contact',
            icon: Mail,
            show: member.email || member.phone || member.socialLinks?.length > 0,
        },
        {
            id: 'skills',
            label: 'Skills',
            icon: Code,
            show: member.skills && member.skills.length > 0,
        },
        {
            id: 'academic',
            label: 'Academic',
            icon: GraduationCap,
            show: member.program || member.year,
        },
        {
            id: 'documents',
            label: 'Documents',
            icon: FileText,
            show: member.resume?.url,
        },
    ].filter((tab) => tab.show);

    const initials =
        member.fullname
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase() || '??';

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return 'Invalid date';
        }
    };

    // Render tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'about':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                <User size={18} className="mr-2 text-blue-400" />
                                About
                            </h3>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-gray-300 leading-relaxed">
                                    {member.bio || 'No bio provided.'}
                                </p>
                            </div>
                        </div>

                        {member.joinedAt && (
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="flex items-center text-blue-300 mb-2">
                                    <Clock size={16} className="mr-2" />
                                    <span className="font-medium">Joined VIB Club</span>
                                </div>
                                <div className="text-white font-medium">
                                    {formatDate(member.joinedAt)}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Mail size={18} className="mr-2 text-blue-400" />
                            Contact Information
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Email and Phone */}
                            {(member.email || member.phone) && (
                                <div className="space-y-3">
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                                        >
                                            <Mail size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                                            <span className="text-gray-300 group-hover:text-white break-all">
                                                {member.email}
                                            </span>
                                        </a>
                                    )}
                                    {member.phone && (
                                        <a
                                            href={`tel:${member.phone}`}
                                            className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                                        >
                                            <Phone size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                                            <span className="text-gray-300 group-hover:text-white">
                                                {member.phone}
                                            </span>
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Social Links */}
                            {member.socialLinks && member.socialLinks.length > 0 && (
                                <div>
                                    <h4 className="text-md font-medium text-blue-300 mb-3 flex items-center">
                                        <Globe size={16} className="mr-2" />
                                        Social Links
                                    </h4>
                                    <div className="space-y-3">
                                        {member.socialLinks.map((social, index) => {
                                            const getIcon = (platform) => {
                                                const platformLower = platform.toLowerCase();
                                                if (platformLower.includes('linkedin')) return Linkedin;
                                                if (platformLower.includes('github')) return Github;
                                                return Globe;
                                            };

                                            const IconComponent = getIcon(social.platform);

                                            return (
                                                <a
                                                    key={index}
                                                    href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                                                >
                                                    <div className="flex items-center">
                                                        <IconComponent size={16} className="text-blue-400 mr-3" />
                                                        <span className="text-gray-300 group-hover:text-white">
                                                            {social.platform}
                                                        </span>
                                                    </div>
                                                    <ExternalLink size={14} className="text-gray-500" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'skills':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Code size={18} className="mr-2 text-blue-400" />
                            Skills & Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {member.skills?.map((skill, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="px-3 py-2 bg-blue-900/40 text-blue-200 rounded-lg border border-blue-700/30 backdrop-blur-sm font-medium"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                );

            case 'academic':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <GraduationCap size={18} className="mr-2 text-blue-400" />
                            Academic Information
                        </h3>

                        <div className="space-y-4">
                            {member.program && (
                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <div className="flex items-center text-blue-300 mb-2">
                                        <School size={16} className="mr-2" />
                                        <span className="font-medium">Program</span>
                                    </div>
                                    <div className="text-white font-medium">{member.program}</div>
                                </div>
                            )}

                            {member.year && (
                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <div className="flex items-center text-blue-300 mb-2">
                                        <Calendar size={16} className="mr-2" />
                                        <span className="font-medium">Academic Year</span>
                                    </div>
                                    <div className="text-white font-medium">Year {member.year}</div>
                                </div>
                            )}

                            {/* Hostel Information for authenticated users */}
                            {isAuthenticated && member.hosteler !== undefined && (
                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <div className="flex items-center text-blue-300 mb-2">
                                        <Building size={16} className="mr-2" />
                                        <span className="font-medium">Residence</span>
                                    </div>
                                    <div className="text-white font-medium">
                                        {member.hosteler
                                            ? `Hosteler${member.hostel ? ` (${member.hostel})` : ''}`
                                            : 'Day Scholar'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'documents':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <FileText size={18} className="mr-2 text-blue-400" />
                            Documents
                        </h3>

                        {member.resume?.url && (
                            <a
                                href={member.resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                            >
                                <div className="flex items-center">
                                    <FileText size={20} className="text-blue-400 mr-3" />
                                    <div>
                                        <span className="text-gray-300 group-hover:text-white font-medium block">
                                            Resume
                                        </span>
                                        <span className="text-gray-500 text-sm">Click to download</span>
                                    </div>
                                </div>
                                <Download size={16} className="text-gray-500" />
                            </a>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-4xl max-h-[95vh] bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/20 rounded-2xl border border-white/10 overflow-hidden flex flex-col"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-600 p-6 flex-shrink-0">
                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                                aria-label="Close modal"
                            >
                                <X size={20} className="text-white" />
                            </button>

                            {/* Profile section */}
                            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Profile image */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                                        {!imageError && member.profilePicture?.url ? (
                                            <img
                                                src={member.profilePicture.url}
                                                alt={member.fullname}
                                                className="w-full h-full object-cover"
                                                onError={() => setImageError(true)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-800">
                                                <span className="text-white font-bold text-xl">
                                                    {initials}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Profile info */}
                                <div className="flex-1 text-center sm:text-left min-w-0">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                        {member.fullname}
                                    </h2>
                                    
                                    {/* Basic info grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                        {/* Department */}
                                        {member.department && (
                                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                                <div className="flex items-center text-blue-200 mb-1">
                                                    <Sparkles size={14} className="mr-2" />
                                                    <span className="text-xs font-medium">Department</span>
                                                </div>
                                                <div className="text-white font-semibold">{member.department}</div>
                                            </div>
                                        )}

                                        {/* Designation */}
                                        {member.designation && (
                                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                                <div className="flex items-center text-blue-200 mb-1">
                                                    <Badge size={14} className="mr-2" />
                                                    <span className="text-xs font-medium">Designation</span>
                                                </div>
                                                <div className="text-white font-semibold">{member.designation}</div>
                                            </div>
                                        )}

                                        {/* LPU ID for authenticated users */}
                                        {isAuthenticated && member.LpuId && (
                                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                                <div className="flex items-center text-blue-200 mb-1">
                                                    <School size={14} className="mr-2" />
                                                    <span className="text-xs font-medium">LPU ID</span>
                                                </div>
                                                <div className="text-white font-semibold">{member.LpuId}</div>
                                            </div>
                                        )}

                                        {/* Hostel for authenticated users */}
                                        {isAuthenticated && member.hosteler && member.hostel && (
                                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                                <div className="flex items-center text-blue-200 mb-1">
                                                    <MapPin size={14} className="mr-2" />
                                                    <span className="text-xs font-medium">Hostel</span>
                                                </div>
                                                <div className="text-white font-semibold">{member.hostel}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/10 bg-gray-900/50 flex-shrink-0 overflow-x-auto">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                                            activeTab === tab.id
                                                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/20'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <IconComponent size={16} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab content */}
                        <div className="flex-1 p-6 overflow-y-auto min-h-0">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                {renderTabContent()}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TeamMemberModal;
