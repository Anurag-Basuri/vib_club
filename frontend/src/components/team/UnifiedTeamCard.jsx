import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Lock, Briefcase, Award } from 'lucide-react';

const UnifiedTeamCard = ({ member, delay = 0, onClick, isAuthenticated, isLeadership = false }) => {
    // Check if member is in top leadership (CEO, CTO, etc.)
    const isTopLeader = ['CEO', 'CTO', 'CMO', 'COO', 'CFO'].includes(member?.designation);
    const isCEO = member?.designation === 'CEO';
    
    return (
        <motion.div
            className={`h-full group ${isTopLeader ? 'leadership-card' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
            whileHover={{ y: -10 }}
            onClick={() => onClick(member)}
        >
            <div className={`relative h-full p-5 rounded-xl bg-gradient-to-b from-[#161a36]/80 to-[#0f1225]/90 backdrop-blur-sm 
                border ${isTopLeader ? 'border-indigo-500/40' : 'border-indigo-500/20'} 
                shadow-lg cursor-pointer group-hover:shadow-indigo-500/20 group-hover:border-indigo-400/40 
                transition-all duration-300 overflow-hidden
                ${isTopLeader ? 'shadow-lg shadow-indigo-500/10' : ''}`}
            >
                {/* Animated background elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Leader badge for CEO/CTO/etc. */}
                {isTopLeader && (
                    <motion.div 
                        className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg border border-white/10 z-20"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {isCEO ? 'Club Lead' : member.designation}
                    </motion.div>
                )}
                
                {/* Overlay corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 flex flex-col items-center">
                    {/* Profile image - styled differently based on leadership status */}
                    <div className={`relative ${isTopLeader ? 'mb-5 group' : 'group/img'}`}>
                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 blur-sm
                            ${isTopLeader ? 'opacity-70' : 'opacity-50'} 
                            ${isTopLeader ? 'group-hover:opacity-90' : 'group-hover/img:opacity-90'} transition-opacity`}
                        ></div>
                        
                        {/* Image */}
                        <img
                            src={member?.profilePicture?.url || '/default-profile.png'}
                            alt={member?.fullname}
                            className={`relative z-10 object-cover border-2 border-white/10
                                ${isTopLeader ? 'w-28 h-28 rounded-full' : 'w-14 h-14 rounded-full'}`}
                            onError={(e) => {
                                e.target.src = '/default-profile.png';
                            }}
                            loading="lazy"
                        />
                        
                        {/* Rotating star indicator */}
                        <motion.div
                            className={`absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 
                                flex items-center justify-center shadow-lg border border-white/10
                                ${isTopLeader ? 'w-8 h-8' : 'w-5 h-5'}`}
                            initial={{ rotate: 0 }}
                            animate={{ 
                                rotate: 360,
                                scale: isTopLeader ? [1, 1.1, 1] : 1
                            }}
                            transition={{ 
                                rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                                scale: isTopLeader ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}
                            }}
                        >
                            <Star size={isTopLeader ? 16 : 10} className="text-white" />
                        </motion.div>
                    </div>

                    {/* Content layout changes based on leadership status */}
                    <div className={`${isTopLeader ? 'text-center' : 'w-full ml-0 mt-3'}`}>
                        {/* Regular team member layout */}
                        {!isTopLeader && (
                            <div className="flex items-center mb-4">
                                <div className="ml-0">
                                    {/* Name */}
                                    <h4 className="text-base font-semibold text-white group-hover:text-blue-200 transition-colors line-clamp-1">
                                        {member.fullname}
                                    </h4>
                                    
                                    {/* Designation */}
                                    <p className="text-blue-300 text-xs font-medium">
                                        {member.designation}
                                    </p>
                                    
                                    {/* Department */}
                                    <div className="flex items-center mt-1">
                                        <Briefcase size={10} className="text-indigo-400 mr-1" />
                                        <p className="text-indigo-400 text-xs">
                                            {member.department}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leadership layout */}
                        {isTopLeader && (
                            <>
                                <h3 className="text-xl font-bold text-white mb-2 mt-2">{member.fullname}</h3>
                                
                                {/* Designation pill */}
                                <div className="mb-3">
                                    <span className="px-4 py-1.5 rounded-full bg-indigo-600/30 text-blue-200 text-sm font-medium border border-indigo-400/30">
                                        {member.designation}
                                    </span>
                                </div>
                                
                                {/* Department badge for leadership */}
                                <div className="mb-3 flex justify-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-blue-300 text-xs">
                                        <Briefcase size={10} className="mr-1" />
                                        {member.department}
                                    </span>
                                </div>
                            </>
                        )}

                        {/* Regular members get tags */}
                        {!isTopLeader && (
                            <>
                                {/* Department tag */}
                                <div className="mb-3">
                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-blue-300 text-xs">
                                        <Briefcase size={10} className="mr-1" />
                                        {member.department}
                                    </span>
                                </div>

                                {/* ID display */}
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

                                {/* Skills tags */}
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
                            </>
                        )}

                        {/* View profile button */}
                        <motion.div
                            className={`flex items-center ${isTopLeader ? 'justify-center' : 'justify-end'} text-blue-300 text-xs font-medium group-hover:text-blue-200 transition-colors`}
                            initial={{ x: 0 }}
                            whileHover={{ x: 3 }}
                        >
                            View Profile <ChevronRight size={14} className="ml-1" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(UnifiedTeamCard, (prevProps, nextProps) => {
    return prevProps.member._id === nextProps.member._id && 
           prevProps.isAuthenticated === nextProps.isAuthenticated;
});