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
} from 'lucide-react';

const navSections = [
    {
        title: 'Navigation',
        items: [
            { name: 'Home', icon: Home, path: '/', color: '#00d9ff' },
            { name: 'Events', icon: Calendar, path: '/events', color: '#7c3aed' },
            { name: 'Blog', icon: Newspaper, path: '/blog', color: '#06b6d4' },
        ],
    },
    {
        title: 'Account',
        items: [
            { name: 'Register', icon: UserPlus, path: '/register', color: '#3b82f6' },
            { name: 'Login', icon: LogIn, path: '/login', color: '#1e40af' },
            { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', color: '#1d4ed8' },
        ],
    },
    {
        title: 'Explore',
        items: [
            { name: 'About Club', icon: Users, path: '/about', color: '#0ea5e9' },
            { name: 'Contact', icon: Mail, path: '/contact', color: '#0284c7' },
            { name: 'FAQs', icon: HelpCircle, path: '/faqs', color: '#0369a1' },
        ],
    },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll listener for navbar blur/shadow
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (name) => {
        setActiveLink(name);
        setIsOpen(false);
        // Add navigation logic here if using react-router
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
                        <span className="ml-2 text-xs text-cyan-300 font-semibold flex items-center gap-1">
                            <Sparkles size={14} className="animate-pulse" />
                            PREMIUM
                        </span>
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
                    {/* Mobile Hamburger */}
                    <button
                        className="lg:hidden p-3 rounded-xl bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] text-white shadow-lg"
                        onClick={() => setIsOpen(true)}
                        aria-label="Open navbar"
                    >
                        <Menu size={24} />
                    </button>
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