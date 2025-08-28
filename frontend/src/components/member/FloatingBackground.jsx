import React from 'react';
import { motion } from 'framer-motion';

const FloatingBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        x: [0, 30, 0],
        y: [0, -20, 0],
        rotate: [0, 180, 360],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-full blur-2xl"
    />
    <motion.div
      animate={{
        x: [0, -25, 0],
        y: [0, 15, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-purple-500/15 to-pink-500/10 rounded-full blur-2xl"
    />
    <motion.div
      animate={{
        x: [0, 20, 0],
        y: [0, -30, 0],
        scale: [1, 0.8, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-xl"
    />
  </div>
));

FloatingBackground.displayName = 'FloatingBackground';

export default FloatingBackground;