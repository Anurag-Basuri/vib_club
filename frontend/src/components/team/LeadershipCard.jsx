import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight, LinkedinIcon, GithubIcon } from 'lucide-react';

const LeadershipCard = ({ leader, index, onClick }) => (
    <motion.div
        className="perspective"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.7 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(leader)}
    >
        <div className={`group relative w-full ${leader.level === 0 ? 'w-[280px] sm:w-[320px]' : 'w-[240px] sm:w-[280px]'}`}>
            {/* 3D rotation effect */}
            <motion.div 
                className="preserve-3d"
                whileHover={{ 
                    rotateY: [0, 5, -5, 0],
                    rotateX: [0, -5, 5, 0],
                    transition: { duration: 0.5 }
                }}
            >
                <div className="relative p-5 rounded-2xl bg-gradient-to-b from-[#161a36]/95 to-[#0f1225]/95 border border-indigo-500/30 shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 cursor-pointer overflow-hidden transform-gpu backface-hidden">
                    {/* Animated gradients */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Leader badge */}
                    {leader.level === 0 && (
                        <motion.div 
                            className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg border border-white/10"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Club Lead
                        </motion.div>
                    )}

                    <div className="flex flex-col items-center relative z-10">
                        {/* Profile image with modern styling */}
                        <div className="relative mb-5 group">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-400 blur-md opacity-50 group-hover:opacity-80 transition-opacity"></div>
                            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
                            <img
                                src={leader?.profilePicture?.url || '/default-profile.png'}
                                alt={leader?.fullName}
                                className="relative z-10 w-28 h-28 rounded-full object-cover border-2 border-white/10"
                                onError={(e) => {
                                    e.target.src = '/default-profile.png';
                                }}
                            />
                            <motion.div
                                className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg border border-white/10"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                                }}
                            >
                                <Star size={16} className="text-white" />
                            </motion.div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{leader.fullName}</h3>

                        {/* Modern designation pill */}
                        <div className="mb-3">
                            <span className="px-4 py-1.5 rounded-full bg-indigo-600/30 text-blue-200 text-sm font-medium border border-indigo-400/30">
                                {leader.designation}
                            </span>
                        </div>

                        <p className="text-white/70 text-sm text-center mb-5 max-w-[220px] line-clamp-2">
                            {leader.bio || 'Passionate leader driving innovation'}
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3 mb-5">
                            {leader.socialLinks?.some(link => link.platform.toLowerCase().includes('linkedin')) && (
                                <motion.a 
                                    href={leader.socialLinks.find(link => 
                                        link.platform.toLowerCase().includes('linkedin'))?.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-indigo-600/30 text-white hover:bg-indigo-600/60 transition-colors"
                                    whileHover={{ y: -3 }}
                                >
                                    <LinkedinIcon size={16} />
                                </motion.a>
                            )}
                            {leader.socialLinks?.some(link => link.platform.toLowerCase().includes('github')) && (
                                <motion.a 
                                    href={leader.socialLinks.find(link => 
                                        link.platform.toLowerCase().includes('github'))?.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-indigo-600/30 text-white hover:bg-indigo-600/60 transition-colors"
                                    whileHover={{ y: -3 }}
                                >
                                    <GithubIcon size={16} />
                                </motion.a>
                            )}
                        </div>

                        <motion.div
                            className="flex items-center justify-center text-blue-300 text-sm font-medium"
                            whileHover={{ x: 3 }}
                        >
                            View Profile <ChevronRight size={16} className="ml-1" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    </motion.div>
);

export default React.memo(LeadershipCard, (prevProps, nextProps) => {
    return prevProps.leader._id === nextProps.leader._id;
});
