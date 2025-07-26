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

// Glassy Past Event Card
const PastEventCard = ({ event, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative overflow-hidden rounded-2xl border border-blue-900/40 bg-gradient-to-br from-[#0a0f1f]/80 to-[#1a1f3a]/90 backdrop-blur-xl shadow-2xl h-full cursor-pointer"
    onClick={() => onClick(event)}
    style={{ perspective: '1000px' }}
  >
    <div className="relative h-48 overflow-hidden">
      {event.posters.length > 0 ? (
        <img
          src={event.posters[0]}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-700 to-cyan-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-900/40">
        <span className="text-sm font-medium text-cyan-200">{new Date(event.date).toLocaleDateString()}</span>
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        <span className="text-blue-200 text-sm">{event.venue}</span>
      </div>
    </div>
  </motion.div>
);

// Glassy Past Section
const PastSection = ({ pastEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-12 relative"
    >
      {/* Glassy blue background elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h2 className="text-4xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Past Events
            </span>
          </motion.h2>
        </motion.div>

        {/* Events grid */}
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {pastEvents.map((event) => (
              <PastEventCard
                key={event._id}
                event={event}
                onClick={setSelectedEvent}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-blue-900/30 to-cyan-900/30 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
          </motion.div>
        )}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[999] flex items-center justify-center p-4"
            style={{ top: 0, left: 0 }} // Ensure modal overlays everything
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#0a0f1f]/95 to-[#1a1f3a]/90 backdrop-blur-2xl rounded-2xl border border-blue-900/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white bg-blue-900/60 hover:bg-blue-800/80 backdrop-blur-sm rounded-full p-2 z-10 border border-blue-900/40"
                onClick={() => setSelectedEvent(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Event Image */}
              <div className="relative h-80">
                {selectedEvent.posters.length > 0 ? (
                  <img
                    src={selectedEvent.posters[0]}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-700 to-cyan-700 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-blue-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-900/40">
                    <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-cyan-200 font-medium">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-900/40">
                    <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-cyan-200 font-medium">
                      {selectedEvent.venue}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-6">{selectedEvent.title}</h2>
                <p className="text-blue-200 mb-8 leading-relaxed">{selectedEvent.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-cyan-300 mb-3">Organizer</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-700 to-cyan-700 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-blue-100">{selectedEvent.organizer || 'Vibranta Team'}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-cyan-300 mb-3">Event Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-sm bg-blue-900/60 text-blue-100 backdrop-blur-sm border border-blue-900/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EventPage = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await publicClient.get('api/events/getall');
        const events = response.data.data;
        const now = new Date();
        const past = events.filter(event => new Date(event.date) < now);
        setPastEvents(past);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1f] via-[#1a1f3a] to-[#0d1326]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-cyan-300">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a1f3a] to-[#0d1326] text-white overflow-hidden relative">
      {/* Glassy blue background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-900/20 filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-900/20 filter blur-3xl" />
      </div>
      {/* Make sure navbar is above modal by using z-50 or higher on navbar */}
      <div className="relative z-10 pt-24 pb-20">
        <PastSection pastEvents={pastEvents} />
      </div>
    </div>
  );
};

export default EventPage;