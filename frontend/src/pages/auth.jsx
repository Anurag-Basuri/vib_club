import React, { useEffect, useRef, useState } from 'react';

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
			'const tech = new Technology();',
			'let solution = tech.createSolution();',
			'return solution.implement();',
			'}',
			'class Developer {',
			'constructor(name, skills) {',
			'this.name = name;',
			'this.skills = skills;',
			'}',
			'buildProject() {',
			'// Create amazing things',
			'}',
			'}',
		];
		for (let i = 0; i < 8; i++) {
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
	const formContainerRef = useRef(null);

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

	return (
		<div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e17] to-[#1a1f3a] font-poppins overflow-x-hidden">
			<TechBackground />
			<FloatingOrbs />

			<div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 z-10 px-4">
				{/* Branding Header */}
				<div className="text-center py-4 animate-fade-in-down">
					<div className="flex justify-center items-center gap-4 mb-2">
						<div className="w-12 h-12 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-pulse-slow">
							<i className="fas fa-atom" />
						</div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-[#6a11cb] to-[#2575fc] bg-clip-text text-transparent tracking-wide animate-text-glow">
							Vibranta
						</h1>
					</div>
					<p className="text-base font-light max-w-xl mx-auto leading-relaxed text-white/80 animate-fade-in-down delay-100">
						"Empowering student innovation through technology, community, and
						creativity."
					</p>
				</div>

				{/* Form Container */}
				<div
					ref={formContainerRef}
					className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden relative transition-all duration-500 ease-out animate-float"
				>
					<div className="flex border-b border-white/20">
						<button
							className={`flex-1 py-4 text-center font-medium cursor-pointer transition-all relative ${activeTab === 'login' ? 'text-white' : 'text-white/70 hover:text-white/90'}`}
							onClick={() => setActiveTab('login')}
						>
							Login
							{activeTab === 'login' && (
								<span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] animate-tab-indicator" />
							)}
						</button>
						<button
							className={`flex-1 py-4 text-center font-medium cursor-pointer transition-all relative ${activeTab === 'register' ? 'text-white' : 'text-white/70 hover:text-white/90'}`}
							onClick={() => setActiveTab('register')}
						>
							Join Club
							{activeTab === 'register' && (
								<span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] animate-tab-indicator" />
							)}
						</button>
					</div>
					<div className="p-6 md:p-8">
						{/* Login Form */}
						{activeTab === 'login' && (
							<form className="animate-fade-in">
								<h2 className="text-2xl mb-6 text-center font-semibold bg-gradient-to-r from-[#6a11cb] to-[#2575fc] bg-clip-text text-transparent animate-text-glow">
									Welcome Back
								</h2>
								<div className="mb-6 relative">
									<label
										htmlFor="login-id"
										className="block mb-2 font-medium text-white/90"
									>
										LPU ID or Email
									</label>
									<i className="fas fa-user absolute left-4 top-10 text-[#8e2de2]" />
									<input
										type="text"
										id="login-id"
										placeholder="Enter your LPU ID or email"
										required
										className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
									/>
								</div>
								<div className="mb-6 relative">
									<label
										htmlFor="login-password"
										className="block mb-2 font-medium text-white/90"
									>
										Password
									</label>
									<i className="fas fa-lock absolute left-4 top-10 text-[#8e2de2]" />
									<input
										type={showPassword ? 'text' : 'password'}
										id="login-password"
										placeholder="Enter your password"
										required
										className="w-full pl-12 pr-12 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
									/>
									<i
										className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-4 top-10 text-white/60 cursor-pointer transition-all hover:text-[#8e2de2]`}
										onClick={() => setShowPassword((v) => !v)}
									/>
								</div>
								<button
									type="submit"
									className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-poppins text-lg font-medium cursor-pointer transition-all mt-2 shadow-md hover:-translate-y-0.5 hover:shadow-lg transform transition-transform duration-300 hover:scale-[1.02]"
								>
									Login
								</button>
								<div className="mt-4 text-center text-sm">
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
							<form className="animate-fade-in">
								<h2 className="text-2xl mb-6 text-center font-semibold bg-gradient-to-r from-[#6a11cb] to-[#2575fc] bg-clip-text text-transparent animate-text-glow">
									Join Our Community
								</h2>
								<div className="mb-6 relative">
									<label
										htmlFor="full-name"
										className="block mb-2 font-medium text-white/90"
									>
										Full Name
									</label>
									<i className="fas fa-user absolute left-4 top-10 text-[#8e2de2]" />
									<input
										type="text"
										id="full-name"
										placeholder="Enter your full name"
										required
										className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
									/>
								</div>
								<div className="flex gap-4 mb-6 flex-col md:flex-row">
									<div className="relative flex-1">
										<label
											htmlFor="lpu-id"
											className="block mb-2 font-medium text-white/90"
										>
											LPU ID
										</label>
										<i className="fas fa-id-card absolute left-4 top-10 text-[#8e2de2]" />
										<input
											type="text"
											id="lpu-id"
											placeholder="Enter LPU ID"
											required
											className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
										/>
									</div>
									<div className="relative flex-1">
										<label
											htmlFor="email"
											className="block mb-2 font-medium text-white/90"
										>
											Email
										</label>
										<i className="fas fa-envelope absolute left-4 top-10 text-[#8e2de2]" />
										<input
											type="email"
											id="email"
											placeholder="Enter your email"
											required
											className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
										/>
									</div>
								</div>
								<div className="flex gap-4 mb-6 flex-col md:flex-row">
									<div className="relative flex-1">
										<label
											htmlFor="phone"
											className="block mb-2 font-medium text-white/90"
										>
											Phone
										</label>
										<i className="fas fa-phone absolute left-4 top-10 text-[#8e2de2]" />
										<input
											type="tel"
											id="phone"
											placeholder="Enter phone number"
											required
											className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
										/>
									</div>
									<div className="relative flex-1">
										<label
											htmlFor="course"
											className="block mb-2 font-medium text-white/90"
										>
											Course
										</label>
										<i className="fas fa-graduation-cap absolute left-4 top-10 text-[#8e2de2]" />
										<select
											id="course"
											required
											className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
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
								<div className="flex gap-4 mb-6 flex-col md:flex-row">
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
													className="accent-[#8e2de2]"
												/>{' '}
												Male
											</label>
											<label className="flex items-center gap-2 transition-all hover:text-[#8e2de2]">
												<input
													type="radio"
													name="gender"
													value="female"
													className="accent-[#8e2de2]"
												/>{' '}
												Female
											</label>
											<label className="flex items-center gap-2 transition-all hover:text-[#8e2de2]">
												<input
													type="radio"
													name="gender"
													value="other"
													className="accent-[#8e2de2]"
												/>{' '}
												Other
											</label>
										</div>
									</div>
									<div className="relative flex-1">
										<label
											htmlFor="accommodation"
											className="block mb-2 font-medium text-white/90"
										>
											Accommodation
										</label>
										<i className="fas fa-home absolute left-4 top-10 text-[#8e2de2]" />
										<select
											id="accommodation"
											required
											className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
										>
											<option value="" disabled>
												Select accommodation
											</option>
											<option value="hostel">Hostel</option>
											<option value="day-scholar">Day Scholar</option>
										</select>
									</div>
								</div>
								<div className="mb-6 relative">
									<label
										htmlFor="domains"
										className="block mb-2 font-medium text-white/90"
									>
										Areas of Interest (Domains)
									</label>
									<div className="relative">
										<i className="fas fa-code absolute left-4 top-4 text-[#8e2de2]" />
										<select
											id="domains"
											multiple
											required
											className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 h-24 hover:bg-black/30"
										>
											<option value="web-dev">Web Development</option>
											<option value="app-dev">App Development</option>
											<option value="ai-ml">AI & Machine Learning</option>
											<option value="cybersecurity">Cybersecurity</option>
											<option value="cloud-computing">Cloud Computing</option>
											<option value="iot">Internet of Things</option>
											<option value="data-science">Data Science</option>
											<option value="blockchain">Blockchain</option>
										</select>
									</div>
									<p className="mt-1 text-xs text-white/60">
										Hold Ctrl/Cmd to select multiple
									</p>
								</div>
								<div className="mb-6 relative">
									<label
										htmlFor="experience"
										className="block mb-2 font-medium text-white/90"
									>
										Previous Experience
									</label>
									<i className="fas fa-briefcase absolute left-4 top-10 text-[#8e2de2]" />
									<textarea
										id="experience"
										placeholder="Describe your previous experience (if any)"
										rows={3}
										className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
									/>
								</div>
								<div className="mb-6 relative">
									<label
										htmlFor="other-org"
										className="block mb-2 font-medium text-white/90"
									>
										Other Organizations
									</label>
									<i className="fas fa-users absolute left-4 top-10 text-[#8e2de2]" />
									<input
										type="text"
										id="other-org"
										placeholder="Other clubs/organizations you're part of"
										className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
									/>
								</div>
								<div className="mb-6 relative">
									<label
										htmlFor="bio"
										className="block mb-2 font-medium text-white/90"
									>
										Bio
									</label>
									<i className="fas fa-comment absolute left-4 top-10 text-[#8e2de2]" />
									<textarea
										id="bio"
										placeholder="Tell us about yourself..."
										rows={3}
										required
										className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white font-poppins text-base transition-all focus:outline-none focus:border-[#8e2de2] focus:ring-2 focus:ring-[#8e2de2]/30 hover:bg-black/30"
									/>
								</div>
								<button
									type="submit"
									className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-poppins text-lg font-medium cursor-pointer transition-all mt-2 shadow-md hover:-translate-y-0.5 hover:shadow-lg transform transition-transform duration-300 hover:scale-[1.02]"
								>
									Register Now
								</button>
								<div className="mt-4 text-center text-sm">
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
