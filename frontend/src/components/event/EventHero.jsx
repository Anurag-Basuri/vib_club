import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const formatDate = (date) =>
    new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);

const EventHero = ({ events = [] }) => {
    const upcomingEvent = useMemo(() => {
        if (!Array.isArray(events) || events.length === 0) return null;
        const now = new Date();
        return (
            events
                .filter(
                    (event) =>
                        event &&
                        event.date &&
                        new Date(event.date) > now &&
                        event.status !== 'cancelled'
                )
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null
        );
    }, [events]);

    if (!upcomingEvent) {
        return (
            <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900/70 via-indigo-900/70 to-purple-900/70 overflow-hidden"></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center p-8 rounded-2xl max-w-2xl mx-4"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 8px 32px 0 rgba(2, 12, 34, 0.6)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        No Upcoming Events
                    </h1>
                    <p className="text-xl text-blue-200">Check back later for new events!</p>
                </motion.div>
            </div>
        );
    }

    const {
        title = '',
        date,
        venue = '',
        description = '',
        posters = [],
    } = upcomingEvent;

    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
            {posters.length > 0 && posters[0]?.url ? (
                <>
                    <img
                        src={posters[0].url}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-blue-900/50 to-cyan-900/30"></div>
                </>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
            )}

            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 text-center p-8 rounded-2xl max-w-4xl mx-4"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 8px 32px 0 rgba(2, 12, 34, 0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-black font-bold mb-6"
                >
                    Next Event
                </motion.span>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300"></h1>
                    {title}
                </h1>

                <p className="text-xl text-blue-300 mb-2">{formatDate(new Date(date))}</p>
                <p className="text-lg text-cyan-300 mb-6">{venue}</p>

                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    {description.length > 200
                        ? `${description.substring(0, 200)}...`
                        : description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg"
                        type="button"
                    >
                        Register Now
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all"
                        type="button"
                    >
                        View Details
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default EventHero;
