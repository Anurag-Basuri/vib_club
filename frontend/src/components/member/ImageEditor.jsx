import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
  Filter,
} from "lucide-react";

const ImageEditor = ({ image, onSave, onCancel, isEditing, onUploadNew }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const [transform, setTransform] = useState({
    scale: 1,
    rotation: 0,
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState(400);
  const [filter, setFilter] = useState("none");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [activeTab, setActiveTab] = useState("transform"); // 'transform', 'adjust', 'filters'

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
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
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
      setTransform((prev) => ({ ...prev, scale: autoScale }));
    };
    img.src = image;
  }, [image, canvasSize]);

  // Draw on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    const { scale, rotation, x, y } = transform;
    const center = canvasSize / 2;
    const cropRadius = canvasSize * 0.35;

    // Clear and setup
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Background
    ctx.fillStyle = "#f8fafc";
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
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(center, center, cropRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // Crop border
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, cropRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Grid lines for better alignment
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
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
      y: clientY - rect.top,
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
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
    const outputCanvas = document.createElement("canvas");
    const outputCtx = outputCanvas.getContext("2d");

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
    outputCtx.translate(center + x * scaleFactor, center + y * scaleFactor);
    outputCtx.rotate((rotation * Math.PI) / 180);
    outputCtx.scale(scale, scale);
    outputCtx.drawImage(imageRef.current, -imageRef.current.width / 2, -imageRef.current.height / 2);
    outputCtx.restore();

    outputCanvas.toBlob(onSave, "image/jpeg", 0.92);
  };

  const controls = [
    {
      label: "Zoom",
      value: Math.round(transform.scale * 100),
      unit: "%",
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
      label: "Rotate",
      value: transform.rotation,
      unit: "°",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Canvas */}
          <div className="flex-1 flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
              style={{ background: "#222" }}
            />
          </div>
          {/* Controls */}
          {isEditing && (
            <div className="w-full xl:w-80 space-y-6">
              {/* ...your controls for zoom, rotate, filters, etc... */}
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onCancel}
            className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold"
          >
            {isEditing ? "Cancel" : "Close"}
          </button>
          {!isEditing && onUploadNew && (
            <button
              onClick={onUploadNew}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all font-semibold"
            >
              Upload New
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={!imageLoaded}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              Save Picture
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
