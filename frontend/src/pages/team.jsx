import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Code, Briefcase, Palette, Megaphone, Mail, Linkedin, Github, Sparkles, Star, Award, Heart, Target, Globe, ArrowRight } from 'lucide-react';

// Enhanced Team Data Structure
const teamData = {
  leadership: [
    {
      id: 'ceo',
      name: 'Alex Chen',
      role: 'Chief Executive Officer',
      bio: 'Visionary leader driving innovation in tech with a passion for creative problem-solving',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      social: { linkedin: '#', github: '#', email: 'alex@company.com' },
      level: 0,
      quote: "Creativity is intelligence having fun"
    },
    {
      id: 'cto',
      name: 'Sarah Johnson',
      role: 'Chief Technology Officer',
      bio: 'Leading technical excellence and architecture with a focus on emerging technologies',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      social: { linkedin: '#', github: '#', email: 'sarah@company.com' },
      level: 1,
      quote: "The best way to predict the future is to invent it"
    },
    {
      id: 'cmo',
      name: 'Michael Rodriguez',
      role: 'Chief Marketing Officer',
      bio: 'Crafting compelling brand narratives that resonate with our community',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      social: { linkedin: '#', github: '#', email: 'michael@company.com' },
      level: 1,
      quote: "Marketing is no longer about the stuff you make, but the stories you tell"
    },
    {
      id: 'coo',
      name: 'Emily Zhang',
      role: 'Chief Operations Officer',
      bio: 'Optimizing processes for maximum efficiency while fostering team collaboration',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
      social: { linkedin: '#', github: '#', email: 'emily@company.com' },
      level: 1,
      quote: "Efficiency is doing things right; effectiveness is doing the right things"
    }
  ],
  departments: {
    technical: {
      title: 'Technical Team',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      description: 'Our tech wizards building innovative solutions and pushing boundaries',
      members: [
        {
          name: 'David Kim',
          role: 'Senior Full Stack Developer',
          image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=300&h=300&fit=crop&crop=face',
          skills: ['React', 'Node.js', 'Python', 'AI'],
          social: { linkedin: '#', github: '#' },
          funFact: 'Can solve a Rubik\'s cube in under 30 seconds'
        },
        {
          name: 'Lisa Wang',
          role: 'DevOps Engineer',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
          skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
          social: { linkedin: '#', github: '#' },
          funFact: 'Competitive esports player in college'
        },
        {
          name: 'James Wilson',
          role: 'Data Scientist',
          image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face',
          skills: ['Python', 'ML', 'TensorFlow', 'NLP'],
          social: { linkedin: '#', github: '#' },
          funFact: 'Won a national math competition twice'
        }
      ]
    },
    management: {
      title: 'Management Team',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
      description: 'Strategic minds organizing and executing our creative initiatives',
      members: [
        {
          name: 'Anna Thompson',
          role: 'Project Manager',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
          skills: ['Agile', 'Scrum', 'Leadership', 'Strategy'],
          social: { linkedin: '#', github: '#' },
          funFact: 'Organized the largest student hackathon in our region'
        },
        {
          name: 'Robert Davis',
          role: 'Product Manager',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
          skills: ['Strategy', 'Analytics', 'UX', 'Research'],
          social: { linkedin: '#', github: '#' },
          funFact: 'Former competitive debater with national awards'
        }
      ]
    },
    design: {
      title: 'Design Team',
      icon: Palette,
      color: 'from-green-500 to-teal-500',
      description: 'Creative visionaries shaping our visual identity and user experiences',
      members: [
        {
          name: 'Sophie Martinez',
          role: 'UI/UX Designer',
          image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face',
          skills: ['Figma', 'Sketch', 'Prototyping', 'Animation'],
          social: { linkedin: '#', github: '#' },
          funFact: 'Illustrates children\'s books in her free time'
        },
        {
          name: 'Tom Anderson',
          role: 'Graphic Designer',
          image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face',
          skills: ['Photoshop', 'Illustrator', 'Branding', 'Typography'],
          social: { linkedin: '#', github: '#' },
          funFact: 'Designed logos for 3 student startups'
        }
      ]
    },
    outreach: {
      title: 'Outreach Team',
      icon: Megaphone,
      color: 'from-orange-500 to-red-500',
      description: 'Connectors building relationships and expanding our community impact',
      members: [
        {
          name: 'Maria Garcia',
          role: 'Community Manager',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
          skills: ['Social Media', 'Content', 'Engagement', 'Networking'],
          social: { linkedin: '#', github: '#' },
          funFact: 'Speaks 4 languages fluently'
        },
        {
          name: 'Chris Brown',
          role: 'Event Coordinator',
          image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face',
          skills: ['Planning', 'Networking', 'Logistics', 'Production'],
          social: { linkedin: '#', github: '#' },
          funFact: 'Former theater director with 10+ productions'
        }
      ]
    }
  }
};

// Leadership Card Component
const LeadershipCard = ({ leader, index, onClick }) => {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.7 }}
      whileHover={{ 
        y: -10,
        scale: 1.03,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(leader)}
    >
      <div className={`
        relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5
        border border-white/20 shadow-2xl overflow-hidden cursor-pointer
        ${leader.level === 0 ? 'w-80' : 'w-72'}
      `}>
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Profile image */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={leader.image}
              alt={leader.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-1">{leader.name}</h3>
          <p className="text-blue-300 font-medium mb-3">{leader.role}</p>
          <p className="text-gray-300 text-sm text-center leading-relaxed">{leader.bio}</p>
          
          {/* Quote */}
          <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/10">
            <p className="text-xs text-gray-300 italic text-center">"{leader.quote}"</p>
          </div>
          
          {/* Social links */}
          <div className="flex space-x-3 mt-4">
            <motion.a 
              href={leader.social.linkedin} 
              className="p-2 rounded-lg bg-white/10"
              whileHover={{ scale: 1.2, backgroundColor: '#0A66C2' }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin size={16} className="text-blue-400" />
            </motion.a>
            <motion.a 
              href={leader.social.github} 
              className="p-2 rounded-lg bg-white/10"
              whileHover={{ scale: 1.2, backgroundColor: '#333' }}
              whileTap={{ scale: 0.9 }}
            >
              <Github size={16} className="text-white" />
            </motion.a>
            <motion.a 
              href={`mailto:${leader.social.email}`} 
              className="p-2 rounded-lg bg-white/10"
              whileHover={{ scale: 1.2, backgroundColor: '#EA4335' }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail size={16} className="text-green-400" />
            </motion.a>
          </div>
        </div>
        
        {/* Connecting lines for hierarchy */}
        {leader.level === 0 && (
          <motion.div 
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gradient-to-b from-blue-400 to-transparent"
            animate={{ height: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        )}
      </div>
    </motion.div>
  );
};

// Team Member Card Component
const TeamMemberCard = ({ member, delay = 0 }) => {
  return (
    <motion.div 
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ 
        y: -10,
      }}
    >
      <div className="relative p-6 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl overflow-hidden h-full">
        {/* Hover gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.4 }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="relative">
              <img
                src={member.image}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover border-3 border-white/30 mr-4"
              />
              <motion.div 
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Star size={12} className="text-white" />
              </motion.div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{member.name}</h4>
              <p className="text-blue-300 text-sm">{member.role}</p>
            </div>
          </div>
          
          {/* Fun fact */}
          <div className="mb-4 p-3 bg-black/20 rounded-lg border border-white/10">
            <p className="text-xs text-gray-300">
              <Sparkles className="inline-block mr-1 text-cyan-300" size={12} />
              {member.funFact}
            </p>
          </div>
          
          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 rounded-full bg-white/10 text-xs text-cyan-300 border border-white/20"
                  whileHover={{ scale: 1.1 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
          
          {/* Social links */}
          <div className="flex space-x-2">
            <motion.a 
              href={member.social.linkedin} 
              className="p-2 rounded-lg bg-white/10"
              whileHover={{ scale: 1.2, backgroundColor: '#0A66C2' }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin size={14} className="text-blue-400" />
            </motion.a>
            <motion.a 
              href={member.social.github} 
              className="p-2 rounded-lg bg-white/10"
              whileHover={{ scale: 1.2, backgroundColor: '#333' }}
              whileTap={{ scale: 0.9 }}
            >
              <Github size={14} className="text-white" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Department Section Component
const DepartmentSection = ({ department, departmentKey }) => {
  const Icon = department.icon;
  
  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Department header */}
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          className={`flex items-center space-x-4 p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-r ${department.color} bg-opacity-20 border border-white/20 mb-4`}
          whileHover={{ scale: 1.03 }}
        >
          <Icon size={32} className="text-white" />
          <h3 className="text-2xl font-bold text-white">{department.title}</h3>
        </motion.div>
        <p className="text-gray-300 max-w-2xl text-center">{department.description}</p>
      </div>
      
      {/* Team members grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {department.members.map((member, index) => (
          <TeamMemberCard
            key={member.name}
            member={member}
            delay={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Modal Component
const Modal = ({ leader, isOpen, onClose }) => {
  if (!isOpen || !leader) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="relative max-w-md w-full p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={e => e.stopPropagation()}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
        
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img
              src={leader.image}
              alt={leader.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white/30 mx-auto"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <Award size={16} className="text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">{leader.name}</h3>
          <p className="text-blue-300 font-medium mb-4">{leader.role}</p>
          <p className="text-gray-300 leading-relaxed mb-6">{leader.bio}</p>
          
          <div className="p-4 bg-black/20 rounded-lg border border-white/10 mb-6">
            <p className="text-sm text-gray-300 italic">"{leader.quote}"</p>
          </div>
          
          <div className="flex justify-center space-x-3">
            <motion.a 
              href={leader.social.linkedin} 
              className="p-3 rounded-lg bg-blue-500/20"
              whileHover={{ scale: 1.2, backgroundColor: '#0A66C2' }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin size={20} className="text-blue-300" />
            </motion.a>
            <motion.a 
              href={leader.social.github} 
              className="p-3 rounded-lg bg-gray-800"
              whileHover={{ scale: 1.2, backgroundColor: '#333' }}
              whileTap={{ scale: 0.9 }}
            >
              <Github size={20} className="text-white" />
            </motion.a>
            <motion.a 
              href={`mailto:${leader.social.email}`} 
              className="p-3 rounded-lg bg-red-500/20"
              whileHover={{ scale: 1.2, backgroundColor: '#EA4335' }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail size={20} className="text-red-300" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Floating Particles Background
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 10 + 2}px`,
            height: `${Math.random() * 10 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#8b5cf6' : '#0ea5e9',
            opacity: 0.3
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Main Component
const TeamsPage = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLeaderClick = (leader) => {
    setSelectedLeader(leader);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedLeader(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white overflow-x-hidden">
      <FloatingParticles />
      
      {/* Creative Introduction */}
      <section className="relative w-full pt-28 pb-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ transform: 'translate(-50%, -50%)' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] shadow-lg mb-6"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Users size={40} className="text-white drop-shadow-lg" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Meet the Vibranta Team
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 font-light mb-6 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Sparkles className="inline-block text-cyan-300 animate-pulse mr-2" size={24} />
              <span>
                Where <span className="font-semibold text-blue-300">creativity</span> meets <span className="font-semibold text-purple-300">technology</span> and <span className="font-semibold text-cyan-300">collaboration</span> sparks innovation.
              </span>
            </motion.p>
            
            <motion.p 
              className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Our diverse team brings together visionaries, builders, designers, and connectors. Scroll down to discover the people powering our journey!
            </motion.p>
            
            <motion.div 
              className="flex justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.a 
                href="#leadership" 
                className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Our Leaders</span>
                <motion.div 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <ChevronDown className="group-hover:animate-bounce" size={24} />
                </motion.div>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Leadership Team
          </motion.h2>
          
          <div className="relative">
            {/* CEO */}
            <div className="flex justify-center mb-10">
              <LeadershipCard
                leader={teamData.leadership[0]}
                index={0}
                onClick={handleLeaderClick}
              />
            </div>
            
            {/* C-Suite */}
            <div className="flex flex-wrap justify-center gap-8">
              {teamData.leadership.slice(1).map((leader, index) => (
                <LeadershipCard
                  key={leader.id}
                  leader={leader}
                  index={index + 1}
                  onClick={handleLeaderClick}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Our Departments
          </motion.h2>
          
          <div className="space-y-20">
            {Object.entries(teamData.departments).map(([key, department]) => (
              <DepartmentSection
                key={key}
                department={department}
                departmentKey={key}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="py-20 text-center border-t border-white/10 bg-gradient-to-t from-blue-900/30 to-transparent relative z-10">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-6"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Heart size={32} className="text-white" />
            </motion.div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Ready to join our creative community?
            </h3>
            
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              We're always looking for passionate innovators and collaborators to join our creative tech family.
            </p>
            
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Join Our Team</span>
              <motion.div 
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <ArrowRight className="group-hover:animate-pulse" size={20} />
              </motion.div>
            </motion.a>
          </motion.div>
        </div>
      </footer>

      {/* Modal */}
      <Modal
        leader={selectedLeader}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default TeamsPage;