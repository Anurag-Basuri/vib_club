import React from 'react';
import { motion } from 'framer-motion';

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

export default BioSection;