import React from 'react';
import { motion } from 'framer-motion';

const TeamSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
            {/* Leadership skeleton - Mobile Optimized */}
            <div className="mb-12 sm:mb-16">
                <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="h-6 sm:h-8 w-32 sm:w-48 bg-indigo-600/10 rounded-lg"></div>
                </div>
                <div className="flex justify-center mb-6">
                    <div className="w-full max-w-[300px] px-2">
                        <SkeletonCard index={0} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 px-2">
                    {Array(3).fill(null).map((_, index) => (
                        <div key={index} className="flex justify-center">
                            <div className="w-full max-w-[300px]">
                                <SkeletonCard index={index + 1} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Department sections skeleton - Mobile Optimized */}
            <div className="space-y-12 sm:space-y-16">
                {Array(3).fill(null).map((_, sectionIndex) => (
                    <div key={sectionIndex}>
                        {/* Department header skeleton */}
                        <div className="flex flex-col items-center mb-6 px-4">
                            <div className="h-5 sm:h-6 w-24 sm:w-32 bg-indigo-600/10 rounded-lg mb-3"></div>
                            <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-indigo-600/10 rounded-full"></div>
                        </div>
                        
                        {/* Cards skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 px-3">
                            {Array(6).fill(null).map((_, cardIndex) => (
                                <div key={cardIndex} className="flex justify-center">
                                    <div className="w-full max-w-[300px]">
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

const SkeletonCard = ({ index }) => (
    <motion.div
        className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#161a36]/50 to-[#0f1225]/50 
            border border-indigo-500/10 overflow-hidden relative min-h-[280px]"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
    >
        {/* Shimmer effect */}
        <motion.div 
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
            animate={{ x: ['0%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, delay: index * 0.05 }}
        />
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600/10"></div>
        
        {/* Profile image centered */}
        <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-indigo-600/10"></div>
        </div>
        
        {/* Name centered */}
        <div className="flex justify-center mb-3">
            <div className="h-4 w-28 sm:w-32 bg-indigo-600/10 rounded-md"></div>
        </div>
        
        {/* Info card */}
        <div className="p-3 rounded-lg bg-white/5 mb-3 flex-1">
            <div className="flex items-center mb-2 pb-2 border-b border-white/10">
                <div className="w-3 h-3 bg-indigo-600/10 rounded mr-2"></div>
                <div className="h-3 w-20 bg-indigo-600/10 rounded-md"></div>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-600/10 rounded mr-2"></div>
                <div className="h-3 w-16 bg-indigo-600/10 rounded-md"></div>
            </div>
        </div>
        
        {/* View profile button */}
        <div className="h-9 w-full bg-indigo-600/10 rounded-lg"></div>
    </motion.div>
);

export default TeamSkeleton;
