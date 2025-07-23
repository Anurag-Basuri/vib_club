import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="pt-24 pb-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-xl">Tech Innovators Club</h3>
            </div>
            <p className="text-blue-200 mb-6 max-w-md">
              Empowering students to become technology leaders through hands-on projects, workshops, and community building.
            </p>
            <div className="flex gap-4">
              {['twitter', 'github', 'linkedin', 'instagram'].map((platform) => (
                <motion.a
                  key={platform}
                  href="#"
                  whileHover={{ y: -5, color: '#818cf8' }}
                  className="text-blue-300 hover:text-white"
                >
                  <span className="sr-only">{platform}</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Events', 'Projects', 'Team', 'Join Us'].map((link) => (
                <li key={link}>
                  <motion.a 
                    href="#" 
                    className="text-blue-300 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-blue-200">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@techinnovators.club</span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Tech Building, Room 305<br />University Campus</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-blue-300">
          <p>© 2023 Tech Innovators Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;