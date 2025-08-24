import { useState, useEffect } from 'react';

const EventHero = ({ events }) => {
	const [upcomingEvent, setUpcomingEvent] = useState(null);

	useEffect(() => {
		if (events && events.length > 0) {
			const now = new Date();
			const upcomingEvents = events
				.filter((event) => new Date(event.date) > now && event.status !== 'cancelled')
				.sort((a, b) => new Date(a.date) - new Date(b.date));

			if (upcomingEvents.length > 0) {
				setUpcomingEvent(upcomingEvents[0]);
			}
		}
	}, [events]);

	if (!upcomingEvent) {
		return (
			<div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
				<div className="absolute inset-0 bg-black/40"></div>
				<div className="relative z-10 text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-2xl">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">No Upcoming Events</h1>
					<p className="text-xl text-blue-200">Check back later for new events!</p>
				</div>
			</div>
		);
	}

	const eventDate = new Date(upcomingEvent.date);

	const formatDate = (date) => {
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	};

	return (
		<div className="relative h-screen flex items-center justify-center overflow-hidden">
			{upcomingEvent.posters && upcomingEvent.posters.length > 0 ? (
				<img
					src={upcomingEvent.posters[0].url}
					alt={upcomingEvent.title}
					className="absolute inset-0 w-full h-full object-cover"
				/>
			) : null}

			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-blue-900/50 to-cyan-900/30"></div>

			<div className="relative z-10 text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-4xl mx-4">
				<span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-black font-bold mb-6">
					Next Event
				</span>

				<h1 className="text-4xl md:text-6xl font-bold mb-6">{upcomingEvent.title}</h1>

				<p className="text-xl text-blue-300 mb-2">{formatDate(eventDate)}</p>
				<p className="text-lg text-cyan-300 mb-6">{upcomingEvent.venue}</p>

				<p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
					{upcomingEvent.description.length > 200
						? `${upcomingEvent.description.substring(0, 200)}...`
						: upcomingEvent.description}
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-bold hover:from-blue-500 hover:to-cyan-500 transition-all">
						Register Now
					</button>
					<button className="px-8 py-3 bg-white/10 border border-white/20 rounded-lg font-bold hover:bg-white/20 transition-all">
						View Details
					</button>
				</div>
			</div>
		</div>
	);
};

export default EventHero;
