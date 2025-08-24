import { useState } from 'react';

const EventCard = ({ event }) => {
	const [imageError, setImageError] = useState(false);
	const eventDate = new Date(event.date);
	const now = new Date();
	const isUpcoming = eventDate > now;
	const isOngoing = eventDate.toDateString() === now.toDateString() || event.status === 'ongoing';

	const formatDate = (date) => {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	};

	return (
		<div
			className={`rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border 
      ${isOngoing ? 'border-green-500/30' : isUpcoming ? 'border-blue-500/30' : 'border-gray-500/30'} 
      transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}
		>
			<div className="relative h-48 overflow-hidden">
				{event.posters && event.posters.length > 0 && !imageError ? (
					<img
						src={event.posters[0].url}
						alt={event.title}
						onError={() => setImageError(true)}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-800 to-cyan-800">
						<span className="text-white/50">Event Image</span>
					</div>
				)}
				{(isOngoing || isUpcoming) && (
					<div
						className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold
            ${isOngoing ? 'bg-green-500 text-black' : 'bg-blue-500 text-black'}`}
					>
						{isOngoing ? 'Ongoing' : 'Upcoming'}
					</div>
				)}
			</div>

			<div className="p-6">
				<h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
				<p className="text-blue-300 mb-1">{formatDate(eventDate)}</p>
				<p className="text-cyan-300 mb-3">{event.venue}</p>

				<p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>

				{event.tags && event.tags.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-5">
						{event.tags.map((tag) => (
							<span
								key={tag}
								className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
							>
								{tag}
							</span>
						))}
					</div>
				)}

				<div className="flex gap-3">
					<button className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:from-blue-500 hover:to-cyan-500 transition-all">
						View Details
					</button>
					{isUpcoming && (
						<button className="py-2 px-4 bg-white/10 border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-all">
							Register
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default EventCard;
