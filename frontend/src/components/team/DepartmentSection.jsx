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

    // Group by designation for clean display
    const designationGroups = sortedMembers.reduce((acc, member) => {
        if (!acc[member.designation]) acc[member.designation] = [];
        acc[member.designation].push(member);
        return acc;
    }, {});

    return (
        <motion.div
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
        >
            {/* Department Header */}
            <div className="flex flex-col items-center mb-8 sm:mb-10 relative">
                <motion.div 
                    className="relative group overflow-hidden mb-4"
                    whileHover={{ scale: 1.03 }}
                >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-xl blur-xl opacity-70"></div>
                    
                    <div className="relative flex items-center gap-3 py-3 px-6 rounded-xl bg-gradient-to-br from-[#161a36]/95 to-[#0f1225]/95 border border-indigo-500/30 shadow-lg">
                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-400 to-indigo-600"></div>
                        <ChevronRight size={18} className="text-blue-400" />
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                            {department}
                        </h3>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/0 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                </motion.div>

                {/* Decorative element */}
                <div className="relative">
                    <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-400 filter blur-md opacity-70"></div>
                </div>
            </div>

            {/* All members in the department - sorted with heads first */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-6xl mx-auto">
                {sortedMembers.map((member, index) => (
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
    );
};

export default DepartmentSection;
