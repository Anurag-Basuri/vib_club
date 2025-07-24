import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Users, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

const UpcomingEventShowcase = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        // Simulating API call - replace with your actual API endpoint
        // const response = await axios.get('/api/events/upcoming-events');
        // const mostRecent = response.data[0];
        
        // Mock data for demonstration
        const mockEvent = {
          id: 1,
          title: "AI & Machine Learning Summit 2025",
          date: "August 15, 2025",
          time: "9:00 AM - 6:00 PM",
          venue: "Tech Innovation Center, Bangalore",
          poster: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop&crop=center",
          tags: ["AI", "Machine Learning", "Summit", "Networking"],
          spotsLeft: 127,
          totalSpots: 300,
          sponsor: {
            name: "TechCorp Solutions",
            logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center"
          },
          registrationFee: "₹2,999",
        };
        
        setTimeout(() => {
          setEvent(mockEvent);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch upcoming event:', error);
        setLoading(false);
      }
    };

    fetchUpcomingEvent();
  }, []);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <section className="py-24 px-4 relative z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen">
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
      <section className="py-24 px-4 relative z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">No Upcoming Events</h2>
          <p className="text-blue-200">Check back soon for new events!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 relative z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-indigo-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-medium tracking-wide">NEXT EVENT</span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Don't Miss Out!
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Join our most anticipated event of the season
          </p>
        </motion.div>

        {/* Main Event Card */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          whileHover="hover"
          variants={cardHoverVariants}
          className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Event Poster */}
            <motion.div 
              variants={itemVariants}
              className="relative h-64 lg:h-full min-h-[400px]"
            >
              <img 
                src={event.poster} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Sponsor Badge */}
              {event.sponsor && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                  <img 
                    src={event.sponsor.logo} 
                    alt={event.sponsor.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-gray-800 text-sm font-medium">Sponsored by {event.sponsor.name}</span>
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute bottom-4 left-4 bg-green-500/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-white font-bold">{event.registrationFee}</span>
              </div>
            </motion.div>

            {/* Event Details */}
            <motion.div variants={itemVariants} className="p-8 lg:p-10">
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {event.title}
                  </h2>
                  <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                    {event.description}
                  </p>

                  {/* Event Meta Info */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-blue-200">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium">{event.date}</div>
                        <div className="text-sm opacity-80">{event.time}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-blue-200">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="font-medium">{event.venue}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-blue-200">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="font-medium">
                        {event.spotsLeft} spots left of {event.totalSpots}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {event.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold text-lg text-white flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
                  >
                    Register Now
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300"
                  >
                    Learn More
                    <ExternalLink className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-blue-300 mb-4">
            🎯 {event.speakers} expert speakers • 🤝 Networking sessions • 🎁 Swag bags included
          </p>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(79, 70, 229, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-indigo-700/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl font-medium text-indigo-300 hover:text-white transition-all duration-300"
          >
            View All Upcoming Events →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEventShowcase;