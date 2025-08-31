import React from 'react';
import { motion } from 'framer-motion';

const TeamSkeleton = () => {
    const skeletonItems = Array(6).fill(null);
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto px-4">
            {skeletonItems.map((_, index) => (
                <motion.div
                    key={index}
                    className="p-5 rounded-xl bg-gradient-to-b from-[#161a36]/50 to-[#0f1225]/50 border border-indigo-500/10 overflow-hidden relative"
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
                    
                    <div className="flex items-center mb-5">
                        <div className="w-14 h-14 rounded-full bg-indigo-600/10"></div>
                        <div className="ml-3 flex-1">
                            <div className="h-4 w-24 bg-indigo-600/10 rounded-md mb-2"></div>
                            <div className="h-3 w-16 bg-indigo-600/10 rounded-md"></div>
                        </div>
                    </div>
                    <div className="h-4 w-20 bg-indigo-600/10 rounded-lg mb-4"></div>
                    <div className="flex gap-2 mb-5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-7 w-16 rounded-full bg-indigo-600/10"></div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <div className="h-3 w-24 bg-indigo-600/10 rounded-md"></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default TeamSkeleton;
