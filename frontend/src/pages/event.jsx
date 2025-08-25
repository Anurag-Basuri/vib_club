import { useState, useEffect, useMemo } from 'react';
import { useGetAllEvents } from '../hooks/useEvents.js';
import EventCard from '../components/event/EventCard.jsx';
import EventFilter from '../components/event/EventFilter.jsx';
import LoadingSpinner from '../components/event/LoadingSpinner.jsx';
import { AnimatePresence, motion } from 'framer-motion';

// Floating decorative elements
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Large background orbs */}
    <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-float-slow" />
    <div className="absolute -bottom-1/2 -left-1/2 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-violet-500/15 to-pink-500/15 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '4s' }} />
    
    {/* Small floating particles */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

// Hero section with dynamic content
const HeroSection = ({ events, loading }) => {
  const upcomingCount = events?.filter(e => new Date(e.date) > new Date()).length || 0;
  const ongoingCount = events?.filter(e => e.status === 'ongoing').length || 0;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      <FloatingElements />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute inset-0 bg-mesh-gradient" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-cyan-300"
        >
          VIB CLUB
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl lg:text-3xl font-light mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed"
        >
          Where innovation meets inspiration. Discover events that challenge, 
          <span className="text-cyan-300 font-medium"> connect</span>, and 
          <span className="text-blue-300 font-medium"> transform</span> your journey.
        </motion.div>

        {/* Stats cards */}
        {!loading && events && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="glass-card-primary p-6 rounded-2xl text-center hover-lift transition-all duration-300">
              <div className="text-3xl font-bold text-blue-300 mb-2">{events.length}</div>
              <div className="text-blue-200">Total Events</div>
            </div>
            <div className="glass-card-success p-6 rounded-2xl text-center hover-lift transition-all duration-300">
              <div className="text-3xl font-bold text-green-300 mb-2">{upcomingCount}</div>
              <div className="text-green-200">Upcoming</div>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center hover-lift transition-all duration-300">
              <div className="text-3xl font-bold text-orange-300 mb-2">{ongoingCount}</div>
              <div className="text-orange-200">Live Now</div>
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 animate-pulse-glow"
          >
            Explore Events
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 glass-card text-white rounded-2xl font-bold text-lg hover-lift transition-all duration-300"
          >
            Join Community
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Enhanced section titles
const sectionTitles = {
  ongoing: { title: 'Live Events', emoji: '🔴', gradient: 'from-red-400 to-orange-400' },
  upcoming: { title: 'Coming Soon', emoji: '🚀', gradient: 'from-blue-400 to-cyan-400' },
  past: { title: 'Past Events', emoji: '📚', gradient: 'from-purple-400 to-pink-400' },
};

const categorizeEvents = (events) => {
  const now = new Date();
  const categorized = { ongoing: [], upcoming: [], past: [] };

  events.forEach((event) => {
    if (event.status === 'cancelled') return;
    const eventDate = new Date(event.date);

    if (event.status === 'ongoing' || eventDate.toDateString() === now.toDateString()) {
      categorized.ongoing.push(event);
    } else if (eventDate > now) {
      categorized.upcoming.push(event);
    } else {
      categorized.past.push(event);
    }
  });

  return categorized;
};

const EventSection = ({ sectionKey, events, emptyMessage }) => {
  const section = sectionTitles[sectionKey];
  
  return (
    <section className="mb-20">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 mb-10"
      >
        <span className="text-4xl">{section.emoji}</span>
        <h2 className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${section.gradient}`}>
          {section.title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
      </motion.div>

      {events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 rounded-3xl text-center hover-lift transition-all duration-300"
        >
          <div className="text-6xl mb-6 opacity-50">{section.emoji}</div>
          <p className="text-xl text-gray-300">{emptyMessage}</p>
        </motion.div>
      ) : (
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: 'spring',
                  damping: 15
                }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

const EventPage = () => {
  const { getAllEvents, events, loading, error } = useGetAllEvents();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    getAllEvents();
    // eslint-disable-next-line
  }, []);

  // Auto-scroll to events section after loading
  useEffect(() => {
    if (events && events.length > 0 && !loading) {
      const timer = setTimeout(() => setShowEvents(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [events, loading]);

  const categorized = useMemo(() => categorizeEvents(events || []), [events]);

  const filteredSections = useMemo(() => {
    const filterEvents = (eventsArray) => {
      if (!searchQuery) return eventsArray;
      return eventsArray.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.tags && event.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    };

    if (activeFilter === 'all') {
      return {
        ongoing: filterEvents(categorized.ongoing),
        upcoming: filterEvents(categorized.upcoming),
        past: filterEvents(categorized.past),
      };
    }

    return { [activeFilter]: filterEvents(categorized[activeFilter] || []) };
  }, [categorized, activeFilter, searchQuery]);

  const isEmpty = Object.values(filteredSections).reduce((acc, arr) => acc + arr.length, 0) === 0;
  const hasEvents = events && events.length > 0;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
        <FloatingElements />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-error p-10 text-center max-w-lg w-full rounded-3xl"
        >
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-red-200 mb-4">Unable to Load Events</h2>
          <p className="text-red-100 mb-8 leading-relaxed">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getAllEvents}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative">
      {/* Hero Section - Always show */}
      <HeroSection events={events} loading={loading} />

      {/* Events Section - Show after loading */}
      {(hasEvents || (!loading && showEvents)) && (
        <div className="relative">
          <FloatingElements />
          <div className="container mx-auto px-6 py-20 relative z-10">
            
            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="sticky top-6 z-30 mb-16"
            >
              <div className="glass-card p-8 rounded-3xl">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                  {/* Search */}
                  <div className="relative w-full lg:w-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search events, venues, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-4 w-full lg:w-96 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                    />
                  </div>

                  {/* Filter */}
                  <EventFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                </div>
              </div>
            </motion.div>

            {/* Events or Empty State */}
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : isEmpty ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-card p-16 rounded-3xl text-center max-w-2xl mx-auto"
              >
                <div className="text-8xl mb-8">🔍</div>
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No events found'}
                </h2>
                <p className="text-xl text-blue-200 mb-8 leading-relaxed">
                  {searchQuery 
                    ? 'Try adjusting your search terms or explore all events'
                    : 'New events are being planned. Check back soon!'}
                </p>
                {searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg"
                  >
                    Show All Events
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <div>
                {Object.entries(filteredSections).map(([section, eventsArr]) =>
                  eventsArr.length > 0 && (
                    <EventSection
                      key={section}
                      sectionKey={section}
                      events={eventsArr}
                      emptyMessage={`No ${sectionTitles[section].title.toLowerCase()} at the moment`}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;
