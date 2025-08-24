const LoadingSpinner = () => {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="relative">
				<div className="w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
				<div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full border-t-cyan-400 animate-spin"></div>
			</div>
			<p className="mt-4 text-blue-200">Loading events...</p>
		</div>
	);
};

export default LoadingSpinner;