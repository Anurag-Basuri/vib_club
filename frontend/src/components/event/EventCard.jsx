import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetailModal = ({ event, isOpen, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > new Date();
    const isOngoing = eventDate.toDateString() === new Date().toDateString() || event.status === 'ongoing';

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

    const nextImage = () => {
        if (event.posters && event.posters.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % event.posters.length);
        }
    };

    const prevImage = () => {
        if (event.posters && event.posters.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + event.posters.length) % event.posters.length);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    className="glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative">
                        {/* Image Gallery */}
                        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-t-3xl">
                            {event.posters && event.posters.length > 0 ? (
                                <>
                                    <motion.img
                                        key={currentImageIndex}
                                        src={event.posters[currentImageIndex].url}
                                        alt={`${event.title} - Image ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    
                                    {/* Navigation arrows */}
                                    {event.posters.length > 1 && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </motion.button>
                                        </>
                                    )}
                                    
                                    {/* Image indicators */}
                                    {event.posters.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                            {event.posters.map((_, index) => (
                                                <motion.button
                                                    key={index}
                                                    whileHover={{ scale: 1.2 }}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-800/60 to-purple-800/60">
                                    <div className="text-8xl opacity-30">🎭</div>
                                </div>
                            )}
                            
                            {/* Status badge */}
                            {(isOngoing || isUpcoming) && (
                                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-sm ${
                                    isOngoing ? 'bg-red-500/90 text-white' : 'bg-blue-500/90 text-white'
                                }`}>
                                    {isOngoing ? '🔴 LIVE NOW' : '🚀 UPCOMING'}
                                </div>
                            )}
                        </div>

                        {/* Close button */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="absolute -top-2 -right-2 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Title and basic info */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                                {event.title}
                            </h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-3 text-blue-300">
                                    <div className="p-2 rounded-full bg-blue-500/20">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">{formatDate(eventDate)}</span>
                                </div>

                                <div className="flex items-center gap-3 text-cyan-300">
                                    <div className="p-2 rounded-full bg-cyan-500/20">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">{event.venue}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">About This Event</h3>
                            <p className="text-gray-300 leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag, index) => (
                                        <motion.span
                                            key={tag}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-400/30"
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                            {isUpcoming && (
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg text-white"
                                >
                                    Register Now
                                </motion.button>
                            )}
                            
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 py-3 px-6 glass-card rounded-xl font-medium hover-lift transition-all duration-300 text-white"
                            >
                                Share Event
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const EventCard = ({ event }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
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
        <>
            <motion.div
                className="glass-card rounded-3xl overflow-hidden hover-lift transition-all duration-500 group relative cursor-pointer"
                whileHover={{ y: -8, rotateY: 2 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => setShowModal(true)}
                layout
            >
                {/* Enhanced Image Section */}
                <div className="relative h-56 overflow-hidden">
                    {event.posters && event.posters.length > 0 && !imageError ? (
                        <motion.img
                            src={event.posters[0].url}
                            alt={event.title}
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover transition-transform duration-700"
                            whileHover={{ scale: 1.05 }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-800/60 to-purple-800/60 relative">
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="text-6xl opacity-20"
                            >
                                🎭
                            </motion.div>
                            <div className="absolute inset-0 animate-shimmer" />
                        </div>
                    )}

                    {/* Enhanced overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Status badge */}
                    {(isOngoing || isUpcoming) && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`absolute top-3 right-3 px-3 py-1 rounded-full font-bold text-xs shadow-lg backdrop-blur-sm ${
                                isOngoing ? 'bg-red-500/90 text-white' : 'bg-blue-500/90 text-white'
                            }`}
                        >
                            {isOngoing ? '🔴 LIVE' : '🚀 UPCOMING'}
                        </motion.div>
                    )}

                    {/* Multiple images indicator */}
                    {event.posters && event.posters.length > 1 && (
                        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            📷 {event.posters.length}
                        </div>
                    )}

                    {/* Enhanced date overlay */}
                    <motion.div
                        className="absolute bottom-3 left-3 text-white"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="text-2xl font-black">{eventDate.getDate()}</div>
                        <div className="text-xs opacity-90 font-medium">
                            {eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                        </div>
                    </motion.div>

                    {/* Click to view overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent opacity-0 flex items-center justify-center"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium"
                        >
                            Click to view details
                        </motion.div>
                    </motion.div>
                </div>

                {/* Compact Content Section */}
                <div className="p-4 space-y-3">
                    <motion.h3
                        className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2"
                        whileHover={{ x: 2 }}
                    >
                        {event.title}
                    </motion.h3>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-300 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{formatDate(eventDate)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-cyan-300 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span className="font-medium truncate">{event.venue}</span>
                        </div>
                    </div>

                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                        {event.description}
                    </p>

                    {/* Compact Tags */}
                    {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {event.tags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-full text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                            {event.tags.length > 2 && (
                                <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">
                                    +{event.tags.length - 2}
                                </span>
                            )}
                        </div>
                    )}
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

            {/* Event Detail Modal */}
            <EventDetailModal event={event} isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default EventCard;
