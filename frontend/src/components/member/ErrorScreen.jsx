import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';
import FloatingBackground from './FloatingBackground';

const ErrorScreen = React.memo(({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] flex items-center justify-center p-4 relative overflow-hidden">
    <FloatingBackground />
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card-error p-8 sm:p-12 text-center max-w-md w-full rounded-3xl relative z-10 border border-red-400/20"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-6xl mb-6"
      >
        ⚠️
      </motion.div>
      <h2 className="text-2xl font-bold text-red-200 mb-4">Profile Error</h2>
      <p className="text-red-100 mb-6 leading-relaxed">{error}</p>
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-xl flex items-center space-x-2 mx-auto"
      >
        <FiRefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </motion.button>
    </motion.div>
  </div>
));

ErrorScreen.displayName = 'ErrorScreen';

export default ErrorScreen;