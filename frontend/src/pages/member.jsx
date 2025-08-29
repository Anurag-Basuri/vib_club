import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit3,
    Save,
    X,
    Upload,
    FileText,
    Camera,
    Shield,
    Award,
    Clock,
    AlertTriangle,
    CheckCircle,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Building,
    GraduationCap,
    Hash,
    Users,
    Settings,
    Lock
} from 'lucide-react';
import { 
    useGetCurrentMember, 
    useUpdateProfile, 
    useUploadProfilePicture, 
    useUploadResume,
    useResetPassword 
} from '../hooks/useMembers.js';
import { useAuth } from '../hooks/useAuth.js';

const MemberProfile = () => {
    // Custom hooks
    const { getCurrentMember, member, loading: memberLoading, error: memberError } = useGetCurrentMember();
    const { updateProfile, loading: updateLoading, error: updateError } = useUpdateProfile();
    const { uploadProfilePicture, loading: uploadLoading, error: uploadError } = useUploadProfilePicture();
    const { uploadResume, loading: uploadResumeLoading, error: uploadResumeError } = useUploadResume();
    const { resetPassword, loading: resetLoading, error: resetError } = useResetPassword();
    const { user } = useAuth();

    // Local state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        program: "",
        year: "",
        hosteler: false,
        hostel: "",
        socialLinks: [],
        bio: "",
        skills: []
    });
    const [message, setMessage] = useState('');
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    // Fetch current member on component mount
    useEffect(() => {
        getCurrentMember();
    }, []);

    // Update form data when member data is loaded
    useEffect(() => {
        if (member) {
            setFormData({
                email: member.email || "",
                phone: member.phone || "",
                program: member.program || "",
                year: member.year || "",
                hosteler: member.hosteler || false,
                hostel: member.hostel || "",
                socialLinks: member.socialLinks || [],
                bio: member.bio || "",
                skills: member.skills || []
            });
        }
    }, [member]);

    // Handle errors and success messages
    useEffect(() => {
        if (memberError || updateError || uploadError || resetError) {
            setMessage(memberError || updateError || uploadError || resetError);
        }
    }, [memberError, updateError, uploadError, resetError]);

    // Enhanced Background Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();

        // Sparkle effects
        class Sparkle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.life = Math.random() * 60 + 60;
                this.maxLife = this.life;
                this.size = Math.random() * 3 + 1;
                this.hue = Math.random() * 360;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life--;

                if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                const alpha = this.life / this.maxLife;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const sparkles = Array.from({ length: 50 }, () => new Sparkle());

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 15, 31, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            sparkles.forEach(sparkle => {
                sparkle.update();
                sparkle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => resizeCanvas();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSocialLinkChange = (index, field, value) => {
        const updatedLinks = [...formData.socialLinks];
        updatedLinks[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            socialLinks: updatedLinks,
        }));
    };

    const addSocialLink = () => {
        if (formData.socialLinks.length < 5) {
            setFormData((prev) => ({
                ...prev,
                socialLinks: [...prev.socialLinks, { platform: '', url: '' }],
            }));
        }
    };

    const removeSocialLink = (index) => {
        setFormData((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index),
        }));
    };

    const addSkill = () => {
        if (newSkill.trim() && formData.skills.length < 10 && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await updateProfile(member._id, formData);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            // Refresh member data
            await getCurrentMember();
        } catch (error) {
            setMessage('Failed to update profile. Please try again.');
        }
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage('Please select a valid image file');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setMessage('File size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            await uploadProfilePicture(member._id, formData);
            setMessage('Profile picture updated successfully!');
            await getCurrentMember();
        } catch (error) {
            setMessage('Failed to upload profile picture');
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            setMessage('Please select a valid document file (PDF, DOC, DOCX)');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            setMessage('File size must be less than 10MB');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        try {
            await uploadResume(member._id, formData);
            setMessage('Resume uploaded successfully!');
            await getCurrentMember();
        } catch (error) {
            setMessage('Failed to upload resume');
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setMessage('Password must be at least 8 characters long');
            return;
        }

        try {
            await resetPassword(member.LpuId, newPassword);
            setMessage('Password reset successfully!');
            setShowPasswordReset(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage('Failed to reset password');
        }
    };

    const getDesignationColor = (designation) => {
        const colors = {
            'CEO': 'from-purple-500 to-pink-500',
            'CTO': 'from-blue-500 to-cyan-500',
            'CFO': 'from-green-500 to-emerald-500',
            'CMO': 'from-orange-500 to-red-500',
            'COO': 'from-indigo-500 to-purple-500',
            'Head': 'from-yellow-500 to-orange-500',
            'member': 'from-gray-500 to-slate-500'
        };
        return colors[designation] || colors['member'];
    };

    const getDepartmentIcon = (department) => {
        const icons = {
            'HR': Users,
            'Technical': Settings,
            'Marketing': Award,
            'Management': Building,
            'Content Writing': FileText,
            'Event Management': Calendar,
            'Media': Camera,
            'Design': Edit3,
            'Coordinator': User,
            'PR': Mail
        };
        return icons[department] || User;
    };

    const getStatusColor = (status) => {
        const colors = {
            'active': 'text-green-400 bg-green-500/20',
            'banned': 'text-red-400 bg-red-500/20',
            'removed': 'text-gray-400 bg-gray-500/20'
        };
        return colors[status] || colors['active'];
    };

    // Loading state
    if (memberLoading || !member) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] to-[#1a1f3a] flex items-center justify-center">
                <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    const isLoading = updateLoading || uploadLoading || uploadResumeLoading || resetLoading;
    const DepartmentIcon = getDepartmentIcon(member.department);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] to-[#1a1f3a] relative overflow-hidden">
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
            
            <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
                {/* Success/Error Message */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`fixed top-20 right-4 p-4 rounded-xl shadow-lg z-50 ${
                                message.includes('successfully') 
                                    ? 'bg-green-500/20 border border-green-500 text-green-300'
                                    : 'bg-red-500/20 border border-red-500 text-red-300'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {message.includes('successfully') ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <AlertTriangle className="w-5 h-5" />
                                )}
                                <span>{message}</span>
                                <button
                                    onClick={() => setMessage('')}
                                    className="ml-2 text-gray-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-3xl p-8 mb-8"
                    >
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Profile Picture */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-xl">
                                    {member.profilePicture?.url ? (
                                        <img
                                            src={member.profilePicture.url}
                                            alt={member.fullname}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                            <User className="w-16 h-16 text-white" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadLoading}
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {uploadLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-white" />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureUpload}
                                    className="hidden"
                                />
                            </div>

                            {/* Member Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                    <h1 className="text-3xl font-bold text-white">{member.fullname}</h1>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}>
                                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                        </span>
                                        {member.restriction?.isRestricted && (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium text-orange-400 bg-orange-500/20">
                                                Restricted
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getDesignationColor(member.designation)}`}>
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Designation</p>
                                            <p className="text-white font-medium">{member.designation}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                                            <DepartmentIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Department</p>
                                            <p className="text-white font-medium">{member.department}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                                            <Hash className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">LPU ID</p>
                                            <p className="text-white font-medium">{member.LpuId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                                            <Calendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Joined</p>
                                            <p className="text-white font-medium">
                                                {new Date(member.joinedAt || member.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:scale-105 transition-transform"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                    </button>
                                    
                                    <button
                                        onClick={() => setShowPasswordReset(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:scale-105 transition-transform"
                                    >
                                        <Lock className="w-4 h-4" />
                                        Reset Password
                                    </button>

                                    <button
                                        onClick={() => resumeInputRef.current?.click()}
                                        disabled={uploadResumeLoading}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                                    >
                                        {uploadResumeLoading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <FileText className="w-4 h-4" />
                                        )}
                                        {member.resume?.url ? 'Update Resume' : 'Upload Resume'}
                                    </button>
                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Restriction Notice */}
                        {member.restriction?.isRestricted && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-orange-500/20 border border-orange-500 rounded-xl"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                                    <span className="text-orange-300 font-medium">Account Restriction</span>
                                </div>
                                <p className="text-orange-200 text-sm">{member.restriction.reason}</p>
                                {member.restriction.time && (
                                    <p className="text-orange-300 text-xs mt-1">
                                        Restricted on: {new Date(member.restriction.time).toLocaleDateString()}
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Profile Form */}
                    <AnimatePresence>
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="glass-card rounded-3xl p-8 mb-8"
                            >
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Email */}
                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">
                                                <Mail className="w-4 h-4 inline mr-2" />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                pattern="[0-9]{10}"
                                                className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                                placeholder="10-digit phone number"
                                            />
                                        </div>

                                        {/* Program */}
                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">
                                                <GraduationCap className="w-4 h-4 inline mr-2" />
                                                Program
                                            </label>
                                            <input
                                                type="text"
                                                name="program"
                                                value={formData.program}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                                placeholder="e.g., B.Tech CSE"
                                            />
                                        </div>

                                        {/* Year */}
                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">
                                                <Calendar className="w-4 h-4 inline mr-2" />
                                                Year
                                            </label>
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                            >
                                                <option value="">Select Year</option>
                                                <option value="1">1st Year</option>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                                <option value="4">4th Year</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Hosteler */}
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-gray-300">
                                            <input
                                                type="checkbox"
                                                name="hosteler"
                                                checked={formData.hosteler}
                                                onChange={handleInputChange}
                                                className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500"
                                            />
                                            <Building className="w-4 h-4" />
                                            Are you a hosteler?
                                        </label>
                                    </div>

                                    {/* Hostel (if hosteler) */}
                                    {formData.hosteler && (
                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">
                                                <MapPin className="w-4 h-4 inline mr-2" />
                                                Hostel
                                            </label>
                                            <select
                                                name="hostel"
                                                value={formData.hostel}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                            >
                                                <option value="">Select Hostel</option>
                                                <option value="BH-1">BH-1</option>
                                                <option value="BH-2">BH-2</option>
                                                <option value="BH-3">BH-3</option>
                                                <option value="BH-4">BH-4</option>
                                                <option value="BH-5">BH-5</option>
                                                <option value="BH-6">BH-6</option>
                                                <option value="BH-7">BH-7</option>
                                                <option value="GH-1">GH-1</option>
                                                <option value="GH-2">GH-2</option>
                                                <option value="GH-3">GH-3</option>
                                                <option value="GH-4">GH-4</option>
                                                <option value="GH-5">GH-5</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            <Award className="w-4 h-4 inline mr-2" />
                                            Skills (Max 10)
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.skills.map((skill, index) => (
                                                <motion.span
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(index)}
                                                        className="text-cyan-400 hover:text-cyan-200"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </motion.span>
                                            ))}
                                        </div>
                                        {formData.skills.length < 10 && (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                    className="flex-1 px-4 py-2 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                                    placeholder="Add a skill"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addSkill}
                                                    className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Social Links */}
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            Social Links (Max 5)
                                        </label>
                                        <div className="space-y-3">
                                            {formData.socialLinks.map((link, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex gap-3"
                                                >
                                                    <input
                                                        type="text"
                                                        value={link.platform}
                                                        onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                                                        className="w-1/3 px-4 py-2 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                                        placeholder="Platform"
                                                    />
                                                    <input
                                                        type="url"
                                                        value={link.url}
                                                        onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                                        className="flex-1 px-4 py-2 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                                        placeholder="https://..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSocialLink(index)}
                                                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                        {formData.socialLinks.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={addSocialLink}
                                                className="mt-3 flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-xl hover:bg-cyan-500/30 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Social Link
                                            </button>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            Bio (Max 500 characters)
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            maxLength={500}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                        <p className="text-gray-400 text-sm mt-1">
                                            {formData.bio.length}/500 characters
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Saving...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Save className="w-4 h-4" />
                                                    Save Changes
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Profile Display */}
                    {!isEditing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {/* Contact Information */}
                            <div className="glass-card rounded-3xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-cyan-400" />
                                    Contact Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-cyan-400" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Email</p>
                                            <p className="text-white">{member.email || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-green-400" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Phone</p>
                                            <p className="text-white">{member.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="glass-card rounded-3xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-purple-400" />
                                    Academic Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <GraduationCap className="w-5 h-5 text-purple-400" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Program</p>
                                            <p className="text-white">{member.program || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-orange-400" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Year</p>
                                            <p className="text-white">
                                                {member.year ? `${member.year}${member.year === 1 ? 'st' : member.year === 2 ? 'nd' : member.year === 3 ? 'rd' : 'th'} Year` : 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                    {member.hosteler && (
                                        <div className="flex items-center gap-3">
                                            <Building className="w-5 h-5 text-blue-400" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Hostel</p>
                                                <p className="text-white">{member.hostel || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            {member.skills && member.skills.length > 0 && (
                                <div className="glass-card rounded-3xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-yellow-400" />
                                        Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Social Links */}
                            {member.socialLinks && member.socialLinks.length > 0 && (
                                <div className="glass-card rounded-3xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-pink-400" />
                                        Social Links
                                    </h3>
                                    <div className="space-y-3">
                                        {member.socialLinks.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                            >
                                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                                <div>
                                                    <p className="text-white font-medium">{link.platform}</p>
                                                    <p className="text-gray-400 text-sm truncate">{link.url}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bio */}
                            {member.bio && (
                                <div className="glass-card rounded-3xl p-6 md:col-span-2">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-emerald-400" />
                                        About
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{member.bio}</p>
                                </div>
                            )}

                            {/* Resume */}
                            {member.resume?.url && (
                                <div className="glass-card rounded-3xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-red-400" />
                                        Resume
                                    </h3>
                                    <a
                                        href={member.resume.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl hover:from-red-500/30 hover:to-pink-500/30 transition-colors border border-red-500/30"
                                    >
                                        <FileText className="w-8 h-8 text-red-400" />
                                        <div>
                                            <p className="text-white font-medium">View Resume</p>
                                            <p className="text-gray-400 text-sm">Click to open in new tab</p>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Password Reset Modal */}
            <AnimatePresence>
                {showPasswordReset && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPasswordReset(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card rounded-3xl p-8 w-full max-w-md"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Lock className="w-6 h-6 text-purple-400" />
                                Reset Password
                            </h3>
                            
                            <form onSubmit={handlePasswordReset} className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all pr-12"
                                            placeholder="Enter new password"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#0d1326] border border-[#2a3a72] text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all pr-12"
                                            placeholder="Confirm new password"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordReset(false)}
                                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                                    >
                                        {resetLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Resetting...
                                            </div>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemberProfile;
