import React from 'react';
import { motion } from 'framer-motion';
import UnifiedTeamCard from './UnifiedTeamCard';
import { ChevronRight, Crown } from 'lucide-react';

const DepartmentSection = ({ department, members, onClick, isAuthenticated }) => {
    // Sort members to show heads first, then group by designation
    const sortedMembers = [...members].sort((a, b) => {
        // Head designation comes first
        if (a.designation === 'Head' && b.designation !== 'Head') return -1;
        if (b.designation === 'Head' && a.designation !== 'Head') return 1;
        // Then sort alphabetically by designation
        return a.designation.localeCompare(b.designation);
    });

    const designationGroups = sortedMembers.reduce((acc, member) => {
        if (!acc[member.designation]) acc[member.designation] = [];
        acc[member.designation].push(member);
        return acc;
    }, {});

    return Object.entries(designationGroups).map(
        ([designation, membersInDesignation]) =>
            membersInDesignation.length > 0 && (
                <motion.div
                    key={designation}
                    className="mb-12 sm:mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex flex-col items-center mb-6 sm:mb-8 relative">
                        {/* Enhanced header background with special styling for heads */}
                        <motion.div 
                            className="relative group overflow-hidden mb-4"
                            whileHover={{ scale: 1.03 }}
                        >
                            {/* Animated background - special color for heads */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${
                                designation === 'Head' 
                                    ? 'from-amber-600/20 to-orange-600/20' 
                                    : 'from-indigo-600/20 to-blue-600/20'
                            } rounded-xl blur-xl opacity-70`}></div>
                            
                            <div className={`relative flex items-center gap-3 py-3 px-6 rounded-xl bg-gradient-to-br from-[#161a36]/95 to-[#0f1225]/95 border ${
                                designation === 'Head' 
                                    ? 'border-amber-500/30' 
                                    : 'border-indigo-500/30'
                            } shadow-lg`}>
                                <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${
                                    designation === 'Head' 
                                        ? 'from-amber-400 to-orange-600' 
                                        : 'from-blue-400 to-indigo-600'
                                }`}></div>
                                
                                {/* Special icon for heads */}
                                {designation === 'Head' ? (
                                    <Crown size={18} className="text-amber-400" />
                                ) : (
                                    <ChevronRight size={18} className="text-blue-400" />
                                )}
                                
                                <h3 className={`text-xl md:text-2xl font-bold ${
                                    designation === 'Head' 
                                        ? 'text-amber-100' 
                                        : 'text-white'
                                }`}>
                                    {designation === 'Head' ? `${department} Head` : designation}
                                </h3>
                                
                                <div className={`absolute inset-0 bg-gradient-to-r ${
                                    designation === 'Head' 
                                        ? 'from-amber-600/0 via-amber-600/0 to-amber-600/10' 
                                        : 'from-indigo-600/0 via-indigo-600/0 to-indigo-600/10'
                                } opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                            </div>
                        </motion.div>

                        {/* Modern decorative element with special styling for heads */}
                        <div className="relative">
                            <div className={`w-16 h-1 bg-gradient-to-r ${
                                designation === 'Head' 
                                    ? 'from-amber-600 to-orange-400' 
                                    : 'from-indigo-600 to-blue-400'
                            } rounded-full`}></div>
                            <div className={`absolute inset-0 bg-gradient-to-r ${
                                designation === 'Head' 
                                    ? 'from-amber-600 to-orange-400' 
                                    : 'from-indigo-600 to-blue-400'
                            } filter blur-md opacity-70`}></div>
                        </div>
                    </div>

                    {/* Center-aligned cards using flexbox */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-6xl mx-auto">
                        {membersInDesignation.map((member, index) => (
                            <div key={member._id || index} className="w-full max-w-[280px] xs:w-auto xs:max-w-[280px]">
                                <UnifiedTeamCard
                                    member={member}
                                    delay={index * 0.05}
                                    onClick={onClick}
                                    isAuthenticated={isAuthenticated}
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>
            )
    );
};

export default DepartmentSection;
