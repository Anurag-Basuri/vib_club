import React, { useState, useEffect, useRef } from 'react';
import {
    PencilIcon,
    CameraIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    UserIcon,
    EnvelopeIcon,
    AcademicCapIcon,
    GlobeAltIcon,
    PhoneIcon,
    HomeIcon,
    CalendarIcon,
    LinkIcon,
    XMarkIcon,
    PlusIcon,
    ShieldCheckIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import {
    useGetCurrentMember,
    useUpdateProfile,
    useUploadProfilePicture,
    useResetPassword,
} from '../hooks/useMembers.js';

const MemberProfile = () => {
    // Custom hooks
    const { getCurrentMember, member, loading: memberLoading, error: memberError } = useGetCurrentMember();
    const { updateProfile, loading: updateLoading, error: updateError } = useUpdateProfile();
    const { uploadProfilePicture, loading: uploadLoading, error: uploadError } = useUploadProfilePicture();
	const { resetPassword, loading: resetLoading, error: resetError } = useResetPassword();

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
    });
    const [message, setMessage] = useState('');
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

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
            });
        }
    }, [member]);

    // Handle errors
    useEffect(() => {
        if (memberError) {
            setMessage(`Error loading profile: ${memberError}`);
        } else if (updateError) {
            setMessage(`Error updating profile: ${updateError}`);
        } else if (uploadError) {
            setMessage(`Error uploading image: ${uploadError}`);
        }
    }, [memberError, updateError, uploadError]);

    // Enhanced Background Animation (keeping the same as before)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const sparkles = [];
        const orbs = [];

        // Enhanced particle system
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 0.5;
                this.speedX = (Math.random() - 0.5) * 1.5;
                this.speedY = (Math.random() - 0.5) * 1.5;
                this.opacity = Math.random() * 0.8 + 0.2;
                this.color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.angle += this.pulseSpeed;

                if (this.x > canvas.width + 50) this.x = -50;
                if (this.x < -50) this.x = canvas.width + 50;
                if (this.y > canvas.height + 50) this.y = -50;
                if (this.y < -50) this.y = canvas.height + 50;

                this.currentSize = this.size + Math.sin(this.angle) * 0.5;
                this.currentOpacity = this.opacity + Math.sin(this.angle * 2) * 0.3;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.currentOpacity);
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Floating orbs
        class Orb {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 100 + 50;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.1 + 0.05;
                this.color = `hsl(${Math.random() * 60 + 240}, 80%, 70%)`;
                this.pulseSpeed = Math.random() * 0.01 + 0.005;
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.angle += this.pulseSpeed;

                if (this.x > canvas.width + this.radius) this.x = -this.radius;
                if (this.x < -this.radius) this.x = canvas.width + this.radius;
                if (this.y > canvas.height + this.radius) this.y = -this.radius;
                if (this.y < -this.radius) this.y = canvas.height + this.radius;

                this.currentRadius = this.radius + Math.sin(this.angle) * 10;
                this.currentOpacity = this.opacity + Math.sin(this.angle * 1.5) * 0.02;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.currentOpacity);
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.currentRadius
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Sparkle effects
        class Sparkle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.01;
                this.color = `hsl(${Math.random() * 60 + 45}, 100%, 80%)`;
                this.twinkle = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                this.twinkle += 0.1;
                
                if (this.life <= 0) {
                    this.reset();
                }
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.life = 1;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.life * (0.5 + Math.sin(this.twinkle) * 0.5);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                
                const spikes = 4;
                const outerRadius = this.size;
                const innerRadius = this.size * 0.5;
                
                ctx.beginPath();
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = (i * Math.PI) / spikes;
                    const x = this.x + Math.cos(angle) * radius;
                    const y = this.y + Math.sin(angle) * radius;
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize all elements
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
        
        for (let i = 0; i < 8; i++) {
            orbs.push(new Orb());
        }
        
        for (let i = 0; i < 30; i++) {
            sparkles.push(new Sparkle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.01;

            // Draw orbs
            orbs.forEach((orb) => {
                orb.update();
                orb.draw();
            });

            // Draw particles and connections
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.15;
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
                        ctx.lineWidth = 1;
                        ctx.shadowBlur = 3;
                        ctx.shadowColor = 'rgba(96, 165, 250, 0.3)';
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }

            // Draw sparkles
            sparkles.forEach((sparkle) => {
                sparkle.update();
                sparkle.draw();
            });

            // Add floating gradient shapes
            ctx.save();
            ctx.globalAlpha = 0.1;
            const gradient1 = ctx.createRadialGradient(
                canvas.width * 0.2 + Math.sin(time) * 100,
                canvas.height * 0.3 + Math.cos(time * 1.2) * 100,
                0,
                canvas.width * 0.2 + Math.sin(time) * 100,
                canvas.height * 0.3 + Math.cos(time * 1.2) * 100,
                200
            );
            gradient1.addColorStop(0, 'rgba(139, 69, 193, 0.3)');
            gradient1.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const gradient2 = ctx.createRadialGradient(
                canvas.width * 0.8 + Math.sin(time * 1.5) * 120,
                canvas.height * 0.7 + Math.cos(time * 0.8) * 80,
                0,
                canvas.width * 0.8 + Math.sin(time * 1.5) * 120,
                canvas.height * 0.7 + Math.cos(time * 0.8) * 80,
                250
            );
            gradient2.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
            gradient2.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
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
        setFormData((prev) => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { platform: '', url: '' }],
        }));
    };

    const removeSocialLink = (index) => {
        setFormData((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedMember = await updateProfile(member._id, formData);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            // Refresh member data
            getCurrentMember();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error updating profile');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('profilePicture', file);

            const updatedMember = await uploadProfilePicture(member._id, formData);
            setMessage('Profile picture updated successfully!');
            // Refresh member data
            getCurrentMember();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error uploading profile picture');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const getDesignationColor = (designation) => {
        const colors = {
            'CEO': 'bg-gradient-to-r from-red-500 to-red-600',
            'CTO': 'bg-gradient-to-r from-purple-500 to-purple-600',
            'CFO': 'bg-gradient-to-r from-green-500 to-green-600',
            'CMO': 'bg-gradient-to-r from-blue-500 to-blue-600',
            'COO': 'bg-gradient-to-r from-orange-500 to-orange-600',
            'Head': 'bg-gradient-to-r from-indigo-500 to-indigo-600',
            'member': 'bg-gradient-to-r from-gray-500 to-gray-600',
        };
        return colors[designation] || colors['member'];
    };

    const getDepartmentIcon = (department) => {
        const icons = {
            'HR': UserIcon,
            'Technical': AcademicCapIcon,
            'Marketing': GlobeAltIcon,
            'Management': ShieldCheckIcon,
            'Content Writing': PencilIcon,
            'Event Management': CalendarIcon,
            'Media': CameraIcon,
            'Design': PencilIcon,
            'Coordinator': UserIcon,
            'PR': EnvelopeIcon,
        };
        return icons[department] || UserIcon;
    };

    // Loading state
    if (memberLoading || !member) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <div className="fixed inset-0 z-0">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)`,
                        }}
                    />
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto mb-4 animate-pulse"></div>
                        <div className="text-white text-xl">Loading your profile...</div>
                        <div className="text-gray-300 text-sm mt-2">Please wait while we fetch your information</div>
                    </div>
                </div>
            </div>
        );
    }

    const isLoading = updateLoading || uploadLoading;
    const DepartmentIcon = getDepartmentIcon(member.department);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background - Keep the same animated background */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%),
                            radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
                        `,
                    }}
                />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Success/Error Message */}
                    {message && (
                        <div className={`mb-8 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${
                            message.includes('Error') || message.includes('error')
                                ? 'bg-red-900/30 border-red-500/50 text-red-200'
                                : 'bg-green-900/30 border-green-500/50 text-green-200'
                        }`}>
                            <div className="flex items-center">
                                {message.includes('Error') || message.includes('error') ? (
                                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                                ) : (
                                    <CheckIcon className="h-5 w-5 mr-2" />
                                )}
                                {message}
                            </div>
                        </div>
                    )}

                    {/* Profile Header Card */}
                    <div className="mb-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                        <div className="relative">
                            {/* Cover Background */}
                            <div className="h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 relative">
                                <div className="absolute inset-0 bg-black/20"></div>
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                                        member.status === 'active' 
                                            ? 'bg-green-500/20 border-green-400/50 text-green-200'
                                            : member.status === 'banned'
                                            ? 'bg-red-500/20 border-red-400/50 text-red-200'
                                            : 'bg-gray-500/20 border-gray-400/50 text-gray-200'
                                    }`}>
                                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Picture Section */}
                            <div className="relative -mt-20 flex justify-center">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white/30 bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center overflow-hidden shadow-2xl">
                                        {member.profilePicture?.url ? (
                                            <img
                                                src={member.profilePicture.url}
                                                alt={member.fullname}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="h-16 w-16 text-white" />
                                        )}
                                    </div>
                                    
                                    {/* Upload Button */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isLoading}
                                        className="absolute bottom-0 right-0 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors duration-200 disabled:opacity-50"
                                    >
                                        <CameraIcon className="h-4 w-4 text-gray-700" />
                                    </button>
                                    
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Name and Basic Info */}
                            <div className="text-center mt-4 pb-6 px-6">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight flex items-center justify-center gap-2">
                                    {member.fullname}
                                    {member.verified && (
                                        <ShieldCheckIcon className="h-6 w-6 text-green-400" title="Verified Member" />
                                    )}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md border border-white/20 ${getDesignationColor(member.designation)}`}
                                    >
                                        {member.designation.toUpperCase()}
                                    </span>
                                    <span className="flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm text-white border border-white/10 shadow">
                                        <DepartmentIcon className="h-4 w-4" />
                                        {member.department}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
                                    <div className="flex items-center gap-1">
                                        <ClockIcon className="h-4 w-4" />
                                        <span>
                                            Joined{' '}
                                            <span className="font-medium text-white">
                                                {new Date(member.joinedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                })}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <UserIcon className="h-4 w-4" />
                                        <span>
                                            ID: <span className="font-mono text-white">{member.LpuId || member.memberID}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Profile Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Bio Section */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <UserIcon className="h-5 w-5" />
                                        About Me
                                    </h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors duration-200 disabled:opacity-50"
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-colors duration-200"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <p className="text-gray-300">
                                        {member.bio || "No bio available. Click edit to add your bio."}
                                    </p>
                                )}
                            </div>

                            {/* Academic Information */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <AcademicCapIcon className="h-5 w-5" />
                                    Academic Information
                                </h2>
                                
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Program</label>
                                            <input
                                                type="text"
                                                name="program"
                                                value={formData.program}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="e.g., B.Tech CSE"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            >
                                                <option value="">Select Year</option>
                                                <option value="1">1st Year</option>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                                <option value="4">4th Year</option>
                                                <option value="5">5th Year</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            <AcademicCapIcon className="h-5 w-5 text-purple-400" />
                                            <div>
                                                <div className="text-sm text-gray-400">Program</div>
                                                <div className="text-white font-medium">{member.program || 'Not specified'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            <CalendarIcon className="h-5 w-5 text-blue-400" />
                                            <div>
                                                <div className="text-sm text-gray-400">Year</div>
                                                <div className="text-white font-medium">{member.year ? `${member.year}${member.year === 1 ? 'st' : member.year === 2 ? 'nd' : member.year === 3 ? 'rd' : 'th'} Year` : 'Not specified'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <GlobeAltIcon className="h-5 w-5" />
                                        Social Links
                                    </h2>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={addSocialLink}
                                            className="flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-colors duration-200"
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                            Add Link
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-3">
                                        {formData.socialLinks.map((link, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Platform (e.g., LinkedIn)"
                                                    value={link.platform}
                                                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                                                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                <input
                                                    type="url"
                                                    placeholder="URL"
                                                    value={link.url}
                                                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSocialLink(index)}
                                                    className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors duration-200"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.socialLinks.length === 0 && (
                                            <p className="text-gray-400 text-center py-4">No social links added. Click "Add Link" to get started.</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {member.socialLinks && member.socialLinks.length > 0 ? (
                                            member.socialLinks.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors duration-200"
                                                >
                                                    <LinkIcon className="h-4 w-4 text-blue-400" />
                                                    <span className="text-white font-medium">{link.platform}</span>
                                                    <span className="text-gray-400 text-sm truncate">{link.url}</span>
                                                </a>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-center py-4">No social links added yet.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Contact & Quick Info */}
                        <div className="space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <EnvelopeIcon className="h-5 w-5" />
                                    Contact Information
                                </h2>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="1234567890"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                                            <div>
                                                <div className="text-sm text-gray-400">Email</div>
                                                <div className="text-white font-medium">{member.email || 'Not provided'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            <PhoneIcon className="h-5 w-5 text-green-400" />
                                            <div>
                                                <div className="text-sm text-gray-400">Phone</div>
                                                <div className="text-white font-medium">{member.phone || 'Not provided'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Hostel Information */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <HomeIcon className="h-5 w-5" />
                                    Accommodation
                                </h2>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="hosteler"
                                                name="hosteler"
                                                checked={formData.hosteler}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                                            />
                                            <label htmlFor="hosteler" className="text-white">I am a hosteler</label>
                                        </div>
                                        {formData.hosteler && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Hostel</label>
                                                <select
                                                    name="hostel"
                                                    value={formData.hostel}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                        <HomeIcon className="h-5 w-5 text-orange-400" />
                                        <div>
                                            <div className="text-sm text-gray-400">Status</div>
                                            <div className="text-white font-medium">
                                                {member.hosteler ? `Hosteler - ${member.hostel || 'Not specified'}` : 'Day Scholar'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
                                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors duration-200"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isLoading}
                                                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-colors duration-200 disabled:opacity-50"
                                            >
                                                <CheckIcon className="h-5 w-5" />
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-colors duration-200"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={() => setShowPasswordReset(!showPasswordReset)}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-colors duration-200"
                                    >
                                        <ShieldCheckIcon className="h-5 w-5" />
                                        Change Password
                                    </button>
                                </div>

                                {/* Password Reset Form */}
                                {showPasswordReset && (
                                    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <div className="space-y-3">
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (newPassword === confirmPassword && newPassword.length >= 8) {
                                                        // Handle password reset logic here
                                                        setMessage('Password reset functionality coming soon!');
                                                        setShowPasswordReset(false);
                                                        setNewPassword('');
                                                        setConfirmPassword('');
                                                    } else {
                                                        setMessage('Passwords must match and be at least 8 characters long');
                                                    }
                                                }}
                                                className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-colors duration-200"
                                            >
                                                Update Password
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default MemberProfile;
