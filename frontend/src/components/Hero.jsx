import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen flex flex-col justify-center items-center px-4 relative z-10">
        <div className="max-w-6xl w-full mx-auto text-center">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
            >
            <motion.span 
                className="text-indigo-400 font-semibold tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
            >
                Vibranta
            </motion.span>
            <motion.h1 
                className="text-5xl md:text-7xl font-bold mt-4 mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                Innovate. Collaborate. Inspire. 
            </motion.h1>
            <motion.p 
                className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
            >
                
            </motion.p>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
            <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#4f46e5' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl font-medium text-lg shadow-lg"
                onClick={() => navigate('/auth', { state: { tab: 'register' } })}
            >
                Join Our Community
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-medium text-lg"
                onClick={() => navigate('/event')}
            >
                View Events
            </motion.button>
            </motion.div>
        </div>

        <motion.div
            className="absolute bottom-12 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
        >
            <span className="text-blue-300 mb-2">Scroll to explore</span>
            <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-8 h-12 rounded-full border-2 border-blue-400 flex justify-center p-1"
            >
            <motion.div 
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            />
            </motion.div>
        </motion.div>
        </section>
    );
};

export default Hero;