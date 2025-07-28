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
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getToken, decodeToken } from '../utils/handleTokens.js';
import logo from '../assets/logo.png';

const navSections = [
    {
        items: [
            { name: 'Home', icon: Home, path: '/', color: '#00d9ff' },
            { name: 'Events', icon: Calendar, path: '/event', color: '#7c3aed' },
            { name: 'Team', icon: Users, path: '/team', color: '#0ea5e9' },
            { name: 'Social', icon: Sparkles, path: '/social-page', color: '#06b6d4' },
            { name: 'Contact', icon: Mail, path: '/contact', color: '#0284c7' },
        ],
    },
];

const pathToNavName = (pathname) => {
    if (pathname === '/') return 'Home';
    if (pathname.startsWith('/event')) return 'Events';
    if (pathname.startsWith('/team')) return 'Team';
    if (pathname.startsWith('/social-page')) return 'Social';
    if (pathname.startsWith('/contact')) return 'Contact';
    return 'Home';
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');
    const { user, isAuthenticated, loading, logoutMember, logoutAdmin } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const userRef = useRef(null);
    const lastScrollY = useRef(window.scrollY);
    const navigate = useNavigate();
    const location = useLocation();

    // Sync active link with route
    useEffect(() => {
        setActiveLink(pathToNavName(location.pathname));
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY <= 0) {
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setShowNavbar(false);
            } else if (currentScrollY < lastScrollY.current) {
                setShowNavbar(true);
            }
            lastScrollY.current = currentScrollY;
            setIsScrolled(currentScrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setIsUserOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        setIsUserOpen(false);

        const found = navSections.flatMap((s) => s.items).find((item) => item.name === name);
        if (found) {
            navigate(found.path);
        }
    };

    const handleLogout = () => {
        const { accessToken } = getToken();
        if (accessToken) {
            try {
                const tokenData = decodeToken(accessToken);
                if (tokenData.memberId) {
                    logoutMember();
                } else if (tokenData.adminId) {
                    logoutAdmin();
                }
            } catch {
                logoutMember();
            }
        } else {
            logoutMember();
        }
        setIsUserOpen(false);
        navigate('/auth');
    };

    const handleAlreadyMember = () => {
        setIsOpen(false);
        setIsUserOpen(false);
        navigate('/auth', { state: { tab: 'login' } });
    };

    const handleJoinClub = () => {
        setIsOpen(false);
        setIsUserOpen(false);
        navigate('/auth', { state: { tab: 'register' } });
    };

    if (loading) return null;

    return (
        <>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .navbar {
                    transition: transform 0.4s ease, background 0.4s, box-shadow 0.4s, backdrop-filter 0.4s;
                }
                .nav-link {
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    position: relative;
                    overflow: hidden;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #06b6d4, #6366f1);
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    transform: translateX(-50%);
                }
                .nav-link:hover::after,
                .nav-link.active::after {
                    width: 70%;
                }
                .logo-float {
                    animation: float 4s ease-in-out infinite;
                }
                .drawer-open {
                    animation: slideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                .fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                .nav-glow {
                    box-shadow: 0 0 25px rgba(6, 182, 212, 0.15);
                }
                .logo-glow {
                    filter: drop-shadow(0 0 12px rgba(6, 182, 212, 0.5));
                }
            `}</style>

            <nav
                className={`fixed top-0 left-0 w-full z-50 navbar bg-[#0a1120]/80 backdrop-blur-xl`}
                style={{
                    height: '5rem',
                    boxShadow: '0 8px 32px 0 rgba(10,17,32,0.18), 0 1.5px 8px 0 #1e293b',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'linear-gradient(90deg, rgba(10,17,32,0.92) 60%, rgba(30,41,59,0.85) 100%)',
                    backdropFilter: 'blur(16px)',
                }}
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-full">
                    {/* Brand with animated background */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 relative select-none">
                        <div
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg border border-blue-900/40 bg-[#0a1120]/90"
                        >
                            <img
                                src={logo}
                                alt="Vibranta Logo"
                                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-400 shadow-md"
                                loading="lazy"
                                decoding="async"
                                style={{
                                    background: '#0a0e17',
                                }}
                            />
                        </div>
                        <h1
                            className="text-white font-extrabold text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-wide text-shadow navbar-brand"
                            style={{ letterSpacing: '0.04em', textShadow: '0 2px 12px #1e293b' }}
                        >
                            Vibranta
                        </h1>
                    </div>

                    {/* Navigation Links */}
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
                            <div className="relative" ref={userRef}>
                                <button
                                    onClick={() => setIsUserOpen(!isUserOpen)}
                                    className="flex items-center gap-2 sm:gap-3 glass-effect px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-300 group"
                                >
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <span className="hidden sm:block text-white font-medium text-sm">
                                        {user?.name || 'User'}
                                    </span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-white transition-transform duration-300 ${isUserOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {/* User Dropdown */}
                                {isUserOpen && (
                                    <div className="absolute right-0 mt-3 w-64 sm:w-72 rounded-2xl bg-slate-900/90 backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden z-50">
                                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
                                                    <User className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        {user?.name || 'User'}
                                                    </p>
                                                    <p className="text-sm text-slate-300">
                                                        {user?.email || 'user@vibranta.edu'}
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
                    <div className="absolute top-0 left-0 h-full mobile-drawer w-80 max-w-sm mobile-menu-enter bg-cyan-900/95 backdrop-blur-lg border-r border-white/20 shadow-2xl overflow-hidden">
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
                                            <ul className="space-y-2">
                                                {section.items.map((item) => (
                                                    <button
                                                        key={item.name}
                                                        onClick={() => handleLinkClick(item.name)}
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
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
