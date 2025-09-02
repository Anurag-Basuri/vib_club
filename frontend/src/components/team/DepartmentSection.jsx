import React from 'react';
import { motion } from 'framer-motion';
import UnifiedTeamCard from './UnifiedTeamCard';
import { ChevronRight, Sparkles } from 'lucide-react';

const DepartmentSection = ({ department, members, onClick, isAuthenticated }) => {
    // Sort members to show heads first, then alphabetically by designation
    const sortedMembers = [...members].sort((a, b) => {
        // Head designation comes first
        if (a.designation === 'Head' && b.designation !== 'Head') return -1;
        if (b.designation === 'Head' && a.designation !== 'Head') return 1;
        // Then sort alphabetically by designation
        return a.designation.localeCompare(b.designation);
    });

    return (
        <motion.div
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Department Header - Enhanced Mobile Design */}
            <div className="flex flex-col items-center mb-8 sm:mb-10 px-4">
                <motion.div 
                    className="relative group overflow-hidden mb-4"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {/* Enhanced background effects */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 via-blue-600/30 to-purple-600/20 
                        rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="relative flex items-center gap-3 sm:gap-4 py-3 sm:py-4 px-5 sm:px-7 
                        rounded-2xl bg-gradient-to-br from-slate-800/95 via-slate-700/90 to-slate-800/95 
                        backdrop-blur-xl border border-indigo-500/30 group-hover:border-indigo-400/50
                        shadow-xl shadow-indigo-900/20 group-hover:shadow-2xl group-hover:shadow-indigo-600/30
                        transition-all duration-500">
                        
                        {/* Animated accent bar */}
                        <motion.div 
                            className="w-1.5 sm:w-2 h-8 sm:h-10 rounded-full bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-600"
                            animate={{ 
                                boxShadow: [
                                    "0 0 10px rgba(79, 70, 229, 0.5)",
                                    "0 0 20px rgba(79, 70, 229, 0.8)",
                                    "0 0 10px rgba(79, 70, 229, 0.5)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        {/* Animated chevron */}
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ChevronRight size={18} className="text-blue-400" />
                        </motion.div>
                        
                        {/* Department title */}
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center flex-1
                            group-hover:text-blue-100 transition-colors duration-300">
                            {department}
                        </h3>
                        
                        {/* Floating sparkle */}
                        <motion.div
                            animate={{ 
                                rotate: [0, 360],
                                scale: [0.8, 1.2, 0.8]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        >
                            <Sparkles size={16} className="text-purple-400" />
                        </motion.div>
                        
                        {/* Animated overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/0 to-indigo-600/10 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>
                    </div>
                </motion.div>

                {/* Enhanced decorative element */}
                <motion.div 
                    className="relative"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 
                        filter blur-md opacity-70 rounded-full"></div>
                    
                    {/* Animated glow */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 
                            filter blur-lg opacity-50 rounded-full"
                        animate={{ 
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                </motion.div>
            </div>

            {/* Cards Grid - Enhanced Mobile-First Layout */}
            <div className="px-3 sm:px-4 lg:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                    gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
                    {sortedMembers.map((member, index) => (
                        <motion.div
                            key={member._id || index}
                            className="flex justify-center"
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ 
                                delay: index * 0.08, 
                                duration: 0.6,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                        >
                            <div className="w-full max-w-[320px]">
                                <UnifiedTeamCard
                                    member={member}
                                    delay={index * 0.02}
                                    onClick={onClick}
                                    isAuthenticated={isAuthenticated}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default DepartmentSection;
