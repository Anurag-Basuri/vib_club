import { useState } from 'react';
import { motion } from 'framer-motion';

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
		<motion.div
			className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl`}
			style={{
				background: 'rgba(255, 255, 255, 0.05)',
				backdropFilter: 'blur(12px)',
				border: isOngoing
					? '1px solid rgba(74, 222, 128, 0.3)'
					: isUpcoming
						? '1px solid rgba(96, 165, 250, 0.3)'
						: '1px solid rgba(255, 255, 255, 0.1)',
				boxShadow: '0 8px 32px 0 rgba(2, 12, 34, 0.4)',
			}}
			whileHover={{ y: -8, transition: { duration: 0.2 } }}
		>
			<div className="relative h-48 overflow-hidden">
				{event.posters && event.posters.length > 0 && !imageError ? (
					<img
						src={event.posters[0].url}
						alt={event.title}
						onError={() => setImageError(true)}
						className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-800/70 to-cyan-800/70">
						<span className="text-white/50">Event Image</span>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
				{(isOngoing || isUpcoming) && (
					<div
						className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold
              ${isOngoing ? 'bg-green-500 text-black' : 'bg-blue-500 text-black'} shadow-md`}
					>
						{isOngoing ? 'Ongoing' : 'Upcoming'}
					</div>
				)}
			</div>

			<div className="p-6">
				<h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
				<p className="text-blue-300 mb-1 flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					{formatDate(eventDate)}
				</p>
				<p className="text-cyan-300 mb-3 flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					{event.venue}
				</p>

				<p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
					{event.description}
				</p>

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
					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-md"
					>
						View Details
					</motion.button>
					{isUpcoming && (
						<motion.button
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							className="py-2 px-4 bg-white/10 border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-all"
						>
							Register
						</motion.button>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default EventCard;
