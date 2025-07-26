import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Users, ArrowRight, ExternalLink, Sparkles, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2
    }
  }
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const UpcomingEventShowcase = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        const res = await axios.get('/api/events/upcoming-event');
        setTimeout(() => {
          setEvent(res.data.data);
          setLoading(false);
        }, 700);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUpcomingEvent();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-4 relative z-10 bg-transparent min-h-[60vh]">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-300/20 rounded-lg mb-4 w-3/4 mx-auto"></div>
            <div className="h-4 bg-blue-300/10 rounded mb-8 w-1/2 mx-auto"></div>
            <div className="bg-blue-900/30 rounded-3xl p-8 h-96"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="py-24 px-4 relative z-10 bg-transparent min-h-[60vh] flex items-center justify-center">
        <motion.div
          className="max-w-2xl mx-auto text-center bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-semibold tracking-wide uppercase">No Upcoming Events</span>
            <Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Stay Tuned!</h2>
          <p className="text-blue-200 mb-8">
            We’re preparing something exciting. Check back soon for new events and opportunities to connect!
          </p>
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(79, 70, 229, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-indigo-700/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl font-medium text-indigo-300 hover:text-white transition-all duration-300"
            onClick={() => navigate('/event')}
          >
            View All Events →
          </motion.button>
        </motion.div>
      </section>
    );
  }

  // Format date and time
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = event.time || eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // Poster (first image)
  const poster = event.posters && event.posters.length > 0 ? event.posters[0] : null;

  // Slots available
  const slots = typeof event.totalSpots === 'number'
    ? (event.totalSpots - (event.registrations ? event.registrations.length : 0))
    : null;

  return (
    <section className="py-24 px-4 relative z-10 bg-transparent min-h-[60vh] overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-semibold tracking-wide uppercase">Next Event</span>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
            {event.title}
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            {event.description}
          </p>
        </motion.div>

        {/* Main Event Card */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          whileHover="hover"
          className="bg-gradient-to-br from-blue-900/60 to-purple-900/60 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch"
        >
          {/* Poster */}
          {poster && (
            <motion.div
              variants={itemVariants}
              className="md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-800/40 to-purple-800/40"
            >
              <img
                src={poster}
                alt={event.title}
                className="object-cover w-full h-72 md:h-full rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-xl"
                style={{ maxHeight: 340 }}
              />
            </motion.div>
          )}

          {/* Event Info */}
          <motion.div
            variants={itemVariants}
            className="flex-1 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-blue-200">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">{dateStr}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <MapPin className="w-5 h-5 text-pink-400" />
                  <span className="font-medium">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="font-medium">{slots !== null ? `${slots} slots left` : 'Open slots'}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <Ticket className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">{event.ticketPrice ? `₹${event.ticketPrice}` : 'Free'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-300 font-semibold">Time:</span>
                <span className="text-white">{timeStr}</span>
              </div>
              {event.sponsor && event.sponsor !== 'Not Applicable' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-300 font-semibold">Sponsor:</span>
                  <span className="text-white">{event.sponsor}</span>
                </div>
              )}
              {event.organizer && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-300 font-semibold">Organizer:</span>
                  <span className="text-white">{event.organizer}</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.06, backgroundColor: 'rgba(99,102,241,0.18)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-700/30 border border-indigo-400/30 rounded-xl font-semibold text-indigo-200 hover:text-white transition-all duration-300 shadow-lg"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                More Info <ArrowRight className="w-5 h-5" />
              </motion.button>
              {event.posters && event.posters.length > 0 && (
                <a
                  href={poster}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-blue-800/20 border border-blue-400/20 rounded-xl font-medium text-blue-200 hover:text-white transition-all duration-300"
                >
                  View Poster <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-blue-300 mb-4">
            🎯 {event.speakers || 'Top'} expert speakers • 🤝 Networking sessions • 🎁 Swag bags included
          </p>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(79, 70, 229, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-indigo-700/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl font-medium text-indigo-300 hover:text-white transition-all duration-300"
            onClick={() => navigate('/event')}
          >
            View All Upcoming Events →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEventShowcase;