import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HorrorRaveYardPage = () => {
  const [spotsLeft, setSpotsLeft] = useState(342);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eyesBlinking, setEyesBlinking] = useState(false);
  const [ghostAppears, setGhostAppears] = useState(false);
  const [bloodDrips, setBloodDrips] = useState([]);
  
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
  
  // Enhanced horror highlights with blood effects
  const horrorHighlights = [
    { 
      icon: "🧟‍♂️", 
      title: "Zombie DJ Sets", 
      description: "Undead DJs spinning beats from beyond the grave with blood-curdling bass drops",
      color: "from-red-600 to-red-800"
    },
    { 
      icon: "⚰️", 
      title: "Coffin Dance Floor", 
      description: "Dance on actual coffins with fog machines creating a graveyard atmosphere",
      color: "from-purple-600 to-purple-800"
    },
    { 
      icon: "🔥", 
      title: "Hell's Kitchen", 
      description: "Demonic cocktails served in skull glasses with dry ice and blood-red concoctions",
      color: "from-orange-600 to-red-600"
    },
    { 
      icon: "👹", 
      title: "Demon Makeover", 
      description: "Professional horror makeup artists transform you into creatures of the night",
      color: "from-green-600 to-green-800"
    },
    { 
      icon: "🦴", 
      title: "Bone Yard VIP", 
      description: "Exclusive skeleton lounge with bone furniture and ghostly experiences",
      color: "from-gray-600 to-gray-800"
    },
    { 
      icon: "🕷️", 
      title: "Spider Web Maze", 
      description: "Navigate through haunted corridors filled with jump scares and nightmares",
      color: "from-indigo-600 to-purple-600"
    }
  ];
  
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
  
  // Blood drip creation
  useEffect(() => {
    const interval = setInterval(() => {
      if (bloodDrips.length < 20) {
        const newDrip = {
          id: Date.now(),
          x: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 3 + Math.random() * 5
        };
        setBloodDrips(prev => [...prev, newDrip]);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [bloodDrips]);
  
  // Blood drip component
  const BloodDrips = () => (
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
            y: [0, window.innerHeight * 0.8]
          }}
          transition={{ 
            duration: drip.duration,
            delay: drip.delay,
            times: [0, 0.3, 0.7, 1]
          }}
          onAnimationComplete={() => {
            setBloodDrips(prev => prev.filter(d => d.id !== drip.id));
          }}
        >
          <motion.div 
            className="absolute bottom-0 w-4 h-4 bg-red-700 rounded-full"
            animate={{ 
              scale: [0, 1.5, 1],
              y: [0, 10, 20]
            }}
            transition={{ 
              duration: drip.duration * 0.3,
              delay: drip.duration * 0.7
            }}
          />
        </motion.div>
      ))}
    </div>
  );
  
  // Floating elements with simplified animations
  const FloatingElement = ({ delay, size, position, emoji }) => {
    return (
      <motion.div
        className={`absolute ${position} z-0 pointer-events-none`}
        initial={{ y: 0, opacity: 0.5 }}
        animate={{ 
          y: [0, -20, 0],
          x: [0, Math.random() > 0.5 ? 10 : -10, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut",
          delay
        }}
      >
        <span className={`text-${size}xl`}>{emoji}</span>
      </motion.div>
    );
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      {/* Enhanced Blood drips with rust particles */}
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
            rotate: [0, Math.random() * 360]
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 0.5
          }}
        >
          •
        </motion.div>
      ))}

      {/* Hero Section with Rust Effects */}
      <section className="relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 40%, #2d1b69 0%, #1a0630 40%, #0a0015 70%, #000000 100%)'
        }}
      >
        {/* Rust texture overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(139,0,0,0.1) 0%, transparent 70%),
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(120, 50, 20, 0.2) 10px,
                rgba(120, 50, 20, 0.2) 20px
              )
            `,
            backgroundSize: "300px 300px, 30px 30px"
          }}
        />
        
        {/* Rusty metal border effect */}
        <div className="absolute inset-8 pointer-events-none"
          style={{
            border: '4px solid transparent',
            borderImage: `linear-gradient(
              to bottom,
              #8B4513 0%,
              #5D2919 25%,
              #8B4513 50%,
              #5D2919 75%,
              #8B4513 100%
            )`,
            borderImageSlice: 1,
            filter: 'drop-shadow(0 0 10px rgba(139, 0, 0, 0.5))'
          }}
        />
        
        {/* Rusty corrosion spots */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-red-900 to-red-700 opacity-30"
            style={{
              width: `${10 + Math.random() * 50}px`,
              height: `${10 + Math.random() * 50}px`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity
            }}
          />
        ))}

        <div className="relative z-10 text-center max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Rusty text effect */}
            <motion.h1 
              className="text-6xl md:text-8xl font-black mb-6 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                RaveYard
              </span>
              <span className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-red-800 via-red-600 to-red-800 rounded-full"></span>
              
              {/* Rust texture on text */}
              <span 
                className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rust.png')] opacity-20"
                style={{ mixBlendMode: 'multiply' }}
              />
            </motion.h1>
            
            {/* Subtitle with dripping effect */}
            <motion.h2 
              className="text-4xl md:text-5xl text-red-400 mb-8 font-bold relative pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              The Haunted Resurrection
              {/* Dripping underline */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-6 mx-1 bg-gradient-to-b from-red-500 to-transparent"
                    animate={{
                      y: [0, 20, 40, 60],
                      opacity: [1, 1, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </div>
            </motion.h2>
            
            <motion.p
              className="text-xl text-red-200 mb-12 max-w-3xl mx-auto leading-relaxed relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {eventData.description}
              
              {/* Random rust spots in text */}
              {[...Array(3)].map((_, i) => (
                <span 
                  key={i}
                  className="absolute inline-block w-2 h-2 bg-red-800 rounded-full opacity-70"
                  style={{
                    left: `${15 + i * 30}%`,
                    top: `${20 + i * 10}%`
                  }}
                />
              ))}
            </motion.p>
            
            {/* Countdown timer with rusty metal look */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {Object.entries(countdown).map(([unit, value], index) => (
                <motion.div 
                  key={unit} 
                  className="relative bg-gradient-to-b from-gray-900 to-black border-b-4 border-red-900 rounded-xl p-4 overflow-hidden"
                  style={{
                    boxShadow: 'inset 0 0 10px rgba(139, 0, 0, 0.5)'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Rust texture overlay */}
                  <div 
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rust.png')] opacity-20 pointer-events-none"
                    style={{ mixBlendMode: 'overlay' }}
                  />
                  
                  {/* Rust spots */}
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
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {/* Rusty metal button */}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(220, 38, 38, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-6 relative rounded-xl font-bold text-xl shadow-lg overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, #8B4513, #5D2919)`,
                  boxShadow: `0 4px 0 #3a180d, inset 0 2px 4px rgba(255, 100, 100, 0.4)`,
                  border: '1px solid #5D2919'
                }}
              >
                {/* Button rust texture */}
                <div 
                  className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rust.png')] opacity-30 pointer-events-none"
                  style={{ mixBlendMode: 'overlay' }}
                />
                
                <div className="relative z-10 flex items-center gap-3">
                  <span>ENTER THE CRYPT</span>
                  <span>💀</span>
                </div>
                
                {/* Button drips */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-6 mx-2 bg-gradient-to-b from-red-600 to-transparent"
                      animate={{
                        y: [0, 10, 20],
                        opacity: [1, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    />
                  ))}
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator with rust */}
        <motion.div
          className="absolute bottom-8 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-red-400 mb-3 text-sm font-medium">DESCEND INTO DARKNESS</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-10 h-16 rounded-full border-2 border-red-900 flex justify-center p-2"
            style={{
              background: `linear-gradient(145deg, #2a0f06, #1a0904)`,
              boxShadow: 'inset 0 0 5px rgba(139, 0, 0, 0.5)'
            }}
          >
            <motion.div 
              className="w-2 h-3 bg-gradient-to-b from-red-500 to-red-700 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Horror Highlights */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-6">
              CHAMBERS OF HORROR
            </h2>
            <p className="text-xl text-red-300 max-w-3xl mx-auto">
              Experience terror like never before in our haunted attractions
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {horrorHighlights.map((item, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${item.color} backdrop-blur-sm border border-red-600/50 rounded-xl p-8 relative overflow-hidden`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                whileHover={{ y: -10 }}
              >
                <div className="text-6xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-red-200">{item.description}</p>
                
                {/* Blood droplet effect */}
                <motion.div
                  className="absolute top-4 right-4 w-6 h-6 bg-red-600 rounded-full"
                  animate={{
                    y: [0, 15, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Blood River Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-6">
              RIVER OF BLOOD
            </h2>
            <p className="text-xl text-red-300 max-w-3xl mx-auto">
              Cross the crimson currents to enter the underworld
            </p>
          </motion.div>
          
          <div className="relative h-64 rounded-xl overflow-hidden border-4 border-red-800/50">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-red-800/80 to-red-600/80"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
            />
            
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-8xl">🩸</span>
            </motion.div>
            
            {/* Floating bodies in blood */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: `${10 + i * 20}%`,
                  top: `${40 + (i % 2) * 30}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 15, 0, -15, 0]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              >
                {i % 2 === 0 ? '💀' : '🦴'}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Event Details */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
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
                    <div className="text-sm text-red-300 font-medium">DATE & TIME</div>
                    <div className="text-white text-xl font-medium">{eventData.date} • {eventData.time}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-red-600/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span>📍</span>
                  </div>
                  <div>
                    <div className="text-sm text-red-300 font-medium">LOCATION</div>
                    <div className="text-white text-xl font-medium">{eventData.venue}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-red-600/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span>🎟️</span>
                  </div>
                  <div>
                    <div className="text-sm text-red-300 font-medium">TICKET PRICE</div>
                    <div className="text-white text-xl font-medium">{eventData.ticketPrice}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-red-400 font-bold">{spotsLeft} SOULS LEFT</span>
                  <span className="text-red-400 font-bold">500 TOTAL</span>
                </div>
                <div className="w-full bg-gray-900/50 h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-600 to-red-800 w-2/3"></div>
                </div>
              </div>
              
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
                  <div className="text-8xl mb-6">👻</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Portal Opening</h3>
                  <p className="text-red-200">Experience the dimensional rift between worlds</p>
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
              CLAIM YOUR SOUL PASS
            </h2>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(220, 38, 38, 0.8)"
              }}
              whileTap={{ scale: 0.95 }}
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
                ⚠️ Limited to 500 souls - Once sold out, entry is sealed forever ⚠️
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 px-4 bg-gradient-to-t from-red-900/20 to-black border-t border-red-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              RaveYard 2025
            </div>
            
            <div className="flex justify-center gap-8 text-red-300">
              {[
                { icon: "📱", text: "#RaveYard2025" },
                { icon: "👻", text: "@raveyard_official" },
                { icon: "💀", text: "Join the Undead" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-red-800/30 pt-8 space-y-2">
              <p className="text-red-300">© 2025 RaveYard. All rights reserved to the underworld.</p>
              <p className="text-red-400 text-sm opacity-80">
                A ghostly rite of passage for the undead students of tomorrow
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Floating eyes */}
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
      
      {/* Floating ghosts */}
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
                  y: [0, -50, -30, -100]
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
    </div>
  );
};

export default HorrorRaveYardPage;