import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Briefcase, Users } from 'lucide-react';

const UnifiedTeamCard = ({ member, delay = 0, onClick, isAuthenticated }) => {
    // Safety check for undefined member
    if (!member) return null;
    
    // Ensure we have proper property names (fullname vs fullName)
    const name = member.fullname || member.fullName || 'Unknown';
    const designation = member.designation || 'Position not specified';
    const department = member.department || 'Department not specified';
    
    return (
        <motion.div
            className="h-full group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => onClick(member)}
        >
            <div className="relative h-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg group-hover:shadow-xl border border-indigo-500/10 group-hover:border-indigo-500/30">
                {/* Simplified gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f47] via-[#141b38] to-[#0f172a]"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Card content */}
                <div className="relative z-10 p-5 flex flex-col h-full">
                    {/* Profile image with better error handling */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            {/* Simplified glow effect */}
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-600/30 to-blue-600/30 blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
                            
                            {/* Image with better error handling */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: delay * 0.1 + 0.2, duration: 0.3 }}
                                className="relative z-10 w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500/30 group-hover:border-indigo-500/50 transition-all duration-300 shadow-lg"
                            >
                                <img
                                    src={member?.profilePicture?.url || '/assets/images/default-avatar.png'}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232d3748"/><text x="50%" y="50%" font-family="Arial" font-size="42" fill="%23a3bffa" text-anchor="middle" dominant-baseline="middle">' + (name?.charAt(0) || '?') + '</text></svg>';
                                    }}
                                    loading="lazy"
                                />
                            </motion.div>
                        </div>
                    </div>
                    
                    {/* Name - with text overflow protection */}
                    <h3 className="text-lg font-bold text-white text-center mb-3 group-hover:text-blue-200 transition-colors px-1 truncate">
                        {name}
                    </h3>
                    
                    {/* Info card with fixed height for consistency */}
                    <div className="mb-4 flex-1">
                        <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-indigo-500/30 transition-colors h-full">
                            {/* Designation with icon and text overflow protection */}
                            <div className="flex items-center mb-3 pb-2 border-b border-white/10">
                                <Users size={14} className="text-blue-400 mr-2 flex-shrink-0" />
                                <p className="text-blue-100 font-medium text-sm truncate">
                                    {designation}
                                </p>
                            </div>
                            
                            {/* Department with icon and text overflow protection */}
                            <div className="flex items-center">
                                <Briefcase size={14} className="text-indigo-400 mr-2 flex-shrink-0" />
                                <p className="text-indigo-200 text-sm truncate">
                                    {department}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Improved "View Profile" button */}
                    <motion.button
                        className="w-full flex items-center justify-center px-3 py-1.5 rounded-md bg-indigo-900/30 border border-indigo-500/20 text-blue-300 text-xs font-medium group-hover:bg-indigo-900/50 group-hover:border-indigo-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-1 focus:ring-offset-[#141b38]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        View Profile <ChevronRight size={14} className="ml-1" />
                    </motion.button>
                </div>
                
                {/* Simpler corner accents */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        </motion.div>
    );
};

export default React.memo(UnifiedTeamCard, (prevProps, nextProps) => {
    return prevProps.member?._id === nextProps.member?._id && 
           prevProps.isAuthenticated === nextProps.isAuthenticated;
});