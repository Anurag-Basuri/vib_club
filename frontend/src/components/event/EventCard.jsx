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
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	};

	return (
		<motion.div
			className="glass-card rounded-3xl overflow-hidden hover-lift transition-all duration-500 group relative"
			whileHover={{ y: -12 }}
			layout
		>
			{/* Image Section */}
			<div className="relative h-56 overflow-hidden">
				{event.posters && event.posters.length > 0 && !imageError ? (
					<img
						src={event.posters[0].url}
						alt={event.title}
						onError={() => setImageError(true)}
						className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-800/50 to-purple-800/50 relative">
						<div className="text-6xl opacity-30">🎭</div>
						<div className="absolute inset-0 animate-shimmer" />
					</div>
				)}

				{/* Overlay gradient */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

				{/* Status badge */}
				{(isOngoing || isUpcoming) && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-sm ${
							isOngoing
								? 'bg-red-500/90 text-white animate-pulse-glow'
								: 'bg-blue-500/90 text-white'
						}`}
					>
						{isOngoing ? '🔴 LIVE' : '🚀 UPCOMING'}
					</motion.div>
				)}

				{/* Date overlay */}
				<div className="absolute bottom-4 left-4 text-white">
					<div className="text-2xl font-bold">{eventDate.getDate()}</div>
					<div className="text-sm opacity-90">
						{eventDate.toLocaleString('default', { month: 'short' })}
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="p-6 space-y-4">
				<h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
					{event.title}
				</h3>

				<div className="flex items-center gap-2 text-blue-300">
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span className="text-sm">{formatDate(eventDate)}</span>
				</div>

				<div className="flex items-center gap-2 text-cyan-300">
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
					</svg>
					<span className="text-sm">{event.venue}</span>
				</div>

				<p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
					{event.description}
				</p>

				{/* Tags */}
				{event.tags && event.tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{event.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium backdrop-blur-sm"
							>
								{tag}
							</span>
						))}
						{event.tags.length > 3 && (
							<span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">
								+{event.tags.length - 3}
							</span>
						)}
					</div>
				)}

				{/* Action buttons */}
				<div className="flex gap-3 pt-2">
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg"
					>
						View Details
					</motion.button>

					{isUpcoming && (
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="px-4 py-3 glass-card rounded-xl font-medium hover-lift transition-all duration-300 text-white"
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
