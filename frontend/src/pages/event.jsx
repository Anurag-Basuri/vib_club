import { useState, useEffect, useMemo } from 'react';
import { useGetAllEvents } from '../hooks/useEvents.js';
import EventCard from '../components/event/EventCard.jsx';
import EventHero from '../components/event/EventHero.jsx';
import EventFilter from '../components/event/EventFilter.jsx';
import LoadingSpinner from '../components/event/LoadingSpinner.jsx';
import { AnimatePresence, motion } from 'framer-motion';

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

const EventSection = ({ title, events }) => (
	<section className="mb-16">
		<motion.h2
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="text-2xl md:text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
		>
			{title}
		</motion.h2>
		<motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<AnimatePresence mode="popLayout">
				{events.map((event) => (
					<motion.div
						key={event._id}
						layout
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.4, type: 'spring', damping: 12 }}
						whileHover={{ y: -5, transition: { duration: 0.2 } }}
					>
						<EventCard event={event} />
					</motion.div>
				))}
			</AnimatePresence>
		</motion.div>
	</section>
);

const EventPage = () => {
	const { getAllEvents, events, loading, error } = useGetAllEvents();
	const [activeFilter, setActiveFilter] = useState('all');

	useEffect(() => {
		getAllEvents();
		// eslint-disable-next-line
	}, []);

	const categorized = useMemo(() => categorizeEvents(events || []), [events]);

	// Filtered events by section
	const filteredSections = useMemo(() => {
		if (activeFilter === 'all') return categorized;
		return { [activeFilter]: categorized[activeFilter] || [] };
	}, [categorized, activeFilter]);

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl"
					style={{
						background: 'rgba(239, 68, 68, 0.1)',
						boxShadow: '0 8px 32px 0 rgba(239, 68, 68, 0.2)',
						backdropFilter: 'blur(12px)',
					}}
				>
					<h2 className="text-xl font-bold text-red-200 mb-2">Error Loading Events</h2>
					<p className="text-red-100 mb-4">{error}</p>
					<button
						onClick={getAllEvents}
						className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg"
					>
						Retry
					</button>
				</motion.div>
			</div>
		);
	}

	// Check if all filtered sections are empty
	const isEmpty = Object.values(filteredSections).reduce((acc, arr) => acc + arr.length, 0) === 0;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
			<EventHero events={events} />

			<div className="container mx-auto px-4 py-12">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
				>
					Discover Events
				</motion.h1>

				{/* Sticky Filter Bar */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="sticky top-4 z-20 py-4 mb-10 rounded-2xl"
					style={{
						background: 'rgba(15, 23, 42, 0.5)',
						boxShadow: '0 8px 32px 0 rgba(2, 12, 34, 0.4)',
						backdropFilter: 'blur(12px)',
						border: '1px solid rgba(255, 255, 255, 0.1)',
					}}
				>
					<EventFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
				</motion.div>

				{isEmpty ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="rounded-2xl p-12 text-center flex flex-col items-center"
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							boxShadow: '0 8px 32px 0 rgba(2, 12, 34, 0.4)',
							backdropFilter: 'blur(12px)',
							border: '1px solid rgba(255, 255, 255, 0.1)',
						}}
					>
						<img
							src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/calendar.svg"
							alt="No events"
							className="w-20 h-20 mb-6 opacity-60"
						/>
						<h2 className="text-2xl font-bold mb-2">
							No {activeFilter !== 'all' ? sectionTitles[activeFilter] : ''} events
							found
						</h2>
						<p className="text-blue-200 mb-2">Check back later for new events!</p>
						<button
							onClick={getAllEvents}
							className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg"
						>
							Reload Events
						</button>
					</motion.div>
				) : (
					Object.entries(filteredSections).map(
						([section, eventsArr]) =>
							eventsArr.length > 0 && (
								<EventSection
									key={section}
									title={sectionTitles[section]}
									events={eventsArr}
								/>
							)
					)
				)}
			</div>
		</div>
	);
};

export default EventPage;
