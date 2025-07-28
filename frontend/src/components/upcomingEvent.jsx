import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const HorrorRaveYardPage = () => {
  const [bloodDrip, setBloodDrip] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(342);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [screamActive, setScreamActive] = useState(false);
  const [eyesBlinking, setEyesBlinking] = useState(false);
  const [ghostAppears, setGhostAppears] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [nightmareMode, setNightmareMode] = useState(false);
  const [cursorTrail, setCursorTrail] = useState([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
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
  
  // Enhanced horror highlights with glitch effects
  const horrorHighlights = [
    { 
      icon: "🧟‍♂️", 
      title: "Zombie DJ Sets", 
      description: "Undead DJs spinning beats from beyond the grave with blood-curdling bass drops that make the earth shake",
      color: "from-red-600 to-red-800",
      bgColor: "bg-gradient-to-br from-red-900/80 to-black/90",
      glitchColor: "red"
    },
    { 
      icon: "⚰️", 
      title: "Coffin Dance Floor", 
      description: "Dance on actual coffins with fog machines creating a graveyard atmosphere of pure terror",
      color: "from-purple-600 to-purple-800",
      bgColor: "bg-gradient-to-br from-purple-900/80 to-black/90",
      glitchColor: "purple"
    },
    { 
      icon: "🔥", 
      title: "Hell's Kitchen", 
      description: "Demonic cocktails served in skull glasses with dry ice and blood-red concoctions from the underworld",
      color: "from-orange-600 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-900/80 to-red-900/80",
      glitchColor: "orange"
    },
    { 
      icon: "👹", 
      title: "Demon Makeover", 
      description: "Professional horror makeup artists transform you into creatures of the night for eternal damnation",
      color: "from-green-600 to-green-800",
      bgColor: "bg-gradient-to-br from-green-900/80 to-black/90",
      glitchColor: "green"
    },
    { 
      icon: "🦴", 
      title: "Bone Yard VIP", 
      description: "Exclusive skeleton lounge with bone furniture and ghostly experiences reserved for the elite damned",
      color: "from-gray-600 to-gray-800",
      bgColor: "bg-gradient-to-br from-gray-900/80 to-black/90",
      glitchColor: "white"
    },
    { 
      icon: "🕷️", 
      title: "Spider Web Maze", 
      description: "Navigate through haunted corridors filled with jump scares, spooky surprises, and your worst nightmares",
      color: "from-indigo-600 to-purple-600",
      bgColor: "bg-gradient-to-br from-indigo-900/80 to-purple-900/80",
      glitchColor: "indigo"
    }
  ];
  
  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);
      setCursorTrail(prev => [
        ...prev.slice(-20),
        { x: e.clientX, y: e.clientY, id: Date.now() }
      ]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  // Enhanced scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setBloodDrip(scrollY > 100);
      setNightmareMode(scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Eyes blinking with randomness
  useEffect(() => {
    const interval = setInterval(() => {
      setEyesBlinking(true);
      setTimeout(() => setEyesBlinking(false), 150 + Math.random() * 200);
    }, 1500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);
  
  // Ghost appearances
  useEffect(() => {
    const interval = setInterval(() => {
      setGhostAppears(true);
      setTimeout(() => setGhostAppears(false), 2000);
    }, 6000 + Math.random() * 8000);
    return () => clearInterval(interval);
  }, []);
  
  // Countdown timer
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
  
  // Reduced Glitch text component
  const GlitchText = ({ children, className = "" }) => {
    const [glitchActive, setGlitchActive] = useState(false);
    useEffect(() => {
      const interval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 80);
      }, 7000 + Math.random() * 4000);
      return () => clearInterval(interval);
    }, []);
    return (
      <motion.div
        className={`relative ${className}`}
        animate={glitchActive ? {
          x: [0, -1, 1, 0],
          filter: [
            "contrast(1)",
            "contrast(1.1)",
            "contrast(0.9)",
            "contrast(1)"
          ]
        } : {}}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    );
  };
  
  // Floating particle system
  const ParticleSystem = () => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      emoji: ['💀', '🦇', '👻', '🕷️', '🩸', '⚰️', '👁️'][Math.floor(Math.random() * 7)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20
    }));
    
    return (
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-2xl opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(particle.id) * 50, 0],
              rotate: [0, 360],
              scale: [0.5, 1.5, 0.5],
              opacity: [0.1, 0.6, 0.1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </div>
    );
  };
  
  // Cursor trail component
  const CursorTrail = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {cursorTrail.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-2 h-2 bg-red-500 rounded-full"
          style={{
            left: point.x - 4,
            top: point.y - 4,
          }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
  
  // Enhanced Horror Background with parallax
  const HorrorBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Multiple layered backgrounds for depth */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black via-red-900/30 to-black"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
        />
        
        {/* Animated lightning effects */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: screamActive ? [
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 70%, rgba(255,0,0,0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            ] : "transparent"
          }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Dynamic fog with mouse interaction */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          style={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          transition={{
            backgroundPosition: {
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(139, 0, 0, 0.6) 0%, transparent 60%),
                radial-gradient(circle at 80% 20%, rgba(75, 0, 130, 0.4) 0%, transparent 60%),
                radial-gradient(circle at 40% 40%, rgba(0, 0, 0, 0.8) 0%, transparent 60%),
                radial-gradient(circle at 60% 60%, rgba(255, 0, 100, 0.2) 0%, transparent 60%)
              `,
              backgroundSize: "400% 400%"
            }}
          />
        </motion.div>
        
        {/* Interactive spider web */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1920 1080">
          <defs>
            <pattern id="spiderweb" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <motion.g
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: isHovering ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <path d="M100,10 L100,190 M10,100 L190,100 M30,30 L170,170 M170,30 L30,170" 
                      stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none"/>
                <circle cx="100" cy="100" r="4" fill="rgba(255,0,0,0.5)"/>
              </motion.g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spiderweb)"/>
        </svg>
        
        {/* Dynamic eyes with mouse tracking */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl cursor-pointer"
              style={{
                left: `${5 + i * 12}%`,
                top: `${15 + (i % 3) * 25}%`,
                transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
              }}
              animate={eyesBlinking ? {
                scaleY: [1, 0.05, 1],
                opacity: [0.8, 1, 0.8]
              } : {
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                scaleY: { duration: 0.2 },
                rotate: { duration: 3, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity, delay: i * 0.2 }
              }}
              whileHover={{
                scale: 1.5,
                textShadow: "0 0 20px #ff0000",
                filter: "drop-shadow(0 0 10px #ff0000)"
              }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              👁️
            </motion.div>
          ))}
        </div>
        
        {/* Nightmare mode overlay */}
        <AnimatePresence>
          {nightmareMode && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-red-900/50 via-black/70 to-purple-900/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
        
        {/* Ghost army */}
        <AnimatePresence>
          {ghostAppears && (
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-8xl z-20"
                  style={{
                    left: `${i * 20}%`,
                    top: `${20 + (i % 2) * 40}%`,
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ 
                    opacity: [0, 1, 0.7, 0], 
                    scale: [0, 1.5, 1.2, 0],
                    rotate: [-180, 0, 20, 180],
                    y: [0, -50, -30, -100]
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                >
                  👻
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative cursor-none">
      <ParticleSystem />
      <CursorTrail />

      {/* Custom cursor */}
      <motion.div
        className="fixed w-8 h-8 bg-red-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x + (typeof window !== 'undefined' ? window.innerWidth / 2 : 0) - 16,
          top: mousePosition.y + (typeof window !== 'undefined' ? window.innerHeight / 2 : 0) - 16,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? "#ff0000" : "#dc2626"
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Hero Section with 3D Transform */}
      <section className="relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden perspective-1000">
        <HorrorBackground />

        {/* 3D floating frame */}
        <motion.div 
          className="absolute inset-8 border-4 border-red-800/60 rounded-2xl pointer-events-none"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          animate={{
            borderColor: screamActive ? ["rgba(220, 38, 38, 0.6)", "rgba(255, 255, 255, 0.8)", "rgba(220, 38, 38, 0.6)"] : "rgba(220, 38, 38, 0.6)"
          }}
        >
          {/* Corner demons */}
          {[
            { position: "-top-4 -left-4", emoji: "👹" },
            { position: "-top-4 -right-4", emoji: "💀" },
            { position: "-bottom-4 -left-4", emoji: "🕷️" },
            { position: "-bottom-4 -right-4", emoji: "⚰️" }
          ].map((corner, i) => (
            <motion.div
              key={i}
              className={`absolute ${corner.position} text-5xl cursor-pointer`}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
                textShadow: [
                  "0 0 10px #ff0000",
                  "0 0 30px #ff0000",
                  "0 0 10px #ff0000"
                ]
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity, delay: i * 0.5 },
                textShadow: { duration: 1.5, repeat: Infinity, delay: i * 0.3 }
              }}
              whileHover={{
                scale: 2,
                rotate: 720,
                textShadow: "0 0 50px #ff0000"
              }}
            >
              {corner.emoji}
            </motion.div>
          ))}
        </motion.div>
        
        {/* Main hero content with 3D effects */}
        <motion.div 
          className="relative z-10 text-center max-w-6xl px-4"
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: "preserve-3d"
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* Dramatic title */}
            <motion.div
              className="mb-12 relative"
              animate={{
                filter: screamActive ? [
                  "drop-shadow(0 0 10px #ff0000)",
                  "drop-shadow(0 0 50px #ff0000) drop-shadow(0 0 100px #ff00ff)",
                  "drop-shadow(0 0 10px #ff0000)"
                ] : "drop-shadow(0 0 20px #ff0000)"
              }}
            >
              <GlitchText className="text-7xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-b from-red-400 via-red-600 to-black bg-clip-text text-transparent">
                RaveYard
              </GlitchText>
              
              <motion.div 
                className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-purple-500 via-red-500 to-orange-500 bg-clip-text text-transparent block mt-6"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                2025
              </motion.div>
              
              {/* Floating skull army */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-4xl md:text-6xl"
                    style={{
                      left: `${-20 + Math.random() * 140}%`,
                      top: `${-20 + Math.random() * 140}%`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [0.5, 1.2, 0.5],
                      opacity: [0.3, 0.8, 0.3],
                      x: [0, Math.sin(i) * 100, 0],
                      y: [0, Math.cos(i) * 50, 0]
                    }}
                    transition={{
                      duration: 8 + Math.random() * 4,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    💀
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <GlitchText className="text-4xl md:text-6xl lg:text-7xl text-red-400 mb-8 font-bold">
              🩸 THE HAUNTED RESURRECTION 🩸
            </GlitchText>
            
            <motion.p
              className="text-2xl md:text-3xl text-red-200 mb-20 max-w-5xl mx-auto leading-relaxed font-light"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255, 0, 0, 0.3)",
                  "0 0 20px rgba(255, 0, 0, 0.6)",
                  "0 0 10px rgba(255, 0, 0, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {eventData.description}
            </motion.p>
            
            {/* 3D Countdown with particle effects */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-24"
              style={{
                transformStyle: "preserve-3d"
              }}
            >
              {Object.entries(countdown).map(([unit, value], index) => (
                <motion.div 
                  key={unit} 
                  className="bg-gradient-to-b from-red-900/90 to-black/95 backdrop-blur-xl border-2 border-red-600/70 rounded-2xl p-8 relative overflow-hidden group cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    rotateX: -10,
                    rotateY: index % 2 === 0 ? -5 : 5
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    rotateX: 0,
                    rotateY: 0,
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 0 60px rgba(220, 38, 38, 0.8), 0 0 100px rgba(147, 51, 234, 0.4)",
                    z: 50
                  }}
                  animate={{
                    boxShadow: [
                      "0 20px 40px rgba(0, 0, 0, 0.5)",
                      "0 30px 60px rgba(220, 38, 38, 0.3)",
                      "0 20px 40px rgba(0, 0, 0, 0.5)"
                    ]
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity, delay: index * 0.2 }
                  }}
                >
                  {/* Particle burst on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    whileHover={{
                      background: [
                        "radial-gradient(circle, transparent 0%, transparent 100%)",
                        "radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 70%)",
                        "radial-gradient(circle, transparent 0%, transparent 100%)"
                      ]
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-5xl md:text-7xl font-black text-red-400 mb-3 font-mono"
                      animate={{
                        textShadow: [
                          "0 0 10px #ff0000",
                          "0 0 30px #ff0000",
                          "0 0 10px #ff0000"
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
                    >
                      {String(value).padStart(2, '0')}
                    </motion.div>
                    <div className="text-lg text-red-300 uppercase font-bold tracking-widest">{unit}</div>
                  </div>
                  
                  {/* Floating mini skulls */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-sm opacity-40"
                      style={{
                        left: `${20 + i * 25}%`,
                        top: `${10 + i * 15}%`
                      }}
                      animate={{
                        rotate: [0, 360],
                        scale: [0.5, 1, 0.5],
                        y: [0, -10, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    >
                      💀
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
            
            {/* Ultimate CTA with holographic effect */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <motion.button
                className="relative px-20 py-12 bg-gradient-to-r from-red-800 via-red-600 to-red-800 rounded-3xl font-black text-4xl md:text-5xl shadow-2xl overflow-hidden group border-4 border-red-500 cursor-pointer"
                whileHover={{ 
                  boxShadow: [
                    "0 0 60px rgba(220, 38, 38, 0.8)",
                    "0 0 120px rgba(220, 38, 38, 1), 0 0 200px rgba(147, 51, 234, 0.6)",
                    "0 0 60px rgba(220, 38, 38, 0.8)"
                  ],
                  borderColor: ["#dc2626", "#ffffff", "#dc2626"]
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  background: [
                    "linear-gradient(45deg, #991b1b, #dc2626, #991b1b)",
                    "linear-gradient(90deg, #dc2626, #ef4444, #dc2626)",
                    "linear-gradient(135deg, #991b1b, #dc2626, #991b1b)"
                  ]
                }}
                transition={{
                  background: { duration: 3, repeat: Infinity },
                  boxShadow: { duration: 0.5 },
                  borderColor: { duration: 0.5 }
                }}
              >
                {/* Holographic overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
                
                {/* Plasma effect */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 20%, rgba(255, 0, 0, 0.3) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.3) 0%, transparent 50%)",
                      "radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.3) 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 80%, rgba(255, 255, 0, 0.3) 0%, transparent 50%)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <div className="relative z-10 flex items-center gap-6">
                  <motion.span 
                    className="text-6xl"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.4, 1],
                      filter: [
                        "drop-shadow(0 0 10px #ff0000)",
                        "drop-shadow(0 0 30px #ff0000) drop-shadow(0 0 50px #ff00ff)",
                        "drop-shadow(0 0 10px #ff0000)"
                      ]
                    }}
                    transition={{ 
                      rotate: { duration: 4, repeat: Infinity },
                      scale: { duration: 2, repeat: Infinity },
                      filter: { duration: 1.5, repeat: Infinity }
                    }}
                  >
                    ⚰️
                  </motion.span>
                  <GlitchText className="font-black">ENTER THE CRYPT</GlitchText>
                  <motion.span
                    className="text-6xl"
                    animate={{ 
                      scale: [1, 1.8, 1],
                      opacity: [1, 0.3, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    💀
                  </motion.span>
                </div>
              </motion.button>
              
              {/* Button aura effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  boxShadow: [
                    "0 0 40px rgba(220, 38, 38, 0.4)",
                    "0 0 80px rgba(220, 38, 38, 0.8), 0 0 120px rgba(147, 51, 234, 0.4)",
                    "0 0 40px rgba(220, 38, 38, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Enhanced scroll indicator */}
        <motion.div
          className="absolute bottom-12 flex flex-col items-center z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          <GlitchText className="text-red-400 mb-6 text-lg font-bold animate-pulse tracking-widest">
            DESCEND TO HELL
          </GlitchText>
          <motion.div 
            className="relative w-16 h-24 rounded-full border-4 border-red-600 flex justify-center p-4 bg-black/60 backdrop-blur-lg overflow-hidden cursor-pointer"
            whileHover={{
              scale: 1.2,
              borderColor: "#ffffff",
              boxShadow: "0 0 40px rgba(220, 38, 38, 0.8)"
            }}
            animate={{
              y: [0, 10, 0],
              boxShadow: [
                "0 0 20px rgba(220, 38, 38, 0.3)",
                "0 0 40px rgba(220, 38, 38, 0.8)",
                "0 0 20px rgba(220, 38, 38, 0.3)"
              ]
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
          >
            {/* Liquid effect */}
            <motion.div 
              className="w-4 h-6 bg-gradient-to-b from-red-500 via-red-600 to-red-800 rounded-full relative"
              animate={{ 
                y: [0, 8, 0],
                scaleY: [1, 1.3, 1]
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full"
                animate={{
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.div>
            
            {/* Floating particles inside */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400 rounded-full"
                style={{
                  left: `${30 + i * 10}%`,
                  top: `${20 + i * 20}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>
      
      {/* Enhanced Horror Highlights with 3D cards */}
      <section className="py-32 px-4 relative z-10">
        <HorrorBackground />
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5 }}
          >
            <GlitchText className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-b from-red-400 via-red-600 to-black bg-clip-text text-transparent mb-8">
              CHAMBERS OF HORROR
            </GlitchText>
            <motion.p 
              className="text-3xl text-red-200 max-w-5xl mx-auto leading-relaxed font-light"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255, 0, 0, 0.3)",
                  "0 0 30px rgba(255, 0, 0, 0.6)",
                  "0 0 10px rgba(255, 0, 0, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Experience terror like never before in our haunted attractions where nightmares become reality
            </motion.p>
          </motion.div>
          
          {/* 3D Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 perspective-1000">
            {horrorHighlights.map((item, index) => (
              <motion.div
                key={index}
                className={`${item.bgColor} backdrop-blur-xl border-3 border-red-800/60 rounded-3xl p-10 relative overflow-hidden group cursor-pointer`}
                style={{
                  transformStyle: "preserve-3d",
                  rotateX: -5,
                  rotateY: index % 2 === 0 ? -3 : 3
                }}
                initial={{ 
                  opacity: 0, 
                  y: 100, 
                  rotateX: -45,
                  scale: 0.8
                }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateX: -5,
                  scale: 1
                }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -30,
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1.05,
                  borderColor: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 40px 80px rgba(220, 38, 38, 0.4), 0 0 100px rgba(147, 51, 234, 0.3)",
                  z: 100
                }}
                animate={{
                  boxShadow: [
                    "0 20px 40px rgba(0, 0, 0, 0.3)",
                    `0 25px 50px rgba(220, 38, 38, 0.2)`,
                    "0 20px 40px rgba(0, 0, 0, 0.3)"
                  ]
                }}
                transition={{
                  boxShadow: { duration: 3, repeat: Infinity, delay: index * 0.3 }
                }}
              >
                {/* Holographic background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-30`}
                  animate={{
                    background: [
                      `linear-gradient(45deg, transparent, rgba(220, 38, 38, 0.1), transparent)`,
                      `linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.1), transparent)`,
                      `linear-gradient(135deg, transparent, rgba(220, 38, 38, 0.1), transparent)`
                    ]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Plasma effect */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 20%, rgba(255, 0, 0, 0.2) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.2) 0%, transparent 50%)",
                      "radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.2) 0%, transparent 50%)"
                    ]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                
                <div className="relative z-10">
                  {/* 3D Icon */}
                  <motion.div 
                    className="text-8xl mb-8 text-center relative"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.2, 1],
                      filter: [
                        "drop-shadow(0 0 10px rgba(255, 0, 0, 0.5))",
                        "drop-shadow(0 0 30px rgba(255, 0, 0, 0.8)) drop-shadow(0 0 50px rgba(255, 255, 255, 0.3))",
                        "drop-shadow(0 0 10px rgba(255, 0, 0, 0.5))"
                      ]
                    }}
                    transition={{ 
                      rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, delay: index * 0.5 },
                      filter: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                    }}
                    whileHover={{
                      scale: 1.5,
                      rotateY: 720,
                      filter: "drop-shadow(0 0 50px rgba(255, 255, 255, 1))"
                    }}
                  >
                    {item.icon}
                    
                    {/* Icon aura */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center text-8xl opacity-30"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.1, 0.3]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {item.icon}
                    </motion.div>
                  </motion.div>
                  
                  <GlitchText className="text-3xl font-bold text-red-100 mb-6 text-center">
                    {item.title}
                  </GlitchText>
                  
                  <motion.p 
                    className="text-red-200 leading-relaxed text-center text-lg"
                    animate={{
                      textShadow: [
                        "0 0 5px rgba(255, 255, 255, 0.1)",
                        "0 0 15px rgba(255, 255, 255, 0.3)",
                        "0 0 5px rgba(255, 255, 255, 0.1)"
                      ]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {item.description}
                  </motion.p>
                </div>
                
                {/* Floating elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl opacity-40"
                      style={{
                        left: `${10 + i * 25}%`,
                        top: `${15 + (i % 2) * 60}%`
                      }}
                      animate={{
                        rotate: [0, 360],
                        scale: [0.8, 1.3, 0.8],
                        opacity: [0.2, 0.6, 0.2],
                        x: [0, Math.sin(i) * 20, 0],
                        y: [0, Math.cos(i) * 15, 0]
                      }}
                      transition={{
                        duration: 6 + Math.random() * 4,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      {['💀', '🩸', '👻', '🕷️'][i]}
                    </motion.div>
                  ))}
                </div>
                
                {/* Corner decorations */}
                {[
                  { pos: "top-4 left-4", emoji: "🔥" },
                  { pos: "top-4 right-4", emoji: "⚡" },
                  { pos: "bottom-4 left-4", emoji: "💀" },
                  { pos: "bottom-4 right-4", emoji: "👁️" }
                ].map((corner, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${corner.pos} text-xl opacity-50 group-hover:opacity-100`}
                    animate={{
                      rotate: [0, 180, 360],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  >
                    {corner.emoji}
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Ultimate Final CTA Section */}
      <section className="py-40 px-4 relative z-10">
        <HorrorBackground />
        
        <div className="max-w-6xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Apocalyptic title */}
            <motion.div
              className="relative mb-16"
              animate={{
                filter: [
                  "drop-shadow(0 0 20px #ff0000)",
                  "drop-shadow(0 0 60px #ff0000) drop-shadow(0 0 100px #ff00ff)",
                  "drop-shadow(0 0 20px #ff0000)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <GlitchText className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-b from-red-400 via-red-600 to-black bg-clip-text text-transparent">
                BOOK YOUR DAMNATION
              </GlitchText>
              
              {/* Floating demons around title */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-6xl"
                    style={{
                      left: `${-10 + Math.random() * 120}%`,
                      top: `${-30 + Math.random() * 160}%`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [0.5, 1.5, 0.5],
                      opacity: [0.3, 0.8, 0.3],
                      x: [0, Math.sin(i) * 150, 0],
                      y: [0, Math.cos(i) * 100, 0]
                    }}
                    transition={{
                      duration: 10 + Math.random() * 5,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    {['👹', '💀', '👻', '🔥', '⚡', '🩸', '👁️', '⚰️'][i]}
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Advanced progress bar */}
            <div className="mb-20">
              <div className="flex justify-between items-center mb-6">
                <GlitchText className="text-red-400 font-bold text-2xl">
                  {spotsLeft} SOULS REMAINING
                </GlitchText>
                <GlitchText className="text-purple-400 font-bold text-2xl">
                  666 TOTAL CAPACITY
                </GlitchText>
              </div>
              
              <motion.div 
                className="w-full h-8 bg-black/80 rounded-full overflow-hidden border-3 border-red-600 relative cursor-pointer"
                whileHover={{
                  scale: 1.02,
                  borderColor: "#ffffff",
                  boxShadow: "0 0 40px rgba(220, 38, 38, 0.8)"
                }}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 relative overflow-hidden"
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${Math.floor((666 - spotsLeft) / 666 * 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 4, ease: "easeOut" }}
                >
                  {/* Liquid effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Bubbles effect */}
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/60 rounded-full"
                      style={{
                        left: `${i * 10}%`,
                        bottom: `${Math.random() * 100}%`
                      }}
                      animate={{
                        y: [-20, -40, -20],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </motion.div>
                
                {/* Danger indicators */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="text-white font-bold text-lg tracking-widest"
                    animate={{
                      opacity: [1, 0.5, 1],
                      textShadow: [
                        "0 0 10px #ffffff",
                        "0 0 20px #ff0000",
                        "0 0 10px #ffffff"
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    HELL IS FILLING UP FAST
                  </motion.span>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center mt-6"
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 10px #ff0000",
                    "0 0 30px #ff0000",
                    "0 0 10px #ff0000"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-red-400 text-2xl font-bold">⚠️ WARNING ⚠️</span>
              </motion.div>
            </div>
            
            {/* Ultimate CTA Button */}
            <motion.div
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.button
                className="relative px-24 py-16 bg-gradient-to-r from-red-800 via-red-600 to-red-800 rounded-3xl font-black text-5xl md:text-6xl shadow-2xl overflow-hidden group border-4 border-red-500 cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  rotateX: -10
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotateX: 0,
                  boxShadow: [
                    "0 0 100px rgba(220, 38, 38, 1)",
                    "0 0 200px rgba(220, 38, 38, 1), 0 0 300px rgba(147, 51, 234, 0.8)",
                    "0 0 100px rgba(220, 38, 38, 1)"
                  ],
                  borderColor: ["#dc2626", "#ffffff", "#dc2626"],
                  y: -20
                }}
                whileTap={{ scale: 0.95, rotateX: -5 }}
                animate={{
                  background: [
                    "linear-gradient(45deg, #991b1b, #dc2626, #991b1b)",
                    "linear-gradient(90deg, #dc2626, #ef4444, #dc2626)",
                    "linear-gradient(135deg, #991b1b, #dc2626, #991b1b)",
                    "linear-gradient(180deg, #dc2626, #991b1b, #dc2626)"
                  ],
                  boxShadow: [
                    "0 20px 60px rgba(0, 0, 0, 0.5)",
                    "0 30px 80px rgba(220, 38, 38, 0.4)",
                    "0 20px 60px rgba(0, 0, 0, 0.5)"
                  ]
                }}
                transition={{
                  background: { duration: 4, repeat: Infinity, ease: "linear" },
                  boxShadow: { duration: 3, repeat: Infinity },
                  hover: { duration: 0.3 }
                }}
              >
                {/* Multiple holographic overlays */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ["-200%", "200%"]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ["200%", "-200%"]
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatDelay: 1.5
                  }}
                />
                
                {/* Plasma background */}
                <motion.div
                  className="absolute inset-0 opacity-40"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 20%, rgba(255, 0, 0, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 80%, rgba(255, 255, 0, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 20%, rgba(255, 100, 0, 0.4) 0%, transparent 50%)"
                    ]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="relative z-10 flex items-center gap-8">
                  <motion.span 
                    className="text-8xl"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.5, 1],
                      filter: [
                        "drop-shadow(0 0 20px #ff0000)",
                        "drop-shadow(0 0 50px #ff0000) drop-shadow(0 0 100px #ff00ff)",
                        "drop-shadow(0 0 20px #ff0000)"
                      ]
                    }}
                    transition={{ 
                      rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2.5, repeat: Infinity },
                      filter: { duration: 2, repeat: Infinity }
                    }}
                  >
                    👹
                  </motion.span>
                  
                  <GlitchText className="font-black text-5xl md:text-6xl">
                    SELL YOUR SOUL - ₹666
                  </GlitchText>
                  
                  <motion.span
                    className="text-8xl"
                    animate={{ 
                      scale: [1, 2, 1],
                      opacity: [1, 0.3, 1],
                      rotate: [0, 180, 360],
                      filter: [
                        "drop-shadow(0 0 15px #ff0000)",
                        "drop-shadow(0 0 40px #ff0000) drop-shadow(0 0 80px #ffffff)",
                        "drop-shadow(0 0 15px #ff0000)"
                      ]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🔥
                  </motion.span>
                </div>
                
                {/* Button energy field */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  animate={{
                    boxShadow: [
                      "inset 0 0 20px rgba(255, 255, 255, 0.1)",
                      "inset 0 0 60px rgba(255, 255, 255, 0.3)",
                      "inset 0 0 20px rgba(255, 255, 255, 0.1)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
              
              {/* Button aura with multiple layers */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 60px rgba(220, 38, 38, 0.5), 0 0 120px rgba(147, 51, 234, 0.3)",
                    "0 0 120px rgba(220, 38, 38, 0.8), 0 0 200px rgba(147, 51, 234, 0.6), 0 0 300px rgba(255, 255, 255, 0.2)",
                    "0 0 60px rgba(220, 38, 38, 0.5), 0 0 120px rgba(147, 51, 234, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Floating energy orbs around button */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-gradient-to-r from-red-500 to-purple-500 rounded-full"
                  style={{
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 200}px`,
                    top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 200}px`,
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [0.5, 1.5, 0.5],
                    opacity: [0.3, 1, 0.3],
                    x: [0, Math.cos(i * 60 * Math.PI / 180) * 50, 0],
                    y: [0, Math.sin(i * 60 * Math.PI / 180) * 50, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
            
            {/* Apocalyptic warnings */}
            <motion.div 
              className="mt-20 space-y-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 1.5 }}
            >
              <motion.p 
                className="text-3xl md:text-4xl text-red-300 max-w-4xl mx-auto font-bold leading-relaxed"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255, 0, 0, 0.5)",
                    "0 0 30px rgba(255, 0, 0, 0.8)",
                    "0 0 10px rgba(255, 0, 0, 0.5)"
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                ⚠️ WARNING: Once the gates of hell close, there's no return to the mortal realm ⚠️
              </motion.p>
              
              <div className="flex justify-center items-center gap-12 text-red-400">
                {[
                  { emoji: "👁️", text: "THE DEAD ARE WATCHING", delay: 0 },
                  { emoji: "⚡", text: "APOCALYPSE INCOMING", delay: 0.5 },
                  { emoji: "👁️", text: "YOUR SOUL IS MARKED", delay: 1 }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center gap-4 cursor-pointer"
                    whileHover={{
                      scale: 1.3,
                      textShadow: "0 0 20px #ff0000",
                      filter: "drop-shadow(0 0 30px #ff0000)"
                    }}
                    animate={{
                      y: [0, -10, 0],
                      textShadow: [
                        "0 0 10px rgba(255, 0, 0, 0.5)",
                        "0 0 25px rgba(255, 0, 0, 0.8)",
                        "0 0 10px rgba(255, 0, 0, 0.5)"
                      ]
                    }}
                    transition={{
                      y: { duration: 2, repeat: Infinity, delay: item.delay },
                      textShadow: { duration: 2, repeat: Infinity, delay: item.delay * 0.5 }
                    }}
                  >
                    <motion.span
                      className="text-6xl"
                      animate={{ 
                        rotate: i % 2 === 0 ? [0, 360] : [0, -360],
                        scale: [1, 1.5, 1],
                        filter: [
                          "drop-shadow(0 0 10px #ff0000)",
                          "drop-shadow(0 0 30px #ff0000) drop-shadow(0 0 50px #ffffff)",
                          "drop-shadow(0 0 10px #ff0000)"
                        ]
                      }}
                      transition={{ 
                        rotate: { duration: 4, repeat: Infinity },
                        scale: { duration: 2, repeat: Infinity, delay: item.delay },
                        filter: { duration: 1.5, repeat: Infinity, delay: item.delay * 0.7 }
                      }}
                    >
                      {item.emoji}
                    </motion.span>
                    <GlitchText className="font-bold text-xl tracking-widest">
                      {item.text}
                    </GlitchText>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced Horror Footer */}
      <footer className="py-32 px-4 border-t-4 border-red-800/60 relative z-10">
        <HorrorBackground />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-12">
            {/* Footer title with 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -45 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <GlitchText className="text-5xl md:text-7xl font-black bg-gradient-to-r from-red-400 via-red-600 to-purple-600 bg-clip-text text-transparent">
                RaveYard 2025 - The Final Dance
              </GlitchText>
            </motion.div>
            
            {/* Social links with advanced hover effects */}
            <div className="flex flex-wrap justify-center gap-16 text-red-300">
              {[
                { icon: "💀", text: "#RaveYard2025", subtitle: "Join the Hashtag of the Damned" },
                { icon: "🩸", text: "@raveyard_crypt", subtitle: "Follow us into Darkness" },
                { icon: "⚰️", text: "Join the Undead Legion", subtitle: "Become One with the Night" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                  whileHover={{ 
                    scale: 1.3,
                    y: -20,
                    textShadow: "0 0 30px #dc2626",
                    filter: "drop-shadow(0 0 40px #dc2626)"
                  }}
                  animate={{
                    y: [0, -8, 0],
                    textShadow: [
                      "0 0 10px rgba(220, 38, 38, 0.3)",
                      "0 0 25px rgba(220, 38, 38, 0.7)",
                      "0 0 10px rgba(220, 38, 38, 0.3)"
                    ]
                  }}
                  transition={{
                    y: { duration: 3, repeat: Infinity, delay: index * 0.4 },
                    textShadow: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                  }}
                >
                  <motion.span
                    className="text-5xl group-hover:text-6xl transition-all duration-300"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    {item.icon}
                  </motion.span>
                  <div className="text-center">
                    <div className="font-bold text-xl mb-2">{item.text}</div>
                    <div className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.subtitle}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Animated divider */}
            <motion.div 
              className="border-t border-red-800/40 pt-12 relative"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            >
              {/* Glowing line effect */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scaleX: [0.8, 1.2, 0.8]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="space-y-8">
                <motion.p 
                  className="text-red-300 text-2xl font-light"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(220, 38, 38, 0.3)",
                      "0 0 20px rgba(220, 38, 38, 0.6)",
                      "0 0 10px rgba(220, 38, 38, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  © 2025 RaveYard. All souls belong to the underworld.
                </motion.p>
                
                <GlitchText className="text-red-400 text-lg opacity-80 font-light max-w-3xl mx-auto leading-relaxed">
                  "Where the living dance with the dead, nightmares become reality, and the apocalypse begins at midnight"
                </GlitchText>
                
                {/* Floating emoji constellation */}
                <div className="flex justify-center gap-8 mt-12">
                  {['💀', '👻', '🦇', '🕷️', '⚰️', '🧟‍♂️', '👹', '🔥'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="text-4xl opacity-60 cursor-pointer"
                      whileHover={{
                        scale: 2,
                        opacity: 1,
                        textShadow: "0 0 30px #ff0000",
                        filter: "drop-shadow(0 0 20px #ff0000)"
                      }}
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.4, 1],
                        y: [0, -15, 0],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        rotate: { duration: 8 + i, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity, delay: i * 0.3 },
                        y: { duration: 2.5, repeat: Infinity, delay: i * 0.2 },
                        opacity: { duration: 2, repeat: Infinity, delay: i * 0.4 }
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
      
      {/* Enhanced floating sound toggle */}
      <motion.div
        className="fixed bottom-12 right-12 z-50 bg-gradient-to-r from-red-900/90 to-black/90 backdrop-blur-xl border-3 border-red-600 rounded-full p-6 cursor-pointer group"
        whileHover={{ 
          scale: 1.3,
          borderColor: "#ffffff",
          boxShadow: "0 0 60px rgba(220, 38, 38, 1), 0 0 100px rgba(147, 51, 234, 0.5)"
        }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(220, 38, 38, 0.4)",
            "0 0 40px rgba(220, 38, 38, 0.8), 0 0 60px rgba(147, 51, 234, 0.3)",
            "0 0 20px rgba(220, 38, 38, 0.4)"
          ],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          boxShadow: { duration: 2.5, repeat: Infinity },
          rotate: { duration: 4, repeat: Infinity }
        }}
        onClick={() => setSoundEnabled(!soundEnabled)}
      >
        <motion.div
          className="text-4xl relative"
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: soundEnabled ? [1, 1.2, 1] : [1, 0.8, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {soundEnabled ? "🔊" : "🔇"}
          
          {/* Sound waves animation */}
          {soundEnabled && (
            <div className="absolute -inset-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-2 border-red-500/30 rounded-full"
                  animate={{
                    scale: [1, 2, 3],
                    opacity: [0.8, 0.3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Tooltip */}
        <motion.div
          className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-black/90 text-red-300 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
          initial={{ y: 10, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
        >
          {soundEnabled ? "Mute Hell's Sounds" : "Unleash the Audio Nightmare"}
        </motion.div>
      </motion.div>
      
      {/* Screen-wide glitch overlay for special effects */}
      <AnimatePresence>
        {screamActive && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              background: [
                "transparent",
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)",
                "transparent"
              ]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HorrorRaveYardPage;