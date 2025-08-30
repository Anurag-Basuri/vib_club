import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Camera,
    Upload,
    Edit3,
    Lock,
    Shield,
    Hash,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Settings,
} from 'lucide-react';
import { getDesignationColor, getDepartmentIcon, getStatusColor } from '../../utils/fileUtils.js';

const ProfileHeader = ({
    member,
    onEditToggle,
    onPasswordReset,
    onImageSelect,
    onResumeUpload,
    uploadLoading,
    uploadResumeLoading,
    isEditing,
}) => {
    const fileInputRef = useRef(null);
    const resumeInputRef = useRef(null);
    const DepartmentIcon = getDepartmentIcon(member.department);

    // Default cover image - this will be replaced with actual cover image later
    const defaultCoverImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2306b6d4;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='400' fill='url(%23grad1)' /%3E%3Cpath d='M0,100 Q300,50 600,100 T1200,100 L1200,400 L0,400 Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
            {/* Cover Image Section */}
            <div className="relative h-48 md:h-64">
                {/* Cover Image - placeholder for now, will be dynamic later */}
                <div
                    className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 relative"
                    style={{
                        backgroundImage: `url("${defaultCoverImage}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                    {/* Future: Cover image upload button */}
                    {/* <div className="absolute top-4 right-4">
                        <button className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-all duration-200">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div> */}
                </div>
            </div>

            <div className="relative px-6 pb-6">
                {/* Profile Picture and Basic Info */}
                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20 mb-6">
                    {/* Profile Picture */}
                    <div className="relative group flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl bg-white dark:bg-gray-800">
                            {member.profilePicture?.url ? (
                                <img
                                    src={member.profilePicture.url}
                                    alt={member.fullname}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Upload Overlay */}
                        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadLoading}
                                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Upload new profile picture"
                            >
                                {uploadLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Camera className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Upload Status Indicator */}
                        {uploadLoading && (
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onImageSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 md:mb-4">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                    {member.fullname}
                                </h2>
                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(member.status)}`}
                                    >
                                        {member.status === 'active' && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
                                        {member.status === 'banned' && <AlertTriangle className="w-4 h-4 inline mr-2" />}
                                        {member.status === 'removed' && <Clock className="w-4 h-4 inline mr-2" />}
                                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                    </span>
                                    {member.restriction?.isRestricted && (
                                        <span className="px-4 py-2 rounded-full text-sm font-semibold text-amber-700 bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30">
                                            <AlertTriangle className="w-4 h-4 inline mr-2" />
                                            Restricted
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {member.designation} • {member.department}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={onEditToggle}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg ${
                                        isEditing
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl hover:scale-105'
                                    }`}
                                >
                                    {isEditing ? <Settings className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                </button>

                                <button
                                    onClick={onPasswordReset}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    <Lock className="w-4 h-4" />
                                    Reset Password
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => resumeInputRef.current?.click()}
                                        disabled={uploadResumeLoading}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                        {uploadResumeLoading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4" />
                                        )}
                                        {member.resume?.url ? 'Update Resume' : 'Upload Resume'}
                                    </button>

                                    {member.resume?.url && !uploadResumeLoading && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}

                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={onResumeUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Member Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                <div className={`p-3 rounded-xl ${getDesignationColor(member.designation)}`}>
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
                                        Designation
                                    </p>
                                    <p className="text-gray-900 dark:text-white font-bold text-sm truncate">
                                        {member.designation}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                                    <DepartmentIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
                                        Department
                                    </p>
                                    <p className="text-gray-900 dark:text-white font-bold text-sm truncate">
                                        {member.department}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
                                    <Hash className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">LPU ID</p>
                                    <p className="text-gray-900 dark:text-white font-bold text-sm">
                                        {member.LpuId}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">Joined</p>
                                    <p className="text-gray-900 dark:text-white font-bold text-sm">
                                        {new Date(
                                            member.joinedAt || member.createdAt
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Restriction Notice */}
                {member.restriction?.isRestricted && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-amber-900 dark:text-amber-300 font-bold text-base">
                                    Account Restriction
                                </p>
                                <p className="text-amber-800 dark:text-amber-400 text-sm mt-1 leading-relaxed">
                                    {member.restriction.reason}
                                </p>
                                {member.restriction.time && (
                                    <p className="text-amber-700 dark:text-amber-500 text-xs mt-3 font-semibold">
                                        Restricted on: {new Date(member.restriction.time).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfileHeader;
