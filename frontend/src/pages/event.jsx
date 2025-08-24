import { useState, useEffect } from 'react';
import { useGetAllEvents } from '../hooks/useEvents.js';
import EventCard from '../components/event/EventCard.jsx';
import EventHero from '../components/event/EventHero.jsx';
import EventFilter from '../components/event/EventFilter.jsx';
import LoadingSpinner from '../components/event/LoadingSpinner.jsx';

const EventPage = () => {
	const { getAllEvents, events, loading, error } = useGetAllEvents();
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [activeFilter, setActiveFilter] = useState('all');

	useEffect(() => {
		getAllEvents();
	}, [getAllEvents]);

	useEffect(() => {
		if (events && events.length > 0) {
			categorizeEvents();
		}
	}, [events, activeFilter]);

	const categorizeEvents = () => {
		const now = new Date();
		let categorized = {};

		events.forEach((event) => {
			if (event.status === 'cancelled') return;

			const eventDate = new Date(event.date);

			if (eventDate > now) {
				categorized.upcoming = categorized.upcoming || [];
				categorized.upcoming.push(event);
			} else if (
				eventDate.toDateString() === now.toDateString() ||
				event.status === 'ongoing'
			) {
				categorized.ongoing = categorized.ongoing || [];
				categorized.ongoing.push(event);
			} else {
				categorized.past = categorized.past || [];
				categorized.past.push(event);
			}
		});

		if (activeFilter === 'upcoming' && categorized.upcoming) {
			setFilteredEvents(categorized.upcoming);
		} else if (activeFilter === 'ongoing' && categorized.ongoing) {
			setFilteredEvents(categorized.ongoing);
		} else if (activeFilter === 'past' && categorized.past) {
			setFilteredEvents(categorized.past);
		} else {
			const allEvents = [
				...(categorized.ongoing || []),
				...(categorized.upcoming || []),
				...(categorized.past || []),
			];
			setFilteredEvents(allEvents);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				<p className="mt-4 text-white">Loading events...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
				<div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-xl p-8 text-center">
					<h2 className="text-xl font-bold text-red-200 mb-2">Error Loading Events</h2>
					<p className="text-red-100">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
			<EventHero events={events} />

			<div className="container mx-auto px-4 py-12">
				<h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
					Events
				</h1>

				<EventFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

				{filteredEvents.length === 0 ? (
					<div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center">
						<h2 className="text-2xl font-bold mb-2">
							No {activeFilter !== 'all' ? activeFilter : ''} events found
						</h2>
						<p className="text-blue-200">Check back later for new events!</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredEvents.map((event) => (
							<EventCard key={event._id} event={event} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default EventPage;
