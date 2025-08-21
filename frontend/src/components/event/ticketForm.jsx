import React, { useRef, useEffect, useCallback } from 'react';

const TicketForm = ({ formData, setFormData, loading, error, onClose, onSubmit }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
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

  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => {
        if (name === 'hosteler' && value !== 'true') {
          const { hostel, ...rest } = prev;
          return { ...rest, [name]: value };
        }
        
        if (type === 'radio') {
          return { ...prev, [name]: value };
        }
        
        return { ...prev, [name]: value };
      });
    },
    [setFormData]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (onSubmit) onSubmit();
    },
    [onSubmit]
  );

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-blue-500/20 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-300 hover:text-white text-xl z-10 transition-all bg-blue-900/50 hover:bg-blue-800/70 p-1 rounded-full"
          aria-label="Close modal"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6 border-b border-blue-600/30 bg-gradient-to-r from-blue-900/40 to-indigo-900/40">
          <div className="flex items-center">
            <div className="bg-blue-700/30 p-3 rounded-xl mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Ticket Registration</h2>
              <p className="text-blue-200">Complete your details to secure your spot</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-900/50 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-blue-200 mb-2">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-blue-200 mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div>
              <label htmlFor="lpuId" className="block text-sm font-medium text-blue-200 mb-2">
                LPU Registration Number *
              </label>
              <input
                id="lpuId"
                type="text"
                name="lpuId"
                value={formData.lpuId || ''}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="Enter your 8-digit LPU ID"
                required
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-blue-200 mb-2">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                className="glass-input"
                required
              >
                <option value="">Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="hosteler" className="block text-sm font-medium text-blue-200 mb-2">
                Are you a Hosteler? *
              </label>
              <select
                id="hosteler"
                name="hosteler"
                value={formData.hosteler || ''}
                onChange={handleInputChange}
                className="glass-input"
                required
              >
                <option value="">Select option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            
            {formData.hosteler === 'true' && (
              <div className="md:col-span-2">
                <label htmlFor="hostel" className="block text-sm font-medium text-blue-200 mb-2">
                  Hostel Name *
                </label>
                <input
                  id="hostel"
                  type="text"
                  name="hostel"
                  value={formData.hostel || ''}
                  onChange={handleInputChange}
                  className="glass-input"
                  placeholder="Enter your hostel name"
                  required
                />
              </div>
            )}
            
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-blue-200 mb-2">
                Course *
              </label>
              <input
                id="course"
                type="text"
                name="course"
                value={formData.course || ''}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="Enter your course"
                required
              />
            </div>
            
            <div>
              <label htmlFor="club" className="block text-sm font-medium text-blue-200 mb-2">
                Club (Optional)
              </label>
              <input
                id="club"
                type="text"
                name="club"
                value={formData.club || ''}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="Enter club name if applicable"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-blue-200 mb-3">
              How did you hear about us? *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Vibranta', 'SML', 'VIBE', 'BEAST'].map((option) => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="referrerType"
                    value={option.toLowerCase()}
                    checked={formData.referrerType === option.toLowerCase()}
                    onChange={handleInputChange}
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/30 p-4 rounded-xl mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-200 text-sm">Total Amount</p>
                <p className="text-white text-2xl font-bold">₹{formData.amount || 0}</p>
              </div>
              <div className="bg-blue-700/40 px-3 py-1 rounded-full text-blue-200 text-sm">
                Fixed Price
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-blue-800/40 hover:bg-blue-700/50 text-blue-200 rounded-xl font-medium transition-all border border-blue-600/30"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium disabled:opacity-50 transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pay Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;