import React from 'react';
import { motion } from 'framer-motion';
import FloatingBackground from './FloatingBackground';

const LoadingScreen = React.memo(() => (
	<div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] flex items-center justify-center relative overflow-hidden">
		<FloatingBackground />
		<div className="text-center relative z-10">
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
				className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-6"
			/>
			<motion.h2
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-xl font-semibold text-white mb-2"
			>
				Loading Profile
			</motion.h2>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="text-blue-200"
			>
				Please wait while we fetch your information...
			</motion.p>
		</div>
	</div>
));

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
