import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const TicketForm = ({ formData, setFormData, loading, error, onClose, onSubmit }) => {
  const modalRef = useRef(null);

  // Focus management and Escape key
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      // Trap focus within modal
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, [setFormData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  }, [onSubmit]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden'
      }}
    >
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        className="bg-gradient-to-br from-red-900/95 to-black/95 backdrop-blur-lg border border-red-700/60 shadow-2xl rounded-2xl max-w-lg w-full max-h-[90vh] relative flex flex-col overflow-hidden"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', zIndex: 10000 }}
      >
        {/* Header */}
        <div className="p-5 sm:p-7 border-b border-red-700/40 relative flex-shrink-0 bg-gradient-to-r from-red-900/60 to-black/60">
          <div className="text-center">
            <h3
              id="modal-title"
              className="text-xl sm:text-2xl font-extrabold text-red-300 mb-1 tracking-wide drop-shadow-lg"
            >
              Enter the Crypt
            </h3>
            <p className="text-red-200 text-xs sm:text-sm">
              Complete your soul pass purchase
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-red-300 hover:text-red-200 text-xl transition-colors hover:bg-red-900/30 rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form
          className="flex-1 flex flex-col min-h-0"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div
            className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/60 border border-red-700 rounded-lg p-3 mb-4 text-center"
                role="alert"
              >
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:gap-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-red-200 text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all"
                    placeholder="Enter your full name"
                    required
                    autoFocus
                  />
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-red-200 text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-red-200 text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all"
                    placeholder="Enter your phone number"
                    required
                    autoComplete="tel"
                  />
                </div>
                {/* LPU ID */}
                <div>
                  <label htmlFor="lpuId" className="block text-red-200 text-sm font-medium mb-1">
                    LPU Registration Number
                  </label>
                  <input
                    id="lpuId"
                    type="text"
                    name="lpuId"
                    value={formData.lpuId || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all"
                    placeholder="Enter your LPU registration number"
                    required
                  />
                </div>
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-red-200 text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all"
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {/* Club */}
                <div>
                  <label htmlFor="club" className="block text-red-200 text-sm font-medium mb-1">
                    Club
                  </label>
                  <select
                    id="club"
                    name="club"
                    value={formData.club || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all"
                    required
                  >
                    <option value="">Select your club</option>
                    <option value="SML">SML</option>
                    <option value="Vibranta">Vibranta</option>
                  </select>
                </div>
                {/* Hosteler Status */}
                <div>
                  <label htmlFor="hosteler" className="block text-red-200 text-sm font-medium mb-1">
                    Are you a Hosteler?
                  </label>
                  <select
                    id="hosteler"
                    name="hosteler"
                    value={formData.hosteler || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all"
                    required
                  >
                    <option value="">Select your status</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                {/* Hostel Name - Conditional */}
                {formData.hosteler === 'true' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="hostel" className="block text-red-200 text-sm font-medium mb-1">
                      Hostel Name
                    </label>
                    <input
                      id="hostel"
                      type="text"
                      name="hostel"
                      value={formData.hostel || ''}
                      onChange={handleInputChange}
                      className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all"
                      placeholder="Enter your hostel name"
                      required
                    />
                  </motion.div>
                )}
                {/* Course */}
                <div>
                  <label htmlFor="course" className="block text-red-200 text-sm font-medium mb-1">
                    Course
                  </label>
                  <input
                    id="course"
                    type="text"
                    name="course"
                    value={formData.course || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-700/60 rounded-lg px-3 py-2 text-white placeholder-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all"
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
                    <span className="text-xl font-bold text-red-300">
                      ₹{formData.amount || 0}
                    </span>
                    <span className="text-xs text-red-300/80 bg-red-900/30 px-2 py-1 rounded">
                      Fixed Price
                    </span>
                  </div>
                  <p className="text-red-300/70 text-xs mt-1">
                    Ticket price set by event organizers
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-gradient-to-t from-black/95 to-transparent pb-2 pointer-events-none">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-white transition-colors text-base pointer-events-auto"
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg shadow-red-900/30 pointer-events-auto"
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
        <style jsx>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #ef4444 rgba(0, 0, 0, 0.2);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #ef4444, #7f1d1d);
            border-radius: 8px;
            border: 2px solid rgba(0, 0, 0, 0.2);
            box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #dc2626, #991b1b);
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border: 1px solid rgba(127, 29, 29, 0.2);
          }
          .custom-scrollbar::-webkit-scrollbar-corner {
            background: rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
};

export default TicketForm;