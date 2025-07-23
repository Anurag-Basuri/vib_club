import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    tags: ['Coding', 'Innovation', 'Teamwork'],
    color: '#10b981'
  },
  {
    id: 'ai-workshop',
    title: 'AI & ML Workshop',
    date: 'February 12, 2023',
    location: 'Computer Science Dept',
    description: 'Hands-on workshop exploring machine learning algorithms and real-world applications.',
    tags: ['AI', 'Machine Learning', 'Workshop'],
    color: '#f59e0b'
  },
  {
    id: 'web3-talk',
    title: 'Web3 Futures',
    date: 'January 18, 2023',
    location: 'Business School Auditorium',
    description: 'Panel discussion on the future of decentralized applications and blockchain technology.',
    tags: ['Blockchain', 'Web3', 'Panel'],
    color: '#8b5cf6'
  },
  {
    id: 'design-challenge',
    title: 'UX Design Challenge',
    date: 'November 30, 2022',
    location: 'Design Center',
    description: 'Competition where students redesigned popular apps with improved user experiences.',
    tags: ['UX', 'Design', 'Competition'],
    color: '#ec4899'
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security Bootcamp',
    date: 'October 15, 2022',
    location: 'Engineering Building',
    description: 'Intensive training on security protocols, ethical hacking, and network protection.',
    tags: ['Security', 'Workshop', 'Networking'],
    color: '#ef4444'
  },
  {
    id: 'startup-fair',
    title: 'Startup Career Fair',
    date: 'September 8, 2022',
    location: 'Student Union',
    description: 'Meet founders and recruiters from the hottest tech startups in the region.',
    tags: ['Career', 'Networking', 'Startups'],
    color: '#06b6d4'
  }
];

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
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
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-20 h-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-white/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-700/10 rounded-2xl transform rotate-6"></div>
        <div className="relative w-full h-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
      <span className="block text-center text-indigo-300 mt-3 text-sm font-medium">{label}</span>
    </motion.div>
  );

  return (
    <motion.div 
      className="mt-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-white mb-8 text-center">Event Starts In</h3>
      <div className="flex justify-center gap-6">
        <CountdownBox value={timeLeft.days} label="Days" />
        <CountdownBox value={timeLeft.hours} label="Hours" />
        <CountdownBox value={timeLeft.minutes} label="Minutes" />
        <CountdownBox value={timeLeft.seconds} label="Seconds" />
      </div>
    </motion.div>
  );
};

const EventCard = ({ event, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, type: "spring" }}
      whileHover={{ 
        y: -15,
        rotateY: 5,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
      }}
      className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full"
      style={{ perspective: '1000px' }}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${event.color}40, ${event.color}20)`
        }}
      ></div>
      
      {/* Event image placeholder with dynamic color */}
      <div 
        className="h-48 relative overflow-hidden"
        style={{ backgroundColor: `${event.color}20` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: event.color }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <span 
            className="px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: `${event.color}80` }}
          >
            {event.date}
          </span>
        </div>
      </div>
      
      <div className="p-6 relative z-10">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-gray-300 text-sm">{event.location}</span>
        </div>
        
        <p className="text-gray-300 mb-4 text-sm leading-relaxed">{event.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.map((tag, i) => (
            <span 
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200"
              style={{ 
                color: event.color,
                borderColor: `${event.color}40`,
                backgroundColor: `${event.color}10`
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden group/btn"
          style={{
            backgroundColor: `${event.color}20`,
            color: event.color,
            border: `1px solid ${event.color}40`
          }}
        >
          <div 
            className="absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"
            style={{ backgroundColor: `${event.color}30` }}
          ></div>
          <span className="relative">View Details</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const UpcomingSection = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen flex flex-col justify-center relative"
  >
    {/* Hero Content */}
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full text-indigo-300 font-semibold tracking-wider text-sm backdrop-blur-sm border border-indigo-500/30">
            UPCOMING EVENT
          </span>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          style={{
            background: `linear-gradient(135deg, ${upcomingEvent.theme.primary}, ${upcomingEvent.theme.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {upcomingEvent.title}
        </motion.h1>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white font-medium">{upcomingEvent.date}</span>
          </div>
          
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="text-white font-medium">{upcomingEvent.location}</span>
          </div>
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {upcomingEvent.description}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold text-lg shadow-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <span className="relative flex items-center gap-2">
              Register Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
      
      <CountdownTimer />
      
      {/* Event Highlights & Stats */}
      <motion.div 
        className="mt-20 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Highlights */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Event Highlights</h2>
            <div className="space-y-4">
              {upcomingEvent.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm rounded-2xl border border-white/10 group hover:border-indigo-500/30 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">By The Numbers</h2>
            <div className="space-y-6">
              {Object.entries(upcomingEvent.stats).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
                  className="p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-white/10 group hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className="text-4xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                    {value}
                  </div>
                  <div className="text-gray-300 capitalize font-medium">{key}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

const PastSection = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen py-12"
  >
    <div className="container mx-auto px-4">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full text-emerald-300 font-semibold tracking-wider text-sm backdrop-blur-sm border border-emerald-500/30">
            PAST EVENTS
          </span>
        </motion.div>
        
        <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Previous Gatherings
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Relive the excitement from our successful events and workshops
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {pastEvents.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 15px 30px rgba(16, 185, 129, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl font-bold text-lg text-emerald-400 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative">View All Events Archive</span>
        </motion.button>
      </motion.div>
    </div>
  </motion.div>
);

const EventPage = () => {
  const [activeSection, setActiveSection] = useState('upcoming');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,119,198,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.1)_0%,transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-pink-500/5 filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Navigation Toggle */}
      <motion.div 
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex bg-black/30 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
          <motion.button
            onClick={() => setActiveSection('upcoming')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeSection === 'upcoming'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upcoming Event
          </motion.button>
          <motion.button
            onClick={() => setActiveSection('past')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeSection === 'past'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Past Events
          </motion.button>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="relative z-10 pt-24">
        <AnimatePresence mode="wait">
          {activeSection === 'upcoming' && <UpcomingSection key="upcoming" />}
          {activeSection === 'past' && <PastSection key="past" />}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/10 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2023 Tech Innovators Club. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EventPage;