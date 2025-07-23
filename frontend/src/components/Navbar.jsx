import React, { useState, useEffect, useRef } from 'react';
import {
    Home,
    Calendar,
    Mail,
    UserPlus,
    LogIn,
    LayoutDashboard,
    Menu,
    X,
    Sparkles,
    User,
    LogOut,
    Users,
    Share2,
    Settings,
    ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../hooks/useAuth.js';

const navSections = [
    {
        items: [
            { name: 'Home', icon: Home, path: '/', color: '#00d9ff' },
            { name: 'Events', icon: Calendar, path: '/event', color: '#7c3aed' },
            { name: 'Team', icon: Users, path: '/team', color: '#0ea5e9' },
            { name: 'Social', icon: Share2, path: '/social-page', color: '#06b6d4' },
            { name: 'Contact', icon: Mail, path: '/contact', color: '#0284c7' },
        ],
    },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');
    const { user, isAuthenticated, loading, logoutMember, logoutAdmin } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    // Scroll listener for navbar blur/shadow
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLinkClick = (name) => {
        setActiveLink(name);
        setIsOpen(false);
        setIsProfileOpen(false);

        const found = navSections.flatMap((s) => s.items).find((item) => item.name === name);
        if (found) {
            navigate(found.path);
        }
    };

    const handleLogout = () => {
        const accessToken = localStorage.getItem('accesstoken');
        if (accessToken) {
            try {
                const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
                if (tokenData.memberId) {
                    logoutMember();
                } else if (tokenData.adminId) {
                    logoutAdmin();
                }
            } catch {
                // fallback if token is not a JWT
                logoutMember();
            }
        } else {
            logoutMember();
        }
        setIsProfileOpen(false);
        navigate('/auth');
    };

    const handleAlreadyMember = () => {
        setIsOpen(false);
        setIsProfileOpen(false);
        navigate('/auth');
    };

    const handleJoinClub = () => {
        setIsOpen(false);
        setIsProfileOpen(false);
        navigate('/auth');
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                @keyframes slideInFromTop {
                    from {
                        opacity: 0;
                        transform: translateY(-100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInFromLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes glowPulse {
                    0%, 100% {
                        box-shadow: 0 4px 32px rgba(0, 217, 255, 0.2),
                                   0 2px 16px rgba(37, 117, 252, 0.1);
                    }
                    50% {
                        box-shadow: 0 8px 40px rgba(0, 217, 255, 0.3),
                                   0 4px 24px rgba(37, 117, 252, 0.2);
                    }
                }

                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-2px); }
                }

                .navbar-enter {
                    animation: slideInFromTop 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .mobile-menu-enter {
                    animation: slideInFromLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .navbar-glow {
                    animation: glowPulse 4s ease-in-out infinite;
                }

                .nav-link {
                    position: relative;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    overflow: hidden;
                }

                .nav-link::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transition: left 0.5s;
                }

                .nav-link:hover::before {
                    left: 100%;
                }

                .nav-link.active {
                    background: linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(37, 117, 252, 0.15) 100%);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(0, 217, 255, 0.3);
                    box-shadow: 0 4px 20px rgba(0, 217, 255, 0.2);
                }

                .nav-link:hover {
                    transform: translateY(-1px);
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .icon-float {
                    animation: iconFloat 2s ease-in-out infinite;
                }

                .glass-effect {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .mobile-nav-item {
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .mobile-nav-item:hover {
                    transform: translateX(8px);
                    background: linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(37, 117, 252, 0.1) 100%);
                }

                .mobile-nav-item.active {
                    background: linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(37, 117, 252, 0.2) 100%);
                    border-left: 3px solid #00d9ff;
                }

                .text-shadow {
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                @media (max-width: 640px) {
                    .navbar-brand {
                        font-size: 1.25rem !important;
                    }

                    .navbar-height {
                        height: 4rem !important;
                    }

                    .mobile-drawer {
                        width: 85vw !important;
                        max-width: 320px !important;
                    }
                }

                @media (max-width: 480px) {
                    .navbar-brand {
                        font-size: 1.125rem !important;
                    }

                    .mobile-drawer {
                        width: 90vw !important;
                    }
                }
            `}</style>

            {/* Top Navbar */}
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 navbar-enter ${
                    isScrolled
                        ? 'glass-effect navbar-glow shadow-2xl'
                        : 'bg-gradient-to-r from-slate-900/70 to-slate-800/70 backdrop-blur-sm'
                } navbar-height`}
                style={{ height: '5rem' }}
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-full">
                    {/* Brand */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg icon-float">
                            <LayoutDashboard size={window.innerWidth < 640 ? 20 : 26} />
                        </div>
                        <h1 className="text-white font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wide text-shadow navbar-brand">
                            Vibranta
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {navSections.flatMap((section) =>
                            section.items.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleLinkClick(item.name)}
                                    className={`nav-link flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 ${
                                        activeLink === item.name
                                            ? 'active text-white'
                                            : 'text-slate-200 hover:text-white'
                                    }`}
                                >
                                    <item.icon
                                        size={18}
                                        className={`transition-all duration-300 ${
                                            activeLink === item.name ? 'text-cyan-400' : ''
                                        }`}
                                    />
                                    <span className="whitespace-nowrap">{item.name}</span>
                                    {activeLink === item.name && (
                                        <div className="w-1 h-1 bg-cyan-400 rounded-full ml-1 animate-pulse" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        {isAuthenticated ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 sm:gap-3 glass-effect px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-300 group"
                                >
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <span className="hidden sm:block text-white font-medium text-sm">
                                        Admin
                                    </span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-64 sm:w-72 rounded-2xl glass-effect border border-white/20 shadow-2xl overflow-hidden z-50">
                                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
                                                    <User className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        Admin User
                                                    </p>
                                                    <p className="text-sm text-slate-300">
                                                        admin@vibranta.edu
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <button
                                                onClick={() => handleLinkClick('Dashboard')}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-all duration-300 text-white group"
                                            >
                                                <LayoutDashboard className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                                                <span>Dashboard</span>
                                            </button>
                                            <button
                                                onClick={() => handleLinkClick('Settings')}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-all duration-300 text-white group"
                                            >
                                                <Settings className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
                                                <span>Settings</span>
                                            </button>
                                        </div>
                                        <div className="p-3 border-t border-white/10">
                                            <button
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-medium"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <button
                                    className="px-3 lg:px-4 py-2 rounded-xl font-medium text-sm lg:text-base text-slate-200 border border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300"
                                    onClick={handleAlreadyMember}
                                >
                                    Already a member
                                </button>
                                <button
                                    onClick={handleJoinClub}
                                    className="px-3 lg:px-4 py-2 rounded-xl font-medium text-sm lg:text-base bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                                >
                                    Join Club
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            onClick={() => setIsOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={window.innerWidth < 640 ? 20 : 24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute top-0 left-0 h-full mobile-drawer w-80 max-w-sm mobile-menu-enter glass-effect border-r border-white/20 shadow-2xl overflow-hidden">
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                        <LayoutDashboard size={22} />
                                    </div>
                                    <h1 className="text-white font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        Vibranta
                                    </h1>
                                </div>
                                <button
                                    className="p-2 rounded-xl glass-effect border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Navigation */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                                <div className="space-y-6">
                                    {navSections.map((section) => (
                                        <div key={section.title}>
                                            <h3 className="text-slate-300 text-xs font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
                                                {section.title}
                                                <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent" />
                                            </h3>
                                            <ul className="space-y-2">
                                                {section.items.map((item) => (
                                                        <button
                                                            onClick={() =>
                                                                handleLinkClick(item.name)
                                                            }
                                                            className={`mobile-nav-item w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                                                                activeLink === item.name
                                                                    ? 'active text-white'
                                                                    : 'text-slate-300 hover:text-white'
                                                            }`}
                                                        >
                                                            <div
                                                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                                                    activeLink === item.name
                                                                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                                                                        : 'bg-white/5 border border-white/10'
                                                                }`}
                                                            >
                                                                <item.icon
                                                                    size={20}
                                                                    className={
                                                                        activeLink === item.name
                                                                            ? 'text-cyan-400'
                                                                            : ''
                                                                    }
                                                                />
                                                            </div>
                                                            <span className="font-medium">
                                                                {item.name}
                                                            </span>
                                                        </button>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Auth Section for Mobile */}
                            {!isAuthenticated && (
                                <div className="p-4 sm:p-6 border-t border-white/10 space-y-3">
                                    <button
                                        onClick={handleAlreadyMember}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-600/50 rounded-xl text-white font-medium hover:bg-slate-800/50 transition-all duration-300"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        <span>Already a member</span>
                                    </button>
                                    <button
                                        onClick={handleJoinClub}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        <span>Join Club</span>
                                    </button>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="p-4 sm:p-6 border-t border-white/10">
                                <div className="glass-effect p-4 rounded-xl text-center border border-cyan-500/20">
                                    <div className="flex items-center gap-2 justify-center mb-2">
                                        <Sparkles
                                            size={16}
                                            className="text-cyan-400 animate-pulse"
                                        />
                                        <p className="text-cyan-400 text-sm font-semibold">
                                            Vibranta Club
                                        </p>
                                    </div>
                                    <p className="text-slate-300 text-xs">
                                        "Code. Create. Collaborate."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
