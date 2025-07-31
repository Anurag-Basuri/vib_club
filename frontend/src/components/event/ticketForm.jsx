import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TicketForm = ({
  eventData,
  formData,
  setFormData,
  loading,
  error,
  onClose,
  onSubmit
}) => {
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-red-900/90 to-black/90 backdrop-blur-sm border border-red-600/50 rounded-xl max-w-md w-full max-h-[90vh] relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-red-600/30 relative">
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-400 mb-1">Enter the Crypt</h3>
            <p className="text-red-300 text-sm">Complete your soul pass purchase</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 pt-4">
          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 mb-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {/* Full Name */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-white placeholder-red-400/50 focus:outline-none focus:border-red-500 text-sm"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email*/}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-white placeholder-red-400/50 focus:outline-none focus:border-red-500 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-white placeholder-red-400/50 focus:outline-none focus:border-red-500 text-sm"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* LPU ID */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-1">
                LPU Registration Number
              </label>
              <input
                type="text"
                name="lpuId"
                value={formData.lpuId}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-white placeholder-red-400/50 focus:outline-none focus:border-red-500 text-sm"
                placeholder="Enter your LPU registration number"
                required
              />
            </div>

            <div>
              <label className="block text-red-300 text-sm font-medium mb-1">
                Amount (₹) - Set by Event
              </label>
              <input
                type="text"
                name="amount"
                value={`₹${formData.amount}`}
                readOnly
                disabled
                className="w-full bg-gray-800/50 border border-red-600/30 rounded-lg px-3 py-2 text-gray-300 text-sm cursor-not-allowed"
              />
              <p className="text-red-400/70 text-xs mt-1">Ticket price set by event organizers</p>
            </div>
            <div className="flex gap-3 pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-white transition-colors text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Pay Now 🔥'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TicketForm;