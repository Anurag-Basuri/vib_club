import { useState, useEffect, useMemo } from 'react';
import { useGetAllEvents } from '../hooks/useEvents.js';
import EventCard from '../components/event/EventCard.jsx';
import EventFilter from '../components/event/EventFilter.jsx';
import LoadingSpinner from '../components/event/LoadingSpinner.jsx';
import { AnimatePresence, motion } from 'framer-motion';

// Decorative background elements matching home page
const EventFloatingBackground = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<motion.div
			animate={{
				x: [0, 30, 0],
				y: [0, -20, 0],
				rotate: [0, 180, 360],
			}}
			transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
			className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-full blur-2xl"
		/>
		<motion.div
			animate={{
				x: [0, -25, 0],
				y: [0, 15, 0],
				scale: [1, 1.2, 1],
			}}
			transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
			className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-purple-500/15 to-pink-500/10 rounded-full blur-2xl"
		/>
		<motion.div
			animate={{
				x: [0, 20, 0],
				y: [0, -15, 0],
				scale: [1, 1.1, 1],
			}}
			transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
			className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-tr from-indigo-500/12 to-blue-500/8 rounded-full blur-2xl"
		/>
	</div>
);

// Hero section with event stats - matching home page theme
const EventHero = ({ events, loading }) => {
	const upcomingCount = events?.filter((e) => new Date(e.date) > new Date()).length || 0;
	const ongoingCount = events?.filter((e) => e.status === 'ongoing').length || 0;
	const pastCount =
		events?.filter((e) => new Date(e.date) < new Date() && e.status !== 'ongoing').length || 0;

	return (
		<div className="relative bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] text-white py-8 sm:py-12 lg:py-16 overflow-hidden">
			<EventFloatingBackground />
			<div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:20px_20px]" />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-6 sm:mb-8"
				>
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-cyan-300">
						Events
					</h1>
					<p className="text-sm sm:text-base lg:text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed px-4">
						Discover, join, and explore our community events
					</p>
				</motion.div>

				{/* Stats */}
				{!loading && events && events.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-lg mx-auto"
					>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="glass-card-success p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl text-center group cursor-pointer"
						>
							<motion.div
								className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-300 mb-1"
								animate={{ scale: [1, 1.05, 1] }}
								transition={{ duration: 2, repeat: Infinity }}
							>
								{upcomingCount}
							</motion.div>
							<div className="text-xs sm:text-sm text-green-200 font-medium">
								Upcoming
							</div>
						</motion.div>

						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="glass-card-error p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl text-center group cursor-pointer relative overflow-hidden"
						>
							{ongoingCount > 0 && (
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20"
									animate={{ opacity: [0.3, 0.7, 0.3] }}
									transition={{ duration: 2, repeat: Infinity }}
								/>
							)}
							<motion.div
								className="relative z-10 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-red-300 mb-1"
								animate={ongoingCount > 0 ? { scale: [1, 1.1, 1] } : {}}
								transition={{ duration: 1.5, repeat: Infinity }}
							>
								{ongoingCount}
							</motion.div>
							<div className="relative z-10 text-xs sm:text-sm text-red-200 font-medium">
								Live
							</div>
						</motion.div>

						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="glass-card p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl text-center group cursor-pointer"
						>
							<div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-300 mb-1">
								{pastCount}
							</div>
							<div className="text-xs sm:text-sm text-purple-200 font-medium">
								Past
							</div>
						</motion.div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

const getCategorizedEvents = (events) => {
	const now = new Date();
	const categorized = { ongoing: [], upcoming: [], past: [] };

	events.forEach((event) => {
		if (event.status === 'cancelled') return;
		const eventDate = new Date(event.date);

		if (event.status === 'ongoing' || eventDate.toDateString() === now.toDateString()) {
			categorized.ongoing.push(event);
		} else if (eventDate > now) {
			categorized.upcoming.push(event);
		} else {
			categorized.past.push(event);
		}
	});

	return categorized;
};

// Section for a category of events
const EventCategorySection = ({ categoryKey, events, emptyMessage }) => {
	const categoryMeta = {
		ongoing: {
			title: 'Live Events',
			emoji: '🔴',
			gradient: 'from-red-400 to-orange-400',
			description: 'Happening right now',
		},
		upcoming: {
			title: 'Upcoming Events',
			emoji: '🚀',
			gradient: 'from-blue-400 to-cyan-400',
			description: 'Coming soon',
		},
		past: {
			title: 'Past Events',
			emoji: '🏆',
			gradient: 'from-purple-400 to-pink-400',
			description: 'Event archive',
		},
	};

	const meta = categoryMeta[categoryKey];

	return (
		<section className="mb-12 sm:mb-16 lg:mb-20">
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-6 sm:mb-8 lg:mb-10"
			>
				{/* Responsive header */}
				<div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2">
					<motion.span
						whileHover={{ scale: 1.1, rotate: 5 }}
						className="text-xl sm:text-2xl lg:text-3xl"
					>
						{meta.emoji}
					</motion.span>
					<h2
						className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${
							events.length > 0
								? `bg-clip-text text-transparent bg-gradient-to-r ${meta.gradient}`
								: 'text-gray-400'
						}`}
					>
						{meta.title}
					</h2>
					<motion.div
						initial={{ width: 0 }}
						whileInView={{ width: '100%' }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent ml-2 sm:ml-4"
					/>
					<motion.span
						initial={{ opacity: 0, scale: 0 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
						className="glass-card px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shrink-0"
					>
						{events.length}
					</motion.span>
				</div>
				<motion.p
					initial={{ opacity: 0, y: 5 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.1 }}
					className="text-gray-400 text-xs sm:text-sm ml-6 sm:ml-8 lg:ml-11"
				>
					{meta.description}
				</motion.p>
			</motion.div>

			{events.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="glass-card p-8 sm:p-12 lg:p-16 rounded-2xl sm:rounded-3xl text-center group hover-lift transition-all duration-500"
				>
					<motion.div
						whileHover={{ scale: 1.05, rotate: 3 }}
						className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
					>
						{meta.emoji}
					</motion.div>
					<p className="text-base sm:text-lg lg:text-xl text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
						{emptyMessage}
					</p>
				</motion.div>
			) : (
				<motion.div
					layout
					className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
				>
					<AnimatePresence mode="popLayout">
						{events.map((event, index) => (
							<motion.div
								key={event._id}
								layout
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								whileInView={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -20 }}
								viewport={{ once: true, margin: '-30px' }}
								transition={{
									duration: 0.4,
									delay: index * 0.05,
									type: 'spring',
									damping: 25,
								}}
							>
								<EventCard event={event} />
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			)}
		</section>
	);
};

const EventPage = () => {
	const { getAllEvents, events, loading, error } = useGetAllEvents();
	const [activeCategory, setActiveCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		getAllEvents();
		// eslint-disable-next-line
	}, []);

	const categorizedEvents = useMemo(() => getCategorizedEvents(events || []), [events]);

	const filteredCategories = useMemo(() => {
		const filterEvents = (eventList) => {
			if (!searchTerm) return eventList;
			return eventList.filter(
				(event) =>
					event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(event.tags &&
						event.tags.some((tag) =>
							tag.toLowerCase().includes(searchTerm.toLowerCase())
						))
			);
		};

		if (activeCategory === 'all') {
			return {
				ongoing: filterEvents(categorizedEvents.ongoing),
				upcoming: filterEvents(categorizedEvents.upcoming),
				past: filterEvents(categorizedEvents.past),
			};
		}

		return { [activeCategory]: filterEvents(categorizedEvents[activeCategory] || []) };
	}, [categorizedEvents, activeCategory, searchTerm]);

	const isEmpty =
		Object.values(filteredCategories).reduce((acc, arr) => acc + arr.length, 0) === 0;

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] p-4 relative overflow-hidden">
				{/* Fixed background elements matching home page */}
				<div className="fixed inset-0 z-0 overflow-hidden">
					<div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:20px_20px]" />
					<div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/10 filter blur-3xl animate-pulse-slow" />
					<div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500/15 filter blur-3xl animate-pulse-slow" />
					<div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-purple-500/12 filter blur-3xl animate-pulse-slow" />
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					className="glass-card-error p-6 sm:p-8 lg:p-12 text-center max-w-sm sm:max-w-md lg:max-w-lg w-full rounded-2xl sm:rounded-3xl relative z-10"
				>
					<motion.div
						animate={{
							rotate: [0, 5, -5, 0],
							scale: [1, 1.05, 1],
						}}
						transition={{ duration: 3, repeat: Infinity }}
						className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6"
					>
						⚠️
					</motion.div>
					<h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-200 mb-3 sm:mb-4">
						Unable to Load Events
					</h2>
					<p className="text-sm sm:text-base text-red-100 mb-6 sm:mb-8 leading-relaxed">
						{error}
					</p>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={getAllEvents}
						className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg sm:rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg text-sm sm:text-base"
					>
						Try Again
					</motion.button>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] text-white overflow-x-hidden">
			{/* Fixed background elements matching home page */}
			<div className="fixed inset-0 z-0 overflow-hidden">
				<div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:20px_20px]" />
				<div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/10 filter blur-3xl animate-pulse-slow" />
				<div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500/15 filter blur-3xl animate-pulse-slow" />
				<div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-purple-500/12 filter blur-3xl animate-pulse-slow" />
			</div>

			{/* Content */}
			<div className="relative z-10">
				<EventHero events={events} loading={loading} />

				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
					{/* Search and Filter */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="sticky top-2 sm:top-4 lg:top-6 z-30 mb-8 sm:mb-12 lg:mb-16"
					>
						<div className="glass-card p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl shadow-xl">
							<div className="flex flex-col gap-3 sm:gap-4">
								{/* Search Input */}
								<div className="relative group">
									<motion.div
										whileHover={{ scale: 1.01 }}
										className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
									>
										<svg
											className="w-4 h-4 sm:w-5 h-5 text-blue-400 group-hover:text-cyan-400 transition-colors duration-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
									</motion.div>
									<input
										type="text"
										placeholder="Search events..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10 pr-10 py-2.5 sm:py-3 w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base hover:bg-white/10 placeholder-gray-400"
									/>
									{searchTerm && (
										<motion.button
											initial={{ scale: 0, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => setSearchTerm('')}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 text-sm"
										>
											✕
										</motion.button>
									)}
								</div>

								{/* Category Filter */}
								<EventFilter
									activeFilter={activeCategory}
									setActiveFilter={setActiveCategory}
								/>
							</div>
						</div>
					</motion.div>

					{/* Events or Empty State */}
					{loading ? (
						<div className="flex justify-center py-12 sm:py-16 lg:py-20">
							<LoadingSpinner />
						</div>
					) : isEmpty ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="glass-card p-8 sm:p-12 lg:p-20 rounded-2xl sm:rounded-3xl text-center max-w-2xl lg:max-w-3xl mx-auto"
						>
							<motion.div
								animate={{
									scale: [1, 1.05, 1],
									rotate: [0, 3, -3, 0],
								}}
								transition={{ duration: 4, repeat: Infinity }}
								className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 lg:mb-8"
							>
								🔍
							</motion.div>
							<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
								{searchTerm ? `No results found` : 'No events found'}
							</h2>
							<p className="text-sm sm:text-base lg:text-xl text-blue-200 mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
								{searchTerm
									? 'Try adjusting your search terms'
									: 'New events are being planned. Check back soon!'}
							</p>
							{searchTerm && (
								<motion.button
									whileHover={{ scale: 1.02, y: -1 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => {
										setSearchTerm('');
										setActiveCategory('all');
									}}
									className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl sm:rounded-2xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-xl text-sm sm:text-base"
								>
									Show All Events
								</motion.button>
							)}
						</motion.div>
					) : (
						<div>
							{Object.entries(filteredCategories).map(
								([category, eventsArr]) =>
									eventsArr.length > 0 && (
										<EventCategorySection
											key={category}
											categoryKey={category}
											events={eventsArr}
											emptyMessage={`No ${category === 'ongoing' ? 'live' : category} events at the moment`}
										/>
									)
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default EventPage;
