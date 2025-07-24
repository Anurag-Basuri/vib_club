import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import logo from '../assets/logo.png';
import axios from 'axios';

const TechBackground = () => {
	const bgRef = useRef(null);

	useEffect(() => {
		const bg = bgRef.current;
		if (!bg) return;
		bg.innerHTML = '';

		// Circuit lines (SVG)
		for (let i = 0; i < 15; i++) {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.classList.add('absolute', 'w-full', 'h-full', 'pointer-events-none');
			svg.style.left = 0;
			svg.style.top = 0;
			svg.style.zIndex = -1;
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			const complexity = Math.floor(Math.random() * 10) + 5;
			let d = `M${Math.random() * 100} ${Math.random() * 100}`;
			for (let j = 0; j < complexity; j++) {
				d += ` L${Math.random() * 100} ${Math.random() * 100}`;
			}
			path.setAttribute('d', d);
			path.setAttribute(
				'stroke',
				`rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100)}, 200, 0.1)`
			);
			path.setAttribute('stroke-width', '1');
			path.setAttribute('fill', 'none');
			path.setAttribute('stroke-dasharray', '10,5');
			path.setAttribute('stroke-dashoffset', '1000');
			svg.appendChild(path);
			bg.appendChild(svg);

			// Animate the circuit path
			path.animate([{ strokeDashoffset: 1000 }, { strokeDashoffset: 0 }], {
				duration: 30000 + Math.random() * 20000,
				iterations: Infinity,
			});
		}

		// Glow nodes
		for (let i = 0; i < 20; i++) {
			const node = document.createElement('div');
			node.className = 'absolute rounded-full animate-pulse';
			const size = Math.random() * 10 + 5;
			node.style.width = `${size}px`;
			node.style.height = `${size}px`;
			const colors = ['#6a11cb', '#2575fc', '#8e2de2', '#00c6ff'];
			const color = colors[Math.floor(Math.random() * colors.length)];
			node.style.background = color;
			node.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}`;
			node.style.left = `${Math.random() * 100}%`;
			node.style.top = `${Math.random() * 100}%`;
			node.style.animationDuration = `${Math.random() * 4 + 2}s`;

			// Add floating animation
			node.animate(
				[
					{ transform: 'translate(0, 0)' },
					{
						transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)`,
					},
					{ transform: 'translate(0, 0)' },
				],
				{
					duration: 8000 + Math.random() * 8000,
					iterations: Infinity,
					easing: 'ease-in-out',
				}
			);

			bg.appendChild(node);
		}

		// Code snippets
		const codeLines = [
			'function innovate() {',
			'  const tech = new Technology();',
			'  let solution = tech.createSolution();',
			'  return solution.implement();',
			'}',
			'class Developer {',
			'  constructor(name, skills) {',
			'    this.name = name;',
			'    this.skills = skills;',
			'  }',
			'  buildProject() {',
			'    // Create amazing things',
			'  }',
			'}',
			'const club = {',
			'  name: "Vibranta",',
			'  members: [],',
			'  addMember(member) {',
			'    this.members.push(member);',
			'  }',
			'};',
			'const domains = ["Web", "AI", "IoT", "Cloud"];',
			'for (const d of domains) {',
			'  console.log("Exploring", d);',
			'}',
			'async function joinClub(user) {',
			'  await club.addMember(user);',
			'  return "Welcome!";',
			'}',
			'let idea = "Innovation";',
			'if (idea) {',
			'  develop(idea);',
			'}',
			'// Empowering students through code',
			'export default Developer;',
			'const inspire = () => "Dream. Build. Inspire.";',
			'console.log(inspire());',
		];
		for (let i = 0; i < 20; i++) {
			const code = document.createElement('div');
			code.className = 'absolute text-white opacity-10 font-mono select-none -rotate-12';
			code.textContent = codeLines[Math.floor(Math.random() * codeLines.length)];
			code.style.left = `${Math.random() * 100}%`;
			code.style.top = `${Math.random() * 100}%`;
			code.style.fontSize = `${Math.random() * 6 + 10}px`;
			code.style.opacity = Math.random() * 0.1 + 0.03;

			// Animate floating code
			code.animate(
				[
					{ transform: 'translate(0, 0) rotate(-12deg)' },
					{
						transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(-12deg)`,
					},
					{ transform: 'translate(0, 0) rotate(-12deg)' },
				],
				{
					duration: 20000 + Math.random() * 20000,
					iterations: Infinity,
					easing: 'ease-in-out',
				}
			);

			bg.appendChild(code);
		}
	}, []);

	return (
		<div
			ref={bgRef}
			className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
		/>
	);
};

const FloatingOrbs = () => {
	return (
		<>
			<div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 filter blur-3xl animate-pulse-slow" />
			<div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-500/15 filter blur-3xl animate-pulse-slow" />
			<div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-indigo-500/12 filter blur-3xl animate-pulse-slow" />
		</>
	);
};

const AuthPage = () => {
	const [activeTab, setActiveTab] = useState('login');
	const [showPassword, setShowPassword] = useState(false);
	const [registerError, setRegisterError] = useState('');
	const [registerSuccess, setRegisterSuccess] = useState('');
	const [registerLoading, setRegisterLoading] = useState(false);
	const formContainerRef = useRef(null);
	const { loginMember } = useAuth();

	const initialRegisterState = {
		fullName: '',
		LpuId: '',
		email: '',
		phone: '',
		course: '',
		gender: '',
		domains: [],
		accommodation: '',
		previousExperience: false,
		anyotherorg: false,
		bio: '',
	};
	const [registerData, setRegisterData] = useState(initialRegisterState);

	useEffect(() => {
		const handleScroll = () => {
			if (formContainerRef.current) {
				const scrollY = window.scrollY || window.pageYOffset;
				const opacity = Math.min(0.2, scrollY / 1000);
				formContainerRef.current.style.backgroundColor = `rgba(255, 255, 255, ${0.1 + opacity})`;
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleRegisterChange = (e) => {
		const { name, value, type, checked, multiple, options } = e.target;
		if (type === 'checkbox') {
			setRegisterData((prev) => ({ ...prev, [name]: checked }));
		} else if (multiple) {
			const selected = Array.from(options).filter((o) => o.selected).map((o) => o.value);
			setRegisterData((prev) => ({ ...prev, [name]: selected }));
		} else {
			setRegisterData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleRegisterSubmit = async (e) => {
		e.preventDefault();
		setRegisterError('');
		setRegisterSuccess('');
		setRegisterLoading(true);

		// Validation (client-side, basic)
		if (
			!registerData.fullName ||
			!registerData.LpuId ||
			!registerData.email ||
			!registerData.phone ||
			!registerData.course ||
			!registerData.gender ||
			!registerData.domains.length ||
			!registerData.accommodation
		) {
			setRegisterError('Please fill all required fields.');
			setRegisterLoading(false);
			return;
		}

		try {
			const payload = {
				...registerData,
				// Map accommodation to backend enum
				accommodation:
					registerData.accommodation === 'hostel'
						? 'hostler'
						: registerData.accommodation === 'day-scholar'
						? 'non-hostler'
						: '',
			};
			await axios.post('/api/apply', payload);
			setRegisterSuccess('Registration successful! We will contact you soon.');
			setRegisterData(initialRegisterState);
		} catch (err) {
			setRegisterError(
				err?.response?.data?.message ||
					'Registration failed. Please check your details or try again.'
			);
		}
		setRegisterLoading(false);
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e17] to-[#1a1f3a] font-poppins overflow-x-hidden">
			<TechBackground />
			<FloatingOrbs />

			<div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 z-10 px-4">
				{/* Branding Header with creative animation */}
				<div className="relative text-center py-10 animate-fade-in-down select-none">
					<div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
						<div className="w-80 h-80 bg-gradient-to-br from-[#0a0e17] via-[#6a11cb]/40 to-[#2575fc]/30 rounded-full blur-3xl opacity-60 animate-spin-slow" />
						<div className="w-40 h-40 bg-gradient-to-tr from-[#8e2de2]/30 to-[#2575fc]/20 rounded-full blur-2xl opacity-40 animate-pulse-slow absolute left-1/4 top-1/4" />
						<div className="w-24 h-24 bg-gradient-to-br from-[#2575fc]/40 to-[#6a11cb]/30 rounded-full blur-2xl opacity-30 animate-bounce-slow absolute right-1/4 bottom-1/4" />
					</div>
					<div className="relative flex justify-center items-center gap-4 mb-2 z-10">
						<div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl logo-float overflow-hidden border-2 border-cyan-400/40 bg-black/70 animate-logo-pop relative">
							<img
								src={logo}
								alt="Vibranta Club Logo"
								className="w-12 h-12 rounded-full object-cover animate-spin-slow"
								loading="lazy"
								decoding="async"
							/>
							<span className="absolute inset-0 rounded-2xl border-4 border-cyan-400/30 animate-glow-ring pointer-events-none" aria-hidden="true" />
						</div>
						<h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#8e2de2] bg-clip-text text-transparent tracking-wide animate-text-glow drop-shadow-xl">
							Vibranta
						</h1>
					</div>
					<p className="relative text-lg font-light max-w-xl mx-auto leading-relaxed text-white/80 animate-fade-in-down delay-100 z-10">
						Empowering student innovation through{' '}
						<span className="font-semibold text-[#8e2de2]">technology</span>,{' '}
						<span className="font-semibold text-[#2575fc]">community</span>, and{' '}
						<span className="font-semibold text-[#6a11cb]">creativity</span>.
					</p>
				</div>

				<div
					ref={formContainerRef}
					className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative transition-all duration-500 ease-out animate-float"
				>
					<div className="flex border-b border-white/20 bg-gradient-to-r from-[#6a11cb]/10 to-[#2575fc]/10">
						<button
							className={`flex-1 py-5 text-center font-semibold text-lg cursor-pointer transition-all relative ${activeTab === 'login' ? 'text-white' : 'text-white/70 hover:text-white/90'}`}
							onClick={() => setActiveTab('login')}
						>
							Login
							{activeTab === 'login' && (
								<span className="absolute bottom-0 left-1/4 w-1/2 h-1 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] animate-tab-indicator" />
							)}
						</button>
						<button
							className={`flex-1 py-5 text-center font-semibold text-lg cursor-pointer transition-all relative ${activeTab === 'register' ? 'text-white' : 'text-white/70 hover:text-white/90'}`}
							onClick={() => setActiveTab('register')}
						>
							Join Club
							{activeTab === 'register' && (
								<span className="absolute bottom-0 left-1/4 w-1/2 h-1 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] animate-tab-indicator" />
							)}
						</button>
					</div>

					<div className="p-8 md:p-12 bg-gradient-to-br from-white/5 via-[#0a0e17]/10 to-[#1a1f3a]/10">
						{/* Login Form */}
						{activeTab === 'login' && (
							<form className="animate-fade-in flex flex-col gap-6">
								<h2 className="text-3xl mb-2 text-center font-bold bg-gradient-to-r from-[#6a11cb] to-[#2575fc] bg-clip-text text-transparent animate-text-glow">
									Welcome Back
								</h2>
								<div className="mb-2 relative">
									<label
										htmlFor="login-id"
										className="block mb-2 font-medium text-white/90"
									>
										LPU ID or Email
									</label>
									<div className="relative">
										<i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-[#8e2de2]" />
										<input
											type="text"
											id="login-id"
											placeholder="Enter your LPU ID or email"
											required
											className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/40"
										/>
									</div>
								</div>
								<div className="mb-2 relative">
									<label
										htmlFor="login-password"
										className="block mb-2 font-medium text-white/90"
									>
										Password
									</label>
									<div className="relative">
										<i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-[#8e2de2]" />
										<input
											type={showPassword ? 'text' : 'password'}
											id="login-password"
											placeholder="Enter your password"
											required
											className="w-full pl-12 pr-12 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/40"
										/>
										<i
											className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-4 top-1/2 -translate-y-1/2 text-white/60 cursor-pointer transition-all hover:text-[#8e2de2]`}
											onClick={() => setShowPassword((v) => !v)}
										/>
									</div>
								</div>
								<button
									type="submit"
									className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-poppins text-lg font-semibold cursor-pointer transition-all mt-2 shadow-lg hover:-translate-y-0.5 hover:shadow-xl transform transition-transform duration-300 hover:scale-[1.03]"
								>
									Login
								</button>
								<div className="mt-2 text-center text-sm">
									<a
										href="#"
										className="text-[#8e2de2] font-medium hover:underline transition-all"
									>
										Forgot Password?
									</a>
								</div>
							</form>
						)}

						{/* Registration Form */}
						{activeTab === 'register' && (
							<form className="animate-fade-in flex flex-col gap-6" onSubmit={handleRegisterSubmit}>
								<h2 className="text-3xl mb-2 text-center font-bold bg-gradient-to-r from-[#6a11cb] to-[#2575fc] bg-clip-text text-transparent animate-text-glow">
									Join Our Community
								</h2>
								{registerError && (
									<div className="text-red-400 text-center font-medium">{registerError}</div>
								)}
								{registerSuccess && (
									<div className="text-green-400 text-center font-medium">{registerSuccess}</div>
								)}
								<div className="mb-2 relative">
									<label htmlFor="fullName" className="block mb-2 font-medium text-white/90">
										Full Name
									</label>
									<div className="relative">
										<i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-[#8e2de2]" />
										<input
											type="text"
											id="fullName"
											name="fullName"
											placeholder="Enter your full name"
											required
											value={registerData.fullName}
											onChange={handleRegisterChange}
											className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/40"
										/>
									</div>
								</div>
								<div className="flex gap-4 mb-2 flex-col md:flex-row">
									<div className="relative flex-1">
										<label htmlFor="LpuId" className="block mb-2 font-medium text-white/90">
											LPU ID
										</label>
										<div className="relative">
											<i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-[#8e2de2]" />
											<input
												type="text"
												id="LpuId"
												name="LpuId"
												placeholder="Enter LPU ID"
												required
												value={registerData.LpuId}
												onChange={handleRegisterChange}
												className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/40"
											/>
										</div>
									</div>
									<div className="relative flex-1">
										<label htmlFor="email" className="block mb-2 font-medium text-white/90">
											Email
										</label>
										<div className="relative">
											<i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-[#8e2de2]" />
											<input
												type="email"
												id="email"
												name="email"
												placeholder="Enter your email"
												required
												value={registerData.email}
												onChange={handleRegisterChange}
												className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/40"
											/>
										</div>
									</div>
								</div>
								<div className="flex gap-4 mb-2 flex-col md:flex-row">
									<div className="relative flex-1">
										<label htmlFor="phone" className="block mb-2 font-medium text-white/90">
											Phone
										</label>
										<div className="relative">
											<i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-[#8e2de2]" />
											<input
												type="tel"
												id="phone"
												name="phone"
												placeholder="Enter phone number"
												required
												value={registerData.phone}
												onChange={handleRegisterChange}
												className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/40"
											/>
										</div>
									</div>
									<div className="relative flex-1">
										<label htmlFor="course" className="block mb-2 font-medium text-white/90">
											Course
										</label>
										<div className="relative">
											<i className="fas fa-graduation-cap absolute left-4 top-1/2 -translate-y-1/2 text-[#8e2de2]" />
											<select
												id="course"
												name="course"
												required
												value={registerData.course}
												onChange={handleRegisterChange}
												className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/40"
											>
												<option value="" disabled>
													Select your course
												</option>
												<option value="btech">B.Tech</option>
												<option value="mtech">M.Tech</option>
												<option value="bca">BCA</option>
												<option value="mca">MCA</option>
												<option value="bsc">B.Sc</option>
												<option value="msc">M.Sc</option>
												<option value="other">Other</option>
											</select>
										</div>
									</div>
								</div>
								<div className="flex gap-4 mb-2 flex-col md:flex-row">
									<div className="flex-1">
										<label className="block mb-2 font-medium text-white/90">
											Gender
										</label>
										<div className="flex gap-4 mt-2">
											<label className="flex items-center gap-2 transition-all hover:text-[#8e2de2]">
												<input
													type="radio"
													name="gender"
													value="male"
													required
													checked={registerData.gender === 'male'}
													onChange={handleRegisterChange}
													className="accent-[#8e2de2]"
												/>{' '}
												Male
											</label>
											<label className="flex items-center gap-2 transition-all hover:text-[#8e2de2]">
												<input
													type="radio"
													name="gender"
													value="female"
													checked={registerData.gender === 'female'}
													onChange={handleRegisterChange}
													className="accent-[#8e2de2]"
												/>{' '}
												Female
											</label>
										</div>
									</div>
									<div className="relative flex-1">
										<label htmlFor="accommodation" className="block mb-2 font-medium text-white/90">
											Accommodation type
										</label>
										<div className="relative">
											<i className="fas fa-home absolute left-4 top-1/2 -translate-y-1/2 text-[#8e2de2]" />
											<select
												id="accommodation"
												name="accommodation"
												required
												value={registerData.accommodation}
												onChange={handleRegisterChange}
												className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/40"
											>
												<option value="hostler">Hostler</option>
												<option value="non-hostler">Non-Hostler</option>
											</select>
										</div>
									</div>
								</div>
								<div className="mb-2 relative">
									<label htmlFor="domains" className="block mb-2 font-medium text-white/90">
										Interested Domains
									</label>
									<div className="relative">
										<i className="fas fa-code absolute left-4 top-4 text-[#8e2de2]" />
										<select
											id="domains"
											name="domains"
											multiple
											required
											value={registerData.domains}
											onChange={handleRegisterChange}
											className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 h-24 hover:bg-black/40"
										>
											<option value="technical">Technical</option>
											<option value="data-management">Data Management</option>
											<option value="event-management">Event Management</option>
											<option value="marketing">Marketing</option>
											<option value="media">Media</option>
											<option value="content-creation">Content Creation</option>
											<option value="content-writing">Content Writing</option>
											<option value="arts-and-culture">Arts and Culture</option>
											<option value="design">Design</option>
										</select>
									</div>
									<p className="mt-1 text-xs text-white/60">
										Hold Ctrl/Cmd to select multiple
									</p>
								</div>
								<div className="mb-2 relative flex gap-4">
									<label className="flex items-center gap-2 text-white/90">
										<input
											type="checkbox"
											name="previousExperience"
											checked={registerData.previousExperience}
											onChange={handleRegisterChange}
											className="accent-[#8e2de2]"
										/>
										Previous Experience
									</label>
									<label className="flex items-center gap-2 text-white/90">
										<input
											type="checkbox"
											name="anyotherorg"
											checked={registerData.anyotherorg}
											onChange={handleRegisterChange}
											className="accent-[#8e2de2]"
										/>
										Member of Other Organizations
									</label>
								</div>
								<div className="mb-2 relative">
									<label htmlFor="bio" className="block mb-2 font-medium text-white/90">
										Bio
									</label>
									<div className="relative">
										<i className="fas fa-comment absolute left-4 top-4 text-[#8e2de2]" />
										<textarea
											id="bio"
											name="bio"
											placeholder="Tell us about yourself..."
											rows={3}
											required
											value={registerData.bio}
											onChange={handleRegisterChange}
											className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/40"
										/>
									</div>
								</div>
								<button
									type="submit"
									disabled={registerLoading}
									className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-poppins text-lg font-semibold cursor-pointer transition-all mt-2 shadow-lg hover:-translate-y-0.5 hover:shadow-xl transform transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
								>
									{registerLoading ? 'Registering...' : 'Register Now'}
								</button>
								<div className="mt-2 text-center text-sm">
									<p>
										Already a member?{' '}
										<button
											type="button"
											className="text-[#8e2de2] font-medium hover:underline transition-all"
											onClick={() => setActiveTab('login')}
										>
											Login
										</button>
									</p>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>

			{/* Floating particles */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{[...Array(15)].map((_, i) => (
					<div
						key={i}
						className="absolute rounded-full bg-white/5"
						style={{
							width: `${Math.random() * 10 + 2}px`,
							height: `${Math.random() * 10 + 2}px`,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animation: `float ${15 + Math.random() * 15}s infinite ease-in-out`,
						}}
					/>
				))}
			</div>
		</div>
	);
};

export default AuthPage;
