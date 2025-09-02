import React from 'react';
import { motion } from 'framer-motion';

const TeamSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            {/* Leadership skeleton - Enhanced Mobile */}
            <div className="mb-16 sm:mb-20">
                {/* Header skeleton */}
                <div className="flex justify-center mb-8 sm:mb-10">
                    <motion.div 
                        className="h-8 sm:h-10 w-40 sm:w-56 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-xl"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
                
                {/* CEO skeleton */}
                <div className="flex justify-center mb-8">
                    <div className="w-full max-w-[320px] px-2">
                        <SkeletonCard index={0} isLeader />
                    </div>
                </div>
                
                {/* Other leadership skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 px-2">
                    {Array(3).fill(null).map((_, index) => (
                        <div key={index} className="flex justify-center">
                            <div className="w-full max-w-[320px]">
                                <SkeletonCard index={index + 1} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Department sections skeleton - Enhanced */}
            <div className="space-y-16 sm:space-y-20">
                {Array(4).fill(null).map((_, sectionIndex) => (
                    <div key={sectionIndex}>
                        {/* Department header skeleton */}
                        <div className="flex flex-col items-center mb-8 px-4">
                            <motion.div 
                                className="h-6 sm:h-8 w-32 sm:w-40 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl mb-4"
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, delay: sectionIndex * 0.2 }}
                            />
                            <motion.div 
                                className="h-1 w-16 sm:w-20 bg-gradient-to-r from-indigo-600/30 to-blue-600/30 rounded-full"
                                animate={{ scaleX: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity, delay: sectionIndex * 0.3 }}
                            />
                        </div>
                        
                        {/* Cards skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 px-3">
                            {Array(6).fill(null).map((_, cardIndex) => (
                                <div key={cardIndex} className="flex justify-center">
                                    <div className="w-full max-w-[320px]">
                                        <SkeletonCard index={sectionIndex * 6 + cardIndex} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SkeletonCard = ({ index, isLeader = false }) => (
    <motion.div
        className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-800/40 to-slate-900/40 
            border border-indigo-500/20 overflow-hidden relative ${isLeader ? 'min-h-[340px]' : 'min-h-[320px]'}
            shadow-lg shadow-indigo-900/10`}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.1 }}
    >
        {/* Enhanced shimmer effect */}
        <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent skew-x-12"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                repeatDelay: 1,
                delay: index * 0.1,
                ease: "easeInOut"
            }}
        />
        
        {/* Top accent line skeleton */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600/20 to-blue-600/20"></div>
        
        {/* Profile image skeleton - Enhanced */}
        <div className="flex justify-center mb-4 sm:mb-5">
            <motion.div 
                className={`${isLeader ? 'w-24 h-24' : 'w-20 h-20'} rounded-full bg-gradient-to-br from-indigo-600/20 to-blue-600/20 relative overflow-hidden`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
        </div>
        
        {/* Name skeleton - Enhanced */}
        <div className="flex justify-center mb-4">
            <motion.div 
                className={`h-5 ${isLeader ? 'w-36' : 'w-32'} bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-lg`}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.15 }}
            />
        </div>
        
        {/* Info card skeleton - Enhanced */}
        <div className="p-3 sm:p-4 rounded-xl bg-white/5 mb-4 flex-1">
            {/* Designation skeleton */}
            <div className="flex items-center mb-3 pb-3 border-b border-white/10">
                <motion.div 
                    className="w-6 h-6 bg-blue-600/20 rounded-lg mr-3 flex-shrink-0"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                />
                <motion.div 
                    className="h-4 w-24 bg-blue-600/20 rounded-md"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.2 }}
                />
            </div>
            
            {/* Department skeleton */}
            <div className="flex items-center">
                <motion.div 
                    className="w-6 h-6 bg-indigo-600/20 rounded-lg mr-3 flex-shrink-0"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.15 }}
                />
                <motion.div 
                    className="h-4 w-20 bg-indigo-600/20 rounded-md"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.25 }}
                />
            </div>
        </div>
        
        {/* Button skeleton - Enhanced */}
        <motion.div 
            className="h-12 w-full bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-xl"
            animate={{ 
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.02, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
        />
        
        {/* Corner decorations */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-indigo-500/10 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-50"></div>
    </motion.div>
);

export default TeamSkeleton;
