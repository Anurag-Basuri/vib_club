import React, { useState, useEffect, useRef } from 'react';
import { Crop, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const ImageEditor = ({ image, onSave, onCancel }) => {
	const canvasRef = useRef(null);
	const [scale, setScale] = useState(1);
	const [rotation, setRotation] = useState(0);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	useEffect(() => {
		drawImage();
	}, [scale, rotation, position, image]);

	const drawImage = () => {
		const canvas = canvasRef.current;
		if (!canvas || !image) return;

		const ctx = canvas.getContext('2d');
		const img = new Image();

		img.onload = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.rotate((rotation * Math.PI) / 180);
			ctx.scale(scale, scale);
			ctx.translate(position.x, position.y);
			ctx.drawImage(img, -img.width / 2, -img.height / 2);
			ctx.restore();

			// Draw crop circle overlay
			ctx.beginPath();
			ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI);
			ctx.strokeStyle = '#00bcd4';
			ctx.lineWidth = 2;
			ctx.stroke();
		};

		img.src = image;
	};

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setDragStart({
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		});
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		setPosition({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y,
		});
	};

	const handleMouseUp = () => setIsDragging(false);

	const handleSave = () => {
		const canvas = canvasRef.current;
		const croppedCanvas = document.createElement('canvas');
		const croppedCtx = croppedCanvas.getContext('2d');

		croppedCanvas.width = 200;
		croppedCanvas.height = 200;

		croppedCtx.beginPath();
		croppedCtx.arc(100, 100, 100, 0, 2 * Math.PI);
		croppedCtx.clip();

		croppedCtx.drawImage(
			canvas,
			canvas.width / 2 - 100,
			canvas.height / 2 - 100,
			200,
			200,
			0,
			0,
			200,
			200
		);

		croppedCanvas.toBlob(
			(blob) => {
				onSave(blob);
			},
			'image/jpeg',
			0.9
		);
	};

	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-xl">
				<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
					<Crop className="w-5 h-5 text-cyan-500" />
					Edit Profile Picture
				</h3>

				<div className="flex flex-col lg:flex-row gap-6">
					<div className="flex-1">
						<canvas
							ref={canvasRef}
							width={300}
							height={300}
							className="border border-gray-300 dark:border-gray-600 rounded-lg cursor-move bg-gray-100 dark:bg-gray-700"
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseUp}
						/>
					</div>

					<div className="space-y-4 min-w-[200px]">
						<div>
							<label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
								Zoom
							</label>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setScale(Math.max(0.5, scale - 0.1))}
									className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
								>
									<ZoomOut className="w-4 h-4" />
								</button>
								<input
									type="range"
									min="0.5"
									max="3"
									step="0.1"
									value={scale}
									onChange={(e) => setScale(parseFloat(e.target.value))}
									className="flex-1"
								/>
								<button
									onClick={() => setScale(Math.min(3, scale + 0.1))}
									className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
								>
									<ZoomIn className="w-4 h-4" />
								</button>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">
								Rotation
							</label>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setRotation(rotation - 15)}
									className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
								>
									<RotateCcw className="w-4 h-4" />
								</button>
								<input
									type="range"
									min="0"
									max="360"
									value={rotation}
									onChange={(e) => setRotation(parseInt(e.target.value))}
									className="flex-1"
								/>
								<span className="text-gray-700 dark:text-gray-300 text-sm w-8">
									{rotation}°
								</span>
							</div>
						</div>

						<button
							onClick={() => {
								setScale(1);
								setRotation(0);
								setPosition({ x: 0, y: 0 });
							}}
							className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
						>
							<RotateCcw className="w-4 h-4" />
							Reset
						</button>
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<button
						onClick={onCancel}
						className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

export default ImageEditor;
