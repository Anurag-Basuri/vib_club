import { useState, useEffect, useMemo, useRef } from 'react';
import { useGetAllEvents } from '../hooks/useEvents.js';
import EventCard from '../components/event/EventCard.jsx';
import EventFilter from '../components/event/EventFilter.jsx';
import LoadingSpinner from '../components/event/LoadingSpinner.jsx';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

// Enhanced floating elements with more interaction
const FloatingElements = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Parallax background orbs */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-float-slow" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute -bottom-1/2 -left-1/2 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-float-slow" 
        style={{ animationDelay: '2s' }} 
      />
      
      {/* Interactive particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 1, 0.2],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Dynamic typing effect for hero text
const TypedText = ({ texts, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.substring(0, displayText.length + 1));
        if (displayText === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(current.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Enhanced Hero section
const HeroSection = ({ events, loading }) => {
  const upcomingCount = events?.filter(e => new Date(e.date) > new Date()).length || 0;
  const ongoingCount = events?.filter(e => e.status === 'ongoing').length || 0;
  const pastCount = events?.filter(e => new Date(e.date) < new Date() && e.status !== 'ongoing').length || 0;

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      ref={heroRef}
      style={{ scale, opacity }}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden"
    >
      <FloatingElements />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute inset-0 bg-mesh-gradient" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        {/* Main title with creative typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              VIB
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 ml-4">
              CLUB
            </span>
          </h1>
          <div className="text-lg md:text-xl text-blue-300 font-light tracking-wider">
            Where 
            <TypedText 
              texts={['Innovation', 'Creativity', 'Inspiration', 'Connection']} 
              className="text-cyan-300 font-medium mx-2"
            />
            Happens
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl font-light mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed"
        >
          Discover events that challenge your mind, expand your network, and transform your journey into something extraordinary.
        </motion.p>

        {/* Simplified Stats - Only show if events exist */}
        {!loading && events && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-12 max-w-md mx-auto"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass-card-success p-4 rounded-2xl text-center"
            >
              <div className="text-2xl font-bold text-green-300">{upcomingCount}</div>
              <div className="text-xs text-green-200">Upcoming</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass-card-error p-4 rounded-2xl text-center"
            >
              <div className="text-2xl font-bold text-red-300">{ongoingCount}</div>
              <div className="text-xs text-red-200">Live Now</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass-card p-4 rounded-2xl text-center"
            >
              <div className="text-2xl font-bold text-purple-300">{pastCount}</div>
              <div className="text-xs text-purple-200">Completed</div>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            onClick={scrollToEvents}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
              rotate: [0, 1, -1, 0]
            }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Explore Events</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 glass-card text-white rounded-2xl font-bold text-lg hover-lift transition-all duration-300 relative group"
          >
            <span className="relative z-10">Join Community</span>
            <motion.div
              className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              initial={false}
            />
          </motion.button>
        </motion.div>

        {/* Creative scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToEvents}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center relative group"
          >
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-4 bg-gradient-to-b from-white/50 to-cyan-300/50 rounded-full mt-2"
            />
            <div className="absolute -bottom-8 text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Scroll to explore
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced section titles with better icons
const sectionTitles = {
  ongoing: { title: 'Live Events', emoji: '🎬', gradient: 'from-red-400 to-orange-400' },
  upcoming: { title: 'Coming Soon', emoji: '🚀', gradient: 'from-blue-400 to-cyan-400' },
  past: { title: 'Event Archive', emoji: '🏆', gradient: 'from-purple-400 to-pink-400' },
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

// Enhanced event section with better animations
const EventSection = ({ sectionKey, events, emptyMessage }) => {
  const section = sectionTitles[sectionKey];
  
  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 mb-12"
      >
        <motion.span 
          whileHover={{ scale: 1.2, rotate: 10 }}
          className="text-4xl"
        >
          {section.emoji}
        </motion.span>
        <h2 className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${section.gradient}`}>
          {section.title}
        </h2>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"
        />
        <span className="text-sm text-gray-400 font-medium">{events.length}</span>
      </motion.div>

      {events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-16 rounded-3xl text-center hover-lift transition-all duration-300 group"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-8xl mb-6 opacity-50 group-hover:opacity-70 transition-opacity"
          >
            {section.emoji}
          </motion.div>
          <p className="text-xl text-gray-300 group-hover:text-gray-200 transition-colors">
            {emptyMessage}
          </p>
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
                viewport={{ once: true, margin: "-50px" }}
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

  useEffect(() => {
    getAllEvents();
    // eslint-disable-next-line
  }, []);

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
          className="glass-card-error p-12 text-center max-w-lg w-full rounded-3xl"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            ⚠️
          </motion.div>
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
      {/* Hero Section */}
      <HeroSection events={events} loading={loading} />

      {/* Events Section */}
      <div id="events-section" className="relative">
        <FloatingElements />
        <div className="container mx-auto px-6 py-20 relative z-10">
          
          {/* Enhanced Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sticky top-6 z-30 mb-20"
          >
            <div className="glass-card p-8 rounded-3xl">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Enhanced Search */}
                <div className="relative w-full lg:w-auto group">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  >
                    <svg className="w-6 h-6 text-blue-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.div>
                  <input
                    type="text"
                    placeholder="Search events, venues, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 w-full lg:w-96 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg hover:bg-white/10"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      ✕
                    </motion.button>
                  )}
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
              className="glass-card p-20 rounded-3xl text-center max-w-2xl mx-auto"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl mb-8"
              >
                🔍
              </motion.div>
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
    </div>
  );
};

export default EventPage;
