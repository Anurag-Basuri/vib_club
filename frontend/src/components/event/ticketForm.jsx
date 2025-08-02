import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TicketForm = ({
  formData,
  setFormData,
  loading,
  error,
  onClose,
  onSubmit
}) => {
  const modalRef = useRef(null);
  
  // Prevent background scroll without layout shift
  useEffect(() => {
    const html = document.documentElement;
    const originalOverflow = html.style.overflow;
    const originalPaddingRight = html.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    html.style.overflow = 'hidden';
    html.style.paddingRight = `${scrollbarWidth}px`;
    
    // Focus on modal for keyboard accessibility
    if (modalRef.current) {
      modalRef.current.focus();
    }
    
    return () => {
      html.style.overflow = originalOverflow;
      html.style.paddingRight = originalPaddingRight;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        className="bg-gradient-to-br from-red-900/95 to-black/95 backdrop-blur-lg border border-red-700/60 shadow-2xl rounded-2xl max-w-lg w-full h-auto relative flex flex-col max-h-[92dvh] sm:max-h-[85dvh] transition-all overflow-hidden"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-7 border-b border-red-700/40 relative flex-shrink-0 bg-gradient-to-r from-red-900/60 to-black/60">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-extrabold text-red-300 mb-1 tracking-wide drop-shadow-lg">
              Enter the Crypt
            </h3>
            <p className="text-red-200 text-xs sm:text-sm">Complete your soul pass purchase</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-red-300 hover:text-red-200 text-xl transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/60 border border-red-700 rounded-lg p-3 mb-4 text-center"
            >
              <p className="text-red-200 text-sm">{error}</p>
            </motion.div>
          )}
          
          <form
            className="space-y-4 sm:space-y-5"
            onSubmit={e => {
              e.preventDefault();
              onSubmit();
            }}
            autoComplete="off"
          >
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-red-200 text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-base transition-all"
                  placeholder="Enter your full name"
                  required
                  autoFocus
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-red-200 text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-base transition-all"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-red-200 text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-base transition-all"
                  placeholder="Enter your phone number"
                  required
                  autoComplete="tel"
                />
              </div>

              {/* LPU ID */}
              <div>
                <label className="block text-red-200 text-sm font-medium mb-1">
                  LPU Registration Number
                </label>
                <input
                  type="text"
                  name="lpuId"
                  value={formData.lpuId}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-base transition-all"
                  placeholder="Enter your LPU registration number"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-red-200 text-sm font-medium mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-base transition-all"
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Hosteler Status */}
              <div>
                <label className="block text-red-200 text-sm font-medium mb-1">
                  Are you a Hosteler?
                </label>
                <select
                  name="hosteler"
                  value={formData.hosteler}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-base transition-all"
                  required
                >
                  <option value="">Select your status</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Hostel Name */}
              {formData.hosteler === "true" && (
                <div>
                  <label className="block text-red-200 text-sm font-medium mb-1">
                    Hostel Name
                  </label>
                  <input
                    type="text"
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-base transition-all"
                    placeholder="Enter your hostel name"
                    required
                  />
                </div>
              )}

              {/* Course */}
              <div>
                <label className="block text-red-200 text-sm font-medium mb-1">
                  Course
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-base transition-all"
                  placeholder="Enter your course name"
                  required
                />
              </div>

              {/* Amount */}
              <div className="bg-gray-900/30 p-3 rounded-lg border border-red-700/30">
                <label className="block text-red-200 text-sm font-medium mb-1">
                  Amount
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-red-300">₹{formData.amount}</span>
                  <span className="text-xs text-red-300/80 bg-red-900/30 px-2 py-1 rounded">
                    Fixed Price
                  </span>
                </div>
                <p className="text-red-300/70 text-xs mt-1">Ticket price set by event organizers</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-white transition-colors text-base"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg shadow-red-900/30"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Pay Now</span>
                    <span className="text-lg">🔥</span>
                  </div>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
      
      {/* Custom scrollbar styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ef4444, #7f1d1d);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </motion.div>
  );
};

export default TicketForm;