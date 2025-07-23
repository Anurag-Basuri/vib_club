import React, { useState, useEffect, useRef } from 'react';
import {
    Home,
    Calendar,
    Newspaper,
    Users,
    Mail,
    HelpCircle,
    UserPlus,
    LogIn,
    LayoutDashboard,
    Menu,
    X,
    Sparkles,
    Zap,
    User as UserIcon,
    LogOut,
    MessageSquare,
    Users as TeamIcon,
    Share2 as SocialIcon,
    Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const navSections = [
    {
        title: 'Navigation',
        items: [
            { name: 'Home', icon: Home, path: '/', color: '#00d9ff' },
            { name: 'Events', icon: Calendar, path: '/event', color: '#7c3aed' },
            { name: 'Team', icon: TeamIcon, path: '/team', color: '#0ea5e9' },
            { name: 'Social', icon: SocialIcon, path: '/social-page', color: '#06b6d4' },
            { name: 'Contact', icon: Mail, path: '/contact', color: '#0284c7' },
        ],
    },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

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

    const handleLinkClick = (name) => {
        setActiveLink(name);
        setIsOpen(false);
        setIsProfileOpen(false);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setIsOpen(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsProfileOpen(false);
    };

    return (
        <>
            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-40px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                @keyframes navGlow {
                    0%,100% { box-shadow: 0 2px 24px 0 #00d9ff33; }
                    50% { box-shadow: 0 4px 32px 0 #2575fc44; }
                }
                .animate-fade-slide-down {
                    animation: fadeSlideDown 0.7s cubic-bezier(.4,0,.2,1) forwards;
                }
                .animate-nav-glow {
                    animation: navGlow 3s ease-in-out infinite;
                }
                .nav-link {
                    transition: all 0.2s cubic-bezier(.4,0,.2,1);
                }
                .nav-link.active {
                    background: linear-gradient(90deg, #00d9ff22 0%, #2575fc22 100%);
                    color: #fff;
                    box-shadow: 0 2px 12px #00d9ff22;
                }
                .nav-link:hover {
                    transform: translateY(-2px) scale(1.06);
                    background: linear-gradient(90deg, #00d9ff11 0%, #2575fc11 100%);
                    color: #fff;
                }
                .icon-glow {
                    filter: drop-shadow(0 0 8px currentColor);
                }
                .profile-dropdown {
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%);
                    backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 217, 255, 0.1);
                }
            `}</style>
            {/* Top Navbar */}
            <nav
                className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 animate-fade-slide-down ${
                    isScrolled
                        ? 'backdrop-blur-xl bg-gradient-to-r from-[#0a0e17]/80 to-[#1a1f3a]/80 shadow-xl animate-nav-glow'
                        : 'bg-gradient-to-r from-[#0a0e17]/60 to-[#1a1f3a]/60'
                }`}
                style={{
                    borderBottom: '1.5px solid rgba(255,255,255,0.08)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20 relative">
                    {/* Branding */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] flex items-center justify-center text-white shadow-lg">
                            <LayoutDashboard size={26} className="icon-glow" />
                        </div>
                        <h1 className="text-white font-bold text-2xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] bg-clip-text text-transparent tracking-wide">
                            Vibranta
                        </h1>
                    </div>
                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-2">
                        {navSections.flatMap((section, sIdx) =>
                            section.items.map((item, i) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleLinkClick(item.name)}
                                    className={`nav-link flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-base ${
                                        activeLink === item.name
                                            ? 'active'
                                            : 'text-slate-200'
                                    }`}
                                    style={{
                                        border: activeLink === item.name
                                            ? `1.5px solid ${item.color}55`
                                            : '1.5px solid transparent',
                                    }}
                                >
                                    <item.icon
                                        size={18}
                                        className={`transition-all duration-300 ${activeLink === item.name ? 'icon-glow' : ''}`}
                                        style={{ color: activeLink === item.name ? item.color : undefined }}
                                    />
                                    <span>{item.name}</span>
                                    {activeLink === item.name && (
                                        <span
                                            className="block h-1 w-6 rounded-full ml-2"
                                            style={{
                                                background: `linear-gradient(90deg, ${item.color} 0%, #2575fc 100%)`,
                                            }}
                                        />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                    
                    {/* Right Side - Membership Section */}
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <div className="relative" ref={profileRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-[#6a11cb]/20 to-[#2575fc]/20 px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-white font-medium">Admin User</span>
                                </motion.button>
                                
                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-64 rounded-xl profile-dropdown overflow-hidden z-50"
                                    >
                                        <div className="p-4 border-b border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] flex items-center justify-center">
                                                    <UserIcon className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">Admin User</p>
                                                    <p className="text-sm text-slate-300">admin@vibranta.edu</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <button 
                                                onClick={() => handleLinkClick('Dashboard')}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                                            >
                                                <LayoutDashboard className="h-5 w-5 text-blue-400" />
                                                <span>Dashboard</span>
                                            </button>
                                            <button 
                                                onClick={() => handleLinkClick('Settings')}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                                            >
                                                <Settings className="h-5 w-5 text-purple-400" />
                                                <span>Account Settings</span>
                                            </button>
                                        </div>
                                        <div className="p-3 border-t border-white/10">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleLinkClick('Login')}
                                    className="px-4 py-2 rounded-lg font-medium text-base text-slate-200 border border-slate-600 hover:bg-slate-800 transition-colors"
                                >
                                    Already a member
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleLinkClick('Register')}
                                    className="px-4 py-2 rounded-lg font-medium text-base bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] text-white hover:opacity-90 transition-opacity"
                                >
                                    Join Club
                                </motion.button>
                            </div>
                        )}
                        
                        {/* Mobile Hamburger */}
                        <button
                            className="lg:hidden p-3 rounded-xl bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] text-white shadow-lg"
                            onClick={() => setIsOpen(true)}
                            aria-label="Open navbar"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>
            
            {/* Mobile Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 backdrop-blur-md transition-opacity duration-300"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
                        }}
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Drawer */}
                    <div
                        className="absolute top-0 left-0 h-full w-72 max-w-full z-50 overflow-hidden animate-fade-slide-down"
                        style={{
                            background: `linear-gradient(135deg, 
                                rgba(15, 23, 42, 0.98) 0%,
                                rgba(30, 41, 59, 0.95) 50%,
                                rgba(15, 23, 42, 0.98) 100%)`,
                            backdropFilter: 'blur(24px)',
                            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 0 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 217, 255, 0.1)',
                        }}
                    >
                        <div className="h-full w-full p-6 flex flex-col relative">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white border"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(59, 130, 246, 0.3) 100%)',
                                            borderColor: 'rgba(0, 217, 255, 0.2)',
                                        }}
                                    >
                                        <LayoutDashboard size={24} />
                                    </div>
                                    <h1
                                        className="text-white font-bold text-2xl"
                                        style={{
                                            background: 'linear-gradient(135deg, #00d9ff 0%, #3b82f6 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Vibranta
                                    </h1>
                                </div>
                                <button
                                    className="p-3 rounded-xl backdrop-blur-xl border border-white/10 text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                    }}
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close navbar"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            {/* Nav */}
                            <div className="space-y-8 overflow-y-auto flex-1">
                                {navSections.map((section, sIdx) => (
                                    <div key={section.title}>
                                        <h3 className="text-slate-300 text-sm font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
                                            {section.title}
                                            <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent" />
                                        </h3>
                                        <ul className="space-y-3">
                                            {section.items.map((item) => (
                                                <li key={item.name} className="relative">
                                                    <button
                                                        onClick={() => handleLinkClick(item.name)}
                                                        className={`nav-link w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                                                            activeLink === item.name
                                                                ? 'active'
                                                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                                                        }`}
                                                        style={{
                                                            border: activeLink === item.name
                                                                ? `1.5px solid ${item.color}55`
                                                                : '1.5px solid transparent',
                                                        }}
                                                    >
                                                        <div
                                                            className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                                                                activeLink === item.name
                                                                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
                                                                    : 'bg-white/5 border-white/10'
                                                            }`}
                                                        >
                                                            <item.icon
                                                                size={20}
                                                                style={{
                                                                    color: activeLink === item.name ? item.color : undefined,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="font-medium">{item.name}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            {/* Footer */}
                            <div
                                className="mt-6 p-4 rounded-xl text-center border"
                                style={{
                                    background:
                                        'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(59, 130, 246, 0.08) 100%)',
                                    borderColor: 'rgba(0, 217, 255, 0.1)',
                                }}
                            >
                                <div className="flex items-center gap-2 justify-center">
                                    <Sparkles size={16} className="text-cyan-400 animate-pulse" />
                                    <p className="text-slate-200 text-sm font-medium">
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