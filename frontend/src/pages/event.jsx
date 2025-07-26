import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicClient } from '../services/api.js';

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

const UpcomingSection = ({ upcomingEvent }) => (
  <section>
    <h2 className="text-2xl font-bold text-white mb-4">Upcoming Events</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* {upcomingEvent.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))} */}
    </div>
  </section>
);

const PastEventCard = ({ event, index }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, type: "spring" }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl h-full"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ perspective: '1000px' }}
    >
      <div className="relative h-48 overflow-hidden">
        {event.posters.length > 0 ? (
          <img 
            src={event.posters[0]} 
            alt={event.title}
            className={`w-full h-full object-cover transition-all duration-700 ${hovered ? 'scale-110' : ''}`}
          />
        ) : (
          <div className="bg-gradient-to-br from-violet-700/20 to-fuchsia-600/20 w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-sm font-medium text-white">{new Date(event.date).toLocaleDateString()}</span>
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          {event.tags.slice(0, 2).map((tag, i) => (
            <span 
              key={i}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-gray-300 text-sm">{event.venue}</span>
        </div>
        
        <p className="text-gray-300 mb-4 text-sm line-clamp-2">{event.description}</p>
        
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 border-2 border-gray-900"
                ></div>
              ))}
            </div>
            <span className="text-xs text-gray-400">{event.registrations?.length || 0} attended</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-700/30 to-fuchsia-700/30 backdrop-blur-sm border border-white/10 hover:border-violet-500/50 transition-colors"
          >
            View Gallery
          </motion.button>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-gray-300">Organized by: {event.organizer || 'Vibranta Team'}</span>
              </div>
              
              <button className="text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 rounded-lg">
                Event Recap
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PastSection = ({ pastEvents }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter events based on selection
  const filteredEvents = pastEvents.filter(event => {
    const matchesFilter = filter === 'all' || event.tags.includes(filter);
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Get unique tags for filter
  const eventTags = [...new Set(pastEvents.flatMap(event => event.tags))];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 relative"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl -z-10"></div>
      
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
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-full text-violet-300 font-semibold tracking-wider text-sm backdrop-blur-sm border border-violet-500/30">
              VIBRANTA ARCHIVES
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Past Experiences
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Relive the energy from our unforgettable gatherings
          </motion.p>
        </motion.div>
        
        {/* Filter and search section */}
        <motion.div 
          className="mb-12 bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search past events..."
                  className="w-full bg-gray-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg 
                  className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
                onClick={() => setFilter('all')}
              >
                All Events
              </motion.button>
              
              {eventTags.slice(0, 4).map(tag => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === tag 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  onClick={() => setFilter(tag)}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Events grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredEvents.map((event, index) => (
              <PastEventCard key={event._id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-violet-700/20 to-fuchsia-700/20 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try adjusting your search or filter to find what you're looking for
            </p>
            <button 
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-700/30 to-fuchsia-700/30 backdrop-blur-sm border border-white/10 text-violet-300 hover:border-violet-500/50 transition-colors"
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </motion.div>
        )}
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(192, 38, 211, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-violet-700/20 to-fuchsia-700/20 backdrop-blur-lg border border-violet-500/30 rounded-2xl font-bold text-lg text-white relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-700/30 to-fuchsia-700/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              Explore Full Archive
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const EventPage = () => {
  const [activeSection, setActiveSection] = useState('upcoming');
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvent, setUpcomingEvent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await publicClient.get('api/events/getall');
        console.log('Fetched events:', response.data.data);
        const events = response.data.data;

        const now = new Date();
        const past = events.filter(event => new Date(event.date) < now);
        const upcoming = events.filter(event => new Date(event.date) >= now);

        setPastEvents(past);
        setUpcomingEvent(upcoming[0] || null);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-violet-300">Loading Vibranta events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden relative">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(217,70,239,0.1)_0%,transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-fuchsia-600/10 filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Particle effect */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              background: `rgba(${Math.random() > 0.5 ? '139,92,246' : '217,70,239'}, ${Math.random() * 0.3 + 0.1})`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Navigation Toggle - Enhanced */}
      <motion.div
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex bg-black/30 backdrop-blur-xl rounded-2xl p-1 border border-white/10 shadow-lg">
          <motion.button
            onClick={() => setActiveSection('upcoming')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
              activeSection === 'upcoming'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeSection === 'upcoming' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Upcoming Event</span>
          </motion.button>

          <motion.button
            onClick={() => setActiveSection('past')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
              activeSection === 'past'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeSection === 'past' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Past Events</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-20">
        <AnimatePresence mode="wait">
          {activeSection === 'upcoming' && upcomingEvent && (
            <UpcomingSection key="upcoming" upcomingEvent={upcomingEvent} />
          )}

          {activeSection === 'past' && (
            <PastSection key="past" pastEvents={pastEvents} />
          )}

          {activeSection === 'upcoming' && !upcomingEvent && (
            <motion.div
              key="no-upcoming"
              className="min-h-screen flex flex-col items-center justify-center text-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-gradient-to-r from-violet-700/20 to-fuchsia-700/20 backdrop-blur-lg p-8 rounded-3xl border border-white/10 max-w-2xl">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-violet-700/20 to-fuchsia-700/20 flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No Upcoming Events</h2>
                <p className="text-gray-300 text-lg mb-8">
                  Stay tuned! We're preparing our next amazing experience for the Vibranta community.
                </p>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-medium text-white"
                  onClick={() => setActiveSection('past')}
                >
                  Explore Past Events
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventPage;