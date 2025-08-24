const EventFilter = ({ activeFilter, setActiveFilter }) => {
	const filters = [
		{ key: 'all', label: 'All Events' },
		{ key: 'upcoming', label: 'Upcoming' },
		{ key: 'ongoing', label: 'Ongoing' },
		{ key: 'past', label: 'Past Events' },
	];

	return (
		<div className="flex flex-wrap justify-center gap-4 mb-12">
			{filters.map((filter) => (
				<button
					key={filter.key}
					className={`px-6 py-2 rounded-full transition-all ${
						activeFilter === filter.key
							? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
							: 'bg-white/5 text-gray-300 hover:bg-white/10'
					}`}
					onClick={() => setActiveFilter(filter.key)}
				>
					{filter.label}
				</button>
			))}
		</div>
	);
};

export default EventFilter;
