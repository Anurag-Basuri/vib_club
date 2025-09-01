import React from 'react';
import { motion } from 'framer-motion';

const TeamSkeleton = () => {
    const skeletonItems = Array(9).fill(null); // Show more cards for better loading experience
    
    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* Leadership skeleton */}
            <div className="mb-16">
                <div className="flex justify-center mb-8">
                    <div className="h-8 w-48 bg-indigo-600/10 rounded-lg mb-4"></div>
                </div>
                <div className="flex justify-center mb-6">
                    <div className="w-full max-w-[280px]">
                        <SkeletonCard index={0} />
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {Array(3).fill(null).map((_, index) => (
                        <div key={index} className="w-full max-w-[280px] xs:w-auto xs:max-w-[280px]">
                            <SkeletonCard index={index + 1} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Department sections skeleton */}
            <div className="space-y-16">
                {Array(3).fill(null).map((_, sectionIndex) => (
                    <div key={sectionIndex}>
                        {/* Department header skeleton */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="h-6 w-32 bg-indigo-600/10 rounded-lg mb-4"></div>
                            <div className="h-1 w-16 bg-indigo-600/10 rounded-full"></div>
                        </div>
                        
                        {/* Cards skeleton */}
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                            {Array(6).fill(null).map((_, cardIndex) => (
                                <div key={cardIndex} className="w-full max-w-[280px] xs:w-auto xs:max-w-[280px]">
                                    <SkeletonCard index={sectionIndex * 6 + cardIndex} />
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
        className="p-5 rounded-xl bg-gradient-to-b from-[#161a36]/50 to-[#0f1225]/50 border border-indigo-500/10 overflow-hidden relative h-full"
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
        
        {/* Profile image centered */}
        <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-indigo-600/10"></div>
        </div>
        
        {/* Name centered */}
        <div className="flex justify-center mb-3">
            <div className="h-4 w-32 bg-indigo-600/10 rounded-md"></div>
        </div>
        
        {/* Info card */}
        <div className="p-3 rounded-lg bg-white/5 mb-4">
            <div className="flex items-center mb-3 pb-2 border-b border-white/10">
                <div className="w-3 h-3 bg-indigo-600/10 rounded mr-2"></div>
                <div className="h-3 w-20 bg-indigo-600/10 rounded-md"></div>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-600/10 rounded mr-2"></div>
                <div className="h-3 w-16 bg-indigo-600/10 rounded-md"></div>
            </div>
        </div>
        
        {/* View profile button */}
        <div className="h-6 w-full bg-indigo-600/10 rounded-md"></div>
    </motion.div>
);

export default TeamSkeleton;
