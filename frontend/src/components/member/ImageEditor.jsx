import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    Crop, 
    RotateCcw, 
    ZoomIn, 
    ZoomOut, 
    Move, 
    RotateCw, 
    Maximize2,
    Save,
    X
} from 'lucide-react';

const ImageEditor = ({ image, onSave, onCancel }) => {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

    // Calculate responsive canvas size
    useEffect(() => {
        const updateCanvasSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const size = Math.min(400, containerWidth - 40);
                setCanvasSize({ width: size, height: size });
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // Load and draw image
    const drawImage = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imageRef.current || !imageLoaded) return;

        const ctx = canvas.getContext('2d');
        const img = imageRef.current;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fill background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Save context
        ctx.save();
        
        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.translate(position.x, position.y);
        
        // Draw image centered
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        // Restore context
        ctx.restore();
        
        // Draw crop circle overlay
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 4;
        
        // Create mask
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        
        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Clear circle
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.restore();
        
        // Draw crop circle border
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw corner indicators
        const corners = [
            [centerX - radius + 10, centerY - radius + 10],
            [centerX + radius - 10, centerY - radius + 10],
            [centerX - radius + 10, centerY + radius - 10],
            [centerX + radius - 10, centerY + radius - 10]
        ];
        
        corners.forEach(([x, y]) => {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - 5, y);
            ctx.lineTo(x + 5, y);
            ctx.moveTo(x, y - 5);
            ctx.lineTo(x, y + 5);
            ctx.stroke();
        });
        
    }, [scale, rotation, position, imageLoaded]);

    // Initialize image
    useEffect(() => {
        if (image) {
            const img = new Image();
            img.onload = () => {
                imageRef.current = img;
                setImageLoaded(true);
                
                // Auto-fit image
                const canvas = canvasRef.current;
                if (canvas) {
                    const scaleX = canvas.width / img.width;
                    const scaleY = canvas.height / img.height;
                    const autoScale = Math.min(scaleX, scaleY) * 0.8;
                    setScale(autoScale);
                }
            };
            img.src = image;
        }
    }, [image]);

    // Redraw when dependencies change
    useEffect(() => {
        drawImage();
    }, [drawImage]);

    // Mouse event handlers
    const handleMouseDown = (e) => {
        if (!canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setIsDragging(true);
        setDragStart({
            x: x - position.x,
            y: y - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setPosition({
            x: x - dragStart.x,
            y: y - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch event handlers for mobile
    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMouseDown(touch);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMouseMove(touch);
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        handleMouseUp();
    };

    // Save cropped image
    const handleSave = () => {
        if (!canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const img = imageRef.current;
        
        // Create output canvas
        const outputCanvas = document.createElement('canvas');
        const outputCtx = outputCanvas.getContext('2d');
        const outputSize = 300; // High quality output
        
        outputCanvas.width = outputSize;
        outputCanvas.height = outputSize;
        
        // Create circular mask
        outputCtx.beginPath();
        outputCtx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, 2 * Math.PI);
        outputCtx.clip();
        
        // Calculate crop area
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 4;
        
        // Calculate source coordinates
        const sourceSize = radius * 2;
        const sourceX = centerX - radius;
        const sourceY = centerY - radius;
        
        // Apply transformations and draw
        outputCtx.save();
        outputCtx.translate(outputSize / 2, outputSize / 2);
        outputCtx.rotate((rotation * Math.PI) / 180);
        outputCtx.scale(scale, scale);
        outputCtx.translate(position.x * (outputSize / sourceSize), position.y * (outputSize / sourceSize));
        
        const scaleFactor = outputSize / sourceSize;
        outputCtx.drawImage(
            img,
            -img.width * scaleFactor / 2,
            -img.height * scaleFactor / 2,
            img.width * scaleFactor,
            img.height * scaleFactor
        );
        
        outputCtx.restore();
        
        // Convert to blob
        outputCanvas.toBlob(
            (blob) => {
                if (blob) {
                    onSave(blob);
                }
            },
            'image/jpeg',
            0.9
        );
    };

    const resetTransform = () => {
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Crop className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                Edit Profile Picture
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Adjust your image and crop to a circle
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Canvas Container */}
                        <div className="flex-1" ref={containerRef}>
                            <div className="relative bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                                <canvas
                                    ref={canvasRef}
                                    width={canvasSize.width}
                                    height={canvasSize.height}
                                    className="border border-slate-300 dark:border-slate-600 rounded-lg cursor-move mx-auto block"
                                    style={{ 
                                        maxWidth: '100%',
                                        height: 'auto',
                                        touchAction: 'none'
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                />
                                
                                {/* Drag instruction */}
                                <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <Move className="w-3 h-3" />
                                    Drag to reposition
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-6 min-w-[280px]">
                            {/* Zoom Control */}
                            <div className="space-y-3">
                                <label className="block text-slate-700 dark:text-slate-300 font-medium text-sm">
                                    Zoom ({Math.round(scale * 100)}%)
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setScale(Math.max(0.1, scale - 0.1))}
                                        className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        disabled={scale <= 0.1}
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="3"
                                        step="0.1"
                                        value={scale}
                                        onChange={(e) => setScale(parseFloat(e.target.value))}
                                        className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <button
                                        onClick={() => setScale(Math.min(3, scale + 0.1))}
                                        className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        disabled={scale >= 3}
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Rotation Control */}
                            <div className="space-y-3">
                                <label className="block text-slate-700 dark:text-slate-300 font-medium text-sm">
                                    Rotation ({rotation}°)
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setRotation(rotation - 15)}
                                        className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={rotation}
                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <button
                                        onClick={() => setRotation(rotation + 15)}
                                        className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-3">
                                <label className="block text-slate-700 dark:text-slate-300 font-medium text-sm">
                                    Quick Actions
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={resetTransform}
                                        className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (imageRef.current && canvasRef.current) {
                                                const canvas = canvasRef.current;
                                                const img = imageRef.current;
                                                const scaleX = canvas.width / img.width;
                                                const scaleY = canvas.height / img.height;
                                                const autoScale = Math.min(scaleX, scaleY) * 0.8;
                                                setScale(autoScale);
                                                setPosition({ x: 0, y: 0 });
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                        Fit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!imageLoaded}
                            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImageEditor;
