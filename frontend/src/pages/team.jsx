import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Code, Briefcase, Palette, Megaphone, Mail, Linkedin, Github, Sparkles } from 'lucide-react';

// Team data structure
const teamData = {
  leadership: [
    {
      id: 'ceo',
      name: 'Alex Chen',
      role: 'Chief Executive Officer',
      bio: 'Visionary leader driving innovation in tech',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      social: { linkedin: '#', github: '#', email: 'alex@company.com' },
      level: 0
    },
    {
      id: 'cto',
      name: 'Sarah Johnson',
      role: 'Chief Technology Officer',
      bio: 'Leading technical excellence and architecture',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      social: { linkedin: '#', github: '#', email: 'sarah@company.com' },
      level: 1
    },
    {
      id: 'cmo',
      name: 'Michael Rodriguez',
      role: 'Chief Marketing Officer',
      bio: 'Crafting compelling brand narratives',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      social: { linkedin: '#', github: '#', email: 'michael@company.com' },
      level: 1
    },
    {
      id: 'coo',
      name: 'Emily Zhang',
      role: 'Chief Operations Officer',
      bio: 'Optimizing processes for maximum efficiency',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
      social: { linkedin: '#', github: '#', email: 'emily@company.com' },
      level: 1
    }
  ],
  departments: {
    technical: {
      title: 'Technical Team',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      members: [
        {
          name: 'David Kim',
          role: 'Senior Full Stack Developer',
          image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=300&h=300&fit=crop&crop=face',
          skills: ['React', 'Node.js', 'Python'],
          social: { linkedin: '#', github: '#' }
        },
        {
          name: 'Lisa Wang',
          role: 'DevOps Engineer',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
          skills: ['AWS', 'Docker', 'Kubernetes'],
          social: { linkedin: '#', github: '#' }
        },
        {
          name: 'James Wilson',
          role: 'Data Scientist',
          image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face',
          skills: ['Python', 'ML', 'TensorFlow'],
          social: { linkedin: '#', github: '#' }
        }
      ]
    },
    management: {
      title: 'Management Team',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
      members: [
        {
          name: 'Anna Thompson',
          role: 'Project Manager',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
          skills: ['Agile', 'Scrum', 'Leadership'],
          social: { linkedin: '#', github: '#' }
        },
        {
          name: 'Robert Davis',
          role: 'Product Manager',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
          skills: ['Strategy', 'Analytics', 'UX'],
          social: { linkedin: '#', github: '#' }
        }
      ]
    },
    design: {
      title: 'Design Team',
      icon: Palette,
      color: 'from-green-500 to-teal-500',
      members: [
        {
          name: 'Sophie Martinez',
          role: 'UI/UX Designer',
          image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face',
          skills: ['Figma', 'Sketch', 'Prototyping'],
          social: { linkedin: '#', github: '#' }
        },
        {
          name: 'Tom Anderson',
          role: 'Graphic Designer',
          image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face',
          skills: ['Photoshop', 'Illustrator', 'Branding'],
          social: { linkedin: '#', github: '#' }
        }
      ]
    },
    outreach: {
      title: 'Outreach Team',
      icon: Megaphone,
      color: 'from-orange-500 to-red-500',
      members: [
        {
          name: 'Maria Garcia',
          role: 'Community Manager',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
          skills: ['Social Media', 'Content', 'Engagement'],
          social: { linkedin: '#', github: '#' }
        },
        {
          name: 'Chris Brown',
          role: 'Event Coordinator',
          image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face',
          skills: ['Planning', 'Networking', 'Logistics'],
          social: { linkedin: '#', github: '#' }
        }
      ]
    }
  }
};

// Smooth scroll simulation (Lenis replacement)
const useSmoothScroll = () => {
  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      const target = e.target.getAttribute('href');
      if (target && target.startsWith('#')) {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => link.addEventListener('click', handleScroll));

    return () => {
      links.forEach(link => link.removeEventListener('click', handleScroll));
    };
  }, []);
};

// Scroll reveal hook
const useScrollReveal = () => {
  const [revealed, setRevealed] = useState(new Set());
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return revealed;
};

// Leadership Card Component
const LeadershipCard = ({ leader, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getPosition = () => {
    if (leader.level === 0) return 'mx-auto mb-12';
    return index % 2 === 0 ? 'mr-8' : 'ml-8';
  };

  return (
    <div 
      className={`relative ${getPosition()} transform transition-all duration-500 hover:scale-105 cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(leader)}
    >
      <div className={`
        relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5
        border border-white/20 shadow-2xl overflow-hidden group
        ${leader.level === 0 ? 'w-80' : 'w-72'}
        ${isHovered ? 'shadow-blue-500/25' : ''}
      `}>
        {/* Animated background gradient */}
        <div className={`
          absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        `} />
        
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
          
          {/* Social links */}
          <div className="flex space-x-3 mt-4">
            <a href={leader.social.linkedin} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Linkedin size={16} className="text-blue-400" />
            </a>
            <a href={leader.social.github} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Github size={16} className="text-white" />
            </a>
            <a href={`mailto:${leader.social.email}`} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Mail size={16} className="text-green-400" />
            </a>
          </div>
        </div>
        
        {/* Connecting lines for hierarchy */}
        {leader.level === 0 && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gradient-to-b from-blue-400 to-transparent" />
        )}
      </div>
    </div>
  );
};

// Team Member Card Component
const TeamMemberCard = ({ member, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="transform transition-all duration-500 hover:scale-105"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative p-6 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5
        border border-white/20 shadow-xl overflow-hidden group h-full
        ${isHovered ? 'shadow-cyan-500/25' : ''}
      `}>
        {/* Hover gradient */}
        <div className={`
          absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        `} />
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <img
              src={member.image}
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover border-3 border-white/30 mr-4"
            />
            <div>
              <h4 className="text-lg font-semibold text-white">{member.name}</h4>
              <p className="text-blue-300 text-sm">{member.role}</p>
            </div>
          </div>
          
          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-white/10 text-xs text-cyan-300 border border-white/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {/* Social links */}
          <div className="flex space-x-2">
            <a href={member.social.linkedin} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Linkedin size={14} className="text-blue-400" />
            </a>
            <a href={member.social.github} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Github size={14} className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Department Section Component
const DepartmentSection = ({ department, departmentKey, revealed }) => {
  const Icon = department.icon;
  const isRevealed = revealed.has(`dept-${departmentKey}`);
  
  return (
    <div
      id={`dept-${departmentKey}`}
      data-reveal
      className={`mb-16 transform transition-all duration-1000 ${
        isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      {/* Department header */}
      <div className="flex items-center justify-center mb-8">
        <div className={`
          flex items-center space-x-4 p-4 rounded-2xl backdrop-blur-xl 
          bg-gradient-to-r ${department.color} bg-opacity-20 border border-white/20
        `}>
          <Icon size={32} className="text-white" />
          <h3 className="text-2xl font-bold text-white">{department.title}</h3>
        </div>
      </div>
      
      {/* Team members grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {department.members.map((member, index) => (
          <TeamMemberCard
            key={member.name}
            member={member}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ leader, isOpen, onClose }) => {
  if (!isOpen || !leader) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-md w-full p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
        >
          ×
        </button>
        
        <div className="text-center">
          <img
            src={leader.image}
            alt={leader.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white/30 mx-auto mb-4"
          />
          <h3 className="text-2xl font-bold text-white mb-2">{leader.name}</h3>
          <p className="text-blue-300 font-medium mb-4">{leader.role}</p>
          <p className="text-gray-300 leading-relaxed">{leader.bio}</p>
        </div>
      </div>
    </div>
  );
};

// Main Component
const TeamsPage = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useSmoothScroll();
  const revealed = useScrollReveal();

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
      {/* Creative Introduction */}
      <section className="relative w-full pt-20 pb-10 px-4 flex flex-col items-center justify-center text-center">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ transform: 'translate(-50%, -50%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] shadow-lg">
              <Users size={32} className="text-white drop-shadow-lg" />
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              Meet the Vibranta Team
            </h1>
          </div>
          <p className="text-lg md:text-2xl text-gray-200 font-light mb-6">
            <Sparkles className="inline-block text-cyan-300 animate-pulse mr-2" size={20} />
            <span>
              Where <span className="font-semibold text-blue-300">creativity</span> meets <span className="font-semibold text-purple-300">technology</span> and <span className="font-semibold text-cyan-300">collaboration</span> sparks innovation.
            </span>
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-2">
            Our diverse team brings together visionaries, builders, designers, and connectors. Scroll down to discover the people powering our journey!
          </p>
          <div className="flex justify-center mt-6">
            <a href="#leadership" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
              Explore Our Leaders <ChevronDown className="animate-bounce" size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Leadership Team
          </h2>
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
      <section id="departments" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Our Departments
          </h2>
          <div className="space-y-20">
            {Object.entries(teamData.departments).map(([key, department]) => (
              <DepartmentSection
                key={key}
                department={department}
                departmentKey={key}
                revealed={revealed}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="py-14 text-center border-t border-white/10 bg-gradient-to-t from-blue-900/30 to-transparent">
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Ready to join our amazing team?
          </h3>
          <p className="text-gray-300 mb-4">
            We’re always looking for passionate innovators and collaborators.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Get in Touch!
          </a>
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