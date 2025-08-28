import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLink, FiSettings } from 'react-icons/fi';

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

export default ProfileTabs;