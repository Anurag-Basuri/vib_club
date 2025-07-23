// src/pages/EventPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lenis as ReactLenis } from '@studio-freight/react-lenis';

// Event data
const upcomingEvent = {
  id: 'tech-summit-2023',
  title: 'Tech Summit 2023',
  date: 'October 15-17, 2023',
  location: 'University Innovation Center',
  description: 'Join us for the biggest tech event of the year! Three days of workshops, keynotes, and networking with industry leaders.',
  theme: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899'
  },
  highlights: [
    'Keynote by Google AI Director',
    'Blockchain Workshop',
    'Startup Pitch Competition',
    'VR Experience Zone'
  ],
  stats: {
    attendees: '1200+',
    speakers: '45+',
    workshops: '20+'
  }
};

const pastEvents = [
  {
    id: 'hackathon-2023',
    title: 'Annual Hackathon 2023',
    date: 'March 25-26, 2023',
    location: 'Tech Hub Building',
    description: '24-hour coding marathon where students built innovative solutions for real-world problems.',
    image: 'hackathon',
    tags: ['Coding', 'Innovation', 'Teamwork']
  },
  {
    id: 'ai-workshop',
    title: 'AI & ML Workshop',
    date: 'February 12, 2023',
    location: 'Computer Science Dept',
    description: 'Hands-on workshop exploring machine learning algorithms and real-world applications.',
    image: 'ai-workshop',
    tags: ['AI', 'Machine Learning', 'Workshop']
  },
  {
    id: 'web3-talk',
    title: 'Web3 Futures',
    date: 'January 18, 2023',
    location: 'Business School Auditorium',
    description: 'Panel discussion on the future of decentralized applications and blockchain technology.',
    image: 'web3',
    tags: ['Blockchain', 'Web3', 'Panel']
  },
  {
    id: 'design-challenge',
    title: 'UX Design Challenge',
    date: 'November 30, 2022',
    location: 'Design Center',
    description: 'Competition where students redesigned popular apps with improved user experiences.',
    image: 'design',
    tags: ['UX', 'Design', 'Competition']
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security Bootcamp',
    date: 'October 15, 2022',
    location: 'Engineering Building',
    description: 'Intensive training on security protocols, ethical hacking, and network protection.',
    image: 'cyber',
    tags: ['Security', 'Workshop', 'Networking']
  },
  {
    id: 'startup-fair',
    title: 'Startup Career Fair',
    date: 'September 8, 2022',
    location: 'Student Union',
    description: 'Meet founders and recruiters from the hottest tech startups in the region.',
    image: 'startup',
    tags: ['Career', 'Networking', 'Startups']
  }
];

const EventCard = ({ event, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ 
        y: -10,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
      }}
      className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-full"
    >
      <div className="h-48 bg-gray-200 border-2 border-dashed border-gray-400 rounded-t-2xl flex items-center justify-center">
        <span className="text-gray-500 font-medium">Event Image</span>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <span className="text-blue-300 text-sm bg-blue-900/30 px-2 py-1 rounded-full">
            {event.date}
          </span>
        </div>
        
        <p className="text-blue-100 mb-4 text-sm">{event.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, i) => (
            <span 
              key={i}
              className="px-3 py-1 bg-white/10 rounded-full text-blue-200 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <button className="w-full py-2 bg-blue-800/30 backdrop-blur-sm border border-blue-600/30 rounded-lg text-blue-200 font-medium hover:bg-blue-700/40 transition-colors">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set the target date (October 15, 2023)
    const targetDate = new Date('2023-10-15T09:00:00');
    
    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerId);
  }, []);

  const CountdownBox = ({ value, label }) => (
    <motion.div 
      className="flex flex-col items-center"
      whileHover={{ scale: 1.1 }}
    >
      <div className="w-20 h-20 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <span className="text-blue-200 mt-2 text-sm">{label}</span>
    </motion.div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-6 text-center">Event Starts In</h3>
      <div className="flex justify-center gap-4">
        <CountdownBox value={timeLeft.days} label="Days" />
        <CountdownBox value={timeLeft.hours} label="Hours" />
        <CountdownBox value={timeLeft.minutes} label="Minutes" />
        <CountdownBox value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

const EventPage = () => {
  const [isSticky, setIsSticky] = useState(false);
  const upcomingRef = useRef(null);
  const pastRef = useRef(null);
  
  // Register button sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] text-white overflow-x-hidden">
        {/* Fixed background elements */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:20px_20px]" />
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/10 filter blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500/15 filter blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-purple-500/12 filter blur-3xl animate-pulse-slow" />
        </div>
        
        {/* Sticky Register Button */}
        <AnimatePresence>
          {isSticky && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-medium shadow-lg flex items-center gap-2"
              >
                <span>Register Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Upcoming Event Section */}
        <section 
          ref={upcomingRef}
          className="relative z-10 min-h-screen flex flex-col"
          style={{
            background: `linear-gradient(135deg, ${upcomingEvent.theme.primary}20, ${upcomingEvent.theme.secondary}20)`,
            borderBottom: `1px solid ${upcomingEvent.theme.accent}30`
          }}
        >
          <div className="container mx-auto px-4 py-24 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 max-w-4xl"
            >
              <motion.span 
                className="text-indigo-400 font-semibold tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                UPCOMING EVENT
              </motion.span>
              
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mt-4 mb-6"
                style={{
                  background: `linear-gradient(to right, ${upcomingEvent.theme.primary}, ${upcomingEvent.theme.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {upcomingEvent.title}
              </motion.h1>
              
              <motion.div 
                className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-blue-200 text-lg">{upcomingEvent.date}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-blue-200 text-lg">{upcomingEvent.location}</span>
                </div>
              </motion.div>
              
              <motion.p 
                className="text-xl text-blue-100 max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {upcomingEvent.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: upcomingEvent.theme.primary }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-medium text-lg shadow-lg"
                  style={{
                    background: `linear-gradient(to right, ${upcomingEvent.theme.primary}, ${upcomingEvent.theme.secondary})`
                  }}
                >
                  Register Now
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Countdown Timer */}
            <CountdownTimer />
            
            {/* Event Highlights */}
            <motion.div 
              className="mt-20 w-full max-w-4xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-center mb-8 text-white">Event Highlights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvent.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
                    className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{highlight}</h3>
                        <p className="text-blue-200 text-sm">Included with your registration</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {Object.entries(upcomingEvent.stats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.0 + index * 0.1, duration: 0.6 }}
                    className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl p-6 rounded-xl text-center border border-white/10"
                  >
                    <div className="text-4xl font-bold text-white mb-2">{value}</div>
                    <div className="text-blue-200 capitalize">{key}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Past Events Section */}
        <section 
          ref={pastRef}
          className="relative z-10 py-24"
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Past Events
              </h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                Relive the excitement from our previous gatherings and workshops
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
            
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: 'rgba(79, 70, 229, 0.5)',
                  boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-indigo-700/30 backdrop-blur-sm border border-indigo-500/30 rounded-xl font-medium text-lg"
              >
                View All Past Events
              </motion.button>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-blue-300">
              © 2023 Tech Innovators Club. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ReactLenis>
  );
};

export default EventPage;