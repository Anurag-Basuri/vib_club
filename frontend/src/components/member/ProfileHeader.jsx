import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiSave, FiCamera, FiUser, FiX, FiUpload, FiLogOut } from 'react-icons/fi';

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
            accept="image/jpeg,image/png,image/jpg,image/webp"
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

export default ProfileHeader;