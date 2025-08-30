import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    Save, 
    X, 
    RotateCw, 
    ZoomIn, 
    ZoomOut, 
    Move,
    RefreshCw,
    Maximize2,
    Crop,
    SunMedium,
    Contrast,
    Filter
} from 'lucide-react';

const ImageEditor = ({ image, onSave, onCancel }) => {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    
    const [transform, setTransform] = useState({
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [canvasSize, setCanvasSize] = useState(400);
    const [filter, setFilter] = useState('none');
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [activeTab, setActiveTab] = useState('transform'); // 'transform', 'adjust', 'filters'

    // Responsive canvas sizing
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const container = containerRef.current;
                const maxSize = Math.min(
                    container.offsetWidth - 40,
                    window.innerHeight * 0.5,
                    500
                );
                setCanvasSize(Math.max(300, maxSize));
            }
        };
        
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Load image
    useEffect(() => {
        if (!image) return;
        
        const img = new Image();
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);
            
            // Auto-fit image
            const maxDim = Math.max(img.width, img.height);
            const autoScale = (canvasSize * 0.7) / maxDim;
            setTransform(prev => ({ ...prev, scale: autoScale }));
        };
        img.src = image;
    }, [image, canvasSize]);

    // Draw on canvas
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img || !imageLoaded) return;

        const ctx = canvas.getContext('2d');
        const { scale, rotation, x, y } = transform;
        const center = canvasSize / 2;
        const cropRadius = canvasSize * 0.35;

        // Clear and setup
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        
        // Background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Draw image with transforms
        ctx.save();
        ctx.translate(center + x, center + y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        // Crop overlay
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(center, center, cropRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        // Crop border
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(center, center, cropRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Grid lines for better alignment
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        // Vertical and horizontal center lines
        ctx.beginPath();
        ctx.moveTo(center, center - cropRadius);
        ctx.lineTo(center, center + cropRadius);
        ctx.moveTo(center - cropRadius, center);
        ctx.lineTo(center + cropRadius, center);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }, [transform, imageLoaded, canvasSize]);

    useEffect(() => {
        draw();
    }, [draw]);

    // Mouse/Touch handlers
    const getEventPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const handleStart = (e) => {
        e.preventDefault();
        const pos = getEventPos(e);
        setIsDragging(true);
        setDragStart({
            x: pos.x - transform.x,
            y: pos.y - transform.y
        });
    };

    const handleMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const pos = getEventPos(e);
        setTransform(prev => ({
            ...prev,
            x: pos.x - dragStart.x,
            y: pos.y - dragStart.y
        }));
    };

    const handleEnd = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Control functions
    const updateTransform = (updates) => {
        setTransform(prev => ({ ...prev, ...updates }));
    };

    const resetImage = () => {
        setTransform({ scale: 1, rotation: 0, x: 0, y: 0 });
    };

    const fitImage = () => {
        if (!imageRef.current) return;
        const img = imageRef.current;
        const maxDim = Math.max(img.width, img.height);
        const autoScale = (canvasSize * 0.7) / maxDim;
        setTransform({ scale: autoScale, rotation: 0, x: 0, y: 0 });
    };

    // Save cropped image
    const handleSave = () => {
        if (!canvasRef.current || !imageRef.current) return;

        const outputSize = 400;
        const outputCanvas = document.createElement('canvas');
        const outputCtx = outputCanvas.getContext('2d');
        
        outputCanvas.width = outputSize;
        outputCanvas.height = outputSize;

        const { scale, rotation, x, y } = transform;
        const center = outputSize / 2;
        const cropRadius = outputSize / 2;
        const scaleFactor = outputSize / canvasSize;

        // Create circular clip
        outputCtx.beginPath();
        outputCtx.arc(center, center, cropRadius, 0, 2 * Math.PI);
        outputCtx.clip();

        // Apply filters
        outputCtx.filter = getImageFilters();

        // Draw transformed image
        outputCtx.save();
        outputCtx.translate(center + (x * scaleFactor), center + (y * scaleFactor));
        outputCtx.rotate((rotation * Math.PI) / 180);
        outputCtx.scale(scale, scale);
        outputCtx.drawImage(
            imageRef.current, 
            -imageRef.current.width / 2, 
            -imageRef.current.height / 2
        );
        outputCtx.restore();

        outputCanvas.toBlob(onSave, 'image/jpeg', 0.92);
    };

    const controls = [
        {
            label: 'Zoom',
            value: Math.round(transform.scale * 100),
            unit: '%',
            min: 10,
            max: 300,
            step: 5,
            onChange: (value) => updateTransform({ scale: value / 100 }),
            buttons: [
                { icon: ZoomOut, action: () => updateTransform({ scale: Math.max(0.1, transform.scale - 0.1) }) },
                { icon: ZoomIn, action: () => updateTransform({ scale: Math.min(3, transform.scale + 0.1) }) }
            ]
        },
        {
            label: 'Rotate',
            value: transform.rotation,
            unit: '°',
            min: 0,
            max: 360,
            step: 1,
            onChange: (value) => updateTransform({ rotation: value }),
            buttons: [
                { icon: RotateCw, action: () => updateTransform({ rotation: (transform.rotation + 90) % 360 }) }
            ]
        }
    ];

    const getImageFilters = () => {
        return `brightness(${brightness}%) contrast(${contrast}%) ${filter !== 'none' ? `filter(${filter})` : ''}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                            <Crop className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Crop Profile Picture
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                Adjust and crop your image to a perfect circle
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col xl:flex-row gap-8">
                        {/* Canvas */}
                        <div className="flex-1 flex flex-col items-center" ref={containerRef}>
                            <div className="relative bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-4">
                                <canvas
                                    ref={canvasRef}
                                    width={canvasSize}
                                    height={canvasSize}
                                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 cursor-move shadow-lg"
                                    style={{ touchAction: 'none' }}
                                    onMouseDown={handleStart}
                                    onMouseMove={handleMove}
                                    onMouseUp={handleEnd}
                                    onMouseLeave={handleEnd}
                                    onTouchStart={handleStart}
                                    onTouchMove={handleMove}
                                    onTouchEnd={handleEnd}
                                />
                                
                                {/* Instruction */}
                                <div className="absolute top-8 left-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 shadow-lg">
                                    <Move className="w-4 h-4" />
                                    Drag to move image
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="w-full xl:w-80 space-y-6">
                            {/* Tabs */}
                            <div className="mb-6 border-b border-gray-200 dark:border-gray-600">
                                <div className="flex space-x-1 mb-4">
                                    <button
                                        onClick={() => setActiveTab('transform')}
                                        className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                                            activeTab === 'transform' 
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' 
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        Transform
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('adjust')}
                                        className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                                            activeTab === 'adjust' 
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' 
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        Adjust
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('filters')}
                                        className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                                            activeTab === 'filters' 
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' 
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        Filters
                                    </button>
                                </div>
                            </div>

                            {/* Controls based on active tab */}
                            {activeTab === 'transform' && (
                                <>
                                    {controls.map((control) => (
                                        <div key={control.label} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {control.label}
                                                </label>
                                                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                                                    {control.value}{control.unit}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min={control.min}
                                                    max={control.max}
                                                    step={control.step}
                                                    value={control.value}
                                                    onChange={(e) => control.onChange(Number(e.target.value))}
                                                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                                                />
                                                
                                                <div className="flex gap-1">
                                                    {control.buttons.map((button, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={button.action}
                                                            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        >
                                                            <button.icon className="w-4 h-4" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Quick Actions */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Quick Actions
                                        </label>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={resetImage}
                                                className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                Reset
                                            </button>
                                            
                                            <button
                                                onClick={fitImage}
                                                className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
                                            >
                                                <Maximize2 className="w-4 h-4" />
                                                Fit
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'adjust' && (
                                <>
                                    <div className="space-y-6">
                                        {/* Brightness */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <SunMedium className="w-4 h-4" />
                                                    Brightness
                                                </label>
                                                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                                                    {brightness}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="50"
                                                max="150"
                                                step="1"
                                                value={brightness}
                                                onChange={(e) => setBrightness(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                                            />
                                        </div>
                                        
                                        {/* Contrast */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <Contrast className="w-4 h-4" />
                                                    Contrast
                                                </label>
                                                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                                                    {contrast}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="50"
                                                max="150"
                                                step="1"
                                                value={contrast}
                                                onChange={(e) => setContrast(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                                            />
                                        </div>
                                        
                                        <button
                                            onClick={() => {
                                                setBrightness(100);
                                                setContrast(100);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Reset Adjustments
                                        </button>
                                    </div>
                                </>
                            )}

                            {activeTab === 'filters' && (
                                <div>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <button
                                            onClick={() => setFilter('none')}
                                            className={`p-3 rounded-xl ${filter === 'none' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}
                                        >
                                            <div className="aspect-square rounded-lg overflow-hidden mb-2">
                                                <img 
                                                    src={image} 
                                                    alt="Normal" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">Normal</p>
                                        </button>
                                        
                                        <button
                                            onClick={() => setFilter('grayscale(1)')}
                                            className={`p-3 rounded-xl ${filter === 'grayscale(1)' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}
                                        >
                                            <div className="aspect-square rounded-lg overflow-hidden mb-2">
                                                <img 
                                                    src={image} 
                                                    alt="B&W" 
                                                    className="w-full h-full object-cover filter grayscale"
                                                />
                                            </div>
                                            <p className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">B&W</p>
                                        </button>
                                        
                                        <button
                                            onClick={() => setFilter('sepia(0.7)')}
                                            className={`p-3 rounded-xl ${filter === 'sepia(0.7)' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}
                                        >
                                            <div className="aspect-square rounded-lg overflow-hidden mb-2">
                                                <img 
                                                    src={image} 
                                                    alt="Sepia" 
                                                    className="w-full h-full object-cover filter sepia"
                                                />
                                            </div>
                                            <p className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">Sepia</p>
                                        </button>
                                    </div>
                                    
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Select a filter to enhance your profile picture
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <button
                            onClick={onCancel}
                            className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold"
                        >
                            Cancel
                        </button>
                        
                        <button
                            onClick={handleSave}
                            disabled={!imageLoaded}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            Save Picture
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImageEditor;
