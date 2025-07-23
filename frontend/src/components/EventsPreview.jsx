import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const EventsPreview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    }
  };

  const cardVariants = {
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Upcoming Events
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join our next gatherings to learn, network, and grow with fellow tech enthusiasts.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {[
            {
              title: "AI Hackathon 2023",
              date: "Oct 15-16, 2023",
              desc: "24-hour hackathon focused on building AI solutions for real-world problems.",
              tags: ["AI", "Hackathon", "Beginner Friendly"]
            },
            {
              title: "Web3 Workshop",
              date: "Nov 3, 2023",
              desc: "Hands-on workshop exploring blockchain development and decentralized applications.",
              tags: ["Blockchain", "Workshop", "Intermediate"]
            }
          ].map((event, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              variants={cardVariants}
              className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                    {event.date}
                  </div>
                </div>
                <p className="text-blue-100 mb-6">{event.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-white/5 rounded-full text-blue-200 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg text-sm font-medium">
                    Register Now
                  </button>
                  <div className="flex items-center text-blue-300 text-sm">
                    <span>48 spots left</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            View All Events
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsPreview;