import React from 'react';
import { motion } from 'framer-motion';
import UnifiedTeamCard from './UnifiedTeamCard';
import { ChevronRight } from 'lucide-react';

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
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
        >
            {/* Department Header - Mobile Optimized */}
            <div className="flex flex-col items-center mb-6 sm:mb-8 px-4">
                <motion.div 
                    className="relative group overflow-hidden mb-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-xl blur-lg opacity-70"></div>
                    
                    <div className="relative flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-4 sm:px-6 
                        rounded-xl bg-gradient-to-br from-[#161a36]/95 to-[#0f1225]/95 
                        border border-indigo-500/30 shadow-lg backdrop-blur-sm">
                        
                        <div className="w-1 sm:w-1.5 h-6 sm:h-8 rounded-full bg-gradient-to-b from-blue-400 to-indigo-600"></div>
                        <ChevronRight size={16} className="text-blue-400" />
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center">
                            {department}
                        </h3>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/0 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                </motion.div>

                {/* Decorative line */}
                <div className="relative">
                    <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-400 filter blur-sm opacity-70"></div>
                </div>
            </div>

            {/* Cards Grid - Mobile-First Responsive */}
            <div className="px-3 sm:px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 max-w-7xl mx-auto">
                    {sortedMembers.map((member, index) => (
                        <motion.div
                            key={member._id || index}
                            className="flex justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                        >
                            <div className="w-full max-w-[300px]">
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
