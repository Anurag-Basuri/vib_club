import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import {
  useGetCurrentMember,
  useUpdateProfile,
  useUploadProfilePicture,
  useResetPassword,
} from '../hooks/useMembers.js';
import {
  FiEdit2,
  FiSave,
  FiCamera,
  FiUser,
  FiMail,
  FiBook,
  FiHome,
  FiLink,
  FiAward,
  FiX,
  FiPlus,
  FiLogOut,
  FiSettings,
  FiShield,
  FiCalendar,
  FiMapPin,
  FiUpload,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiExternalLink,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Constants
const HOSTELS = [
  'BH-1', 'BH-2', 'BH-3', 'BH-4', 'BH-5', 'BH-6', 'BH-7',
  'GH-1', 'GH-2', 'GH-3', 'GH-4', 'GH-5',
];

const SOCIAL_PLATFORMS = [
  'LinkedIn', 'GitHub', 'Instagram', 'Twitter', 'Facebook',
  'LeetCode', 'Codeforces', 'CodeChef', 'YouTube', 'Medium',
];

const MAX_BIO_LENGTH = 500;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// Sub-components
const FloatingBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        x: [0, 30, 0],
        y: [0, -20, 0],
        rotate: [0, 180, 360],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-full blur-2xl"
    />
    <motion.div
      animate={{
        x: [0, -25, 0],
        y: [0, 15, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-purple-500/15 to-pink-500/10 rounded-full blur-2xl"
    />
    <motion.div
      animate={{
        x: [0, 20, 0],
        y: [0, -30, 0],
        scale: [1, 0.8, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-xl"
    />
  </div>
));
FloatingBackground.displayName = 'FloatingBackground';

const StatCard = React.memo(({ icon: Icon, label, value, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-500/10 border-blue-400/20 text-blue-300',
    green: 'from-green-500/20 to-emerald-500/10 border-green-400/20 text-green-300',
    purple: 'from-purple-500/20 to-pink-500/10 border-purple-400/20 text-purple-300',
    orange: 'from-orange-500/20 to-yellow-500/10 border-orange-400/20 text-orange-300',
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center group cursor-pointer relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border`}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.1), transparent)`,
        }}
      />
      <div className="relative z-10">
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mb-3">
          <Icon className="w-6 h-6 sm:w-8 h-8 mx-auto" />
        </motion.div>
        <div className="text-xl sm:text-2xl font-bold mb-1">{value}</div>
        <div className="text-xs sm:text-sm opacity-80">{label}</div>
      </div>
    </motion.div>
  );
});
StatCard.displayName = 'StatCard';

const LoadingScreen = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] flex items-center justify-center relative overflow-hidden">
    <FloatingBackground />
    <div className="text-center relative z-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-6"
      />
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-white mb-2"
      >
        Loading Profile
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-blue-200"
      >
        Please wait while we fetch your information...
      </motion.p>
    </div>
  </div>
));
LoadingScreen.displayName = 'LoadingScreen';

const ErrorScreen = React.memo(({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] flex items-center justify-center p-4 relative overflow-hidden">
    <FloatingBackground />
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card-error p-8 sm:p-12 text-center max-w-md w-full rounded-3xl relative z-10 border border-red-400/20"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-6xl mb-6"
      >
        ⚠️
      </motion.div>
      <h2 className="text-2xl font-bold text-red-200 mb-4">Profile Error</h2>
      <p className="text-red-100 mb-6 leading-relaxed">{error}</p>
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-xl flex items-center space-x-2 mx-auto"
      >
        <FiRefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </motion.button>
    </motion.div>
  </div>
));
ErrorScreen.displayName = 'ErrorScreen';

const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="glass-card p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-blue-400/20 relative"
      >
        <div className="flex items-center mb-4">
          <div className="bg-blue-500/20 text-blue-400 rounded-full p-2 mr-3">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-blue-200">{title}</h3>
        </div>
        <p className="mb-6 text-blue-100">{message}</p>
        <div className="flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-700/60 hover:bg-gray-600 text-gray-200 border border-gray-500/30 transition-all duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow border border-blue-400/30 transition-all duration-200"
          >
            Confirm
          </motion.button>
        </div>
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
          aria-label="Close dialog"
        >
          <FiX className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

const PasswordChangeModal = ({ isOpen, onClose, onChangePassword, loading }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const resetFields = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    if (!submitting && !loading) {
      resetFields();
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required', { icon: '❌' });
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters', { icon: '🔒' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', { icon: '❌' });
      return;
    }
    setSubmitting(true);
    try {
      await onChangePassword(oldPassword, newPassword);
      handleClose();
    } catch (err) {
      toast.error('Failed to change password', { icon: '❌' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.form
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-blue-400/20 relative"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
          aria-label="Close modal"
          disabled={submitting || loading}
        >
          <FiX className="w-5 h-5" />
        </button>
        <div className="flex items-center mb-4">
          <div className="bg-blue-500/20 text-blue-400 rounded-full p-2 mr-3">
            <FiShield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-blue-200">Change Password</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 pr-10"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter old password"
                disabled={submitting || loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400"
                onClick={() => setShowOld((v) => !v)}
                tabIndex={-1}
                aria-label={showOld ? 'Hide password' : 'Show password'}
              >
                {showOld ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                disabled={submitting || loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400"
                onClick={() => setShowNew((v) => !v)}
                tabIndex={-1}
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Minimum 8 characters. Use a strong password.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                disabled={submitting || loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-gray-700/60 hover:bg-gray-600 text-gray-200 border border-gray-500/30 transition-all duration-200"
            disabled={submitting || loading}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow border border-blue-400/30 transition-all duration-200 flex items-center space-x-2 disabled:opacity-60"
            disabled={submitting || loading}
          >
            {(submitting || loading) && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            )}
            <span>{submitting || loading ? 'Changing...' : 'Change Password'}</span>
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

const ProfileHeader = ({ member, isEditing, setIsEditing, handleCancelEdit, updating, handleProfileUpdate, setShowLogoutDialog, profileImage, imagePreview, fileInputRef, handleImageSelect, handleImageUpload, cancelImageUpload, uploading }) => {
  return (
    <div className="relative h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Profile Picture */}
      <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-8">
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm overflow-hidden shadow-2xl"
          >
            {imagePreview || member.profilePicture?.url ? (
              <img
                src={imagePreview || member.profilePicture.url}
                alt={member.fullname}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center ${imagePreview || member.profilePicture?.url ? 'hidden' : ''}`}
            >
              <FiUser className="text-2xl sm:text-3xl text-white/60" />
            </div>
          </motion.div>

          {/* Camera Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-colors duration-300 border-2 border-white/20"
            title="Change profile picture"
            aria-label="Change profile picture"
          >
            <FiCamera className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            onChange={handleImageSelect}
            className="hidden"
            aria-label="Upload profile picture"
          />
        </div>

        {/* Image Upload Actions */}
        <AnimatePresence>
          {profileImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-20 left-0 right-0 flex justify-center mt-2"
            >
              <div className="glass-card p-2 rounded-xl flex items-center space-x-2 border border-white/10">
                <span className="text-xs text-white/80">
                  New image selected
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2 rounded-lg disabled:opacity-50 transition-colors duration-300 flex items-center space-x-1"
                  aria-label="Save profile picture"
                >
                  {uploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="w-3 h-3 border border-white border-t-transparent rounded-full"
                      />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-3 h-3" />
                      <span>Save</span>
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelImageUpload}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded-lg transition-colors duration-300"
                  aria-label="Cancel image upload"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header Actions */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsEditing(true);
              toast('Edit mode enabled', { icon: '✏️' });
            }}
            className="glass-card px-3 py-2 rounded-xl flex items-center space-x-2 text-white hover:bg-white/10 transition-all duration-300 border border-white/10"
            aria-label="Edit profile"
          >
            <FiEdit2 className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Edit</span>
          </motion.button>
        ) : (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileUpdate}
              disabled={updating}
              className="glass-card-success px-3 py-2 rounded-xl flex items-center space-x-2 text-green-300 hover:bg-green-500/20 transition-all duration-300 border border-green-400/20 disabled:opacity-50"
              aria-label="Save changes"
            >
              {updating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="w-4 h-4 border border-green-300 border-t-transparent rounded-full"
                  />
                  <span className="text-sm hidden sm:inline">
                    Saving...
                  </span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">
                    Save
                  </span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancelEdit}
              className="glass-card px-3 py-2 rounded-xl flex items-center space-x-2 text-white hover:bg-white/10 transition-all duration-300 border border-white/10"
              aria-label="Cancel editing"
            >
              <FiX className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Cancel</span>
            </motion.button>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLogoutDialog(true)}
          className="glass-card-error px-3 py-2 rounded-xl flex items-center space-x-2 text-red-300 hover:bg-red-500/20 transition-all duration-300 border border-red-400/20"
          aria-label="Logout"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Logout</span>
        </motion.button>
      </div>
    </div>
  );
};

const ProfileTabs = ({ activeTab, handleTabChange, isEditing }) => {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'social', label: 'Social Links', icon: FiLink },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  if (!isEditing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex border-b border-white/10 mb-6 sm:mb-8 overflow-x-auto"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center space-x-2 py-3 px-4 font-medium whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-300'
                : 'text-gray-400 hover:text-white'
            }`}
            aria-label={`Switch to ${tab.label} tab`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

const PersonalInfoSection = ({ member, isEditing, formData, handleInputChange }) => {
  const getYearSuffix = (year) => {
    if (year === 1) return 'st';
    if (year === 2) return 'nd';
    if (year === 3) return 'rd';
    return 'th';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-6 rounded-2xl border border-white/5"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <FiUser className="w-5 h-5 mr-2 text-blue-400" />
        Personal Information
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name{' '}
            {isEditing && (
              <span className="text-red-400">*</span>
            )}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
              required
              minLength="2"
              maxLength="100"
              aria-describedby="fullname-help"
            />
          ) : (
            <p className="text-white bg-white/5 px-4 py-3 rounded-xl">
              {member.fullname}
            </p>
          )}
          {isEditing && (
            <p
              id="fullname-help"
              className="text-xs text-gray-400 mt-1"
            >
              Minimum 2 characters, maximum 100 characters
            </p>
          )}
        </div>

        {/* LPU ID (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            LPU ID
          </label>
          <p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
            {member.LpuId}
          </p>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
            <FiMail className="w-4 h-4 mr-2 text-blue-400" />
            {member.email}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Email cannot be changed
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Program
          </label>
          {isEditing ? (
            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
              placeholder="e.g., Computer Science Engineering"
              maxLength="100"
            />
          ) : (
            <p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
              <FiBook className="w-4 h-4 mr-2 text-blue-400" />
              {member.program || 'Not specified'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Year
          </label>
          {isEditing ? (
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-300"
            >
              {[1, 2, 3, 4].map((year) => (
                <option
                  key={year}
                  value={year}
                  className="bg-gray-800"
                >
                  {year}
                  {getYearSuffix(year)} Year
                </option>
              ))}
            </select>
          ) : (
            <p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
              <FiCalendar className="w-4 h-4 mr-2 text-blue-400" />
              {member.year
                ? `${member.year}${getYearSuffix(member.year)} Year`
                : 'Not specified'}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ClubInfoSection = ({ member, isEditing, formData, handleInputChange }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-6 rounded-2xl border border-white/5"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <FiAward className="w-5 h-5 mr-2 text-purple-400" />
        Club Information
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hosteler
          </label>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="hosteler"
                checked={formData.hosteler}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/5"
              />
              <span className="ml-3 text-white">
                Resides in hostel
              </span>
            </div>
          ) : (
            <p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
              <FiHome className="w-4 h-4 mr-2 text-blue-400" />
              {member.hosteler ? 'Yes' : 'No'}
            </p>
          )}
        </div>

        {(formData.hosteler || member.hosteler) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hostel
            </label>
            {isEditing ? (
              <select
                name="hostel"
                value={formData.hostel}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-300"
              >
                <option
                  value=""
                  className="bg-gray-800"
                >
                  Select Hostel
                </option>
                {HOSTELS.map((hostel) => (
                  <option
                    key={hostel}
                    value={hostel}
                    className="bg-gray-800"
                  >
                    {hostel}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-white bg-white/5 px-4 py-3 rounded-xl">
                {member.hostel || 'Not specified'}
              </p>
            )}
          </motion.div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Member Since
          </label>
          <p className="text-white bg-white/5 px-4 py-3 rounded-xl flex items-center">
            <FiCalendar className="w-4 h-4 mr-2 text-blue-400" />
            {new Date(
              member.joinedAt
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const BioSection = ({ member, isEditing, formData, handleInputChange }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-6 rounded-2xl border border-white/5"
    >
      <h3 className="text-lg font-semibold text-white mb-4">
        Bio
      </h3>
      {isEditing ? (
        <div>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows="4"
            maxLength={MAX_BIO_LENGTH}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 resize-none"
            placeholder="Tell us about yourself..."
            aria-describedby="bio-help"
          />
          <div className="flex justify-between items-center mt-2">
            <p
              id="bio-help"
              className="text-xs text-gray-400"
            >
              Share something about yourself
            </p>
            <p
              className={`text-xs ${
                formData.bio?.length >
                MAX_BIO_LENGTH * 0.9
                  ? 'text-orange-400'
                  : 'text-gray-400'
              }`}
            >
              {formData.bio?.length || 0}/{MAX_BIO_LENGTH}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-300 leading-relaxed">
          {member.bio || 'No bio provided yet.'}
        </p>
      )}
    </motion.div>
  );
};

const SocialLinksSection = ({ isEditing, socialLinks, handleSocialLinkChange, addSocialLink, removeSocialLink, member }) => {
  if (isEditing) {
    return (
      <motion.div
        key="social"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-card p-6 rounded-2xl border border-white/5"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FiLink className="w-5 h-5 mr-2 text-cyan-400" />
            Social Links
          </h3>

          <div className="space-y-4">
            <AnimatePresence>
              {socialLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 glass-card rounded-xl border border-white/5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Platform
                    </label>
                    <select
                      value={link.platform}
                      onChange={(e) =>
                        handleSocialLinkChange(
                          index,
                          'platform',
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-300"
                      aria-label={`Platform for social link ${index + 1}`}
                    >
                      <option
                        value=""
                        className="bg-gray-800"
                      >
                        Select Platform
                      </option>
                      {SOCIAL_PLATFORMS.map(
                        (platform) => (
                          <option
                            key={platform}
                            value={platform}
                            className="bg-gray-800"
                          >
                            {platform}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) =>
                          handleSocialLinkChange(
                            index,
                            'url',
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                        placeholder="https://..."
                        aria-label={`URL for social link ${index + 1}`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          removeSocialLink(index)
                        }
                        className="bg-red-500/20 text-red-300 hover:bg-red-500/30 p-3 rounded-xl transition-colors duration-300 border border-red-400/20"
                        title={`Remove social link ${index + 1}`}
                        aria-label={`Remove social link ${index + 1}`}
                      >
                        <FiX className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addSocialLink}
              className="w-full py-3 border-2 border-dashed border-white/20 hover:border-blue-400/40 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              aria-label="Add new social link"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Social Link</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    member.socialLinks && member.socialLinks.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl border border-white/5"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FiLink className="w-5 h-5 mr-2 text-cyan-400" />
          Social Links
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {member.socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card-primary p-3 rounded-xl text-center border border-blue-400/20 hover:border-blue-300/40 transition-all duration-300"
              onClick={() =>
                toast(`Opening ${link.platform}...`, { icon: '🔗' })
              }
            >
              <div className="text-blue-300 font-medium text-sm">
                {link.platform}
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    )
  );
};

const SettingsSection = ({ isEditing, setShowPasswordModal }) => {
  if (!isEditing) return null;

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <motion.div
        whileHover={{ y: -2 }}
        className="glass-card p-6 rounded-2xl border border-white/5"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FiSettings className="w-5 h-5 mr-2 text-gray-400" />
          Account Settings
        </h3>

        <div className="space-y-4">
          <div className="p-4 glass-card-primary rounded-xl border border-blue-400/20">
            <h4 className="font-medium text-blue-300 mb-2">
              Password Reset
            </h4>
            <p className="text-blue-200 text-sm mb-4">
              Change your password to keep your account secure.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors duration-300 border border-blue-400/20 flex items-center space-x-2"
            >
              <FiSettings className="w-4 h-4" />
              <span>Change Password</span>
            </motion.button>
          </div>

          <div className="p-4 glass-card-error rounded-xl border border-red-400/20">
            <h4 className="font-medium text-red-300 mb-2">
              Account Actions
            </h4>
            <p className="text-red-200 text-sm mb-4">
              Need to deactivate your account or have concerns? Contact the administrators.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast('Feature coming soon! 🚀')}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors duration-300 border border-red-400/20"
            >
              Contact Admin
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MemberInfo = ({ member }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '✅ Active Member';
      case 'banned': return '🚫 Banned';
      default: return '⏸️ Inactive';
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl sm:text-3xl font-bold text-white mb-2"
      >
        {member.fullname}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-blue-300 text-lg"
      >
        {member.designation
          ? member.designation.charAt(0).toUpperCase() +
            member.designation.slice(1)
          : 'Member'}{' '}
        • {member.department || 'Unassigned'}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-cyan-300 text-sm mt-1"
      >
        LPU ID: {member.LpuId}
      </motion.p>
    </div>
  );
};

const StatusBadge = ({ member }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '✅ Active Member';
      case 'banned': return '🚫 Banned';
      default: return '⏸️ Inactive';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="mb-6 sm:mb-8"
    >
      <span
        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${
          member.status === 'active'
            ? 'bg-green-500/20 text-green-300 border-green-400/30'
            : member.status === 'banned'
              ? 'bg-red-500/20 text-red-300 border-red-400/30'
              : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
        }`}
      >
        {getStatusText(member.status)}
      </span>

      {member.restriction?.isRestricted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 glass-card-error p-3 rounded-xl border border-red-400/20"
        >
          <p className="text-red-300 text-sm font-medium">
            ⚠️ Account Restricted
          </p>
          <p className="text-red-200 text-xs mt-1">
            Reason: {member.restriction.reason}
          </p>
          <p className="text-red-200 text-xs">
            Until:{' '}
            {new Date(member.restriction.time).toLocaleDateString()}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

const UnsavedChangesWarning = ({ hasUnsavedChanges }) => {
  if (!hasUnsavedChanges) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 glass-card-error p-4 rounded-xl border border-orange-400/20 flex items-center space-x-3"
    >
      <FiAlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
      <p className="text-orange-200 text-sm">
        You have unsaved changes. Don't forget to save your updates!
      </p>
    </motion.div>
  );
};

const MemberStats = ({ member }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'banned': return 'red';
      default: return 'orange';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
    >
      <StatCard
        icon={FiCalendar}
        label="Member Since"
        value={new Date(member.joinedAt).getFullYear()}
        color="blue"
      />
      <StatCard
        icon={FiAward}
        label="Designation"
        value={
          member.designation
            ? member.designation.charAt(0).toUpperCase() +
                member.designation.slice(1)
            : 'Member'
        }
        color="purple"
      />
      <StatCard
        icon={FiShield}
        label="Status"
        value={member.status === 'active' ? 'Active' : member.status}
        color={getStatusColor(member.status)}
      />
      <StatCard
        icon={FiMapPin}
        label="Department"
        value={member.department || 'Not Set'}
        color="orange"
      />
    </motion.div>
  );
};

// Main component
const MemberProfile = () => {
  const { user, logoutMember: logout } = useAuth();
  const { getCurrentMember, member, loading, error } = useGetCurrentMember();
  const { updateProfile, loading: updating } = useUpdateProfile();
  const { uploadProfilePicture, loading: uploading } = useUploadProfilePicture();
  const { resetPassword, loading: resettingPassword } = useResetPassword();

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullname: '',
    program: '',
    year: 1,
    hosteler: false,
    hostel: '',
    department: '',
    designation: '',
    bio: '',
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const fileInputRef = useRef(null);

  // Initialize form data
  const initializeFormData = useCallback((memberData) => {
    if (!memberData) return;

    setFormData({
      fullname: memberData.fullname || '',
      program: memberData.program || '',
      year: memberData.year || 1,
      hosteler: memberData.hosteler || false,
      hostel: memberData.hostel || '',
      department: memberData.department || '',
      designation: memberData.designation || '',
      bio: memberData.bio || '',
    });

    setSocialLinks(memberData.socialLinks ? [...memberData.socialLinks] : []);
    setHasUnsavedChanges(false);
  }, []);

  // Fetch member data on mount
  useEffect(() => {
    if (user?.memberID) {
      getCurrentMember();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.memberID]);

  // Update form data when member data loads
  useEffect(() => {
    initializeFormData(member);
  }, [member, initializeFormData]);

  // Handle input changes with unsaved changes tracking
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setHasUnsavedChanges(true);
  }, []);

  // Handle social links
  const handleSocialLinkChange = useCallback(
    (index, field, value) => {
      const updatedLinks = [...socialLinks];
      updatedLinks[index][field] = value;
      setSocialLinks(updatedLinks);
      setHasUnsavedChanges(true);
    },
    [socialLinks]
  );

  const addSocialLink = useCallback(() => {
    setSocialLinks((prev) => [...prev, { platform: '', url: '' }]);
    setHasUnsavedChanges(true);
    toast.success('Social link field added!', { icon: '➕' });
  }, []);

  const removeSocialLink = useCallback((index) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
    toast.success('Social link removed!', { icon: '🗑️' });
  }, []);

  // Handle profile image
  const handleImageSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error, { icon: '❌' });
      return;
    }

    setProfileImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.onerror = () => toast.error('Failed to read image file');
    reader.readAsDataURL(file);

    toast.success('Image selected! Click Save to upload.', { icon: '📸' });
  }, []);

  const handleImageUpload = useCallback(async () => {
    if (!profileImage || !member?._id) return;

    const uploadPromise = new Promise((resolve, reject) => {
      (async () => {
        try {
          const formDataToSend = new FormData();
          formDataToSend.append('profilePicture', profileImage);

          await uploadProfilePicture(member._id, formDataToSend);
          setProfileImage(null);
          setImagePreview(null);
          await getCurrentMember();
          resolve();
        } catch (error) {
          reject(error);
        }
      })();
    });

    toast.promise(uploadPromise, {
      loading: 'Uploading profile picture...',
      success: 'Profile picture updated successfully! 🎉',
      error: (err) => `Failed to upload: ${err.message || 'Unknown error'}`,
    });
  }, [profileImage, member?._id, uploadProfilePicture, getCurrentMember]);

  const cancelImageUpload = useCallback(() => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast('Image upload cancelled', { icon: '❌' });
  }, []);

  // Handle profile update
  const handleProfileUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      if (!member?._id) return;

      // Validate form
      const validationErrors = validateForm(formData);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => toast.error(error, { icon: '❌' }));
        return;
      }

      // Validate social links
      const invalidSocialLinks = socialLinks.filter(
        (link) => (link.platform && !link.url) || (!link.platform && link.url)
      );

      if (invalidSocialLinks.length > 0) {
        toast.error('Please complete all social link fields or remove empty ones', {
          icon: '❌',
        });
        return;
      }

      // Filter out empty social links
      const validSocialLinks = socialLinks.filter((link) => link.platform && link.url);

      const updatePromise = new Promise((resolve, reject) => {
        (async () => {
          try {
            await updateProfile(member._id, {
              ...formData,
              socialLinks: validSocialLinks,
            });
            setIsEditing(false);
            setActiveTab('profile');
            setHasUnsavedChanges(false);
            await getCurrentMember();
            resolve();
          } catch (error) {
            reject(error);
          }
        })();
      });

      toast.promise(updatePromise, {
        loading: 'Updating profile...',
        success: 'Profile updated successfully! ✨',
        error: (err) => `Failed to update profile: ${err.message || 'Unknown error'}`,
      });
    },
    [member?._id, formData, socialLinks, updateProfile, getCurrentMember]
  );

  // Handle logout
  const handleLogout = useCallback(async () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to logout?'
      );
      if (!confirmed) return;
    }
    logout();
    toast.success('Logged out successfully! 👋');
  }, [hasUnsavedChanges, logout]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) return;
    }

    setIsEditing(false);
    setActiveTab('profile');
    initializeFormData(member);

    toast('Changes cancelled', { icon: '↩️' });
  }, [hasUnsavedChanges, member, initializeFormData]);

  // Handle tab change
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Prevent navigation if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle password change
  const handlePasswordChange = async (oldPassword, newPassword) => {
    // Optionally, you can verify oldPassword on the frontend before sending
    if (!member?.LpuId) {
      toast.error('LPU ID not found. Cannot reset password.');
      return;
    }
    try {
      await resetPassword(member.LpuId, newPassword);
      toast.success('Password reset successfully!');
    } catch (err) {
      console.error("Failed to reset password:", err);
      toast.error('Failed to reset password.');
    }
  };

  // Show loading state
  if (loading) return <LoadingScreen />;

  // Show error state
  if (error) return <ErrorScreen error={error} onRetry={getCurrentMember} />;

  // Show error if no member data
  if (!member) {
    return <ErrorScreen error="Member data not found" onRetry={getCurrentMember} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] text-white relative overflow-hidden">
      <FloatingBackground />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />
        
        <MemberStats member={member} />

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <ProfileHeader
            member={member}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleCancelEdit={handleCancelEdit}
            updating={updating}
            handleProfileUpdate={handleProfileUpdate}
            setShowLogoutDialog={setShowLogoutDialog}
            profileImage={profileImage}
            imagePreview={imagePreview}
            fileInputRef={fileInputRef}
            handleImageSelect={handleImageSelect}
            handleImageUpload={handleImageUpload}
            cancelImageUpload={cancelImageUpload}
            uploading={uploading}
          />

          {/* Profile Content */}
          <div className="pt-16 sm:pt-20 pb-6 sm:pb-8 px-6 sm:px-8">
            <MemberInfo member={member} />
            <StatusBadge member={member} />
            
            <ProfileTabs 
              activeTab={activeTab} 
              handleTabChange={handleTabChange} 
              isEditing={isEditing} 
            />

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {(!isEditing || activeTab === 'profile') && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PersonalInfoSection 
                      member={member} 
                      isEditing={isEditing} 
                      formData={formData} 
                      handleInputChange={handleInputChange} 
                    />
                    
                    <ClubInfoSection 
                      member={member} 
                      isEditing={isEditing} 
                      formData={formData} 
                      handleInputChange={handleInputChange} 
                    />
                  </div>

                  <BioSection 
                    member={member} 
                    isEditing={isEditing} 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                  />
                </motion.div>
              )}

              {/* Social Links Tab */}
              {isEditing && activeTab === 'social' && (
                <SocialLinksSection
                  isEditing={isEditing}
                  socialLinks={socialLinks}
                  handleSocialLinkChange={handleSocialLinkChange}
                  addSocialLink={addSocialLink}
                  removeSocialLink={removeSocialLink}
                  member={member}
                />
              )}

              {/* Settings Tab */}
              {isEditing && activeTab === 'settings' && (
                <SettingsSection 
                  isEditing={isEditing} 
                  setShowPasswordModal={setShowPasswordModal} 
                />
              )}
            </AnimatePresence>

            {/* Display Social Links (when not editing) */}
            {!isEditing && (
              <SocialLinksSection
                isEditing={isEditing}
                socialLinks={socialLinks}
                handleSocialLinkChange={handleSocialLinkChange}
                addSocialLink={addSocialLink}
                removeSocialLink={removeSocialLink}
                member={member}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Confirmation Dialog for Logout */}
      <ConfirmationDialog
        open={showLogoutDialog}
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
      />

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onChangePassword={handlePasswordChange}
        loading={resettingPassword}
      />
    </div>
  );
};

// Validation utilities
const validateForm = (formData) => {
  const errors = [];
  if (!formData.fullname?.trim()) {
    errors.push('Full name is required');
  }
  if (formData.fullname?.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }
  if (formData.bio && formData.bio.length > MAX_BIO_LENGTH) {
    errors.push(`Bio must be less than ${MAX_BIO_LENGTH} characters`);
  }
  return errors;
};

const validateImageFile = (file) => {
  if (!file) return { isValid: false, error: 'No file selected' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image (JPEG, PNG, JPG, WebP)',
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB',
    };
  }
  return { isValid: true };
};

export default MemberProfile;