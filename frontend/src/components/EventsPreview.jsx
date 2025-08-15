import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, Ticket, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { publicClient } from '../services/api.js';

const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			staggerChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6 },
	},
};

const FloatingElement = ({ children, delay = 0 }) => (
	<motion.div
		animate={{
			y: [0, -10, 0],
			rotate: [0, 2, -2, 0],
		}}
		transition={{
			duration: 4,
			repeat: Infinity,
			delay,
			ease: 'easeInOut',
		}}
	>
		{children}
	</motion.div>
);

const UpcomingEventShowcase = () => {
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUpcomingEvent = async () => {
			try {
				const res = await publicClient.get('/api/events/upcoming-event');
				setTimeout(() => {
					setEvent(res.data.data);
					setLoading(false);
				}, 700);
			} catch (error) {
				setLoading(false);
			}
		};

		fetchUpcomingEvent();

		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	if (loading) {
		return (
			<section className="py-24 px-4 relative z-10 bg-transparent min-h-[60vh]">
				<div className="max-w-4xl mx-auto">
					<div className="animate-pulse flex flex-col items-center">
						<div className="h-8 bg-blue-300/20 rounded-lg mb-4 w-3/4"></div>
						<div className="h-4 bg-blue-300/10 rounded mb-8 w-1/2"></div>
						<div className="w-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch">
							<div className="md:w-1/2 h-64 md:h-auto bg-blue-800/20"></div>
							<div className="flex-1 p-8 space-y-4">
								<div className="h-4 bg-blue-800/20 rounded w-3/4"></div>
								<div className="h-4 bg-blue-800/20 rounded w-1/2"></div>
								<div className="h-4 bg-blue-800/20 rounded w-2/3"></div>
								<div className="h-4 bg-blue-800/20 rounded w-1/3"></div>
								<div className="flex gap-4 mt-8">
									<div className="h-10 w-32 bg-indigo-700/20 rounded-xl"></div>
									<div className="h-10 w-32 bg-blue-800/20 rounded-xl"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (!event) {
		return (
			<section className="py-24 px-4 relative z-10 bg-transparent min-h-[60vh] flex items-center justify-center">
				<motion.div
					className="max-w-2xl mx-auto text-center bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
				>
					<div className="flex items-center justify-center gap-2 mb-4">
						<Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
						<span className="text-yellow-400 font-semibold tracking-wide uppercase">
							No Upcoming Events
						</span>
						<Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
					</div>
					<h2 className="text-3xl font-bold text-white mb-2">Stay Tuned!</h2>
					<p className="text-blue-200 mb-8">
						We're preparing something exciting. Check back soon for new events and
						opportunities to connect!
					</p>
					<motion.button
						whileHover={{
							scale: 1.05,
							backgroundColor: 'rgba(79, 70, 229, 0.3)',
						}}
						whileTap={{ scale: 0.95 }}
						className="px-8 py-3 bg-indigo-700/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl font-medium text-indigo-300 hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto"
						onClick={() => navigate('/event')}
					>
						<span>View All Events</span>
						<ArrowRight className="w-4 h-4" />
					</motion.button>
				</motion.div>
			</section>
		);
	}

	// Format date and time (robust)
	let dateStr = '--';
	let timeStr = '--';
	if (event?.date) {
		const eventDate = new Date(event.date);
		if (!isNaN(eventDate)) {
			dateStr = eventDate.toLocaleDateString(undefined, {
				weekday: 'long',
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
			timeStr = event.time
				? event.time
				: eventDate.toLocaleTimeString(undefined, {
						hour: '2-digit',
						minute: '2-digit',
					});
		}
	}

	// Poster (first image)
	const poster = event.posters && event.posters.length > 0 ? event.posters[0] : null;

	// Slots available (never negative)
	const slots =
		typeof event.totalSpots === 'number'
			? Math.max(
					0,
					event.totalSpots - 152 - (event.registrations ? event.registrations.length : 0)
				)
			: null;

	// ExpandableText component for mobile description
	function ExpandableText({ text, maxChars = 100, className }) {
		const [expanded, setExpanded] = useState(false);
		if (!text) return null;
		if (text.length <= maxChars)
			return (
				<p className={className || 'text-blue-100/90 text-sm leading-relaxed'}>{text}</p>
			);
		return (
			<div>
				<p className={className || 'text-blue-100/90 text-sm leading-relaxed'}>
					{expanded ? text : text.slice(0, maxChars) + '...'}
					<button
						className="ml-2 text-cyan-400 font-medium text-sm hover:text-cyan-300 transition-colors"
						onClick={() => setExpanded((e) => !e)}
					>
						{expanded ? 'Show less' : 'Show more'}
					</button>
				</p>
			</div>
		);
	}

	// Mobile-specific layout with enhanced creativity
	if (isMobile) {
		return (
			<section className="py-8 px-2 relative z-10 bg-transparent min-h-[70vh] overflow-hidden">
				{/* Floating background elements */}
				<div className="absolute top-10 left-4 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
				<div
					className="absolute top-32 right-6 w-16 h-16 bg-purple-400/10 rounded-full blur-lg animate-pulse"
					style={{ animationDelay: '1s' }}
				></div>
				<div
					className="absolute bottom-20 left-8 w-12 h-12 bg-pink-400/10 rounded-full blur-md animate-pulse"
					style={{ animationDelay: '2s' }}
				></div>

				<div className="max-w-sm mx-auto relative z-10">
					{/* Header */}
					<motion.div
						className="text-center mb-6"
						initial={{ opacity: 0, y: -30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
					>
						<div className="flex items-center justify-center gap-2 mb-3">
							<FloatingElement delay={0}>
								<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
							</FloatingElement>
							<motion.span
								className="text-yellow-400 font-bold tracking-wider text-xs uppercase bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30"
								animate={{
									boxShadow: [
										'0 0 20px rgba(251,191,36,0.3)',
										'0 0 30px rgba(251,191,36,0.5)',
										'0 0 20px rgba(251,191,36,0.3)',
									],
								}}
								transition={{ duration: 2, repeat: Infinity }}
							>
								Next Event
							</motion.span>
							<FloatingElement delay={0.5}>
								<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
							</FloatingElement>
						</div>
						<motion.h1
							className="text-2xl font-black mb-2 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg leading-tight"
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
						>
							{event.title}
						</motion.h1>
					</motion.div>

					{/* Mobile Card */}
					<motion.div
						ref={ref}
						variants={containerVariants}
						initial="hidden"
						animate={inView ? 'visible' : 'hidden'}
						className="relative"
					>
						<motion.div
							variants={itemVariants}
							className="bg-gradient-to-br from-blue-900/60 via-purple-900/70 to-indigo-900/60 backdrop-blur-2xl border-2 border-white/20 rounded-3xl overflow-hidden shadow-2xl relative"
							whileHover={{ scale: 1.02 }}
							transition={{ type: 'spring', stiffness: 300 }}
						>
							{/* Poster */}
							{poster && poster.url && (
								<motion.div
									variants={itemVariants}
									className="relative w-full h-64 overflow-hidden"
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.6 }}
								>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
									<img
										src={poster.url}
										alt={event.title}
										className="w-full h-full object-cover object-center rounded-t-3xl"
									/>
									{/* Floating Info Cards on Poster */}
									<div className="absolute top-4 left-4 z-20">
										<motion.div
											className="bg-black/70 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 flex items-center gap-2"
											animate={{ y: [0, -5, 0] }}
											transition={{
												duration: 3,
												repeat: Infinity,
												ease: 'easeInOut',
											}}
										>
											<Ticket className="w-4 h-4 text-cyan-400" />
											<span className="text-white text-xs font-bold">
												{slots !== null
													? `${slots} spots`
													: 'Open Registration'}
											</span>
										</motion.div>
									</div>
									{/* Bottom overlay with key info */}
									<div className="absolute bottom-0 left-0 right-0 z-20 p-3">
										<motion.div
											className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2"
											initial={{ y: 50, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.5, duration: 0.6 }}
										>
											<div className="flex items-center justify-between mb-1">
												<div className="flex items-center gap-2">
													<Calendar className="w-4 h-4 text-cyan-400" />
													<span className="text-white text-xs font-semibold">
														{dateStr.split(',')[0]}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Clock className="w-4 h-4 text-purple-400" />
													<span className="text-white text-xs font-semibold">
														{timeStr}
													</span>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<MapPin className="w-4 h-4 text-pink-400" />
												<span className="text-white text-xs font-medium truncate">
													{event.venue}
												</span>
											</div>
										</motion.div>
									</div>
								</motion.div>
							)}

							{/* Content Section */}
							<motion.div variants={itemVariants} className="p-4">
								{/* Description */}
								<div className="mb-3">
									<ExpandableText text={event.description} maxChars={120} />
								</div>

								{/* Additional Info Cards */}
								<div className="grid grid-cols-1 gap-2 mb-4">
									{event.sponsor && event.sponsor !== 'Not Applicable' && (
										<motion.div
											className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 backdrop-blur-sm border border-indigo-400/30 rounded-xl p-2 flex items-center gap-2"
											whileHover={{
												scale: 1.02,
												backgroundColor: 'rgba(99, 102, 241, 0.2)',
											}}
										>
											<div className="w-7 h-7 bg-indigo-500/30 rounded-lg flex items-center justify-center">
												<Star className="w-4 h-4 text-indigo-400" />
											</div>
											<div>
												<div className="text-indigo-300 text-xs font-medium">
													Sponsored by
												</div>
												<div className="text-white text-xs font-semibold">
													{event.sponsor}
												</div>
											</div>
										</motion.div>
									)}
									{event.organizer && (
										<motion.div
											className="bg-gradient-to-r from-cyan-800/30 to-blue-800/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-2 flex items-center gap-2"
											whileHover={{
												scale: 1.02,
												backgroundColor: 'rgba(34, 211, 238, 0.15)',
											}}
										>
											<div className="w-7 h-7 bg-cyan-500/30 rounded-lg flex items-center justify-center">
												<Users className="w-4 h-4 text-cyan-400" />
											</div>
											<div>
												<div className="text-cyan-300 text-xs font-medium">
													Organized by
												</div>
												<div className="text-white text-xs font-semibold">
													{event.organizer}
												</div>
											</div>
										</motion.div>
									)}
								</div>

								{/* Enhanced CTA Button */}
								<motion.button
									whileHover={{
										scale: 1.05,
										boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)',
									}}
									whileTap={{ scale: 0.95 }}
									className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border border-indigo-400/50 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg relative overflow-hidden group"
									onClick={() => navigate(`/event`)}
								>
									<div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
									<span className="relative z-10">Discover More</span>
									<ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
								</motion.button>
							</motion.div>
						</motion.div>
						{/* Decorative Elements */}
						<div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400/60 rounded-full blur-sm animate-ping"></div>
						<div
							className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-400/60 rounded-full blur-sm animate-ping"
							style={{ animationDelay: '1s' }}
						></div>
					</motion.div>
				</div>
			</section>
		);
	}

	// Desktop layout
	return (
		<section className="py-24 px-4 relative z-10 bg-transparent min-h-[60vh] overflow-hidden">
			{/* Decorative elements */}
			<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
			<div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>

			<div className="max-w-5xl mx-auto relative z-10">
				{/* Header */}
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<div className="flex items-center justify-center gap-2 mb-4">
						<Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
						<span className="text-yellow-400 font-semibold tracking-wide uppercase">
							Next Event
						</span>
						<Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
					</div>
					<h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
						{event.title}
					</h1>
				</motion.div>

				{/* Main Event Card */}
				<motion.div
					ref={ref}
					variants={containerVariants}
					initial="hidden"
					animate={inView ? 'visible' : 'hidden'}
					whileHover={{ scale: 1.01, boxShadow: '0 25px 50px rgba(99, 102, 241, 0.2)' }}
					className="bg-gradient-to-br from-blue-900/60 to-purple-900/60 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch"
				>
					{/* Poster */}
					{poster && poster.url && (
						<motion.div
							variants={itemVariants}
							className="md:w-2/5 flex items-center justify-center bg-gradient-to-br from-blue-800/40 to-purple-800/40 relative overflow-hidden"
						>
							<img
								src={poster.url}
								alt={event.title}
								className="object-cover w-full h-full min-h-[300px] rounded-l-3xl"
							/>
						</motion.div>
					)}

					{/* Event Info */}
					<motion.div
						variants={itemVariants}
						className="flex-1 p-8 flex flex-col justify-between"
					>
						<ExpandableText
							text={event.description}
							maxChars={200}
							className="mb-6 text-blue-100/90 text-base leading-relaxed"
						/>
						<div>
							<div className="grid grid-cols-2 gap-4 mb-6">
								<div className="flex items-start gap-3">
									<div className="p-2 bg-blue-800/30 rounded-lg">
										<Calendar className="w-5 h-5 text-blue-400" />
									</div>
									<div>
										<div className="text-blue-300 text-sm font-semibold">
											Date
										</div>
										<div className="text-white">{dateStr}</div>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="p-2 bg-purple-800/30 rounded-lg">
										<Clock className="w-5 h-5 text-purple-400" />
									</div>
									<div>
										<div className="text-blue-300 text-sm font-semibold">
											Time
										</div>
										<div className="text-white">{timeStr}</div>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="p-2 bg-pink-800/30 rounded-lg">
										<MapPin className="w-5 h-5 text-pink-400" />
									</div>
									<div>
										<div className="text-blue-300 text-sm font-semibold">
											Venue
										</div>
										<div className="text-white">{event.venue}</div>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="p-2 bg-yellow-800/30 rounded-lg">
										<Ticket className="w-4 h-4 text-cyan-400" />
									</div>
									<div>
										<div className="text-blue-300 text-sm font-semibold">
											Tickets
										</div>
										<div className="text-white">{slots}</div>
									</div>
								</div>
								{event.sponsor && event.sponsor !== 'Not Applicable' && (
									<div className="flex items-start gap-3">
										<div className="p-2 bg-indigo-800/30 rounded-lg">
											<Star className="w-5 h-5 text-indigo-400" />
										</div>
										<div>
											<div className="text-blue-300 text-sm font-semibold">
												Sponsor
											</div>
											<div className="text-white">{event.sponsor}</div>
										</div>
									</div>
								)}
							</div>

							{event.organizer && (
								<div className="flex items-center gap-3 mb-6 p-3 bg-blue-900/30 rounded-xl">
									<div className="text-blue-300 font-medium">Organized by:</div>
									<div className="text-white">{event.organizer}</div>
								</div>
							)}
						</div>

						<div className="flex gap-4">
							<motion.button
								whileHover={{
									scale: 1.06,
									backgroundColor: 'rgba(99,102,241,0.18)',
								}}
								whileTap={{ scale: 0.97 }}
								className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-400/30 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg"
								onClick={() => navigate(`/event`)}
							>
								More Info <ArrowRight className="w-5 h-5" />
							</motion.button>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default UpcomingEventShowcase;
