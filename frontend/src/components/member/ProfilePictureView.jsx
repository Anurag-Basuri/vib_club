import React from 'react';
import { motion } from 'framer-motion';
import { X, Upload, ZoomIn, Download } from 'lucide-react';

const ProfilePictureView = ({ image, onClose, onUploadNew }) => {
    // Download profile picture
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'profile-picture.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900/70 backdrop-blur-md rounded-3xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Profile Picture</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Image Container */}
                <div className="relative">
                    <div className="p-4 sm:p-8 flex items-center justify-center">
                        <img 
                            src={image} 
                            alt="Profile" 
                            className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 p-4 border-t border-gray-700">
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all font-medium flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    
                    <button
                        onClick={onUploadNew}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all font-medium flex items-center gap-2 shadow-lg"
                    >
                        <Upload className="w-4 h-4" />
                        Upload New
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProfilePictureView;