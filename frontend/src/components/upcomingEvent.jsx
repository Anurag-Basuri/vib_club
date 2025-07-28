import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RaveYardEventPage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [ticketHovered, setTicketHovered] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(342);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [hoveredHighlight, setHoveredHighlight] = useState(null);
  
  // Mock event data
  const eventData = {
    title: "RaveYard 2025",
    subtitle: "A Ghostly Rite of Passage",
    date: "October 31, 2025",
    time: "9:00 PM - 4:00 AM",
    venue: "The Crypt - University Campus",
    ticketPrice: "₹799",
    status: "upcoming",
    tags: ["#RaveYard2025", "#HauntedRave", "#FreshersParty", "#HorrorEDM", "#GlowParty"],
    description: "Enter the post-apocalyptic graveyard rave where horror meets EDM. Experience DJ Gracy's nationally acclaimed horror-fusion sets, haunted selfie zones, scream-triggered photo booths, and VIP occult experiences. This isn't just a party—it's your ghostly initiation into college life."
  };
  
  // Enhanced highlights with more immersive descriptions
  const highlights = [
    { 
      icon: "🎧", 
      title: "DJ Gracy Live", 
      description: "National horror-EDM headliner with crowd-interactive AV drops and Bollywood x Bass fusion",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-red-900/40 to-orange-900/40"
    },
    { 
      icon: "🌫️", 
      title: "Haunted Atmosphere", 
      description: "Fog machines, UV-reactive decor, skull-lit pathways, and post-apocalyptic graveyard vibes",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-900/40 to-pink-900/40"
    },
    { 
      icon: "📸", 
      title: "Transformation Booths", 
      description: "Tattoo-mask makeovers, haunted selfie zones, scream-triggered photo ops with AR filters",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-cyan-900/40 to-blue-900/40"
    },
    { 
      icon: "👑", 
      title: "VIP Occult Zones", 
      description: "Exclusive scream tunnels, haunted chili town, and special access for contest winners",
      color: "from-yellow-500 to-red-500",
      bgColor: "bg-gradient-to-br from-yellow-900/40 to-red-900/40"
    },
    { 
      icon: "🍹", 
      title: "Ghostly Refreshments", 
      description: "Glowing mojitos, chocolate-dipped waffles, horror-themed snacks in eerie atmosphere",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-green-900/40 to-teal-900/40"
    },
    { 
      icon: "🛡️", 
      title: "Safe Haunting", 
      description: "Medical emergency setups, crowd flow management, inclusive entry with checkpoint security",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-indigo-900/40 to-purple-900/40"
    }
  ];
  
  // Enhanced FAQ data
  const faqs = [
    { 
      question: "What should I wear for the transformation?", 
      answer: "Come ready for your ghostly makeover! UV-reactive clothing, horror costumes, or anything that glows. Our tattoo-mask transformation booths will complete your look.",
      icon: "🎭",
      color: "bg-gradient-to-br from-purple-900/40 to-pink-900/40"
    },
    { 
      question: "What's included in VIP Occult Zones?", 
      answer: "Exclusive access to scream tunnels, haunted chili town, priority photo booth access, and special meet & greet opportunities with DJ Gracy.",
      icon: "👑",
      color: "bg-gradient-to-br from-yellow-900/40 to-red-900/40"
    },
    { 
      question: "Are the horror elements too scary?", 
      answer: "It's thrilling, not terrifying! Think haunted house meets music festival. Medical teams and security ensure everyone feels safe while having spooky fun.",
      icon: "😱",
      color: "bg-gradient-to-br from-cyan-900/40 to-blue-900/40"
    },
    { 
      question: "Can I get refunds or transfer tickets?", 
      answer: "Tickets are non-refundable but fully transferable to another student. Contact us through social media for transfer assistance.",
      icon: "🎟️",
      color: "bg-gradient-to-br from-green-900/40 to-teal-900/40"
    }
  ];
  
  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Glitch effect trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate countdown
  useEffect(() => {
    const targetDate = new Date('October 31, 2025 21:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Floating elements with enhanced animations
  const FloatingElement = ({ delay, size, position, emoji, duration = 6 }) => {
    return (
      <motion.div
        className={`absolute ${position} z-10`}
        initial={{ y: 0, opacity: 0.7 }}
        animate={{ 
          y: [0, -30, 0],
          x: [0, Math.random() > 0.5 ? 15 : -15, 0],
          rotate: [0, 10, -10, 0],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: duration, 
          repeat: Infinity,
          ease: "easeInOut",
          delay
        }}
      >
        <span className={`text-${size}xl filter drop-shadow-lg`}>{emoji}</span>
      </motion.div>
    );
  };
  
  // Enhanced glitch text effect
  const GlitchText = ({ text, className = "", size = "text-6xl" }) => {
    return (
      <motion.div 
        className={`relative ${className}`}
        animate={glitchActive ? { 
          textShadow: [
            "2px 2px 0 #ff00ff, -2px -2px 0 #00ffff",
            "3px 3px 0 #ff00ff, -3px -3px 0 #00ffff",
            "2px 2px 0 #ff00ff, -2px -2px 0 #00ffff"
          ],
          x: [0, -2, 2, 0],
          filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
        } : {}}
        transition={{ 
          duration: 0.2,
          ease: "easeInOut"
        }}
      >
        <div className={`${size} font-black bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent`}>
          {text}
        </div>
      </motion.div>
    );
  };
  
  // Progress bar for spots left
  const SpotsProgress = () => {
    const percentage = Math.min(100, Math.floor((500 - spotsLeft) / 500 * 100));
    
    return (
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-green-400 font-bold text-lg">{spotsLeft} SOULS LEFT</span>
          <span className="text-red-400 font-bold text-lg">500 TOTAL</span>
        </div>
        <div className="w-full bg-gray-900/50 h-4 rounded-full overflow-hidden border border-purple-500/30">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 relative"
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
        <div className="text-center mt-2">
          <span className="text-red-400 text-sm font-medium animate-pulse">⚠️ FILLING UP FAST ⚠️</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      
      {/* Floating atmospheric elements */}
      <FloatingElement delay={0} size="3" position="top-20 left-10" emoji="💀" />
      <FloatingElement delay={0.5} size="4" position="bottom-1/4 right-20" emoji="👻" />
      <FloatingElement delay={1} size="2" position="top-1/3 right-1/4" emoji="🦇" />
      <FloatingElement delay={1.5} size="3" position="bottom-20 left-1/3" emoji="⚡" />
      <FloatingElement delay={2} size="2" position="top-1/2 left-1/4" emoji="🔥" />
      <FloatingElement delay={2.5} size="3" position="bottom-1/3 right-1/3" emoji="🌟" />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 40%, #2d1b69 0%, #1a0630 40%, #0a0015 70%, #000000 100%)'
        }}
      >
        {/* Enhanced animated background */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
              `,
              backgroundSize: "300% 300%"
            }}
          />
          
          {/* Animated smoke effect */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: `
                radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%),
                conic-gradient(from 0deg, transparent, rgba(147, 51, 234, 0.1), transparent)
              `
            }}
          />
        </div>
        
        {/* Main content */}
        <div className="relative z-10 text-center max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <GlitchText text="RaveYard" size="text-6xl md:text-8xl lg:text-9xl" />
              <motion.span 
                className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                2025
              </motion.span>
            </motion.div>
            
            <motion.h2 
              className="text-2xl md:text-4xl lg:text-5xl text-purple-300 mb-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              A Ghostly Rite of Passage
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl text-purple-200 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              Enter the post-apocalyptic graveyard rave where horror meets EDM. Experience nationally acclaimed DJ sets, haunted transformations, and your initiation into the undead side of campus life.
            </motion.p>
            
            {/* Enhanced countdown timer */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {Object.entries(countdown).map(([unit, value], index) => (
                <motion.div 
                  key={unit} 
                  className="bg-black/40 backdrop-blur-lg border border-purple-500/50 rounded-2xl p-4 relative overflow-hidden"
                  whileHover={{ scale: 1.05, borderColor: "rgba(147, 51, 234, 0.8)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10" />
                  <div className="relative z-10">
                    <div className="text-3xl md:text-5xl font-black text-green-400 mb-1">{value}</div>
                    <div className="text-sm text-purple-300 uppercase font-medium">{unit}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 50px rgba(255, 0, 128, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl font-black text-2xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-3xl">👻</span>
                  <span>ENTER THE RAVE</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ⚡
                  </motion.span>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Enhanced scroll indicator */}
        <motion.div
          className="absolute bottom-8 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-purple-400 mb-3 text-sm font-medium animate-pulse">DESCEND INTO DARKNESS</span>
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-10 h-16 rounded-full border-2 border-purple-500 flex justify-center p-2 bg-black/20 backdrop-blur-sm"
          >
            <motion.div 
              className="w-2 h-3 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>
      
      {/* About the Event - Enhanced */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-black via-purple-900/5 to-black">
        {/* Enhanced background elements */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-pink-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-900/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.h2 
              className="mb-6"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GlitchText text="Welcome to the Underworld" size="text-4xl md:text-6xl" />
            </motion.h2>
            <p className="text-xl md:text-2xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
              {eventData.description}
            </p>
          </motion.div>
          
          {/* Enhanced highlights grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                className={`${item.bgColor} backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative overflow-hidden group`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                whileHover={{ 
                  y: -15, 
                  borderColor: "rgba(147, 51, 234, 0.6)",
                  boxShadow: "0 25px 50px rgba(147, 51, 234, 0.3)"
                }}
                onHoverStart={() => setHoveredHighlight(index)}
                onHoverEnd={() => setHoveredHighlight(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="text-5xl mb-6">
                    <motion.span
                      animate={hoveredHighlight === index ? { 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.2, 1]
                      } : {}}
                      transition={{ duration: 0.8 }}
                    >
                      {item.icon}
                    </motion.span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-purple-200 leading-relaxed">{item.description}</p>
                </div>
                
                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent"
                  initial={{ scale: 0, rotate: 0 }}
                  whileInView={{ scale: 1, rotate: 45 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Event Details - Enhanced */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-red-900/5 to-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-8 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                <GlitchText text="Event Transmission" />
              </h2>
              
              <div className="space-y-6 mb-10">
                <motion.div 
                  className="flex items-center gap-4 p-4 bg-black/30 rounded-2xl border border-purple-500/30"
                  whileHover={{ borderColor: "rgba(147, 51, 234, 0.6)", x: 10 }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 font-medium">RITUAL DATE & TIME</div>
                    <div className="text-white text-xl font-bold">{eventData.date} • {eventData.time}</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-4 p-4 bg-black/30 rounded-2xl border border-purple-500/30"
                  whileHover={{ borderColor: "rgba(236, 72, 153, 0.6)", x: 10 }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 font-medium">HAUNTED LOCATION</div>
                    <div className="text-white text-xl font-bold">{eventData.venue}</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-4 p-4 bg-black/30 rounded-2xl border border-purple-500/30"
                  whileHover={{ borderColor: "rgba(34, 197, 94, 0.6)", x: 10 }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-cyan-600 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 font-medium">SOUL PRICE</div>
                    <div className="text-white text-xl font-bold">{eventData.ticketPrice}</div>
                  </div>
                </motion.div>
              </div>
              
              <SpotsProgress />
              
              <div className="flex flex-wrap gap-3 mb-8">
                {eventData.tags.map((tag, index) => (
                  <motion.span 
                    key={index}
                    className="px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-300 border border-purple-500/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, borderColor: "rgba(147, 51, 234, 0.8)" }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-purple-300 font-medium">TRANSMISSION STATUS:</span>
                <motion.span 
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    eventData.status === 'upcoming' 
                      ? 'bg-green-900/40 text-green-400 border border-green-500/50' 
                      : 'bg-red-900/40 text-red-400 border border-red-500/50'
                  }`}
                  animate={{ 
                    boxShadow: eventData.status === 'upcoming' 
                      ? ["0 0 10px rgba(34, 197, 94, 0.3)", "0 0 20px rgba(34, 197, 94, 0.6)", "0 0 10px rgba(34, 197, 94, 0.3)"]
                      : ["0 0 10px rgba(239, 68, 68, 0.3)", "0 0 20px rgba(239, 68, 68, 0.6)", "0 0 10px rgba(239, 68, 68, 0.3)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {eventData.status.toUpperCase()} 📡
                </motion.span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-900/40 via-black/60 to-pink-900/40 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden aspect-square max-w-lg mx-auto relative">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-red-600/20"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Content overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="text-8xl mb-6"
                  >
                    🌀
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-4">Portal Opening</h3>
                  <p className="text-purple-200 text-lg">Experience the dimensional rift between worlds</p>
                  
                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-purple-400 rounded-full"
                      style={{
                        left: `${20 + i * 10}%`,
                        top: `${30 + (i % 2) * 20}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Orbiting elements */}
              <motion.div 
                className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full blur-xl opacity-60"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              
              <motion.div 
                className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full blur-xl opacity-60"
                animate={{ 
                  rotate: [360, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{ 
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* DJ Showcase Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-purple-900/10 to-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              <GlitchText text="Featured Necromancer" />
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-orange-600/10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-6xl">🎧</div>
                    <div>
                      <h3 className="text-3xl font-black text-white">DJ Gracy</h3>
                      <p className="text-red-300 text-lg">National Horror-EDM Pioneer</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-purple-200">
                    <p className="text-lg leading-relaxed">
                      Witness the mastery of India's leading horror-techno artist as she conjures spine-chilling beats that merge Bollywood classics with underground bass drops.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-black/30 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">500K+</div>
                        <div className="text-sm text-purple-300">Souls Moved</div>
                      </div>
                      <div className="bg-black/30 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-cyan-400">7 Hrs</div>
                        <div className="text-sm text-purple-300">Live Set</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated sound waves */}
                <div className="absolute bottom-4 right-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gradient-to-t from-red-500 to-orange-500 rounded-full"
                      animate={{
                        height: [10, 30, 10],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🔥</span>
                    <h4 className="text-xl font-bold text-white">Live Horror-Techno Sets</h4>
                  </div>
                  <p className="text-purple-200">Crowd-interactive AV drops with 3D projection mapping and ghostly visual synchronization</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎵</span>
                    <h4 className="text-xl font-bold text-white">Bollywood x EDM Fusion</h4>
                  </div>
                  <p className="text-purple-200">Haunted remixes of classic tracks mixed with underground bass and desi beats</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">⚡</span>
                    <h4 className="text-xl font-bold text-white">Interactive Experience</h4>
                  </div>
                  <p className="text-purple-200">Scream-triggered sound effects and crowd-responsive lighting that reacts to your energy</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Transformation Experience */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-red-900/5 to-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              <GlitchText text="Metamorphosis Stations" />
            </h2>
            <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
              Transform into your undead avatar through our immersive experience zones
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🎭", title: "Tattoo-Mask Station", desc: "Professional horror makeup and UV-reactive temporary tattoos", color: "from-purple-500 to-pink-500", bg: "bg-gradient-to-br from-purple-900/40 to-pink-900/40" },
              { icon: "📸", title: "Haunted Selfie Zones", desc: "AR filters, ghost overlays, and scream-activated photo triggers", color: "from-cyan-500 to-blue-500", bg: "bg-gradient-to-br from-cyan-900/40 to-blue-900/40" },
              { icon: "🌟", title: "Glow Transformation", desc: "UV face paint, neon accessories, and bioluminescent effects", color: "from-green-500 to-teal-500", bg: "bg-gradient-to-br from-green-900/40 to-teal-900/40" },
              { icon: "👻", title: "Spectral Booths", desc: "Holographic projections and ethereal costume accessories", color: "from-red-500 to-orange-500", bg: "bg-gradient-to-br from-red-900/40 to-orange-900/40" }
            ].map((station, index) => (
              <motion.div
                key={index}
                className={`${station.bg} backdrop-blur-sm border border-white/20 rounded-3xl p-6 relative overflow-hidden group`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                whileHover={{ 
                  y: -20, 
                  borderColor: "rgba(147, 51, 234, 0.6)",
                  boxShadow: "0 30px 60px rgba(147, 51, 234, 0.3)"
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${station.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                    className="text-6xl mb-6"
                  >
                    {station.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-4">{station.title}</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">{station.desc}</p>
                </div>
                
                {/* Animated particles */}
                <motion.div
                  className="absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced Ticket CTA */}
      <section className="py-32 px-4 bg-gradient-to-b from-black via-red-900/10 to-purple-900/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Background effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-red-600/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              <GlitchText text="Claim Your Soul Pass" />
            </h2>
            
            <motion.div
              onHoverStart={() => setTicketHovered(true)}
              onHoverEnd={() => setTicketHovered(false)}
              className="inline-block relative"
            >
              <AnimatePresence>
                {ticketHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl blur-xl -z-10"
                  />
                )}
              </AnimatePresence>
              
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 60px rgba(255, 0, 128, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl font-black text-3xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="relative z-10 flex items-center gap-4">
                  <motion.span 
                    className="text-4xl"
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎟️
                  </motion.span>
                  <span>SECURE YOUR PLACE</span>
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-4xl"
                  >
                    ⚡
                  </motion.span>
                </div>
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="mt-12 space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xl text-purple-300 max-w-3xl mx-auto">
                ⚠️ Warning: Once sold out, entry to the underworld is sealed forever ⚠️
              </p>
              <div className="flex justify-center items-center gap-4 text-red-400">
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  💀
                </motion.span>
                <span className="font-bold">Limited to 500 Lost Souls</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                >
                  💀
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced FAQ Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-purple-900/10 via-black to-black">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              <GlitchText text="Spectral Inquiries" />
            </h2>
            <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
              Everything mortal souls need to know before crossing into the RaveYard
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`${faq.color} backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative overflow-hidden group`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                whileHover={{ 
                  y: -10,
                  borderColor: "rgba(147, 51, 234, 0.6)",
                  boxShadow: "0 25px 50px rgba(147, 51, 234, 0.2)"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-start gap-6">
                    <div className="text-4xl mt-2">{faq.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4">{faq.question}</h3>
                      <p className="text-purple-200 leading-relaxed text-lg">{faq.answer}</p>
                    </div>
                  </div>
                </div>
                
                {/* Animated corner accent */}
                <motion.div
                  className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-500/20 to-transparent"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced Footer */}
      <footer className="py-16 px-4 bg-gradient-to-t from-purple-900/20 to-black border-t border-white/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              RaveYard 2025
            </motion.div>
            
            <div className="flex justify-center gap-8 text-purple-300">
              {[
                { icon: "📱", text: "#RaveYard2025" },
                { icon: "👻", text: "@raveyard_official" },
                { icon: "💀", text: "Join the Undead" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1, color: "#a855f7" }}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-8 space-y-2">
              <p className="text-purple-300">© 2025 RaveYard. All rights reserved to the underworld.</p>
              <p className="text-purple-400 text-sm opacity-80">
                A ghostly rite of passage for the undead students of tomorrow
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer floating elements */}
        <FloatingElement delay={0} size="2" position="bottom-10 left-10" emoji="💀" duration={8} />
        <FloatingElement delay={1} size="2" position="bottom-10 right-10" emoji="👻" duration={10} />
      </footer>
    </div>
  );
};

export default RaveYardEventPage;