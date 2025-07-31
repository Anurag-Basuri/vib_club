import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { name: 'Twitter', icon: <FaTwitter className="w-5 h-5" />, url: "https://twitter.com/vibrantaclub" },
    { name: 'GitHub', icon: <FaGithub className="w-5 h-5" />, url: "https://github.com/vibrantaclub" },
    { name: 'LinkedIn', icon: <FaLinkedin className="w-5 h-5" />, url: "https://linkedin.com/company/vibrantaclub" },
    { name: 'Instagram', icon: <FaInstagram className="w-5 h-5" />, url: "https://instagram.com/vibrantaclub" }
  ];

  const footerLinks = [
    {
      title: "Legal",
      items: [
        // { name: "Privacy Policy", Navigate: () => <Navigate to="/policy/privacy" /> },
        { name: "Terms and Conditions", Navigate: () => <Navigate to="/policy/terms" /> },
        { name: "Cookie Policy", Navigate: () => <Navigate to="/policy/cookie" /> }
      ]
    }
  ];

  return (
    <footer className="pt-24 pb-12 px-4 relative z-10 overflow-hidden bg-transparent">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Remove solid backgrounds, keep only subtle gradients and blurs */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-blue-900/20 to-indigo-900/0 backdrop-blur-2xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-2xl bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Vibranta Club
              </h3>
            </div>
            
            <p className="text-blue-200 mb-8 max-w-md leading-relaxed">
              Empowering the next generation of tech innovators through hands-on projects, workshops, and community building.
            </p>
            
            {/* Social links */}
            <div className="flex gap-4 mb-8">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-900/20 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-blue-800/30 transition-colors"
                  whileHover={{ 
                    y: -5,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Empty columns for spacing */}
          <div></div>
          <div></div>

          {/* Contact column */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg relative inline-block">
              Contact Us
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            </h4>
            <ul className="space-y-5 text-blue-200">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900/20 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>vibranta.studorg@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900/20 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>+91 9140253374</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-300 text-center md:text-left">
            © 2024 Vibranta Club. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            {footerLinks.map((section, index) => (
              <div key={index} className="text-blue-200">
                <h5 className="font-semibold mb-2">{section.title}</h5>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx}>
                      <item.Navigate className="hover:text-blue-400 transition-colors">
                        {item.name}
                      </item.Navigate>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <motion.div 
        className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-xl -z-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-40 left-20 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-xl -z-10"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1
        }}
      />
    </footer>
  );
};

export default Footer;