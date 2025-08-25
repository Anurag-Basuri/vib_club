import { motion } from 'framer-motion';

const EventFilter = ({ activeFilter, setActiveFilter }) => {
    const filters = [
        { key: 'all', label: 'All', icon: '🎭', gradient: 'from-blue-500 to-purple-600' },
        { key: 'upcoming', label: 'Upcoming', icon: '🚀', gradient: 'from-blue-500 to-cyan-500' },
        { key: 'ongoing', label: 'Live', icon: '🔴', gradient: 'from-red-500 to-orange-500' },
        { key: 'past', label: 'Past', icon: '📚', gradient: 'from-purple-500 to-pink-500' },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {filters.map((filter) => (
                <motion.button
                    key={filter.key}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium relative overflow-hidden group text-sm ${
                        activeFilter === filter.key
                            ? `bg-gradient-to-r ${filter.gradient} text-white shadow-lg`
                            : 'glass-card text-gray-300 hover:text-white'
                    }`}
                    onClick={() => setActiveFilter(filter.key)}
                >
                    {/* Background animation for inactive buttons */}
                    {activeFilter !== filter.key && (
                        <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                                background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))`,
                            }}
                        />
                    )}

                    <span className="text-sm sm:text-base relative z-10">{filter.icon}</span>
                    <span className="relative z-10 font-semibold hidden sm:inline">{filter.label}</span>

                    {/* Active indicator */}
                    {activeFilter === filter.key && (
                        <motion.div
                            layoutId="activeFilter"
                            className="absolute inset-0 border border-white/30 rounded-xl"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
};

export default EventFilter;
