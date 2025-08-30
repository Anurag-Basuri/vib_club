import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const MessageNotification = ({ message, onClose }) => {
    const isSuccess = message && (
        message.includes('successfully') || 
        message.includes('Success') ||
        message.includes('complete')
    );

    const isError = message && !isSuccess;

    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    className="fixed top-4 right-4 z-50 max-w-md"
                >
                    <div className={`p-4 rounded-xl shadow-lg border backdrop-blur-sm ${
                        isSuccess 
                            ? 'bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-700'
                            : 'bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-700'
                    }`}>
                        <div className="flex items-start gap-3">
                            <div className={`p-1 rounded-full ${
                                isSuccess 
                                    ? 'bg-green-100 dark:bg-green-800' 
                                    : 'bg-red-100 dark:bg-red-800'
                            }`}>
                                {isSuccess ? (
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                    isSuccess 
                                        ? 'text-green-800 dark:text-green-200' 
                                        : 'text-red-800 dark:text-red-200'
                                }`}>
                                    {isSuccess ? 'Success' : 'Error'}
                                </p>
                                <p className={`text-sm mt-1 ${
                                    isSuccess 
                                        ? 'text-green-700 dark:text-green-300' 
                                        : 'text-red-700 dark:text-red-300'
                                }`}>
                                    {message}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className={`p-1 rounded-full hover:bg-white/20 transition-colors ${
                                    isSuccess 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : 'text-red-600 dark:text-red-400'
                                }`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MessageNotification;
