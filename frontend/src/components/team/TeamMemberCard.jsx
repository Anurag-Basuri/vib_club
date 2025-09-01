import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Lock, Briefcase } from 'lucide-react';

const TeamMemberCard = ({ member, delay = 0, onClick, isAuthenticated }) => (
    <motion.div
        className="h-full group"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1, duration: 0.5 }}
        whileHover={{ y: -10 }}
        onClick={() => onClick(member)}
    >
        <div className="relative h-full p-5 rounded-xl bg-gradient-to-b from-[#161a36]/80 to-[#0f1225]/90 backdrop-blur-sm border border-indigo-500/20 shadow-lg cursor-pointer group-hover:shadow-indigo-500/20 group-hover:border-indigo-400/40 transition-all duration-300 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Overlay corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
                <div className="flex items-center mb-4">
                    <div className="relative group/img">
                        {/* Modern image styling */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 blur-sm opacity-50 group-hover/img:opacity-90 transition-opacity"></div>
                        <img
                            src={member?.profilePicture?.url || '/default-profile.png'}
                            alt={member?.fullName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white/10 relative z-10"
                            onError={(e) => {
                                e.target.src = '/default-profile.png';
                            }}
                            loading="lazy"
                        />
                        <motion.div
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg border border-white/10"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                        >
                            <Star size={10} className="text-white" />
                        </motion.div>
                    </div>
                    <div className="ml-3">
                        {/* Name - Bigger and bolder */}
                        <h4 className="text-base font-semibold text-white group-hover:text-blue-200 transition-colors line-clamp-1">
                            {member.fullName}
                        </h4>
                        
                        {/* Designation */}
                        <p className="text-blue-300 text-xs font-medium">
                            {member.designation}
                        </p>
                        
                        {/* Department - New! */}
                        <div className="flex items-center mt-1">
                            <Briefcase size={10} className="text-indigo-400 mr-1" />
                            <p className="text-indigo-400 text-xs">
                                {member.department}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Department tag - More visible */}
                <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-blue-300 text-xs">
                        <Briefcase size={10} className="mr-1" />
                        {member.department}
                    </span>
                </div>

                {/* ID with modern design */}
                <div className="mb-3 flex items-center text-xs">
                    {isAuthenticated ? (
                        <span className="px-2 py-1 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-white">
                            ID: <span className="font-mono">{member.LpuId || 'N/A'}</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-600/10 border border-indigo-500/20 text-white/60">
                            <Lock size={10} />
                            <span>Member ID hidden</span>
                        </span>
                    )}
                </div>

                {/* Modern skill tags */}
                <div className="mb-5 flex flex-wrap gap-2">
                    {member.skills?.slice(0, 3).map((skill, idx) => (
                        <motion.span
                            key={idx}
                            className="px-2 py-1 rounded-full bg-indigo-600/20 text-xs text-blue-200 border border-indigo-500/30 group-hover:border-indigo-400/50 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            {skill}
                        </motion.span>
                    ))}
                    {member.skills?.length > 3 && (
                        <motion.span
                            className="px-2 py-1 rounded-full bg-indigo-600/10 text-xs text-blue-200/70"
                            whileHover={{ scale: 1.05 }}
                        >
                            +{member.skills.length - 3}
                        </motion.span>
                    )}
                </div>

                {/* View profile button with animation */}
                <motion.div
                    className="flex items-center justify-end text-blue-300 text-xs font-medium group-hover:text-blue-200 transition-colors"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                >
                    View Profile <ChevronRight size={14} className="ml-1" />
                </motion.div>
            </div>
        </div>
    </motion.div>
);

export default React.memo(TeamMemberCard, (prevProps, nextProps) => {
    return prevProps.member._id === nextProps.member._id && 
           prevProps.isAuthenticated === nextProps.isAuthenticated;
});
