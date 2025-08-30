import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, X, CheckCircle } from 'lucide-react';

const UploadProgress = ({ progress, fileName, type, onCancel }) => {
    const getIcon = () => {
        if (progress >= 100) return CheckCircle;
        if (type === 'image') return Image;
        if (type === 'document') return FileText;
        return Upload;
    };

    const Icon = getIcon();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 p-4 min-w-[320px]"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                        progress >= 100 
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    }`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">
                            {progress >= 100 ? 'Upload Complete' : 'Uploading...'}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs truncate max-w-[180px]">
                            {fileName}
                        </p>
                    </div>
                </div>
                {progress < 100 && (
                    <button
                        onClick={onCancel}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{Math.round(progress)}%</span>
                    <span>{progress >= 100 ? 'Done' : 'In progress'}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                            progress >= 100 
                                ? 'bg-green-500' 
                                : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default UploadProgress;
