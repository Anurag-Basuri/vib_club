import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    X,
    Mail,
    Linkedin,
    Github,
    Globe,
    Phone,
    Code,
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

// Utility function for formatting dates
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

// Get icon based on social platform
const getSocialIcon = (platform) => {
    const platformLower = platform?.toLowerCase() || '';
    if (platformLower.includes('linkedin')) return Linkedin;
    if (platformLower.includes('github')) return Github;
    return Globe;
};

// Component for social link item
const SocialLinkItem = ({ social, index }) => {
    const IconComponent = getSocialIcon(social.platform);
    const url = social.url?.startsWith('http') ? social.url : `https://${social.url}`;
    
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 group active:scale-[0.98]"
            aria-label={`Visit ${social.platform} profile`}
        >
            <div className="flex items-center min-w-0 flex-1">
                <IconComponent size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300 group-hover:text-white text-sm truncate">
                    {social.platform}
                </span>
            </div>
            <ExternalLink size={14} className="text-gray-500 flex-shrink-0 ml-2" />
        </a>
    );
};

// Component for info card
const InfoCard = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`bg-white/5 rounded-lg p-3 border border-white/10 ${className}`}>
        <div className="flex items-center text-blue-300 mb-2">
            <Icon size={16} className="mr-2 flex-shrink-0" />
            <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="text-white font-medium text-sm break-words">{value}</div>
    </div>
);

// Skill badge component
const SkillBadge = ({ skill, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 50);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <span
            className={`px-3 py-2 bg-blue-900/40 text-blue-200 rounded-lg border border-blue-700/30 backdrop-blur-sm font-medium text-sm hover:bg-blue-900/60 transition-all duration-300 transform ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
        >
            {skill}
        </span>
    );
};

// Tab content component
const TabContent = ({ activeTab, member, isAuthenticated }) => {
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        setContentVisible(false);
        const timer = setTimeout(() => setContentVisible(true), 100);
        return () => clearTimeout(timer);
    }, [activeTab]);

    if (!member) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'about':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                <User size={18} className="mr-2 text-blue-400 flex-shrink-0" />
                                About
                            </h3>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {member.bio || 'No bio provided.'}
                                </p>
                            </div>
                        </div>

                        {member.joinedAt && (
                            <InfoCard
                                icon={Clock}
                                label="Joined VIB Club"
                                value={formatDate(member.joinedAt)}
                            />
                        )}
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Mail size={18} className="mr-2 text-blue-400 flex-shrink-0" />
                            Contact Information
                        </h3>
                        
                        <div className="space-y-3">
                            {/* Email and Phone */}
                            {member.email && (
                                <a
                                    href={`mailto:${member.email}`}
                                    className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 group active:scale-[0.98]"
                                    aria-label={`Send email to ${member.email}`}
                                >
                                    <Mail size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                                    <span className="text-gray-300 group-hover:text-white break-all text-sm">
                                        {member.email}
                                    </span>
                                </a>
                            )}
                            
                            {member.phone && (
                                <a
                                    href={`tel:${member.phone}`}
                                    className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 group active:scale-[0.98]"
                                    aria-label={`Call ${member.phone}`}
                                >
                                    <Phone size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                                    <span className="text-gray-300 group-hover:text-white text-sm">
                                        {member.phone}
                                    </span>
                                </a>
                            )}

                            {/* Social Links */}
                            {member.socialLinks && member.socialLinks.length > 0 && (
                                <div>
                                    <h4 className="text-md font-medium text-blue-300 mb-3 flex items-center">
                                        <Globe size={16} className="mr-2 flex-shrink-0" />
                                        Social Links
                                    </h4>
                                    <div className="space-y-2">
                                        {member.socialLinks.map((social, index) => (
                                            <SocialLinkItem key={`social-${index}`} social={social} index={index} />
                                        ))}
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
                            <Code size={18} className="mr-2 text-blue-400 flex-shrink-0" />
                            Skills & Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {member.skills?.map((skill, index) => (
                                <SkillBadge key={`skill-${index}-${skill}`} skill={skill} index={index} />
                            ))}
                        </div>
                    </div>
                );

            case 'academic':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <GraduationCap size={18} className="mr-2 text-blue-400 flex-shrink-0" />
                            Academic Information
                        </h3>

                        <div className="space-y-3">
                            {member.program && (
                                <InfoCard icon={School} label="Program" value={member.program} />
                            )}

                            {member.year && (
                                <InfoCard icon={Calendar} label="Academic Year" value={`Year ${member.year}`} />
                            )}

                            {/* Hostel Information for authenticated users */}
                            {isAuthenticated && member.hosteler !== undefined && (
                                <InfoCard
                                    icon={Building}
                                    label="Residence"
                                    value={member.hosteler
                                        ? `Hosteler${member.hostel ? ` (${member.hostel})` : ''}`
                                        : 'Day Scholar'}
                                />
                            )}
                        </div>
                    </div>
                );

            case 'documents':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <FileText size={18} className="mr-2 text-blue-400 flex-shrink-0" />
                            Documents
                        </h3>

                        {member.resume?.url && (
                            <a
                                href={member.resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 group active:scale-[0.98]"
                                aria-label="Download resume"
                            >
                                <div className="flex items-center min-w-0 flex-1">
                                    <FileText size={20} className="text-blue-400 mr-3 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-gray-300 group-hover:text-white font-medium block text-sm">
                                            Resume
                                        </span>
                                        <span className="text-gray-500 text-xs">Click to download</span>
                                    </div>
                                </div>
                                <Download size={16} className="text-gray-500 flex-shrink-0 ml-2" />
                            </a>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No content available</p>
                    </div>
                );
        }
    };

    return (
        <div
            className={`transition-all duration-300 ${
                contentVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
            }`}
        >
            {renderContent()}
        </div>
    );
};

// Main modal component
const TeamMemberModal = ({ member, isOpen, onClose, isAuthenticated = false }) => {
    const [activeTab, setActiveTab] = useState('about');
    const [imageError, setImageError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Memoized initials calculation
    const initials = useMemo(() => {
        if (!member?.fullname) return '??';
        return member.fullname
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }, [member?.fullname]);

    // Handle keyboard events
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape' && isOpen) {
            onClose();
        }
    }, [isOpen, onClose]);

    // Handle modal visibility and animations
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setActiveTab('about');
            setImageError(false);
            // Small delay for smooth animation
            setTimeout(() => setModalVisible(true), 10);
        } else {
            document.body.style.overflow = 'unset';
            setModalVisible(false);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Keyboard event listener
    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    // Dynamic tabs based on available data
    const tabs = useMemo(() => [
        { id: 'about', label: 'About', icon: User, show: true },
        {
            id: 'contact',
            label: 'Contact',
            icon: Mail,
            show: member?.email || member?.phone || (member?.socialLinks?.length > 0),
        },
        {
            id: 'skills',
            label: 'Skills',
            icon: Code,
            show: member?.skills && member.skills.length > 0,
        },
        {
            id: 'academic',
            label: 'Academic',
            icon: GraduationCap,
            show: member?.program || member?.year,
        },
        {
            id: 'documents',
            label: 'Documents',
            icon: FileText,
            show: member?.resume?.url,
        },
    ].filter((tab) => tab.show), [member]);

    if (!isOpen || !member) return null;

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 transition-opacity duration-300 ${
                modalVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
        >
            <div
                className={`relative w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/20 rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl transition-all duration-300 transform ${
                    modalVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-600 p-4 sm:p-6 flex-shrink-0">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 z-10 active:scale-95"
                        aria-label="Close modal"
                    >
                        <X size={18} className="text-white" />
                    </button>

                    {/* Profile section */}
                    <div className="relative z-10 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
                        {/* Profile image */}
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                                {!imageError && member.profilePicture?.url ? (
                                    <img
                                        src={member.profilePicture.url}
                                        alt={member.fullname || 'Profile'}
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-800">
                                        <span className="text-white font-bold text-lg">
                                            {initials}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile info */}
                        <div className="flex-1 min-w-0 w-full">
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 break-words leading-tight">
                                {member.fullname}
                            </h2>
                            
                            {/* Basic info grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                                {/* Department */}
                                {member.department && (
                                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                                        <div className="flex items-center text-blue-200 mb-1">
                                            <Sparkles size={12} className="mr-1 flex-shrink-0" />
                                            <span className="text-xs font-medium">Department</span>
                                        </div>
                                        <div className="text-white font-semibold text-sm truncate" title={member.department}>
                                            {member.department}
                                        </div>
                                    </div>
                                )}

                                {/* Designation */}
                                {member.designation && (
                                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                                        <div className="flex items-center text-blue-200 mb-1">
                                            <Badge size={12} className="mr-1 flex-shrink-0" />
                                            <span className="text-xs font-medium">Designation</span>
                                        </div>
                                        <div className="text-white font-semibold text-sm truncate" title={member.designation}>
                                            {member.designation}
                                        </div>
                                    </div>
                                )}

                                {/* LPU ID for authenticated users */}
                                {isAuthenticated && member.LpuId && (
                                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                                        <div className="flex items-center text-blue-200 mb-1">
                                            <School size={12} className="mr-1 flex-shrink-0" />
                                            <span className="text-xs font-medium">LPU ID</span>
                                        </div>
                                        <div className="text-white font-semibold text-sm">
                                            {member.LpuId}
                                        </div>
                                    </div>
                                )}

                                {/* Hostel for authenticated users */}
                                {isAuthenticated && member.hosteler && member.hostel && (
                                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                                        <div className="flex items-center text-blue-200 mb-1">
                                            <MapPin size={12} className="mr-1 flex-shrink-0" />
                                            <span className="text-xs font-medium">Hostel</span>
                                        </div>
                                        <div className="text-white font-semibold text-sm">
                                            {member.hostel}
                                        </div>
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
                                className={`flex items-center justify-center gap-1 sm:gap-2 px-3 py-3 text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 min-w-[70px] sm:min-w-[90px] ${
                                    activeTab === tab.id
                                        ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <IconComponent size={14} className="flex-shrink-0" />
                                <span className="hidden xs:inline sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab content */}
                <div className="flex-1 p-4 overflow-y-auto min-h-0 overscroll-contain">
                    <TabContent 
                        activeTab={activeTab} 
                        member={member} 
                        isAuthenticated={isAuthenticated} 
                    />
                </div>
            </div>
        </div>
    );
};

export default TeamMemberModal;