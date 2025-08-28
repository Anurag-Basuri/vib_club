import React from 'react';
import { motion } from 'framer-motion';

const StatCard = React.memo(({ icon: Icon, label, value, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-500/10 border-blue-400/20 text-blue-300',
    green: 'from-green-500/20 to-emerald-500/10 border-green-400/20 text-green-300',
    purple: 'from-purple-500/20 to-pink-500/10 border-purple-400/20 text-purple-300',
    orange: 'from-orange-500/20 to-yellow-500/10 border-orange-400/20 text-orange-300',
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center group cursor-pointer relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border`}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.1), transparent)`,
        }}
      />
      <div className="relative z-10">
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mb-3">
          <Icon className="w-6 h-6 sm:w-8 h-8 mx-auto" />
        </motion.div>
        <div className="text-xl sm:text-2xl font-bold mb-1">{value}</div>
        <div className="text-xs sm:text-sm opacity-80">{label}</div>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;