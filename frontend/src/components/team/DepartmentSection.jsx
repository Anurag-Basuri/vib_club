import React from 'react';
import { motion } from 'framer-motion';
import UnifiedTeamCard from './UnifiedTeamCard';
import { ChevronRight } from 'lucide-react';

const DepartmentSection = ({ department, members, onClick, isAuthenticated }) => {
    const designationGroups = members.reduce((acc, member) => {
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
                        {/* Enhanced header background */}
                        <motion.div 
                            className="relative group overflow-hidden mb-4"
                            whileHover={{ scale: 1.03 }}
                        >
                            {/* Animated background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-xl blur-xl opacity-70"></div>
                            
                            <div className="relative flex items-center gap-3 py-3 px-6 rounded-xl bg-gradient-to-br from-[#161a36]/95 to-[#0f1225]/95 border border-indigo-500/30 shadow-lg">
                                <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-400 to-indigo-600"></div>
                                <ChevronRight size={18} className="text-blue-400" />
                                <h3 className="text-xl md:text-2xl font-bold text-white">
                                    {designation}
                                </h3>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/0 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>
                        </motion.div>

                        {/* Modern decorative element */}
                        <div className="relative">
                            <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-400 filter blur-md opacity-70"></div>
                        </div>
                    </div>

                    {/* Updated responsive grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {membersInDesignation.map((member, index) => (
                            <div key={member._id || index} className="flex justify-center">
                                <div className="w-full max-w-[280px]">
                                    <UnifiedTeamCard
                                        member={member}
                                        delay={index * 0.05}
                                        onClick={onClick}
                                        isAuthenticated={isAuthenticated}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )
    );
};

export default DepartmentSection;
