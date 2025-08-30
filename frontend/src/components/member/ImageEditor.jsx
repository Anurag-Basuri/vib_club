import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	RotateCw,
	ZoomIn,
	ZoomOut,
	RefreshCw,
	X,
	Upload,
	Save,
	Edit3,
	Crop,
	FlipHorizontal,
	FlipVertical,
	Sun,
	Contrast,
	Palette,
} from 'lucide-react';

const CONTROL_BTN =
	'inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400';

const SLIDER = 'w-full accent-blue-500 h-2 rounded-lg appearance-none bg-gray-200 dark:bg-gray-700';

const TAB_BTN = 'px-4 py-2 rounded-lg font-semibold transition-colors text-sm focus:outline-none';
const TAB_BTN_ACTIVE = 'bg-blue-600 text-white shadow';
const TAB_BTN_INACTIVE =
	'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-700';

const FILTERS = [
	{ name: 'None', fn: (ctx) => ctx },
	{ name: 'Grayscale', fn: (ctx) => (ctx.filter += ' grayscale(100%)') },
	{ name: 'Sepia', fn: (ctx) => (ctx.filter += ' sepia(100%)') },
	{ name: 'Invert', fn: (ctx) => (ctx.filter += ' invert(100%)') },
];

const ImageEditor = ({ image, onSave, onCancel, isEditing, onUploadNew, setIsEditingImage }) => {
	const canvasRef = useRef(null);
	const imageRef = useRef(null);
	const containerRef = useRef(null);

	const [transform, setTransform] = useState({
		scale: 1,
		rotation: 0,
		x: 0,
		y: 0,
		flipX: false,
		flipY: false,
	});
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [imageLoaded, setImageLoaded] = useState(false);
	const [canvasSize, setCanvasSize] = useState(320);
	const [brightness, setBrightness] = useState(100);
	const [contrast, setContrast] = useState(100);
	const [saturation, setSaturation] = useState(100);
	const [activeTab, setActiveTab] = useState('transform'); // 'transform', 'adjust', 'filters'
	const [filterIndex, setFilterIndex] = useState(0);
	const [cropShape, setCropShape] = useState('circle'); // 'circle' | 'square'

	// Responsive canvas sizing
	useEffect(() => {
		const updateSize = () => {
			if (containerRef.current) {
				const container = containerRef.current;
				const maxSize = Math.min(
					container.offsetWidth - 16,
					window.innerHeight * 0.45,
					400
				);
				setCanvasSize(Math.max(180, maxSize));
			}
		};
		updateSize();
		window.addEventListener('resize', updateSize);
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	// Load image
	useEffect(() => {
		if (!image) return;
		setImageLoaded(false);
		const img = new window.Image();
		img.onload = () => {
			imageRef.current = img;
			setImageLoaded(true);
			// Auto-fit image
			const maxDim = Math.max(img.width, img.height);
			const autoScale = (canvasSize * 0.7) / maxDim;
			setTransform((prev) => ({
				...prev,
				scale: autoScale,
				x: 0,
				y: 0,
				rotation: 0,
				flipX: false,
				flipY: false,
			}));
			setBrightness(100);
			setContrast(100);
			setSaturation(100);
			setFilterIndex(0);
			setCropShape('circle');
		};
		img.src = image;
	}, [image, canvasSize]);

	// Draw on canvas
	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		const img = imageRef.current;
		if (!canvas || !img || !imageLoaded) return;

		const ctx = canvas.getContext('2d');
		const { scale, rotation, x, y, flipX, flipY } = transform;
		const center = canvasSize / 2;
		const cropRadius = canvasSize * 0.35;
		const cropSize = canvasSize * 0.7;

		// Clear and setup
		ctx.clearRect(0, 0, canvasSize, canvasSize);

		// Background
		ctx.fillStyle = '#f8fafc';
		ctx.fillRect(0, 0, canvasSize, canvasSize);

		// Draw image with transforms and filters
		ctx.save();
		ctx.translate(center + x, center + y);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.scale(scale * (flipX ? -1 : 1), scale * (flipY ? -1 : 1));
		ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
		FILTERS[filterIndex].fn(ctx);
		ctx.drawImage(img, -img.width / 2, -img.height / 2);
		ctx.restore();

		// Crop overlay
		ctx.save();
		ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
		ctx.fillRect(0, 0, canvasSize, canvasSize);

		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		if (cropShape === 'circle') {
			ctx.arc(center, center, cropRadius, 0, 2 * Math.PI);
		} else {
			ctx.rect(center - cropSize / 2, center - cropSize / 2, cropSize, cropSize);
		}
		ctx.fill();
		ctx.restore();

		// Crop border
		ctx.strokeStyle = '#3b82f6';
		ctx.lineWidth = 3;
		ctx.beginPath();
		if (cropShape === 'circle') {
			ctx.arc(center, center, cropRadius, 0, 2 * Math.PI);
		} else {
			ctx.rect(center - cropSize / 2, center - cropSize / 2, cropSize, cropSize);
		}
		ctx.stroke();

		// Grid lines for better alignment
		ctx.strokeStyle = 'rgba(59, 130, 246, 0.18)';
		ctx.lineWidth = 1;
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		if (cropShape === 'circle') {
			ctx.moveTo(center, center - cropRadius);
			ctx.lineTo(center, center + cropRadius);
			ctx.moveTo(center - cropRadius, center);
			ctx.lineTo(center + cropRadius, center);
		} else {
			ctx.moveTo(center, center - cropSize / 2);
			ctx.lineTo(center, center + cropSize / 2);
			ctx.moveTo(center - cropSize / 2, center);
			ctx.lineTo(center + cropSize / 2, center);
		}
		ctx.stroke();
		ctx.setLineDash([]);
	}, [
		transform,
		imageLoaded,
		canvasSize,
		brightness,
		contrast,
		saturation,
		filterIndex,
		cropShape,
	]);

	useEffect(() => {
		draw();
	}, [draw]);

	// Mouse/Touch handlers
	const getEventPos = (e) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const clientX = e.touches?.[0]?.clientX ?? e.clientX;
		const clientY = e.touches?.[0]?.clientY ?? e.clientY;
		return {
			x: clientX - rect.left,
			y: clientY - rect.top,
		};
	};

	const handleStart = (e) => {
		e.preventDefault();
		if (!isEditing) return;
		const pos = getEventPos(e);
		setIsDragging(true);
		setDragStart({
			x: pos.x - transform.x,
			y: pos.y - transform.y,
		});
	};

	const handleMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const pos = getEventPos(e);
		setTransform((prev) => ({
			...prev,
			x: pos.x - dragStart.x,
			y: pos.y - dragStart.y,
		}));
	};

	const handleEnd = (e) => {
		e.preventDefault();
		setIsDragging(false);
	};

	// Control functions
	const updateTransform = (updates) => {
		setTransform((prev) => ({ ...prev, ...updates }));
	};

	const resetImage = () => {
		setTransform((prev) => ({
			...prev,
			scale: 1,
			rotation: 0,
			x: 0,
			y: 0,
			flipX: false,
			flipY: false,
		}));
		setBrightness(100);
		setContrast(100);
		setSaturation(100);
		setFilterIndex(0);
		setCropShape('circle');
	};

	const fitImage = () => {
		if (!imageRef.current) return;
		const img = imageRef.current;
		const maxDim = Math.max(img.width, img.height);
		const autoScale = (canvasSize * 0.7) / maxDim;
		setTransform({
			scale: autoScale,
			rotation: 0,
			x: 0,
			y: 0,
			flipX: false,
			flipY: false,
		});
		setBrightness(100);
		setContrast(100);
		setSaturation(100);
		setFilterIndex(0);
		setCropShape('circle');
	};

	// Save cropped image
	const handleSave = () => {
		if (!canvasRef.current || !imageRef.current) return;

		const outputSize = 400;
		const outputCanvas = document.createElement('canvas');
		const outputCtx = outputCanvas.getContext('2d');

		outputCanvas.width = outputSize;
		outputCanvas.height = outputSize;

		const { scale, rotation, x, y, flipX, flipY } = transform;
		const center = outputSize / 2;
		const cropRadius = outputSize / 2;
		const cropSize = outputSize;
		const scaleFactor = outputSize / canvasSize;

		// Create crop shape
		outputCtx.beginPath();
		if (cropShape === 'circle') {
			outputCtx.arc(center, center, cropRadius, 0, 2 * Math.PI);
		} else {
			outputCtx.rect(center - cropSize / 2, center - cropSize / 2, cropSize, cropSize);
		}
		outputCtx.clip();

		// Apply filters
		outputCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
		FILTERS[filterIndex].fn(outputCtx);

		// Draw transformed image
		outputCtx.save();
		outputCtx.translate(center + x * scaleFactor, center + y * scaleFactor);
		outputCtx.rotate((rotation * Math.PI) / 180);
		outputCtx.scale(scale * (flipX ? -1 : 1), scale * (flipY ? -1 : 1));
		outputCtx.drawImage(
			imageRef.current,
			-imageRef.current.width / 2,
			-imageRef.current.height / 2
		);
		outputCtx.restore();

		outputCanvas.toBlob(onSave, 'image/jpeg', 0.92);
	};

	// Controls UI
	const renderTransformControls = () => (
		<div className="space-y-6">
			{/* Zoom */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<span className="font-medium text-gray-700 dark:text-gray-200">Zoom</span>
					<span className="text-xs text-gray-500">
						{Math.round(transform.scale * 100)}%
					</span>
				</div>
				<div className="flex items-center gap-2">
					<button
						className={CONTROL_BTN}
						onClick={() =>
							updateTransform({ scale: Math.max(0.2, transform.scale - 0.1) })
						}
						aria-label="Zoom Out"
						type="button"
					>
						<ZoomOut size={18} />
					</button>
					<input
						type="range"
						min={20}
						max={300}
						step={1}
						value={Math.round(transform.scale * 100)}
						onChange={(e) => updateTransform({ scale: Number(e.target.value) / 100 })}
						className={SLIDER}
					/>
					<button
						className={CONTROL_BTN}
						onClick={() =>
							updateTransform({ scale: Math.min(3, transform.scale + 0.1) })
						}
						aria-label="Zoom In"
						type="button"
					>
						<ZoomIn size={18} />
					</button>
				</div>
			</div>
			{/* Rotate */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<span className="font-medium text-gray-700 dark:text-gray-200">Rotate</span>
					<span className="text-xs text-gray-500">{transform.rotation}°</span>
				</div>
				<div className="flex items-center gap-2">
					<button
						className={CONTROL_BTN}
						onClick={() =>
							updateTransform({ rotation: (transform.rotation + 270) % 360 })
						}
						aria-label="Rotate Left"
						type="button"
					>
						<RotateCw size={18} className="rotate-180" />
					</button>
					<input
						type="range"
						min={0}
						max={359}
						step={1}
						value={transform.rotation}
						onChange={(e) => updateTransform({ rotation: Number(e.target.value) })}
						className={SLIDER}
					/>
					<button
						className={CONTROL_BTN}
						onClick={() =>
							updateTransform({ rotation: (transform.rotation + 90) % 360 })
						}
						aria-label="Rotate Right"
						type="button"
					>
						<RotateCw size={18} />
					</button>
				</div>
			</div>
			{/* Flip */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<span className="font-medium text-gray-700 dark:text-gray-200">Flip</span>
				</div>
				<div className="flex gap-2">
					<button
						className={CONTROL_BTN}
						onClick={() => updateTransform({ flipX: !transform.flipX })}
						aria-label="Flip Horizontal"
						type="button"
					>
						<FlipHorizontal size={18} />
					</button>
					<button
						className={CONTROL_BTN}
						onClick={() => updateTransform({ flipY: !transform.flipY })}
						aria-label="Flip Vertical"
						type="button"
					>
						<FlipVertical size={18} />
					</button>
				</div>
			</div>
			{/* Position */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<span className="font-medium text-gray-700 dark:text-gray-200">Move</span>
					<span className="text-xs text-gray-500">Drag image</span>
				</div>
				<div className="flex gap-2">
					<button
						className={CONTROL_BTN}
						onClick={() => updateTransform({ x: 0, y: 0 })}
						aria-label="Center"
						type="button"
					>
						<RefreshCw size={18} />
					</button>
					<button
						className={CONTROL_BTN}
						onClick={fitImage}
						aria-label="Fit"
						type="button"
					>
						<Upload size={18} className="rotate-90" />
					</button>
				</div>
			</div>
			{/* Crop Shape */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<span className="font-medium text-gray-700 dark:text-gray-200">Crop Shape</span>
				</div>
				<div className="flex gap-2">
					<button
						className={
							CONTROL_BTN +
							(cropShape === 'circle'
								? ' bg-blue-500 text-white'
								: '')
						}
						onClick={() => setCropShape('circle')}
						aria-label="Circle Crop"
						type="button"
					>
						<Crop size={18} className="rounded-full" />
					</button>
					<button
						className={
							CONTROL_BTN +
							(cropShape === 'square'
								? ' bg-blue-500 text-white'
								: '')
						}
						onClick={() => setCropShape('square')}
						aria-label="Square Crop"
						type="button"
					>
						<Crop size={18} className="rounded-none" />
					</button>
				</div>
			</div>
		</div>
	);

	const renderAdjustControls = () => (
		<div className="space-y-6">
			{/* Brightness */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<span className="font-medium text-gray-700 dark:text-gray-200">Brightness</span>
					<span className="text-xs text-gray-500">{brightness}%</span>
				</div>
				<input
					type="range"
					min={50}
					max={150}
					step={1}
					value={brightness}
					onChange={(e) => setBrightness(Number(e.target.value))}
					className={SLIDER}
				/>
			</div>
			{/* Contrast */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<span className="font-medium text-gray-700 dark:text-gray-200">Contrast</span>
					<span className="text-xs text-gray-500">{contrast}%</span>
				</div>
				<input
					type="range"
					min={50}
					max={150}
					step={1}
					value={contrast}
					onChange={(e) => setContrast(Number(e.target.value))}
					className={SLIDER}
				/>
			</div>
			{/* Saturation */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<span className="font-medium text-gray-700 dark:text-gray-200">Saturation</span>
					<span className="text-xs text-gray-500">{saturation}%</span>
				</div>
				<input
					type="range"
					min={0}
					max={200}
					step={1}
					value={saturation}
					onChange={(e) => setSaturation(Number(e.target.value))}
					className={SLIDER}
				/>
			</div>
			{/* Reset */}
			<div className="flex gap-2 mt-4">
				<button
					className={CONTROL_BTN}
					onClick={resetImage}
					aria-label="Reset All"
					type="button"
				>
					<RefreshCw size={18} />
				</button>
			</div>
		</div>
	);

	const renderFilterControls = () => (
		<div className="space-y-6">
			<div>
				<div className="flex items-center justify-between mb-1">
					<span className="font-medium text-gray-700 dark:text-gray-200">Filters</span>
				</div>
				<div className="flex flex-wrap gap-2">
					{FILTERS.map((f, idx) => (
						<button
							key={f.name}
							className={
								CONTROL_BTN +
								(filterIndex === idx
									? ' bg-blue-500 text-white'
									: '')
							}
							onClick={() => setFilterIndex(idx)}
							aria-label={f.name}
							type="button"
						>
							{f.name === 'Grayscale' && <Palette size={18} />}
							{f.name === 'Sepia' && <Sun size={18} />}
							{f.name === 'Invert' && <Contrast size={18} />}
							{f.name === 'None' && <X size={18} />}
						</button>
					))}
				</div>
			</div>
		</div>
	);

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.98 }}
				className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
			>
				<div
					ref={containerRef}
					className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto p-0 sm:p-6 flex flex-col"
					style={{
						maxHeight: '98vh',
						width: '100%',
						margin: '0 auto',
						boxSizing: 'border-box',
					}}
				>
					{/* Header */}
					<div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white">
								{isEditing ? 'Edit Profile Picture' : 'Profile Picture'}
							</span>
						</div>
						<button
							onClick={onCancel}
							className={CONTROL_BTN + ' ml-2'}
							aria-label="Close"
							type="button"
						>
							<X size={20} />
						</button>
					</div>
					{/* Main */}
					<div className="flex-1 flex flex-col xl:flex-row gap-4 xl:gap-8 p-2 sm:p-4 overflow-y-auto">
						{/* Canvas */}
						<div className="flex-1 flex flex-col items-center justify-center min-w-[180px]">
							<canvas
								ref={canvasRef}
								width={canvasSize}
								height={canvasSize}
								className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 touch-none cursor-move"
								style={{
									background: '#222',
									maxWidth: '100%',
									height: 'auto',
									touchAction: 'none',
								}}
								onMouseDown={handleStart}
								onMouseMove={handleMove}
								onMouseUp={handleEnd}
								onMouseLeave={handleEnd}
								onTouchStart={handleStart}
								onTouchMove={handleMove}
								onTouchEnd={handleEnd}
								draggable={false}
							/>
							<div className="text-xs text-gray-500 mt-2 text-center">
								{isEditing
									? 'Drag to move. Use controls to zoom/rotate/adjust.'
									: 'Preview'}
							</div>
						</div>
						{/* Controls */}
						{isEditing && (
							<div className="w-full xl:w-80 space-y-6">
								{/* Tabs */}
								<div className="flex gap-2 mb-2">
									<button
										className={
											TAB_BTN +
											' ' +
											(activeTab === 'transform'
												? TAB_BTN_ACTIVE
												: TAB_BTN_INACTIVE)
										}
										onClick={() => setActiveTab('transform')}
										type="button"
									>
										Transform
									</button>
									<button
										className={
											TAB_BTN +
											' ' +
											(activeTab === 'adjust'
												? TAB_BTN_ACTIVE
												: TAB_BTN_INACTIVE)
										}
										onClick={() => setActiveTab('adjust')}
										type="button"
									>
										Adjust
									</button>
									<button
										className={
											TAB_BTN +
											' ' +
											(activeTab === 'filters'
												? TAB_BTN_ACTIVE
												: TAB_BTN_INACTIVE)
										}
										onClick={() => setActiveTab('filters')}
										type="button"
									>
										Filters
									</button>
								</div>
								{activeTab === 'transform'
									? renderTransformControls()
									: activeTab === 'adjust'
									? renderAdjustControls()
									: renderFilterControls()}
							</div>
						)}
					</div>
					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-2 sm:mt-4 px-2 sm:px-4 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-700">
						<div className="flex-1 flex items-center gap-2">
							{!isEditing && onUploadNew && (
								<>
									<button
										onClick={onUploadNew}
										className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all text-sm sm:text-base"
										type="button"
									>
										<Upload size={18} /> Upload New
									</button>
									{setIsEditingImage && (
										<button
											onClick={() => setIsEditingImage(true)}
											className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all text-sm sm:text-base"
											type="button"
										>
											<Edit3 size={18} /> Edit
										</button>
									)}
								</>
							)}
						</div>
						<div className="flex gap-2">
							<button
								onClick={onCancel}
								className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold text-sm sm:text-base"
								type="button"
							>
								{isEditing ? 'Cancel' : 'Close'}
							</button>
							{isEditing && (
								<button
									onClick={handleSave}
									disabled={!imageLoaded}
									className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all text-sm sm:text-base"
									type="button"
								>
									<Save size={18} /> Save Picture
								</button>
							)}
						</div>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default ImageEditor;
