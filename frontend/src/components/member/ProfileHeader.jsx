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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
            {/* Header Background */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="relative px-6 pb-6">
                {/* Profile Picture */}
                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-6">
                    <div className="relative group flex-shrink-0">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-white dark:bg-slate-800">
                            {member.profilePicture?.url ? (
                                <img
                                    src={member.profilePicture.url}
                                    alt={member.fullname}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                                    <User className="w-16 h-16 text-white" />
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
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
                                    {member.fullname}
                                </h2>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}
                                    >
                                        {member.status === 'active' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                                        {member.status === 'banned' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                                        {member.status === 'removed' && <Clock className="w-3 h-3 inline mr-1" />}
                                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                    </span>
                                    {member.restriction?.isRestricted && (
                                        <span className="px-3 py-1 rounded-full text-sm font-medium text-amber-600 bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30">
                                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                                            Restricted
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={onEditToggle}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                                        isEditing
                                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                    }`}
                                >
                                    <Edit3 className="w-4 h-4" />
                                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                </button>

                                <button
                                    onClick={onPasswordReset}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    <Lock className="w-4 h-4" />
                                    Reset Password
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => resumeInputRef.current?.click()}
                                        disabled={uploadResumeLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                        {uploadResumeLoading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4" />
                                        )}
                                        {member.resume?.url ? 'Update Resume' : 'Upload Resume'}
                                    </button>

                                    {member.resume?.url && !uploadResumeLoading && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
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
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <div className={`p-2 rounded-lg ${getDesignationColor(member.designation)}`}>
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Designation
                                    </p>
                                    <p className="text-slate-800 dark:text-white font-semibold text-sm truncate">
                                        {member.designation}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                                    <DepartmentIcon className="w-4 h-4 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Department
                                    </p>
                                    <p className="text-slate-800 dark:text-white font-semibold text-sm truncate">
                                        {member.department}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                                    <Hash className="w-4 h-4 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">LPU ID</p>
                                    <p className="text-slate-800 dark:text-white font-semibold text-sm">
                                        {member.LpuId}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
                                    <Calendar className="w-4 h-4 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Joined</p>
                                    <p className="text-slate-800 dark:text-white font-semibold text-sm">
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
                        className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-400 rounded-r-lg"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-800 dark:text-amber-300 font-semibold text-sm">
                                    Account Restriction
                                </p>
                                <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                                    {member.restriction.reason}
                                </p>
                                {member.restriction.time && (
                                    <p className="text-amber-600 dark:text-amber-500 text-xs mt-2">
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
