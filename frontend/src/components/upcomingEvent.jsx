import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HorrorRaveYardPage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [bloodDrip, setBloodDrip] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(342);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [screamActive, setScreamActive] = useState(false);
  const [eyesBlinking, setEyesBlinking] = useState(false);
  const [ghostAppears, setGhostAppears] = useState(false);
  
  // Event data
  const eventData = {
    title: "RaveYard 2025",
    subtitle: "The Haunted Resurrection",
    date: "October 31, 2025",
    time: "11:59 PM - 6:66 AM",
    venue: "The Cursed Crypt - Abandoned Campus",
    ticketPrice: "₹666",
    status: "SOULS BEING HARVESTED",
    tags: ["#RaveYard2025", "#CursedRave", "#BloodMoon", "#GhostlyBeats", "#NightmareParty"],
    description: "Rise from your graves for the most terrifying rave experience ever conjured. Where screaming meets bass drops, and the dead dance until dawn. This Halloween, we're not just throwing a party - we're summoning the apocalypse."
  };
  
  // Horror highlights
  const horrorHighlights = [
    { 
      icon: "🧟‍♂️", 
      title: "Zombie DJ Sets", 
      description: "Undead DJs spinning beats from beyond the grave with blood-curdling bass drops",
      color: "from-red-600 to-red-800",
      bgColor: "bg-gradient-to-br from-red-900/60 to-black/80"
    },
    { 
      icon: "⚰️", 
      title: "Coffin Dance Floor", 
      description: "Dance on actual coffins with fog machines creating a graveyard atmosphere",
      color: "from-purple-600 to-purple-800",
      bgColor: "bg-gradient-to-br from-purple-900/60 to-black/80"
    },
    { 
      icon: "🔥", 
      title: "Hell's Kitchen", 
      description: "Demonic cocktails served in skull glasses with dry ice and blood-red mocktails",
      color: "from-orange-600 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-900/60 to-red-900/60"
    },
    { 
      icon: "👹", 
      title: "Demon Makeover", 
      description: "Professional horror makeup artists transform you into creatures of the night",
      color: "from-green-600 to-green-800",
      bgColor: "bg-gradient-to-br from-green-900/60 to-black/80"
    },
    { 
      icon: "🦴", 
      title: "Bone Yard Chill", 
      description: "VIP skeleton lounge with bone furniture and exclusive ghostly experiences",
      color: "from-gray-600 to-gray-800",
      bgColor: "bg-gradient-to-br from-gray-900/60 to-black/80"
    },
    { 
      icon: "🕷️", 
      title: "Spider Web Maze", 
      description: "Navigate through haunted corridors filled with jump scares and spooky surprises",
      color: "from-indigo-600 to-purple-600",
      bgColor: "bg-gradient-to-br from-indigo-900/60 to-purple-900/60"
    }
  ];
  
  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setBloodDrip(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scream effect trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setScreamActive(true);
      setTimeout(() => setScreamActive(false), 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Eyes blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setEyesBlinking(true);
      setTimeout(() => setEyesBlinking(false), 200);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  // Ghost appearance
  useEffect(() => {
    const interval = setInterval(() => {
      setGhostAppears(true);
      setTimeout(() => setGhostAppears(false), 1500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate countdown
  useEffect(() => {
    const targetDate = new Date('October 31, 2025 23:59:00').getTime();
    
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
  
  // Floating horror elements
  const FloatingHorrorElement = ({ delay, size, position, emoji, duration = 8 }) => {
    return (
      <motion.div
        className={`absolute ${position} z-20 pointer-events-none`}
        initial={{ y: 0, opacity: 0.8, scale: 1 }}
        animate={{ 
          y: [0, -40, 0],
          x: [0, Math.random() > 0.5 ? 20 : -20, 0],
          rotate: [0, 15, -15, 0],
          opacity: [0.8, 1, 0.4, 0.8],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{ 
          duration: duration, 
          repeat: Infinity,
          ease: "easeInOut",
          delay
        }}
      >
        <span className={`text-${size}xl filter drop-shadow-2xl`}>{emoji}</span>
      </motion.div>
    );
  };
  
  // Creepy text effect with blood drip
  const BloodText = ({ text, className = "", size = "text-7xl" }) => {
    return (
      <motion.div 
        className={`relative ${className}`}
        animate={screamActive ? { 
          textShadow: [
            "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000",
            "0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000",
            "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000"
          ],
          scale: [1, 1.05, 1],
          filter: ["hue-rotate(0deg)", "hue-rotate(10deg)", "hue-rotate(0deg)"]
        } : {}}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className={`${size} font-black bg-gradient-to-b from-red-500 via-red-600 to-black bg-clip-text text-transparent relative`}>
          {text}
          {/* Blood drip effect */}
          <motion.div
            className="absolute top-full left-1/2 w-2 bg-gradient-to-b from-red-600 to-red-800 rounded-full"
            initial={{ height: 0 }}
            animate={bloodDrip ? { height: [0, 20, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>
      </motion.div>
    );
  };
  
  // Horror background component
  const HorrorBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-900/20 to-black" />
        
        {/* Animated fog */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(139, 0, 0, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(75, 0, 130, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(0, 0, 0, 0.6) 0%, transparent 50%)
            `,
            backgroundSize: "400% 400%"
          }}
        />
        
        {/* Spider web pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="spiderweb" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M100,10 L100,190 M10,100 L190,100 M30,30 L170,170 M170,30 L30,170" 
                      stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none"/>
                <circle cx="100" cy="100" r="3" fill="rgba(255,0,0,0.3)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#spiderweb)"/>
          </svg>
        </div>
        
        {/* Floating eyes */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 30}%`,
              }}
              animate={eyesBlinking ? {
                scaleY: [1, 0.1, 1],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{
                duration: 0.3,
                delay: i * 0.1
              }}
            >
              👁️
            </motion.div>
          ))}
        </div>
        
        {/* Ghostly apparition */}
        <AnimatePresence>
          {ghostAppears && (
            <motion.div
              className="absolute top-1/4 right-10 text-6xl z-10"
              initial={{ opacity: 0, scale: 0, x: 100 }}
              animate={{ 
                opacity: [0, 0.8, 0], 
                scale: [0, 1.2, 0],
                x: [100, 0, -100],
                rotate: [0, 10, -10, 0]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.5 }}
            >
              👻
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-serif relative">
      
      {/* Horror floating elements */}
      <FloatingHorrorElement delay={0} size="4" position="top-20 left-10" emoji="💀" />
      <FloatingHorrorElement delay={0.8} size="3" position="bottom-1/4 right-20" emoji="🦇" />
      <FloatingHorrorElement delay={1.2} size="5" position="top-1/3 right-1/4" emoji="⚰️" />
      <FloatingHorrorElement delay={1.8} size="3" position="bottom-20 left-1/3" emoji="👻" />
      <FloatingHorrorElement delay={2.2} size="4" position="top-1/2 left-1/4" emoji="🕷️" />
      <FloatingHorrorElement delay={2.8} size="3" position="bottom-1/3 right-1/3" emoji="🧟‍♀️" />
      
      {/* Hero Section with Horror Theme */}
      <section className="relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden">
        <HorrorBackground />
        
        {/* Creepy border frame */}
        <div className="absolute inset-4 border-4 border-red-800/50 rounded-lg pointer-events-none">
          <div className="absolute -top-2 -left-2 text-3xl">🕷️</div>
          <div className="absolute -top-2 -right-2 text-3xl">🕷️</div>
          <div className="absolute -bottom-2 -left-2 text-3xl">🕷️</div>
          <div className="absolute -bottom-2 -right-2 text-3xl">🕷️</div>
        </div>
        
        {/* Main horror content */}
        <div className="relative z-10 text-center max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Creepy title with dripping effect */}
            <motion.div
              initial={{ scale: 0.5, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="mb-8 relative"
            >
              <BloodText text="RaveYard" size="text-6xl md:text-8xl lg:text-9xl" />
              <motion.div 
                className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-600 via-red-600 to-black bg-clip-text text-transparent block mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                2025
              </motion.div>
              
              {/* Skull decorations */}
              <motion.div 
                className="absolute -top-10 -left-10 text-6xl"
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                💀
              </motion.div>
              <motion.div 
                className="absolute -top-10 -right-10 text-6xl"
                animate={{ rotate: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                💀
              </motion.div>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-5xl lg:text-6xl text-red-400 mb-6 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              🩸 THE HAUNTED RESURRECTION 🩸
            </motion.h2>
            
            <motion.p
              className="text-xl md:text-2xl text-red-200 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              {eventData.description}
            </motion.p>
            
            {/* Spooky countdown with coffin design */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              {Object.entries(countdown).map(([unit, value], index) => (
                <motion.div 
                  key={unit} 
                  className="bg-gradient-to-b from-red-900/80 to-black/90 backdrop-blur-lg border-2 border-red-600/50 rounded-lg p-6 relative overflow-hidden transform -skew-y-1"
                  whileHover={{ 
                    scale: 1.1, 
                    borderColor: "rgba(220, 38, 38, 0.8)",
                    skewY: 0,
                    boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)"
                  }}
                  initial={{ opacity: 0, y: 30, rotate: Math.random() * 10 - 5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 1.7 + index * 0.15 }}
                >
                  {/* Coffin shape decoration */}
                  <div className="absolute inset-0 bg-gradient-to-b from-red-800/20 to-black/40" />
                  <div className="relative z-10">
                    <div className="text-4xl md:text-6xl font-black text-red-400 mb-2 font-serif">{value}</div>
                    <div className="text-sm text-red-300 uppercase font-bold tracking-wider">{unit}</div>
                  </div>
                  
                  {/* Corner skulls */}
                  <div className="absolute top-1 left-1 text-xs opacity-50">💀</div>
                  <div className="absolute top-1 right-1 text-xs opacity-50">💀</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Horror CTA button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.15,
                  boxShadow: "0 0 60px rgba(220, 38, 38, 0.8), 0 0 100px rgba(147, 51, 234, 0.4)"
                }}
                whileTap={{ scale: 0.9 }}
                className="px-16 py-8 bg-gradient-to-r from-red-700 via-red-600 to-red-800 rounded-xl font-black text-3xl shadow-2xl relative overflow-hidden group border-2 border-red-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-700 to-red-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                <div className="relative z-10 flex items-center gap-4">
                  <motion.span 
                    className="text-4xl"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    ⚰️
                  </motion.span>
                  <span>ENTER THE CRYPT</span>
                  <motion.span
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    💀
                  </motion.span>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Creepy scroll indicator */}
        <motion.div
          className="absolute bottom-8 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <span className="text-red-400 mb-4 text-sm font-bold animate-pulse tracking-widest">DESCEND TO HELL</span>
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-12 h-20 rounded-full border-3 border-red-600 flex justify-center p-3 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              className="w-3 h-4 bg-gradient-to-b from-red-500 to-red-700 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Rest of the page with consistent horror background */}
      <div className="relative">
        <HorrorBackground />
        
        {/* Horror Highlights Section */}
        <section className="py-24 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <BloodText text="CHAMBERS OF HORROR" size="text-4xl md:text-6xl" />
              <p className="text-2xl text-red-200 max-w-4xl mx-auto leading-relaxed mt-6">
                Experience terror like never before in our haunted attractions
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {horrorHighlights.map((item, index) => (
                <motion.div
                  key={index}
                  className={`${item.bgColor} backdrop-blur-sm border-2 border-red-800/50 rounded-xl p-8 relative overflow-hidden group transform hover:-skew-y-1`}
                  initial={{ opacity: 0, y: 50, rotate: Math.random() * 6 - 3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  whileHover={{ 
                    y: -20, 
                    borderColor: "rgba(220, 38, 38, 0.8)",
                    boxShadow: "0 30px 60px rgba(220, 38, 38, 0.3)",
                    skewY: 0
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 text-center">
                      <motion.span
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        {item.icon}
                      </motion.span>
                    </div>
                    <h3 className="text-2xl font-bold text-red-100 mb-4 text-center">{item.title}</h3>
                    <p className="text-red-200 leading-relaxed text-center">{item.description}</p>
                  </div>
                  
                  {/* Blood splatter effect */}
                  <motion.div
                    className="absolute top-2 right-2 text-2xl opacity-70"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  >
                    🩸
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Final CTA with Ultimate Horror */}
        <section className="py-32 px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <BloodText text="BOOK YOUR DAMNATION" size="text-4xl md:text-6xl" />
              
              <div className="mt-12 mb-16">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-red-400 font-bold text-xl">{spotsLeft} SOULS REMAINING</span>
                  <span className="text-purple-400 font-bold text-xl">666 TOTAL CAPACITY</span>
                </div>
                <div className="w-full bg-black/60 h-6 rounded-full overflow-hidden border-2 border-red-600">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 relative"
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${Math.floor((666 - spotsLeft) / 666 * 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 3, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
                <div className="text-center mt-3">
                  <span className="text-red-400 text-lg font-bold animate-pulse">⚠️ HELL IS FILLING UP FAST ⚠️</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 80px rgba(220, 38, 38, 1), 0 0 120px rgba(147, 51, 234, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-20 py-10 bg-gradient-to-r from-red-800 via-red-600 to-red-800 rounded-2xl font-black text-4xl shadow-2xl relative overflow-hidden group border-3 border-red-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-700 to-red-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
                <div className="relative z-10 flex items-center gap-6">
                  <motion.span 
                    className="text-5xl"
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity 
                    }}
                  >
                    👹
                  </motion.span>
                  <span>SELL YOUR SOUL - ₹666</span>
                  <motion.span
                    animate={{ 
                      scale: [1, 1.8, 1],
                      opacity: [1, 0.3, 1]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-5xl"
                  >
                    🔥
                  </motion.span>
                </div>
              </motion.button>
              
              <motion.div 
                className="mt-16 space-y-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-2xl text-red-300 max-w-3xl mx-auto font-bold">
                  ⚠️ WARNING: Once the gates of hell close, there's no return ⚠️
                </p>
                <div className="flex justify-center items-center gap-6 text-red-400">
                  <motion.span
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👁️
                  </motion.span>
                  <span className="font-bold text-xl">THE DEAD ARE WATCHING</span>
                  <motion.span
                    animate={{ 
                      rotate: [0, -360],
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    👁️
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Horror Footer */}
        <footer className="py-20 px-4 border-t-2 border-red-800/50 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
              >
                RaveYard 2025 - The Final Dance
              </motion.div>
              
              <div className="flex justify-center gap-12 text-red-300">
                {[
                  { icon: "💀", text: "#RaveYard2025" },
                  { icon: "🩸", text: "@raveyard_crypt" },
                  { icon: "⚰️", text: "Join the Undead Legion" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 cursor-pointer"
                    whileHover={{ 
                      scale: 1.2, 
                      color: "#dc2626",
                      textShadow: "0 0 10px #dc2626"
                    }}
                    animate={{
                      y: [0, -5, 0]
                    }}
                    transition={{
                      y: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                    }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-bold text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="border-t border-red-800/30 pt-8 space-y-4">
                <p className="text-red-300 text-lg">© 2025 RaveYard. All souls belong to the underworld.</p>
                <p className="text-red-400 text-sm opacity-80 font-light">
                  "Where the living dance with the dead, and nightmares become reality"
                </p>
                <div className="flex justify-center gap-6 mt-6">
                  {['💀', '👻', '🦇', '🕷️', '⚰️', '🧟‍♂️'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="text-3xl opacity-60"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Horror ambient sounds indicator */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 bg-red-900/80 backdrop-blur-sm border-2 border-red-600 rounded-full p-4 cursor-pointer"
        whileHover={{ 
          scale: 1.2,
          boxShadow: "0 0 30px rgba(220, 38, 38, 0.8)"
        }}
        animate={{
          boxShadow: [
            "0 0 10px rgba(220, 38, 38, 0.3)",
            "0 0 25px rgba(220, 38, 38, 0.8)",
            "0 0 10px rgba(220, 38, 38, 0.3)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-2xl"
        >
          🔊
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HorrorRaveYardPage;