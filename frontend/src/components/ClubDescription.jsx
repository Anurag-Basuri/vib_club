// src/components/ClubDescription.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ClubDescription = () => {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 300
      } 
    }
  };

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Who We Are
              </h2>
              <p className="text-lg text-blue-100 mb-6">
                We are a passionate community of tech enthusiasts at the forefront of innovation. 
                Our mission is to bridge the gap between academic learning and real-world tech challenges.
              </p>
              <p className="text-lg text-blue-100 mb-8">
                Through workshops, hackathons, and collaborative projects, we empower students to 
                develop cutting-edge skills and build the future of technology.
              </p>
              
              <motion.div 
                className="flex flex-wrap gap-6"
                variants={containerVariants}
              >
                <motion.div 
                  variants={statVariants}
                  className="flex-1 min-w-[150px] bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20"
                >
                  <div className="text-4xl font-bold text-blue-400 mb-2">200+</div>
                  <div className="text-blue-200">Active Members</div>
                </motion.div>
                <motion.div 
                  variants={statVariants}
                  className="flex-1 min-w-[150px] bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20"
                >
                  <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
                  <div className="text-purple-200">Events Hosted</div>
                </motion.div>
                <motion.div 
                  variants={statVariants}
                  className="flex-1 min-w-[150px] bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-indigo-500/20"
                >
                  <div className="text-4xl font-bold text-indigo-400 mb-2">15</div>
                  <div className="text-indigo-200">Projects Launched</div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                What We Do
              </h2>
              
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
              >
                {[
                  {
                    title: "Skill Development",
                    desc: "Regular workshops on emerging technologies like AI, blockchain, and cloud computing.",
                    icon: "📚"
                  },
                  {
                    title: "Project Building",
                    desc: "Collaborative projects that solve real-world problems and build portfolio pieces.",
                    icon: "🚀"
                  },
                  {
                    title: "Industry Connections",
                    desc: "Guest lectures, tech talks, and networking events with industry professionals.",
                    icon: "🤝"
                  },
                  {
                    title: "Hackathons & Competitions",
                    desc: "Organize and participate in coding competitions to challenge and grow skills.",
                    icon: "💻"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="flex gap-4"
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-200 mb-1">{item.title}</h3>
                      <p className="text-blue-100">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(79, 70, 229, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-6 py-3 bg-indigo-700/30 backdrop-blur-sm border border-indigo-500/30 rounded-xl font-medium text-lg w-full"
              >
                Learn More About Us
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClubDescription;