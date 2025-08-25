import { useState, useEffect, useMemo } from 'react';
import { useGetAllEvents } from '../hooks/useEvents.js';
import EventCard from '../components/event/EventCard.jsx';
import EventHero from '../components/event/EventHero.jsx';
import EventFilter from '../components/event/EventFilter.jsx';
import LoadingSpinner from '../components/event/LoadingSpinner.jsx';
import { AnimatePresence, motion } from 'framer-motion';

// Decorative animated background elements
const GraphicElements = ({ hasEvents = true }) => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<div className="absolute -top-40 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
		<div className="absolute top-1/4 -left-20 w-60 h-60 bg-cyan-400/15 rounded-full blur-3xl"></div>
		<div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
		<div className="absolute bottom-20 right-1/3 w-40 h-40 bg-sky-500/15 rounded-full blur-3xl"></div>
		<motion.div
			className="absolute top-1/3 left-1/4 w-6 h-6 bg-cyan-400/30 rounded-full"
			animate={{
				y: [0, -20, 0],
				scale: [1, 1.2, 1],
			}}
			transition={{
				duration: 6,
				repeat: Infinity,
				ease: 'easeInOut',
			}}
		/>
		<motion.div
			className="absolute top-2/3 right-1/3 w-4 h-4 bg-blue-400/40 rounded-full"
			animate={{
				y: [0, 15, 0],
				scale: [1, 1.1, 1],
			}}
			transition={{
				duration: 5,
				repeat: Infinity,
				ease: 'easeInOut',
				delay: 1,
			}}
		/>
		{hasEvents && (
			<motion.div
				className="absolute top-1/4 right-1/4 w-5 h-5 bg-sky-300/50 rounded-full"
				animate={{
					y: [0, -15, 0],
					scale: [1, 1.3, 1],
				}}
				transition={{
					duration: 7,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 0.5,
				}}
			/>
		)}
	</div>
);

// Hero for no events
const NoEventsHero = () => (
	<div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-sky-900 overflow-hidden">
		<GraphicElements hasEvents={false} />
		<div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7 }}
			className="relative z-10 text-center p-8 rounded-2xl max-w-4xl mx-4 glass-card"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: 'spring', stiffness: 200, damping: 10 }}
				className="inline-block p-3 bg-blue-500/20 rounded-full text-blue-300 mb-6"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-12 w-12"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</motion.div>

			<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300">
				No Events Scheduled Yet
			</h1>

			<p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto leading-relaxed">
				We're busy planning amazing experiences for you. Check back soon for upcoming
				events or subscribe to our newsletter to be the first to know!
			</p>

			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg"
					type="button"
					aria-label="Subscribe to Updates"
				>
					Subscribe to Updates
				</motion.button>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all"
					type="button"
					aria-label="Suggest an Event"
				>
					Suggest an Event
				</motion.button>
			</div>
		</motion.div>
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
			className="text-2xl md:text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
		>
			{title}
		</motion.h2>

		{events.length === 0 ? (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px] glass-card"
			>
				<div className="text-5xl mb-4">📅</div>
				<p className="text-gray-400">{emptyMessage}</p>
			</motion.div>
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

	const hasEvents = events && events.length > 0;
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
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-sky-900">
				<GraphicElements hasEvents={false} />
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-sky-900 p-4">
				<GraphicElements hasEvents={false} />
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="glass-card-error p-8 text-center max-w-md w-full"
				>
					<div className="text-5xl mb-4" aria-hidden="true">😞</div>
					<h2 className="text-xl font-bold text-red-200 mb-2">Error Loading Events</h2>
					<p className="text-red-100 mb-6">{error}</p>
					<button
						onClick={getAllEvents}
						className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg"
						aria-label="Try Again"
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
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-sky-900 text-white relative overflow-hidden">
			<GraphicElements hasEvents={hasEvents} />

			{/* Conditional rendering of hero section */}
			{hasEvents ? <EventHero events={events} /> : <NoEventsHero />}

			{/* Only show event listing section if there are events */}
			{hasEvents && (
				<div className="container mx-auto px-4 py-12 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-center mb-12"
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
							Discover Events
						</h1>
						<p className="text-lg text-blue-200 max-w-2xl mx-auto">
							Explore upcoming, ongoing, and past events. Find something that excites
							you!
						</p>
					</motion.div>

					{/* Search and Filter Bar */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="sticky top-4 z-20 p-6 mb-10 rounded-2xl glass-card"
					>
						<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
							<div className="relative w-full md:w-auto">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										className="w-5 h-5 text-blue-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
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
									className="pl-10 pr-4 py-3 w-full md:w-96 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									aria-label="Search events"
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
							className="rounded-2xl p-12 text-center flex flex-col items-center glass-card"
						>
							<div className="text-7xl mb-6" aria-hidden="true">🔍</div>
							<h2 className="text-2xl font-bold mb-2">
								{searchQuery
									? `No events found for "${searchQuery}"`
									: `No ${activeFilter !== 'all' ? sectionTitles[activeFilter] : ''} events found`}
							</h2>
							<p className="text-blue-200 mb-6">
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
									className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg"
									aria-label="View All Events"
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
			)}
		</div>
	);
};

export default EventPage;

// Add these styles to your global CSS
const styles = `
  .glass-card {
    background: rgba(15, 23, 42, 0.5);
    box-shadow: 0 8px 32px 0 rgba(2, 12, 34, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .glass-card-error {
    background: rgba(239, 68, 68, 0.1);
    box-shadow: 0 8px 32px 0 rgba(239, 68, 68, 0.2);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .bg-grid-pattern {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 6s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
