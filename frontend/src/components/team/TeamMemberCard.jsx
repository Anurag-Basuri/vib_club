import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TeamMemberCard = ({ member, delay = 0, onClick }) => (
  <motion.div
    className="h-full group"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.5 }}
    whileHover={{ y: -10 }}
    onClick={() => onClick(member)}
  >
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-[#0a0f1f]/80 to-[#1a1f3a]/90 border border-[#3a56c9]/40 shadow-lg h-full cursor-pointer">
      <div className="flex items-center mb-4">
        <div className="relative">
          <img
            src={member?.profilePicture?.url || '/default-profile.png'}
            alt={member?.fullName}
            className="w-16 h-16 rounded-full object-cover border-3 border-[#3a56c9]/30"
            onError={(e) => {
              e.target.src = '/default-profile.png';
            }}
          />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] flex items-center justify-center shadow-lg">
            <Star size={12} className="text-white" />
          </div>
        </div>
        <div className="ml-3">
          <h4 className="text-lg font-semibold text-white group-hover:text-[#5d7df5] transition-colors">{member.fullName}</h4>
          <p className="text-[#5d7df5] text-sm">{member.designation}</p>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {member.skills?.slice(0, 3).map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-full bg-[#1a244f] text-xs text-[#9ca3d4] border border-[#2a3a72]"
          >
            {skill}
          </span>
        ))}
        {member.skills?.length > 3 && (
          <span className="px-3 py-1 rounded-full bg-[#1a244f]/60 text-xs text-[#9ca3d4]">
            +{member.skills.length - 3}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

export default TeamMemberCard;