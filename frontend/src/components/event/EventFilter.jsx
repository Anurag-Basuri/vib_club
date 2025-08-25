import { motion } from 'framer-motion';

const EventFilter = ({ activeFilter, setActiveFilter }) => {
    const filters = [
        { key: 'all', label: 'All', icon: '🎭', color: 'blue' },
        { key: 'upcoming', label: 'Upcoming', icon: '🚀', color: 'cyan' },
        { key: 'ongoing', label: 'Live', icon: '🔴', color: 'red' },
        { key: 'past', label: 'Past', icon: '📚', color: 'purple' },
    ];

    const getColorClasses = (color, isActive) => {
        const colorMap = {
            blue: {
                active: 'bg-blue-500/20 text-blue-300 border-blue-400/50',
                inactive: 'text-gray-400 border-gray-600/30 hover:text-blue-300 hover:border-blue-500/40'
            },
            cyan: {
                active: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50',
                inactive: 'text-gray-400 border-gray-600/30 hover:text-cyan-300 hover:border-cyan-500/40'
            },
            red: {
                active: 'bg-red-500/20 text-red-300 border-red-400/50',
                inactive: 'text-gray-400 border-gray-600/30 hover:text-red-300 hover:border-red-500/40'
            },
            purple: {
                active: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
                inactive: 'text-gray-400 border-gray-600/30 hover:text-purple-300 hover:border-purple-500/40'
            }
        };
        return colorMap[color][isActive ? 'active' : 'inactive'];
    };

    return (
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {filters.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                    <motion.button
                        key={filter.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            px-2.5 sm:px-3 py-1.5 sm:py-2 
                            rounded-lg sm:rounded-xl 
                            border backdrop-blur-sm
                            transition-all duration-300 
                            flex items-center gap-1.5 sm:gap-2 
                            font-medium text-xs sm:text-sm
                            relative overflow-hidden group
                            ${getColorClasses(filter.color, isActive)}
                        `}
                        onClick={() => setActiveFilter(filter.key)}
                    >
                        {/* Subtle hover background */}
                        {!isActive && (
                            <motion.div
                                className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                initial={false}
                            />
                        )}

                        {/* Icon */}
                        <span className="text-xs sm:text-sm relative z-10">{filter.icon}</span>
                        
                        {/* Label - hidden on mobile for space */}
                        <span className="relative z-10 font-semibold hidden sm:inline whitespace-nowrap">
                            {filter.label}
                        </span>

                        {/* Active indicator with layout animation */}
                        {isActive && (
                            <motion.div
                                layoutId="filterIndicator"
                                className="absolute inset-0 bg-white/10 rounded-lg sm:rounded-xl"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

export default EventFilter;
