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
    FlipHorizontal,
    FlipVertical,
    Sun,
    Contrast,
    Palette,
    Image as ImageIcon,
    Crop,
    RotateCcw,
    Sliders,
    Layers,
    Grid,
    History,
    Eye,
    EyeOff,
    Settings,
} from 'lucide-react';

// --- UI constants ---
const CONTROL_BTN =
    'inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400';

const SLIDER = 'w-full accent-blue-500 h-2 rounded-lg appearance-none bg-gray-200 dark:bg-gray-700';

const TAB_BTN = 'px-4 py-2 rounded-lg font-semibold transition-colors text-sm focus:outline-none';
const TAB_BTN_ACTIVE = 'bg-blue-600 text-white shadow';
const TAB_BTN_INACTIVE =
    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-700';

// --- Filters ---
const FILTERS = [
    { name: 'None', fn: () => 'none', icon: <X size={18} /> },
    { name: 'Grayscale', fn: () => 'grayscale(100%)', icon: <Contrast size={18} /> },
    { name: 'Sepia', fn: () => 'sepia(100%)', icon: <Sun size={18} /> },
    { name: 'Invert', fn: () => 'invert(100%)', icon: <Contrast size={18} className="rotate-180" /> },
    { name: 'Blur', fn: () => 'blur(2px)', icon: <ImageIcon size={18} /> },
    { name: 'Hue Rotate', fn: () => 'hue-rotate(90deg)', icon: <Palette size={18} /> },
    { name: 'Cool', fn: () => 'brightness(110%) contrast(120%) saturate(120%) hue-rotate(200deg)', icon: <Palette size={18} className="text-blue-400" /> },
    { name: 'Warm', fn: () => 'brightness(110%) contrast(110%) saturate(120%) hue-rotate(-20deg)', icon: <Palette size={18} className="text-orange-400" /> },
    { name: 'Vintage', fn: () => 'sepia(50%) hue-rotate(-20deg) contrast(110%) brightness(110%)', icon: <History size={18} className="text-amber-600" /> },
    { name: 'Dramatic', fn: () => 'contrast(150%) brightness(90%) saturate(110%)', icon: <Contrast size={18} className="text-purple-500" /> },
];

// --- Aspect ratios ---
const ASPECT_RATIOS = [
    { name: 'Square', value: 1 },
    { name: '16:9', value: 16 / 9 },
    { name: '4:3', value: 4 / 3 },
    { name: '3:4', value: 3 / 4 },
    { name: '9:16', value: 9 / 16 },
];

const ImageEditor = ({
    image,
    onSave,
    onCancel,
    isEditing,
    onUploadNew,
    setIsEditingImage,
    viewOriginal = false,
    setViewOriginal,
}) => {
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
    const [activeTab, setActiveTab] = useState('transform');
    const [filterIndex, setFilterIndex] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [editHistory, setEditHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Responsive canvas sizing ---
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const container = containerRef.current;
                const maxSize = Math.min(
                    container.offsetWidth - 16,
                    window.innerHeight * 0.45,
                    500
                );
                setCanvasSize(Math.max(200, maxSize));
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // --- Load image and auto-fit to crop area ---
    useEffect(() => {
        if (!image) return;
        setImageLoaded(false);
        const img = new window.Image();
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);

            // Auto-fit image to crop rectangle (centered, scaled to cover)
            const cropW = canvasSize * 0.8;
            const cropH = cropW / aspectRatio;
            const scaleX = cropW / img.width;
            const scaleY = cropH / img.height;
            const autoScale = Math.max(scaleX, scaleY);

            const initialState = {
                scale: autoScale,
                x: 0,
                y: 0,
                rotation: 0,
                flipX: false,
                flipY: false,
            };

            setTransform(initialState);
            setBrightness(100);
            setContrast(100);
            setSaturation(100);
            setFilterIndex(0);

            setEditHistory([initialState]);
            setHistoryIndex(0);

            // If not editing, immediately save the cropped image
            if (!isEditing && onSave) {
                setTimeout(() => handleSave(img, autoScale), 100);
            }
        };
        img.src = image;
        // eslint-disable-next-line
    }, [image, canvasSize, aspectRatio]);

    // --- Save state to history when adjustments are made ---
    useEffect(() => {
        if (historyIndex === -1) return;
        const currentState = {
            ...transform,
            brightness,
            contrast,
            saturation,
            filterIndex,
        };
        if (
            editHistory.length === 0 ||
            JSON.stringify(currentState) !== JSON.stringify(editHistory[historyIndex])
        ) {
            const newHistory = editHistory.slice(0, historyIndex + 1);
            newHistory.push(currentState);
            setEditHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
        // eslint-disable-next-line
    }, [transform, brightness, contrast, saturation, filterIndex]);

    // --- Draw on canvas ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img || !imageLoaded) return;

        const ctx = canvas.getContext('2d');
        const { scale, rotation, x, y, flipX, flipY } = transform;

        const cropW = canvasSize * 0.8;
        const cropH = cropW / aspectRatio;
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;

        // Clear and setup
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Draw image with transforms and filters
        ctx.save();
        ctx.translate(centerX + x, centerY + y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale * (flipX ? -1 : 1), scale * (flipY ? -1 : 1));
        if (viewOriginal) {
            ctx.filter = 'none';
        } else {
            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${FILTERS[filterIndex].fn()}`;
        }
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        // Crop overlay
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.rect(centerX - cropW / 2, centerY - cropH / 2, cropW, cropH);
        ctx.fill();
        ctx.restore();

        // Crop border
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(centerX - cropW / 2, centerY - cropH / 2, cropW, cropH);
        ctx.stroke();

        // Grid lines for better alignment
        if (showGrid) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.18)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            // Vertical lines
            for (let i = 1; i < 3; i++) {
                const xPos = centerX - cropW / 2 + (cropW / 3) * i;
                ctx.moveTo(xPos, centerY - cropH / 2);
                ctx.lineTo(xPos, centerY + cropH / 2);
            }
            // Horizontal lines
            for (let i = 1; i < 3; i++) {
                const yPos = centerY - cropH / 2 + (cropH / 3) * i;
                ctx.moveTo(centerX - cropW / 2, yPos);
                ctx.lineTo(centerX + cropW / 2, yPos);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }, [
        transform,
        imageLoaded,
        canvasSize,
        brightness,
        contrast,
        saturation,
        filterIndex,
        viewOriginal,
        aspectRatio,
        showGrid,
    ]);

    useEffect(() => {
        draw();
    }, [draw]);

    // --- Mouse/Touch handlers ---
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

    // --- Control functions ---
    const updateTransform = (updates) => {
        setTransform((prev) => ({ ...prev, ...updates }));
    };

    const resetImage = () => {
        if (!imageRef.current) return;
        const img = imageRef.current;
        const cropW = canvasSize * 0.8;
        const cropH = cropW / aspectRatio;
        const scaleX = cropW / img.width;
        const scaleY = cropH / img.height;
        const autoScale = Math.max(scaleX, scaleY);
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
    };

    const fitImage = () => {
        if (!imageRef.current) return;
        const img = imageRef.current;
        const cropW = canvasSize * 0.8;
        const cropH = cropW / aspectRatio;
        const scaleX = cropW / img.width;
        const scaleY = cropH / img.height;
        const autoScale = Math.max(scaleX, scaleY);
        setTransform({
            scale: autoScale,
            rotation: 0,
            x: 0,
            y: 0,
            flipX: false,
            flipY: false,
        });
    };

    // --- Undo/Redo functionality ---
    const undo = () => {
        if (historyIndex > 0) {
            const previousState = editHistory[historyIndex - 1];
            setTransform({
                scale: previousState.scale,
                rotation: previousState.rotation,
                x: previousState.x,
                y: previousState.y,
                flipX: previousState.flipX,
                flipY: previousState.flipY,
            });
            setBrightness(previousState.brightness ?? 100);
            setContrast(previousState.contrast ?? 100);
            setSaturation(previousState.saturation ?? 100);
            setFilterIndex(previousState.filterIndex ?? 0);
            setHistoryIndex(historyIndex - 1);
        }
    };

    const redo = () => {
        if (historyIndex < editHistory.length - 1) {
            const nextState = editHistory[historyIndex + 1];
            setTransform({
                scale: nextState.scale,
                rotation: nextState.rotation,
                x: nextState.x,
                y: nextState.y,
                flipX: nextState.flipX,
                flipY: nextState.flipY,
            });
            setBrightness(nextState.brightness ?? 100);
            setContrast(nextState.contrast ?? 100);
            setSaturation(nextState.saturation ?? 100);
            setFilterIndex(nextState.filterIndex ?? 0);
            setHistoryIndex(historyIndex + 1);
        }
    };

    // --- Save cropped image ---
    const handleSave = async (imgOverride, scaleOverride) => {
        setIsProcessing(true);
        const img = imgOverride || imageRef.current;
        if (!canvasRef.current || !img) {
            setIsProcessing(false);
            return;
        }

        const outputW = 800;
        const cropW = canvasSize * 0.8;
        const cropH = cropW / aspectRatio;
        const outputH = Math.round(outputW / aspectRatio);
        const outputCanvas = document.createElement('canvas');
        const outputCtx = outputCanvas.getContext('2d');

        outputCanvas.width = outputW;
        outputCanvas.height = outputH;

        const { scale, rotation, x, y, flipX, flipY } = transform;
        const center = canvasSize / 2;
        const scaleFactor = outputW / cropW;

        // Apply filters
        outputCtx.filter = viewOriginal
            ? 'none'
            : `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${FILTERS[filterIndex].fn()}`;

        // Draw transformed image, centered and scaled to crop
        outputCtx.save();
        outputCtx.translate(outputW / 2, outputH / 2);
        outputCtx.rotate((rotation * Math.PI) / 180);
        outputCtx.scale(
            (scaleOverride !== undefined ? scaleOverride : scale) * (flipX ? -1 : 1) * scaleFactor,
            (scaleOverride !== undefined ? scaleOverride : scale) * (flipY ? -1 : 1) * scaleFactor
        );
        outputCtx.drawImage(
            img,
            -img.width / 2 + (x * outputW) / cropW,
            -img.height / 2 + (y * outputH) / cropH
        );
        outputCtx.restore();

        await new Promise((resolve) => setTimeout(resolve, 200));
        outputCanvas.toBlob(onSave, 'image/jpeg', 0.92);
        setIsProcessing(false);
    };

    // --- Controls UI ---
    const renderTransformControls = () => (
        <div className="space-y-6">
            {/* Aspect Ratio */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Aspect Ratio</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                        <button
                            key={ratio.name}
                            className={`px-2 py-1.5 text-xs rounded-md font-medium transition-colors ${
                                aspectRatio === ratio.value
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => {
                                setAspectRatio(ratio.value);
                                setTimeout(fitImage, 100);
                            }}
                            aria-label={`Aspect Ratio: ${ratio.name}`}
                            type="button"
                        >
                            {ratio.name}
                        </button>
                    ))}
                </div>
            </div>
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
                            updateTransform({ scale: Math.max(0.1, transform.scale - 0.1) })
                        }
                        aria-label="Zoom Out"
                        type="button"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <input
                        type="range"
                        min={10}
                        max={300}
                        step={1}
                        value={Math.round(transform.scale * 100)}
                        onChange={(e) => updateTransform({ scale: Number(e.target.value) / 100 })}
                        className={SLIDER}
                    />
                    <button
                        className={CONTROL_BTN}
                        onClick={() =>
                            updateTransform({ scale: Math.min(5, transform.scale + 0.1) })
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
                            updateTransform({ rotation: (transform.rotation - 90 + 360) % 360 })
                        }
                        aria-label="Rotate Left"
                        type="button"
                    >
                        <RotateCcw size={18} />
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
                        className={`${CONTROL_BTN} ${transform.flipX ? 'bg-blue-500 text-white' : ''}`}
                        onClick={() => updateTransform({ flipX: !transform.flipX })}
                        aria-label="Flip Horizontal"
                        type="button"
                    >
                        <FlipHorizontal size={18} />
                    </button>
                    <button
                        className={`${CONTROL_BTN} ${transform.flipY ? 'bg-blue-500 text-white' : ''}`}
                        onClick={() => updateTransform({ flipY: !transform.flipY })}
                        aria-label="Flip Vertical"
                        type="button"
                    >
                        <FlipVertical size={18} />
                    </button>
                </div>
            </div>
            {/* Grid Toggle */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Grid</span>
                </div>
                <button
                    className={`${CONTROL_BTN} ${showGrid ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => setShowGrid(!showGrid)}
                    aria-label="Toggle Grid"
                    type="button"
                >
                    <Grid size={18} />
                </button>
            </div>
            {/* Position */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Position</span>
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
                        aria-label="Fit to Crop"
                        type="button"
                    >
                        <Crop size={18} />
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
                    min={0}
                    max={200}
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
                    min={0}
                    max={200}
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
                    onClick={() => {
                        setBrightness(100);
                        setContrast(100);
                        setSaturation(100);
                    }}
                    aria-label="Reset Adjustments"
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
                <div className="grid grid-cols-3 gap-2">
                    {FILTERS.map((f, idx) => (
                        <button
                            key={f.name}
                            className={`flex flex-col items-center p-2 rounded-lg transition-colors text-xs ${
                                filterIndex === idx
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => setFilterIndex(idx)}
                            aria-label={f.name}
                            type="button"
                        >
                            <div className="w-8 h-8 mb-1 flex items-center justify-center">
                                {f.icon}
                            </div>
                            <span>{f.name}</span>
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2 sm:p-4"
            >
                <div
                    ref={containerRef}
                    className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl mx-auto p-0 sm:p-4 flex flex-col"
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
                                {isEditing ? 'Edit Image' : 'Image Preview'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            {isEditing && (
                                <>
                                    <button
                                        className={CONTROL_BTN}
                                        onClick={undo}
                                        disabled={historyIndex <= 0}
                                        aria-label="Undo"
                                        type="button"
                                    >
                                        <History size={18} />
                                    </button>
                                    <button
                                        className={CONTROL_BTN}
                                        onClick={redo}
                                        disabled={historyIndex >= editHistory.length - 1}
                                        aria-label="Redo"
                                        type="button"
                                    >
                                        <History size={18} className="rotate-180" />
                                    </button>
                                </>
                            )}
                            <button
                                onClick={onCancel}
                                className={CONTROL_BTN + ' ml-2'}
                                aria-label="Close"
                                type="button"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    {/* Main */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-4 xl:gap-6 p-2 sm:p-4 overflow-y-auto">
                        {/* Canvas */}
                        <div className="flex-1 flex flex-col items-center justify-center min-w-[200px]">
                            <canvas
                                ref={canvasRef}
                                width={canvasSize}
                                height={canvasSize}
                                className="rounded-lg sm:rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 touch-none cursor-move"
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
                                onClick={() => {
                                    if (typeof setViewOriginal === 'function') {
                                        setViewOriginal((v) => !v);
                                    }
                                }}
                            />
                            <div className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-2">
                                {isEditing
                                    ? 'Drag to move. Use controls to adjust.'
                                    : viewOriginal
                                    ? 'Original (click to toggle back)'
                                    : 'Preview (click to view original)'}
                                {isEditing && (
                                    <button
                                        onClick={() => setViewOriginal((v) => !v)}
                                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                        type="button"
                                    >
                                        {viewOriginal ? <EyeOff size={14} /> : <Eye size={14} />}
                                        {viewOriginal ? 'Hide Original' : 'View Original'}
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Controls */}
                        {isEditing && (
                            <div className="w-full lg:w-80 xl:w-96 space-y-6 overflow-y-auto max-h-[50vh] lg:max-h-none py-2">
                                {/* Tabs */}
                                <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
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
                                        <Sliders size={16} className="sm:mr-1" />
                                        <span className="hidden sm:inline">Transform</span>
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
                                        <Settings size={16} className="sm:mr-1" />
                                        <span className="hidden sm:inline">Adjust</span>
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
                                        <Layers size={16} className="sm:mr-1" />
                                        <span className="hidden sm:inline">Filters</span>
                                    </button>
                                </div>
                                {activeTab === 'transform'
                                    ? renderTransformControls()
                                    : activeTab === 'adjust'
                                    ? renderAdjustControls()
                                    : renderFilterControls()}
                                {/* Reset All Button */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={resetImage}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                                        type="button"
                                    >
                                        <RefreshCw size={16} />
                                        Reset All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-2 sm:mt-4 px-2 sm:px-4 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div className="flex-1 flex items-center gap-2">
                            {!isEditing && onUploadNew && (
                                <>
                                    <button
                                        onClick={onUploadNew}
                                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl font-medium transition-all text-sm"
                                        type="button"
                                    >
                                        <Upload size={16} />
                                        <span className="hidden sm:inline">Upload New</span>
                                    </button>
                                    {setIsEditingImage && (
                                        <button
                                            onClick={() => setIsEditingImage(true)}
                                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium transition-all text-sm"
                                            type="button"
                                        >
                                            <Edit3 size={16} />
                                            <span className="hidden sm:inline">Edit</span>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={onCancel}
                                className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium text-sm"
                                type="button"
                            >
                                {isEditing ? 'Cancel' : 'Close'}
                            </button>
                            {isEditing && (
                                <button
                                    onClick={() => handleSave()}
                                    disabled={!imageLoaded || isProcessing}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg sm:rounded-xl font-medium shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all text-sm"
                                    type="button"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            <span className="hidden sm:inline">Save Image</span>
                                        </>
                                    )}
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