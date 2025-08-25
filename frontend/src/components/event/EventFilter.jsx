import { motion } from 'framer-motion';

const EventFilter = ({ activeFilter, setActiveFilter }) => {
	const filters = [
		{ key: 'all', label: 'All Events', icon: '🎭', gradient: 'from-blue-500 to-purple-600' },
		{ key: 'upcoming', label: 'Upcoming', icon: '🚀', gradient: 'from-blue-500 to-cyan-500' },
		{ key: 'ongoing', label: 'Live Now', icon: '🔴', gradient: 'from-red-500 to-orange-500' },
		{ key: 'past', label: 'Archive', icon: '📚', gradient: 'from-purple-500 to-pink-500' },
	];

	return (
		<div className="flex flex-wrap justify-center gap-3">
			{filters.map((filter) => (
				<motion.button
					key={filter.key}
					whileHover={{ scale: 1.05, y: -2 }}
					whileTap={{ scale: 0.95 }}
					className={`px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 font-medium relative overflow-hidden group ${
						activeFilter === filter.key
							? `bg-gradient-to-r ${filter.gradient} text-white shadow-xl`
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

					<span className="text-lg relative z-10">{filter.icon}</span>
					<span className="relative z-10 font-semibold">{filter.label}</span>

					{/* Active indicator */}
					{activeFilter === filter.key && (
						<motion.div
							layoutId="activeFilter"
							className="absolute inset-0 border-2 border-white/30 rounded-2xl"
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
