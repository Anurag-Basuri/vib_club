import React, {useEffect, useCallback} from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TeamPreview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 300
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

  const teamMembers = [
    { 
      name: "Alex Johnson", 
      role: "President",
      bio: "Computer Science Senior with a passion for AI and community building."
    },
    { 
      name: "Maya Rodriguez", 
      role: "VP of Events",
      bio: "Organizes our flagship events and workshops. UX Design expert."
    },
    { 
      name: "Chris Thompson", 
      role: "Tech Lead",
      bio: "Full-stack developer and mentor for our project teams."
    },
    { 
      name: "Taylor Kim", 
      role: "Outreach Director",
      bio: "Connects students with industry opportunities and partnerships."
    }
  ];

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
            Meet Our Core Team
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Passionate students driving innovation and community growth.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              variants={cardVariants}
              className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <div className="text-blue-400 mb-4">{member.role}</div>
                <p className="text-blue-100 text-sm">{member.bio}</p>
              </div>
              <div className="p-4 bg-black/20 border-t border-white/10">
                <button className="text-blue-300 hover:text-white text-sm font-medium flex items-center gap-2">
                  View Profile
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
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
            Meet Full Team
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamPreview;