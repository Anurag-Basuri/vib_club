import { useState } from 'react';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
	const [imageError, setImageError] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
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
			whileHover={{ y: -15, rotateY: 5 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			layout
		>
			{/* Enhanced Image Section */}
			<div className="relative h-64 overflow-hidden">
				{event.posters && event.posters.length > 0 && !imageError ? (
					<motion.img
						src={event.posters[0].url}
						alt={event.title}
						onError={() => setImageError(true)}
						className="w-full h-full object-cover transition-transform duration-700"
						whileHover={{ scale: 1.1 }}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-800/60 to-purple-800/60 relative">
						<motion.div
							animate={{ rotate: [0, 360] }}
							transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
							className="text-8xl opacity-20"
						>
							🎭
						</motion.div>
						<div className="absolute inset-0 animate-shimmer" />
					</div>
				)}

				{/* Enhanced overlay gradient */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

				{/* Status badge with enhanced animation */}
				{(isOngoing || isUpcoming) && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-sm ${
							isOngoing ? 'bg-red-500/90 text-white' : 'bg-blue-500/90 text-white'
						}`}
					>
						<motion.span
							animate={isOngoing ? { opacity: [1, 0.5, 1] } : {}}
							transition={{ duration: 1.5, repeat: Infinity }}
						>
							{isOngoing ? '🔴 LIVE' : '🚀 UPCOMING'}
						</motion.span>
					</motion.div>
				)}

				{/* Enhanced date overlay */}
				<motion.div
					className="absolute bottom-4 left-4 text-white"
					whileHover={{ scale: 1.1 }}
				>
					<div className="text-3xl font-black">{eventDate.getDate()}</div>
					<div className="text-sm opacity-90 font-medium">
						{eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
					</div>
				</motion.div>

				{/* Hover overlay */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0"
					animate={{ opacity: isHovered ? 1 : 0 }}
					transition={{ duration: 0.3 }}
				/>
			</div>

			{/* Enhanced Content Section */}
			<div className="p-6 space-y-4">
				<motion.h3
					className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2"
					whileHover={{ x: 5 }}
				>
					{event.title}
				</motion.h3>

				<div className="space-y-3">
					<motion.div
						className="flex items-center gap-3 text-blue-300"
						whileHover={{ x: 5 }}
					>
						<div className="p-1 rounded-full bg-blue-500/20">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<span className="text-sm font-medium">{formatDate(eventDate)}</span>
					</motion.div>

					<motion.div
						className="flex items-center gap-3 text-cyan-300"
						whileHover={{ x: 5 }}
					>
						<div className="p-1 rounded-full bg-cyan-500/20">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
							</svg>
						</div>
						<span className="text-sm font-medium">{event.venue}</span>
					</motion.div>
				</div>

				<p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
					{event.description}
				</p>

				{/* Enhanced Tags */}
				{event.tags && event.tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{event.tags.slice(0, 3).map((tag, index) => (
							<motion.span
								key={tag}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.05 }}
								className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-400/30"
							>
								{tag}
							</motion.span>
						))}
						{event.tags.length > 3 && (
							<motion.span
								whileHover={{ scale: 1.05 }}
								className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs border border-gray-400/30"
							>
								+{event.tags.length - 3}
							</motion.span>
						)}
					</div>
				)}

				{/* Enhanced Action buttons */}
				<div className="flex gap-3 pt-4">
					<motion.button
						whileHover={{ scale: 1.02, y: -2 }}
						whileTap={{ scale: 0.98 }}
						className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg relative overflow-hidden group"
					>
						<span className="relative z-10">View Details</span>
						<motion.div
							className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
						/>
					</motion.button>

					{isUpcoming && (
						<motion.button
							whileHover={{ scale: 1.02, y: -2 }}
							whileTap={{ scale: 0.98 }}
							className="px-6 py-3 glass-card rounded-xl font-medium hover-lift transition-all duration-300 text-white relative overflow-hidden group"
						>
							<span className="relative z-10">Register</span>
							<motion.div
								className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							/>
						</motion.button>
					)}
				</div>
			</div>

			{/* Card border glow effect */}
			<motion.div
				className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
				style={{
					background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
					filter: 'blur(1px)',
				}}
				animate={{ opacity: isHovered ? 1 : 0 }}
				transition={{ duration: 0.3 }}
			/>
		</motion.div>
	);
};

export default EventCard;
