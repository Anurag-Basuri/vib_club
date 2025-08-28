import React from 'react';
import { motion } from 'framer-motion';

const MemberInfo = ({ member }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl sm:text-3xl font-bold text-white mb-2"
      >
        {member.fullname}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-blue-300 text-lg"
      >
        {member.designation
          ? member.designation.charAt(0).toUpperCase() +
            member.designation.slice(1)
          : 'Member'}{' '}
        • {member.department || 'Unassigned'}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-cyan-300 text-sm mt-1"
      >
        LPU ID: {member.LpuId}
      </motion.p>
    </div>
  );
};

export default MemberInfo;