import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicClient } from '../../services/api.js';
import TicketForm from './ticketForm.jsx';
import handlePayment from "../../utils/paymentHandler.js";

// Custom hook to prevent background scroll when modal is open
const usePreventBodyScroll = (preventScroll) => {
    useEffect(() => {
        if (preventScroll) {
            const originalOverflow = document.body.style.overflow;
            const originalPaddingRight = document.body.style.paddingRight;
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.paddingRight = originalPaddingRight;
            };
        }
    }, [preventScroll]);
};

const HorrorRaveYardPage = () => {
    const [spotsLeft, setSpotsLeft] = useState(0);
    const [totalSpots, setTotalSpots] = useState(0);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [eyesBlinking, setEyesBlinking] = useState(false);
    const [ghostAppears, setGhostAppears] = useState(false);
    const [bloodDrips, setBloodDrips] = useState([]);
    const [eventData, setEventData] = useState(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showStartingSoon, setShowStartingSoon] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        amount: '300',
        lpuId: '',
        gender: '',
        hosteler: '',
        hostel: '',
        course: '',
        club: ''
    });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Responsive check
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent scroll when modal is open
    usePreventBodyScroll(showPaymentForm || showStartingSoon);

    // Fetch event data
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await publicClient.get('api/events/by-id/68859a199ec482166f0e8523');
                const event = response.data?.data || response.data;
                if (event && !event.tags) {
                    event.tags = [
                        'DJ Anshika',
                        'Freshers Exclusive',
                        'Horror Theme',
                        'VIP Access',
                        'Underground Experience',
                    ];
                }
                setEventData(event);
                if (event) {
                    setTotalSpots(event.totalSpots || 0);
                    const registrations = Array.isArray(event.registrations)
                        ? event.registrations.length
                        : 0;
                    setSpotsLeft((event.totalSpots || 0) - registrations);
                    setFormData((f) => ({
                        ...f,
                        amount: event.ticketPrice ? String(event.ticketPrice) : '300',
                    }));
                }
            } catch (error) {
                setError('Failed to fetch event data.');
                console.error('Error fetching event data:', error);
            }
        };
        fetchEventData();
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!eventData?.date) return;
        const targetDate = new Date(eventData.date).getTime();
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setCountdown({ days, hours, minutes, seconds });
            } else {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [eventData]);

    // Eyes blinking animation
    useEffect(() => {
        const interval = setInterval(() => {
            setEyesBlinking(true);
            setTimeout(() => setEyesBlinking(false), 150 + Math.random() * 200);
        }, 1500 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    // Ghost appears animation
    useEffect(() => {
        const interval = setInterval(() => {
            setGhostAppears(true);
            setTimeout(() => setGhostAppears(false), 2000);
        }, 6000 + Math.random() * 8000);
        return () => clearInterval(interval);
    }, []);

    // Blood drips animation
    useEffect(() => {
        const interval = setInterval(() => {
            if (bloodDrips.length < 20) {
                const newDrip = {
                    id: Date.now(),
                    x: Math.random() * 100,
                    delay: Math.random() * 3,
                    duration: 3 + Math.random() * 5,
                };
                setBloodDrips((prev) => [...prev, newDrip]);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [bloodDrips]);

    const BloodDrips = useCallback(() => (
        <div className="fixed inset-0 pointer-events-none z-0">
            {bloodDrips.map((drip) => (
                <motion.div
                    key={drip.id}
                    className="absolute top-0 w-2 h-8 bg-red-600 rounded-b-full"
                    style={{ left: `${drip.x}%` }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: ['0px', '50px', '50px', '100px'],
                        opacity: [0, 1, 1, 0],
                        y: [0, window.innerHeight * 0.8],
                    }}
                    transition={{
                        duration: drip.duration,
                        delay: drip.delay,
                        times: [0, 0.3, 0.7, 1],
                    }}
                    onAnimationComplete={() => {
                        setBloodDrips((prev) => prev.filter((d) => d.id !== drip.id));
                    }}
                >
                    <motion.div
                        className="absolute bottom-0 w-4 h-4 bg-red-700 rounded-full"
                        animate={{
                            scale: [0, 1.5, 1],
                            y: [0, 10, 20],
                        }}
                        transition={{
                            duration: drip.duration * 0.3,
                            delay: drip.duration * 0.7,
                        }}
                    />
                </motion.div>
            ))}
        </div>
    ), [bloodDrips]);

    // Partners data
    const partners = [
        {
            name: "Cabnest",
            description: "Safe and affordable student rides",
            icon: "🚕",
            color: "from-blue-600 to-blue-800"
        },
        {
            name: "White Heaven Entertainment",
            description: "Bringing celestial experiences to the underground",
            icon: "🌌",
            color: "from-purple-600 to-purple-800"
        },
        {
            name: "Crypto Coven",
            description: "Blockchain-powered horror experiences",
            icon: "🔮",
            color: "from-green-600 to-green-800"
        }
    ];

    // Event features
    const eventFeatures = [
        {
            title: "Raveyard Traitor Hunt: Among the Undead",
            description: "Uncover the traitor hiding among the undead crowd. Solve cryptic clues to survive the night.",
            icon: "🕵️‍♂️"
        },
        {
            title: "Whispers from the Grave",
            description: "Experience chilling audio narratives from beyond the grave in our immersive sound chambers.",
            icon: "👻"
        },
        {
            title: "The Forbidden Ritual Room",
            description: "Participate in ancient rituals to summon spirits of the rave. Not for the faint of heart.",
            icon: "🔮"
        },
        {
            title: "GraveWalk - Fashion after the fall of civilization",
            description: "Witness post-apocalyptic couture on our runway of ruins. Apocalyptic fashion meets underground rave.",
            icon: "👗"
        },
        {
            title: "Apocalypse Couture - Ramp Walk",
            description: "Models showcase fashion designed for the end times. Survivor chic meets haute horror.",
            icon: "💃"
        },
        {
            title: "Experience the Madness Live with DJ Anshika",
            description: "Nationally renowned DJ bringing an exclusive high-energy haunted set. Remix segments: Bollywood x EOH Desi Bass.",
            icon: "🎧"
        }
    ];

    // Rust pattern for background
    const rustPattern = {
        backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(160, 82, 45, 0.15) 0%, transparent 20%),
        radial-gradient(circle at 50% 50%, rgba(205, 133, 63, 0.2) 0%, transparent 40%)
        `,
        backgroundColor: '#1a0630',
    };

    // Glitchy text component
    const GlitchText = ({ text, className }) => (
        <motion.span 
            className={`${className} relative inline-block`}
            animate={{ 
                textShadow: [
                    '2px 0 0 rgba(255, 0, 0, 0.7), -2px 0 0 rgba(0, 0, 255, 0.7), 0 0 10px rgba(255, 0, 0, 0.5)',
                    '0px 0 0 rgba(255, 0, 0, 0.7), 0px 0 0 rgba(0, 0, 255, 0.7), 0 0 0px rgba(255, 0, 0, 0.5)',
                    '2px 0 0 rgba(255, 0, 0, 0.7), -2px 0 0 rgba(0, 0, 255, 0.7), 0 0 10px rgba(255, 0, 0, 0.5)',
                    '-2px 0 0 rgba(255, 0, 0, 0.7), 2px 0 0 rgba(0, 0, 255, 0.7), 0 0 15px rgba(255, 0, 0, 0.5)'
                ]
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
            }}
        >
            {text}
            <motion.span 
                className="absolute top-0 left-0 w-full h-full overflow-hidden"
                animate={{ 
                    clipPath: [
                        'inset(0 0 0 0)',
                        'inset(20% 0 60% 0)',
                        'inset(60% 0 20% 0)',
                        'inset(0 0 0 0)',
                    ]
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            >
                <div 
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        background: 'linear-gradient(transparent, rgba(255, 0, 0, 0.2), transparent)',
                        mixBlendMode: 'screen'
                    }}
                />
            </motion.span>
        </motion.span>
    );

    // Open payment form
    const openPaymentForm = useCallback(() => {
        setError('');
        setShowPaymentForm(true);
    }, []);

    // Payment submit handler
    const onPaymentSubmit = useCallback(() => {
        handlePayment({
            formData,
            eventData,
            setLoading,
            setError,
            setShowPaymentForm,
            onSuccess: (orderData) => {
                console.log('Payment initiated successfully:', orderData);
            },
            onFailure: (error) => {
                console.error('Payment failed:', error);
            }
        });
    }, [formData, eventData]);

    return (
        <div
            className="min-h-screen bg-black text-white font-sans relative"
            style={{ overflow: 'hidden' }}
        >
            <BloodDrips />

            {/* Rust particles floating */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-xl text-red-800 opacity-50"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -10, 0],
                        x: [0, (Math.random() > 0.5 ? 1 : -1) * 5, 0],
                        rotate: [0, Math.random() * 360],
                    }}
                    transition={{
                        duration: 8 + Math.random() * 10,
                        repeat: Infinity,
                        delay: i * 0.5,
                    }}
                >
                    •
                </motion.div>
            ))}

            {/* Hero Section */}
            <div 
                className="min-h-screen w-full flex flex-col justify-center items-center p-4 overflow-hidden relative"
                style={{
                    background: `
                        radial-gradient(circle at 30% 40%, #3d1f1a 0%, #2a0f06 40%, #1a0904 70%, #0a0015 100%),
                        ${rustPattern.backgroundImage}
                    `,
                    backgroundColor: rustPattern.backgroundColor,
                }}
            >
                {/* Rust overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a0522d' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    opacity: 0.7
                }} />
                
                {/* Rusty metal border */}
                <div className="absolute inset-2 border-4 pointer-events-none" style={{
                    borderImage: `linear-gradient(45deg, #8B4513, #5D2919, #3a180d) 1`,
                    borderStyle: 'solid',
                    boxShadow: 'inset 0 0 20px rgba(139, 69, 19, 0.8)',
                }} />
                
                {/* Glitch effect container */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        background: `linear-gradient(rgba(0,0,0,0.1) 50%, transparent 50%),
                                    linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))`,
                        backgroundSize: '100% 4px, 4px 100%',
                        opacity: 0.3,
                        animation: 'glitch 0.5s infinite'
                    }} />
                </div>
                
                <div className="relative z-10 text-center max-w-6xl w-full px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Welcome text */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mb-6"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-red-300">
                                <GlitchText text="ew fo College" className="text-4xl md:text-6xl" />
                            </h2>
                            <h1 className="text-5xl md:text-7xl font-bold text-red-500">
                                <GlitchText text="Welcome to The Night of Chaos" className="text-5xl md:text-7xl" />
                            </h1>
                        </motion.div>
                        
                        {/* Glitchy RAVEYARD text */}
                        <motion.div
                            className="relative mb-6"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.h1
                                className={`${isMobile ? 'text-6xl' : 'text-9xl'} font-black mb-0 relative tracking-tighter`}
                                style={{
                                    fontFamily: "'Rajdhani', sans-serif",
                                    color: '#ff3a3a'
                                }}
                            >
                                <GlitchText text="RAVEYARD" className={`${isMobile ? 'text-6xl' : 'text-9xl'} font-black`} />
                            </motion.h1>
                            
                            <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-red-800 via-red-600 to-red-800 rounded-full" />
                        </motion.div>
                        
                        <motion.h2
                            className={`${isMobile ? 'text-2xl' : 'text-4xl'} text-red-300 mb-8 font-bold relative pb-4`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            style={{
                                textShadow: '0 0 8px rgba(255, 50, 50, 0.7)'
                            }}
                        >
                            <GlitchText text="Not your average EDM Night... It's curse of Beats" className="text-2xl md:text-4xl" />
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 h-6 mx-1 bg-gradient-to-b from-red-500 to-transparent"
                                        animate={{
                                            y: [0, 20, 40, 60],
                                            opacity: [1, 1, 1, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.h2>
                        
                        <motion.div
                            className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-6 mt-8 max-w-4xl mx-auto`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                        >
                            {[
                                { icon: '🎧', title: 'DJ Anshika' },
                                { icon: '👻', title: 'GraveWalk - Fashion Show' },
                                { icon: '🍔', title: 'Refreshment Zone' },
                                { icon: '🎟️', title: 'VIP Wristbands' }
                            ].map((item, index) => (
                                <motion.div 
                                    key={index}
                                    className="flex flex-col items-center p-4 rounded-lg"
                                    style={{
                                        background: 'rgba(90, 35, 25, 0.4)',
                                        border: '1px solid rgba(205, 133, 63, 0.3)',
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                                    }}
                                    whileHover={{ 
                                        scale: 1.05,
                                        backgroundColor: 'rgba(120, 50, 35, 0.6)',
                                        boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)'
                                    }}
                                >
                                    <span className="text-5xl mb-2">{item.icon}</span>
                                    <span className="text-lg font-bold text-red-300">{item.title}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                        
                        <motion.div
                            className="mt-12"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                        >
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 0 30px rgba(220, 38, 38, 0.8)',
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openPaymentForm}
                                className="px-10 py-6 relative rounded-xl font-bold text-xl shadow-lg overflow-hidden"
                                style={{
                                    background: `linear-gradient(145deg, #8B4513, #5D2919)`,
                                    boxShadow: `0 4px 0 #3a180d, inset 0 2px 4px rgba(255, 100, 100, 0.4)`,
                                    border: '1px solid #5D2919',
                                    textShadow: '0 0 8px rgba(255, 50, 50, 0.7)'
                                }}
                            >
                                <div className="relative z-10 flex items-center gap-3">
                                    <span>ENTER THE CRYPT</span>
                                    <span>💀</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1 h-6 mx-2 bg-gradient-to-b from-red-600 to-transparent"
                                            animate={{
                                                y: [0, 10, 20],
                                                opacity: [1, 1, 0],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.5,
                                            }}
                                        />
                                    ))}
                                </div>
                                
                                {/* Rust texture on button */}
                                <div className="absolute inset-0 opacity-20" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                }} />
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
                
                <motion.div
                    className="absolute bottom-8 flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <span className="text-red-400 mb-3 text-sm font-medium tracking-widest">
                        DESCEND INTO DARKNESS
                    </span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="w-10 h-16 rounded-full border-2 border-red-900 flex justify-center p-2"
                        style={{
                            background: `linear-gradient(145deg, #2a0f06, #1a0904)`,
                            boxShadow: 'inset 0 0 5px rgba(139, 0, 0, 0.5)',
                        }}
                    >
                        <motion.div
                            className="w-2 h-3 bg-gradient-to-b from-red-500 to-red-700 rounded-full"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Partners Section */}
            <section className="py-16 px-4 bg-gradient-to-b from-black via-red-900/5 to-black">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-500">
                            <GlitchText text="OUR PARTNERS IN CHAOS" className="text-3xl md:text-4xl" />
                        </h2>
                        <p className="text-xl text-red-300 max-w-3xl mx-auto">
                            Bringing you a night of unforgettable madness
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {partners.map((partner, index) => (
                            <motion.div
                                key={index}
                                className={`bg-gradient-to-br ${partner.color} backdrop-blur-sm border border-red-600/30 rounded-xl p-6 relative overflow-hidden`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.8 }}
                                whileHover={{ scale: 1.03 }}
                            >
                                <div className="text-5xl mb-4">{partner.icon}</div>
                                <h3 className="text-2xl font-bold text-white mb-2">{partner.name}</h3>
                                <p className="text-red-200">{partner.description}</p>
                                
                                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
                                    <span className="text-sm">⚡</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Countdown timer */}
            <section className="py-12 px-4 bg-black">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    >
                        {Object.entries(countdown).map(([unit, value], index) => (
                            <motion.div
                                key={unit}
                                className="relative bg-gradient-to-b from-gray-900 to-black border-b-4 border-red-900 rounded-xl p-4 overflow-hidden"
                                style={{
                                    boxShadow: 'inset 0 0 10px rgba(139, 0, 0, 0.5)',
                                }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="absolute top-2 right-2 w-3 h-3 bg-red-900 rounded-full"></div>
                                <div className="absolute bottom-2 left-2 w-4 h-4 bg-red-900 rounded-full opacity-70"></div>
                                <div className="text-3xl md:text-4xl font-black text-red-400 mb-1 relative z-10">
                                    {String(value).padStart(2, '0')}
                                </div>
                                <div className="text-sm text-red-300 uppercase font-medium relative z-10">
                                    {unit}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    <div className="flex justify-center gap-8 mb-4">
                        <span className="text-red-400 font-bold">{spotsLeft} SOULS LEFT</span>
                        <span className="text-red-400 font-bold">{totalSpots} TOTAL</span>
                    </div>
                    <div className="w-full bg-gray-900/50 h-3 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 to-red-800"
                            style={{
                                width: totalSpots > 0 ? `${(spotsLeft / totalSpots) * 100}%` : '0%',
                            }}
                        ></div>
                    </div>
                </div>
            </section>

            {/* Event Features */}
            <section className="py-24 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-6">
                            <GlitchText text="EXPERIENCE THE MADNESS" className="text-4xl md:text-5xl" />
                        </h2>
                        <p className="text-xl text-red-300 max-w-3xl mx-auto">
                            Dive into the underworld of chaos and beats
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {eventFeatures.map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-gradient-to-br from-red-900 to-black backdrop-blur-sm border border-red-600/50 rounded-xl p-8 relative overflow-hidden"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.8 }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-red-200">{item.description}</p>
                                
                                {/* Glitch effect */}
                                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                    <div className="absolute top-0 left-0 w-full h-full" style={{
                                        background: `linear-gradient(90deg, rgba(255,0,0,0.1), rgba(0,255,0,0.05), rgba(0,0,255,0.1))`,
                                        backgroundSize: '4px 100%',
                                        opacity: 0.3,
                                        animation: 'glitch 0.5s infinite'
                                    }}></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Event Details */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-red-400 mb-8">
                                EVENT DETAILS
                            </h2>
                            <div className="space-y-6 mb-10">
                                <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-red-600/30">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                                        <span>📅</span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-red-300 font-medium">
                                            DATE & TIME
                                        </div>
                                        <div className="text-white text-xl font-medium">
                                            {eventData?.date
                                                ? new Date(eventData.date).toLocaleDateString()
                                                : '--'}{' '}
                                            • {eventData?.time || '--'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-red-600/30">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                                        <span>📍</span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-red-300 font-medium">
                                            LOCATION
                                        </div>
                                        <div className="text-white text-xl font-medium">
                                            {eventData?.venue || '--'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-red-600/30">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                                        <span>🎟️</span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-red-300 font-medium">
                                            TICKET PRICE
                                        </div>
                                        <div className="text-white text-xl font-medium">
                                            {eventData?.ticketPrice
                                                ? `₹${eventData.ticketPrice}`
                                                : '₹1'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-red-400 font-bold">
                                        {spotsLeft} SOULS LEFT
                                    </span>
                                    <span className="text-red-400 font-bold">
                                        {totalSpots} TOTAL
                                    </span>
                                </div>
                                <div className="w-full bg-gray-900/50 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-600 to-red-800"
                                        style={{
                                            width:
                                                totalSpots > 0
                                                    ? `${(spotsLeft / totalSpots) * 100}%`
                                                    : '0%',
                                        }}
                                    ></div>
                                </div>
                            </div>
                            {eventData?.tags && eventData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {eventData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 rounded-full text-sm bg-red-900/50 text-red-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-red-900/40 to-black/70 backdrop-blur-sm border border-red-600/50 rounded-xl overflow-hidden aspect-square">
                                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                                    <div className="text-8xl mb-6">🌀</div>
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        Portal Opening Experience
                                    </h3>
                                    <p className="text-red-200">
                                        Experience the dimensional rift between worlds with
                                        immersive ghost installations and scream zones
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Ticket CTA */}
            <section className="py-32 px-4 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-8">
                            <GlitchText text="CLAIM YOUR SOUL PASS" className="text-4xl md:text-5xl" />
                        </h2>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 0 40px rgba(220, 38, 38, 0.8)',
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openPaymentForm}
                            className="px-16 py-10 bg-gradient-to-r from-red-600 to-red-800 rounded-xl font-bold text-2xl shadow-xl relative overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center gap-4">
                                <span>🎟️</span>
                                <span>SECURE YOUR PLACE</span>
                                <span>🔥</span>
                            </div>
                        </motion.button>
                        <div className="mt-12 space-y-4">
                            <p className="text-xl text-red-300 max-w-2xl mx-auto">
                                ⚠️ Limited to {totalSpots} souls - Once sold out, entry is sealed
                                forever ⚠️
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-4 bg-gradient-to-t from-red-900/20 to-black border-t border-red-800/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-6">
                        <div className="text-3xl font-bold">
                            <GlitchText text="RAVEYARD 2025" className="text-3xl" />
                        </div>
                        <div className="flex justify-center gap-8 text-red-300">
                            {[
                                { icon: '📱', text: '#RaveYard2025' },
                                { icon: '👻', text: '@raveyard_official' },
                                { icon: '💀', text: 'Join the Undead' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span>{item.icon}</span>
                                    <span className="font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-red-800/30 pt-8 space-y-2">
                            <p className="text-red-300">
                                © 2025 RaveYard. All rights reserved to the underworld.
                            </p>
                            <p className="text-red-400 text-sm opacity-80">
                                A ghostly rite of passage for the undead students of tomorrow
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Animated effects */}
            <AnimatePresence>
                {eyesBlinking && (
                    <motion.div
                        className="fixed inset-0 pointer-events-none z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-5xl"
                                style={{
                                    left: `${5 + i * 12}%`,
                                    top: `${15 + (i % 3) * 25}%`,
                                }}
                                animate={{ scaleY: [1, 0.05, 1] }}
                                transition={{ duration: 0.3 }}
                            >
                                👁️
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {ghostAppears && (
                    <div className="fixed inset-0 pointer-events-none z-20">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-6xl"
                                style={{
                                    left: `${i * 30}%`,
                                    top: `${20 + (i % 2) * 40}%`,
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0, 1, 0.7, 0],
                                    scale: [0, 1.5, 1.2, 0],
                                    y: [0, -50, -30, -100],
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 2 }}
                            >
                                👻
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Payment Form Modal */}
            <AnimatePresence>
                {showPaymentForm && (
                    <>
                        <TicketForm
                            eventData={eventData}
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                            error={error}
                            onClose={() => setShowPaymentForm(false)}
                            onSubmit={onPaymentSubmit}
                        />
                        <div id="cashfree-dropin-container" className="w-full min-h-[500px]"></div>
                    </>
                )}
            </AnimatePresence>

            {/* Starting Soon Modal */}
            <AnimatePresence>
                {showStartingSoon && (
                    <motion.div
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowStartingSoon(false)}
                    >
                        <motion.div
                            className="bg-gradient-to-br from-red-900/95 to-black/95 border border-red-700/60 shadow-2xl rounded-2xl max-w-xs w-full p-8 text-center flex flex-col items-center"
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-5xl mb-4 animate-bounce">⏳</div>
                            <h2 className="text-2xl font-bold text-red-300 mb-2">Registration Starting Soon</h2>
                            <p className="text-red-200 mb-6">Stay tuned! Registration for this event will open soon.</p>
                            <button
                                onClick={() => setShowStartingSoon(false)}
                                className="mt-2 px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 rounded-lg font-semibold text-white hover:from-red-700 hover:to-red-900 transition"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&display=swap');
                
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                
                body {
                    font-family: 'Rajdhani', sans-serif;
                    background-color: #000;
                    color: #fff;
                    overflow-x: hidden;
                }
                
                .glitch-text {
                    position: relative;
                    display: inline-block;
                }
            `}</style>
        </div>
    );
};

export default HorrorRaveYardPage;