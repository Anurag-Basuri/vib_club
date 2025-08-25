import { useState, useEffect, useMemo } from 'react';
import { useGetAllEvents } from '../hooks/useEvents.js';
import EventCard from '../components/event/EventCard.jsx';
import EventHero from '../components/event/EventHero.jsx';
import EventFilter from '../components/event/EventFilter.jsx';
import LoadingSpinner from '../components/event/LoadingSpinner.jsx';
import { AnimatePresence, motion } from 'framer-motion';

// New graphic elements
const GraphicElements = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
		<div className="absolute top-1/4 -left-20 w-60 h-60 bg-cyan-400/30 rounded-full blur-3xl"></div>
		<div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
		<div className="absolute bottom-20 right-1/3 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl"></div>
	</div>
);

const sectionTitles = {
	ongoing: 'Happening Now',
	upcoming: 'Coming Soon',
	past: 'Past Events',
};

const categorizeEvents = (events) => {
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

const EventSection = ({ title, events, emptyMessage }) => (
	<section className="mb-16">
		<motion.h2
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="text-2xl md:text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
		>
			{title}
		</motion.h2>

		{events.length === 0 ? (
			<div className="rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10">
				<div className="text-5xl mb-4">📅</div>
				<p className="text-gray-400">{emptyMessage}</p>
			</div>
		) : (
			<motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<AnimatePresence mode="popLayout">
					{events.map((event) => (
						<motion.div
							key={event._id}
							layout
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: -20 }}
							transition={{ duration: 0.4, type: 'spring', damping: 12 }}
							whileHover={{ y: -8, transition: { duration: 0.2 } }}
						>
							<EventCard event={event} />
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>
		)}
	</section>
);

const EventPage = () => {
	const { getAllEvents, events, loading, error } = useGetAllEvents();
	const [activeFilter, setActiveFilter] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		getAllEvents();
		// eslint-disable-next-line
	}, []);

	const categorized = useMemo(() => categorizeEvents(events || []), [events]);

	// Filter events by search query and active filter
	const filteredSections = useMemo(() => {
		const filterEvents = (eventsArray) => {
			return eventsArray.filter(
				(event) =>
					event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
					(event.tags &&
						event.tags.some((tag) =>
							tag.toLowerCase().includes(searchQuery.toLowerCase())
						))
			);
		};

		if (activeFilter === 'all') {
			return {
				ongoing: filterEvents(categorized.ongoing),
				upcoming: filterEvents(categorized.upcoming),
				past: filterEvents(categorized.past),
			};
		}

		return { [activeFilter]: filterEvents(categorized[activeFilter] || []) };
	}, [categorized, activeFilter, searchQuery]);

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
				<GraphicElements />
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
				<GraphicElements />
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl max-w-md w-full"
				>
					<div className="text-5xl mb-4">😞</div>
					<h2 className="text-xl font-bold text-red-200 mb-2">Error Loading Events</h2>
					<p className="text-red-100 mb-6">{error}</p>
					<button
						onClick={getAllEvents}
						className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg"
					>
						Try Again
					</button>
				</motion.div>
			</div>
		);
	}

	// Check if all filtered sections are empty
	const isEmpty = Object.values(filteredSections).reduce((acc, arr) => acc + arr.length, 0) === 0;

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white relative overflow-hidden">
			<GraphicElements />

			<EventHero events={events} />

			<div className="container mx-auto px-4 py-12 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
						Discover Events
					</h1>
					<p className="text-lg text-purple-200 max-w-2xl mx-auto">
						Explore upcoming, ongoing, and past events. Find something that excites you!
					</p>
				</motion.div>

				{/* Search and Filter Bar */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="sticky top-4 z-20 p-6 mb-10 rounded-2xl backdrop-blur-xl"
					style={{
						background: 'rgba(15, 23, 42, 0.5)',
						boxShadow: '0 8px 32px 0 rgba(2, 12, 34, 0.4)',
						border: '1px solid rgba(255, 255, 255, 0.1)',
					}}
				>
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						<div className="relative w-full md:w-auto">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg
									className="w-5 h-5 text-purple-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									></path>
								</svg>
							</div>
							<input
								type="text"
								placeholder="Search events by name, venue, or tags..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 pr-4 py-3 w-full md:w-96 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							/>
						</div>

						<EventFilter
							activeFilter={activeFilter}
							setActiveFilter={setActiveFilter}
						/>
					</div>
				</motion.div>

				{isEmpty ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="rounded-2xl p-12 text-center flex flex-col items-center backdrop-blur-sm"
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							boxShadow: '0 8px 32px 0 rgba(2, 12, 34, 0.4)',
							border: '1px solid rgba(255, 255, 255, 0.1)',
						}}
					>
						<div className="text-7xl mb-6">🔍</div>
						<h2 className="text-2xl font-bold mb-2">
							{searchQuery
								? `No events found for "${searchQuery}"`
								: `No ${activeFilter !== 'all' ? sectionTitles[activeFilter] : ''} events found`}
						</h2>
						<p className="text-purple-200 mb-6">
							{searchQuery
								? 'Try adjusting your search terms or browse all events'
								: 'Check back later for new events!'}
						</p>
						{(searchQuery || activeFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchQuery('');
									setActiveFilter('all');
								}}
								className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg"
							>
								View All Events
							</button>
						)}
					</motion.div>
				) : (
					<>
						{Object.entries(filteredSections).map(
							([section, eventsArr]) =>
								eventsArr.length > 0 && (
									<EventSection
										key={section}
										title={sectionTitles[section]}
										events={eventsArr}
										emptyMessage={`No ${sectionTitles[section].toLowerCase()} at the moment`}
									/>
								)
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default EventPage;
