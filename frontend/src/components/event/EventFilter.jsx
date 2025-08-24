const EventFilter = ({ activeFilter, setActiveFilter }) => {
	const filters = [
		{ key: 'all', label: 'All Events', icon: '🎭' },
		{ key: 'upcoming', label: 'Upcoming', icon: '🚀' },
		{ key: 'ongoing', label: 'Ongoing', icon: '🔥' },
		{ key: 'past', label: 'Past Events', icon: '📅' },
	];

	return (
		<div className="flex flex-wrap justify-center gap-3 px-4">
			{filters.map((filter) => (
				<motion.button
					key={filter.key}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
						activeFilter === filter.key
							? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
							: 'bg-white/5 text-gray-300 hover:bg-white/10 backdrop-blur-sm'
					}`}
					onClick={() => setActiveFilter(filter.key)}
					style={{
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(255, 255, 255, 0.1)',
					}}
				>
					<span>{filter.icon}</span>
					<span>{filter.label}</span>
				</motion.button>
			))}
		</div>
	);
};

export default EventFilter;
