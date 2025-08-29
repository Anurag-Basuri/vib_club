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
    const canvasRef = useRef(null);

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
                        <div className="text-white text-xl">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    const isLoading = updateLoading || uploadLoading;

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

            
        </div>
    );
};

export default MemberProfile;
