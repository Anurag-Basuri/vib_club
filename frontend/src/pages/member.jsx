import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

const EnhancedProfile = ({ memberId }) => {
	const [member, setMember] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const canvasRef = useRef(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	useEffect(() => {
		// For demo purposes, we'll use mock data
		const mockMember = {
			memberID: '123e4567-e89b-12d3-a456-426614174000',
			profilePicture: {
				url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
				publicId: 'profile_abc123',
			},
			fullname: 'Alex Johnson',
			LpuId: '12345678',
			email: 'alex.johnson@example.com',
			program: 'Computer Science',
			year: 3,
			hosteler: true,
			hostel: 'BH-3',
			socialLinks: [
				{ platform: 'GitHub', url: 'https://github.com/alexjohnson' },
				{ platform: 'LinkedIn', url: 'https://linkedin.com/in/alexjohnson' },
				{ platform: 'Twitter', url: 'https://twitter.com/alexjohnson' },
			],
			department: 'Technical',
			designation: 'Head',
			bio: 'Passionate about technology and innovation. Currently working on AI projects with a focus on machine learning and computer vision.',
			joinedAt: '2022-01-15T00:00:00.000Z',
			status: 'active',
			restriction: {
				time: null,
				reason: null,
				isRestricted: false,
			},
		};

		setMember(mockMember);
		reset(mockMember);
		setIsLoading(false);
	}, [memberId, reset]);

	useEffect(() => {
		// Animated background using canvas
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		let animationFrameId;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		const particles = [];
		const particleCount = 50;

		class Particle {
			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;
				this.size = Math.random() * 2 + 1;
				this.speedX = Math.random() * 0.5 - 0.25;
				this.speedY = Math.random() * 0.5 - 0.25;
				this.color = `rgba(59, 130, 246, ${Math.random() * 0.3})`;
			}

			update() {
				this.x += this.speedX;
				this.y += this.speedY;

				if (this.x > canvas.width || this.x < 0) {
					this.speedX = -this.speedX;
				}
				if (this.y > canvas.height || this.y < 0) {
					this.speedY = -this.speedY;
				}
			}

			draw() {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		const init = () => {
			for (let i = 0; i < particleCount; i++) {
				particles.push(new Particle());
			}
		};

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < particles.length; i++) {
				particles[i].update();
				particles[i].draw();

				for (let j = i; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 100) {
						ctx.beginPath();
						ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
						ctx.lineWidth = 0.5;
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}

			animationFrameId = requestAnimationFrame(animate);
		};

		init();
		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	const onSubmit = async (data) => {
		try {
			// In a real app, you would make an API call here
			setMember(data);
			setIsEditing(false);
			setMessage('Profile updated successfully!');
			setTimeout(() => setMessage(''), 3000);
		} catch (error) {
			console.error('Error updating profile:', error);
			setMessage('Failed to update profile');
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
				<div className="flex flex-col items-center">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
					<div className="text-white text-xl">Loading profile...</div>
				</div>
			</div>
		);
	}

	if (!member) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
				<div className="text-white text-xl">Profile not found</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Animated Background */}
			<canvas
				ref={canvasRef}
				className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-0"
			/>

			{/* Content */}
			<div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto bg-slate-800/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 transform transition-all duration-500 hover:shadow-blue-500/10">
					{/* Cover Photo with Parallax Effect */}
					<div className="h-48 sm:h-64 relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-slate-900/70 z-10"></div>
						<img
							src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
							alt="Cover"
							className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-20"></div>
					</div>

					{/* Profile Header */}
					<div className="px-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-end relative -mt-16 sm:-mt-20">
						<div className="relative group transition-transform duration-300 hover:scale-105">
							<div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-lg group-hover:opacity-75 transition duration-300 opacity-0"></div>
							<img
								src={member.profilePicture?.url || '/default-avatar.png'}
								alt={member.fullname}
								className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-slate-800 bg-slate-800 object-cover shadow-xl relative z-10"
							/>
							{isEditing && (
								<div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
									<span className="text-white text-sm font-medium flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-1"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
										</svg>
										Change
									</span>
								</div>
							)}
						</div>

						<div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
							<h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
								{member.fullname}
							</h1>
							<p className="text-slate-300 mt-1 italic">
								{member.bio || 'No bio provided'}
							</p>
							<div className="flex items-center mt-2 flex-wrap gap-2">
								<span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
									{member.designation}
								</span>
								<span className="mx-2 text-slate-400">•</span>
								<span className="bg-indigo-600/30 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
									{member.department}
								</span>
								<span className="mx-2 text-slate-400">•</span>
								<span className="bg-emerald-600/30 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
									Member since {new Date(member.joinedAt).getFullYear()}
								</span>
							</div>
						</div>

						{!isEditing ? (
							<button
								className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30 font-medium flex items-center group"
								onClick={() => setIsEditing(true)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2 transition-transform group-hover:rotate-12"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
								</svg>
								Edit Profile
							</button>
						) : (
							<div className="flex space-x-2 mt-4 sm:mt-0">
								<button
									className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30 font-medium flex items-center group"
									onClick={handleSubmit(onSubmit)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2 transition-transform group-hover:scale-110"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									Save Changes
								</button>
								<button
									className="bg-slate-600/50 hover:bg-slate-700/50 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-slate-500/30 font-medium flex items-center backdrop-blur-sm"
									onClick={() => {
										setIsEditing(false);
										reset(member);
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
									Cancel
								</button>
							</div>
						)}
					</div>

					{/* Profile Content */}
					<div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							<PersonalInfo
								member={member}
								isEditing={isEditing}
								register={register}
								errors={errors}
							/>

							<AcademicInfo
								member={member}
								isEditing={isEditing}
								register={register}
								errors={errors}
							/>

							<SocialLinks
								member={member}
								isEditing={isEditing}
								register={register}
							/>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							<DepartmentCard member={member} />
							<StatusCard member={member} />
						</div>
					</div>

					{message && (
						<div className="px-6 sm:px-8 pb-6">
							<div
								className={`p-4 rounded-lg flex items-center shadow-lg transition-all duration-500 animate-fadeIn ${
									message.includes('success')
										? 'bg-green-900/50 text-green-200 border border-green-700/50'
										: 'bg-red-900/50 text-red-200 border border-red-700/50'
								} backdrop-blur-sm`}
							>
								{message.includes('success') ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2 text-green-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2 text-red-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
								)}
								{message}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Sub-components
const PersonalInfo = ({ member, isEditing, register, errors }) => (
	<div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 shadow-xl transition-all duration-300 hover:border-slate-600/50 hover:shadow-blue-500/5">
		<h2 className="text-xl font-semibold text-white mb-4 flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-5 w-5 mr-2 text-blue-400"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fillRule="evenodd"
					d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
					clipRule="evenodd"
				/>
			</svg>
			Personal Information
		</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-1">
				<label className="block text-slate-400 text-sm font-medium">Email</label>
				{isEditing ? (
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-slate-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
							</svg>
						</div>
						<input
							type="email"
							defaultValue={member.email}
							className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm"
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^\S+@\S+$/i,
									message: 'Invalid email address',
								},
							})}
						/>
						{errors.email && (
							<span className="text-red-400 text-sm mt-1 block">
								{errors.email.message}
							</span>
						)}
					</div>
				) : (
					<p className="text-white bg-slate-700/30 py-2 px-4 rounded-lg backdrop-blur-sm">
						{member.email}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<label className="block text-slate-400 text-sm font-medium">LPU ID</label>
				{isEditing ? (
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-slate-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<input
							type="text"
							defaultValue={member.LpuId}
							className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm"
							{...register('LpuId', {
								required: 'LPU ID is required',
								pattern: {
									value: /^\d{8}$/,
									message: 'Must be 8 digits',
								},
							})}
						/>
						{errors.LpuId && (
							<span className="text-red-400 text-sm mt-1 block">
								{errors.LpuId.message}
							</span>
						)}
					</div>
				) : (
					<p className="text-white bg-slate-700/30 py-2 px-4 rounded-lg backdrop-blur-sm">
						{member.LpuId}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<label className="block text-slate-400 text-sm font-medium">Hosteler</label>
				{isEditing ? (
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-slate-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
							</svg>
						</div>
						<select
							defaultValue={member.hosteler}
							className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none backdrop-blur-sm"
							{...register('hosteler')}
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
							<svg
								className="fill-current h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
							</svg>
						</div>
					</div>
				) : (
					<p className="text-white bg-slate-700/30 py-2 px-4 rounded-lg backdrop-blur-sm">
						{member.hosteler ? 'Yes' : 'No'}
					</p>
				)}
			</div>

			{member.hosteler && (
				<div className="space-y-1">
					<label className="block text-slate-400 text-sm font-medium">Hostel</label>
					{isEditing ? (
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-slate-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
								</svg>
							</div>
							<select
								defaultValue={member.hostel}
								className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none backdrop-blur-sm"
								{...register('hostel')}
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
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
								<svg
									className="fill-current h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
								</svg>
							</div>
						</div>
					) : (
						<p className="text-white bg-slate-700/30 py-2 px-4 rounded-lg backdrop-blur-sm">
							{member.hostel}
						</p>
					)}
				</div>
			)}
		</div>
	</div>
);

const AcademicInfo = ({ member, isEditing, register, errors }) => (
	<div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 shadow-xl transition-all duration-300 hover:border-slate-600/50 hover:shadow-blue-500/5">
		<h2 className="text-xl font-semibold text-white mb-4 flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-5 w-5 mr-2 text-blue-400"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
			</svg>
			Academic Information
		</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-1">
				<label className="block text-slate-400 text-sm font-medium">Program</label>
				{isEditing ? (
					<input
						type="text"
						defaultValue={member.program}
						className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm"
						{...register('program')}
					/>
				) : (
					<p className="text-white bg-slate-700/30 py-2 px-4 rounded-lg backdrop-blur-sm">
						{member.program || 'Not specified'}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<label className="block text-slate-400 text-sm font-medium">Year</label>
				{isEditing ? (
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-slate-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<select
							defaultValue={member.year}
							className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none backdrop-blur-sm"
							{...register('year')}
						>
							<option value="">Select Year</option>
							<option value="1">1st Year</option>
							<option value="2">2nd Year</option>
							<option value="3">3rd Year</option>
							<option value="4">4th Year</option>
						</select>
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
							<svg
								className="fill-current h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
							</svg>
						</div>
					</div>
				) : (
					<p className="text-white bg-slate-700/30 py-2 px-4 rounded-lg backdrop-blur-sm">
						{member.year ? `${member.year} Year` : 'Not specified'}
					</p>
				)}
			</div>
		</div>
	</div>
);

const SocialLinks = ({ member, isEditing, register }) => (
	<div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 shadow-xl transition-all duration-300 hover:border-slate-600/50 hover:shadow-blue-500/5">
		<h2 className="text-xl font-semibold text-white mb-4 flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-5 w-5 mr-2 text-blue-400"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
			</svg>
			Social Links
		</h2>
		{isEditing ? (
			<div className="space-y-3">
				{member.socialLinks &&
					member.socialLinks.map((link, index) => (
						<div
							key={index}
							className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0"
						>
							<div className="relative flex-1">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-slate-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<input
									type="text"
									placeholder="Platform (e.g., GitHub)"
									defaultValue={link.platform}
									className="flex-1 w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm"
									{...register(`socialLinks[${index}].platform`)}
								/>
							</div>
							<div className="relative flex-1">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-slate-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<input
									type="url"
									placeholder="URL"
									defaultValue={link.url}
									className="flex-1 w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm"
									{...register(`socialLinks[${index}].url`)}
								/>
							</div>
						</div>
					))}
				<button
					type="button"
					className="text-blue-400 hover:text-blue-300 text-sm flex items-center mt-3 py-2 px-3 rounded-lg hover:bg-blue-900/30 transition-colors duration-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 mr-1"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
							clipRule="evenodd"
						/>
					</svg>
					Add Another Link
				</button>
			</div>
		) : (
			<div className="flex flex-wrap gap-3">
				{member.socialLinks && member.socialLinks.length > 0 ? (
					member.socialLinks.map((link, index) => (
						<a
							key={index}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-400 px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center backdrop-blur-sm group"
						>
							{getSocialIcon(link.platform)}
							<span className="ml-2 group-hover:text-blue-300 transition-colors">
								{link.platform}
							</span>
						</a>
					))
				) : (
					<p className="text-slate-400">No social links added</p>
				)}
			</div>
		)}
	</div>
);

// Helper function to get social icons
const getSocialIcon = (platform) => {
	const lowerPlatform = platform.toLowerCase();

	if (lowerPlatform.includes('github')) {
		return (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fillRule="evenodd"
					d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					clipRule="evenodd"
				/>
			</svg>
		);
	} else if (lowerPlatform.includes('linkedin')) {
		return (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
			</svg>
		);
	} else if (lowerPlatform.includes('twitter') || lowerPlatform.includes('x')) {
		return (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
			</svg>
		);
	} else {
		return (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fillRule="evenodd"
					d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.272.644 1.772 1.153.509.5.902 1.104 1.153 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.903 4.903 0 01-1.153 1.772c-.5.509-1.104.902-1.772 1.153-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.903 4.903 0 01-1.772-1.153 4.903 4.903 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.903 4.903 0 011.153-1.772A4.903 4.903 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
};

const DepartmentCard = ({ member }) => (
	<div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 shadow-xl transition-all duration-300 hover:border-slate-600/50 hover:shadow-blue-500/5">
		<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-5 w-5 mr-2 text-blue-400"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
			</svg>
			Department Information
		</h3>

		<div className="space-y-4">
			<div>
				<div className="text-slate-400 text-sm">Department</div>
				<div className="mt-1 flex items-center">
					<div className="bg-indigo-900/50 text-indigo-300 border border-indigo-700/30 px-4 py-2 rounded-lg text-sm font-medium flex items-center backdrop-blur-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
						</svg>
						{member.department}
					</div>
				</div>
			</div>

			<div>
				<div className="text-slate-400 text-sm">Designation</div>
				<div className="mt-1 flex items-center">
					<div className="bg-blue-900/50 text-blue-300 border border-blue-700/30 px-4 py-2 rounded-lg text-sm font-medium flex items-center backdrop-blur-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
								clipRule="evenodd"
							/>
							<path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
						</svg>
						{member.designation}
					</div>
				</div>
			</div>

			{member.bio && (
				<div className="mt-4 pt-4 border-t border-slate-700/50">
					<div className="text-slate-400 text-sm mb-2">About</div>
					<p className="text-white text-sm italic">{member.bio}</p>
				</div>
			)}
		</div>
	</div>
);

const StatusCard = ({ member }) => (
	<div
		className={`bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border shadow-xl transition-all duration-300 hover:shadow-blue-500/5 ${
			member.status === 'active'
				? 'border-green-700/50 hover:border-green-600/50'
				: 'border-red-700/50 hover:border-red-600/50'
		}`}
	>
		<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-5 w-5 mr-2 text-blue-400"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fillRule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clipRule="evenodd"
				/>
			</svg>
			Status
		</h3>
		<div
			className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 backdrop-blur-sm ${
				member.status === 'active'
					? 'bg-green-900/50 text-green-300 border border-green-700/50'
					: 'bg-red-900/50 text-red-300 border border-red-700/50'
			}`}
		>
			{member.status.toUpperCase()}
		</div>

		<div className="mt-3 pt-3 border-t border-slate-700/50">
			<div className="flex items-center text-slate-300 mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 mr-2 text-blue-400"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
						clipRule="evenodd"
					/>
				</svg>
				Member since:{' '}
				<span className="text-white ml-1">
					{new Date(member.joinedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</span>
			</div>
		</div>

		{member.restriction.isRestricted && (
			<div className="mt-4 pt-4 border-t border-red-800/30 bg-red-900/20 p-3 rounded-lg">
				<div className="flex items-center text-red-300 mb-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 mr-2"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
					<strong>Restriction</strong>
				</div>
				<p className="text-red-300 ml-7">
					<strong>Reason:</strong> {member.restriction.reason || 'Not specified'}
				</p>
				{member.restriction.time && (
					<p className="text-red-300 ml-7 mt-1">
						<strong>Until:</strong>{' '}
						{new Date(member.restriction.time).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				)}
			</div>
		)}
	</div>
);

// Add keyframes for fadeIn animation to your CSS
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
`;

if (!document.querySelector('style#custom-animations')) {
	const styleElement = document.createElement('style');
	styleElement.id = 'custom-animations';
	styleElement.textContent = keyframes;
	document.head.appendChild(styleElement);
}

// Export the component for use in other files
export default EnhancedProfile;
