// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Home,
	Calendar,
	Newspaper,
	Users,
	Mail,
	HelpCircle,
	UserPlus,
	LogIn,
	LayoutDashboard,
	Menu,
	X,
} from 'lucide-react';

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeLink, setActiveLink] = useState('Home');
	const [isScrolled, setIsScrolled] = useState(false);
	const [isHovering, setIsHovering] = useState(false);

	// Scroll listener for Lenis integration
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);

		// Clean up listener
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Navigation items
	const navItems = [
		{ name: 'Home', icon: <Home size={20} />, section: 'display' },
		{ name: 'Events', icon: <Calendar size={20} />, section: 'display' },
		{ name: 'Blog', icon: <Newspaper size={20} />, section: 'display' },
		{ name: 'About Club', icon: <Users size={20} />, section: 'other' },
		{ name: 'Contact', icon: <Mail size={20} />, section: 'other' },
		{ name: 'FAQs', icon: <HelpCircle size={20} />, section: 'other' },
		{ name: 'Register', icon: <UserPlus size={20} />, section: 'account' },
		{ name: 'Login', icon: <LogIn size={20} />, section: 'account' },
		{ name: 'Dashboard', icon: <LayoutDashboard size={20} />, section: 'account' },
	];

	// Handle link click
	const handleLinkClick = (name) => {
		setActiveLink(name);
		setIsOpen(false);
	};

	// Variants for animations
	const sidebarVariants = {
		hidden: {
			x: '-100%',
			opacity: 0,
			borderRadius: '50%',
			clipPath: 'circle(0% at 0% 0%)',
		},
		visible: {
			x: 0,
			opacity: 1,
			borderRadius: '0 20px 20px 0',
			clipPath: 'circle(150% at 0% 0%)',
			transition: {
				type: 'spring',
				damping: 25,
				stiffness: 300,
				mass: 0.5,
			},
		},
		exit: {
			x: '-100%',
			opacity: 0,
			borderRadius: '50%',
			clipPath: 'circle(0% at 0% 0%)',
			transition: { duration: 0.4 },
		},
	};

	const itemVariants = {
		hidden: { x: -20, opacity: 0 },
		visible: (i) => ({
			x: 0,
			opacity: 1,
			transition: { delay: i * 0.1 },
		}),
		hover: {
			y: -5,
			scale: 1.05,
			textShadow: '0 0 8px rgba(99, 102, 241, 0.8)',
			transition: { type: 'spring', stiffness: 300 },
		},
	};

	const underlineVariants = {
		hidden: { width: 0 },
		visible: { width: '100%' },
	};

	const blobVariants = {
		hidden: { scale: 0, opacity: 0 },
		visible: { scale: 1, opacity: 1 },
	};

	return (
		<>
			{/* Mobile Hamburger Button */}
			<motion.button
				className="fixed top-6 left-6 z-50 p-2 rounded-full bg-indigo-600 text-white shadow-lg lg:hidden"
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				onClick={() => setIsOpen(true)}
			>
				<Menu size={24} />
			</motion.button>

			{/* Desktop Sidebar */}
			<motion.div
				className="hidden lg:flex fixed left-0 top-0 h-full w-64 z-40"
				initial={{ x: -100 }}
				animate={{ x: 0 }}
				transition={{ type: 'spring', stiffness: 100 }}
				onHoverStart={() => setIsHovering(true)}
				onHoverEnd={() => setIsHovering(false)}
			>
				<motion.div
					className="h-full w-full bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-xl shadow-xl border-r border-indigo-500/30 p-6"
					animate={{
						boxShadow: isScrolled
							? '0 10px 30px rgba(79, 70, 229, 0.3)'
							: '0 4px 15px rgba(79, 70, 229, 0.2)',
						background: isScrolled
							? 'linear-gradient(to bottom right, rgba(67, 56, 202, 0.95), rgba(109, 40, 217, 0.95))'
							: 'linear-gradient(to bottom right, rgba(67, 56, 202, 0.85), rgba(109, 40, 217, 0.85))',
					}}
				>
					<div className="flex items-center gap-3 mb-10">
						<motion.div
							className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white"
							whileHover={{ rotate: 10, scale: 1.1 }}
						>
							<LayoutDashboard size={24} />
						</motion.div>
						<motion.h1
							className="text-white font-bold text-xl bg-gradient-to-r from-indigo-200 to-purple-300 bg-clip-text text-transparent"
							animate={{
								opacity: isHovering ? 1 : 0.9,
								scale: isHovering ? 1.05 : 1,
							}}
						>
							Tech Club
						</motion.h1>
					</div>

					<div className="space-y-8">
						<div>
							<h3 className="text-indigo-300 text-xs uppercase tracking-wider mb-3 pl-2">
								Display
							</h3>
							<ul className="space-y-2">
								{navItems
									.filter((item) => item.section === 'display')
									.map((item, index) => (
										<motion.li
											key={item.name}
											custom={index}
											variants={itemVariants}
											initial="hidden"
											animate="visible"
											whileHover="hover"
											className="relative"
										>
											<button
												onClick={() => handleLinkClick(item.name)}
												className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${
													activeLink === item.name
														? 'bg-indigo-700/50 text-white'
														: 'text-indigo-200 hover:bg-indigo-800/30'
												}`}
											>
												<motion.span
													animate={{
														rotate: activeLink === item.name ? 5 : 0,
													}}
												>
													{item.icon}
												</motion.span>
												<span>{item.name}</span>

												{activeLink === item.name && (
													<motion.div
														className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
														variants={underlineVariants}
														initial="hidden"
														animate="visible"
													/>
												)}
											</button>
										</motion.li>
									))}
							</ul>
						</div>

						<div>
							<h3 className="text-indigo-300 text-xs uppercase tracking-wider mb-3 pl-2">
								Account
							</h3>
							<ul className="space-y-2">
								{navItems
									.filter((item) => item.section === 'account')
									.map((item, index) => (
										<motion.li
											key={item.name}
											custom={index}
											variants={itemVariants}
											initial="hidden"
											animate="visible"
											whileHover="hover"
											className="relative"
										>
											<button
												onClick={() => handleLinkClick(item.name)}
												className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${
													activeLink === item.name
														? 'bg-indigo-700/50 text-white'
														: 'text-indigo-200 hover:bg-indigo-800/30'
												}`}
											>
												<motion.span
													animate={{
														rotate: activeLink === item.name ? 5 : 0,
													}}
												>
													{item.icon}
												</motion.span>
												<span>{item.name}</span>

												{activeLink === item.name && (
													<motion.div
														className="absolute -left-1 w-2 h-2 rounded-full bg-indigo-400"
														variants={blobVariants}
														initial="hidden"
														animate="visible"
													/>
												)}
											</button>
										</motion.li>
									))}
							</ul>
						</div>

						<div>
							<h3 className="text-indigo-300 text-xs uppercase tracking-wider mb-3 pl-2">
								Other
							</h3>
							<ul className="space-y-2">
								{navItems
									.filter((item) => item.section === 'other')
									.map((item, index) => (
										<motion.li
											key={item.name}
											custom={index}
											variants={itemVariants}
											initial="hidden"
											animate="visible"
											whileHover="hover"
										>
											<button
												onClick={() => handleLinkClick(item.name)}
												className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${
													activeLink === item.name
														? 'bg-indigo-700/50 text-white'
														: 'text-indigo-200 hover:bg-indigo-800/30'
												}`}
											>
												<motion.span
													animate={{
														rotate: activeLink === item.name ? 5 : 0,
													}}
												>
													{item.icon}
												</motion.span>
												<span>{item.name}</span>
											</button>
										</motion.li>
									))}
							</ul>
						</div>
					</div>

					<motion.div
						className="absolute bottom-6 left-0 right-0 px-6"
						animate={{
							opacity: isHovering ? 1 : 0.7,
							y: isHovering ? 0 : 5,
						}}
					>
						<div className="bg-indigo-800/30 backdrop-blur-sm rounded-xl p-4 text-center">
							<p className="text-indigo-200 text-sm">"Code. Create. Collaborate."</p>
						</div>
					</motion.div>
				</motion.div>
			</motion.div>

			{/* Mobile Sidebar with AnimatePresence */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="fixed inset-0 z-40 lg:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{/* Overlay */}
						<div
							className="absolute inset-0 bg-black/50 backdrop-blur-sm"
							onClick={() => setIsOpen(false)}
						/>

						{/* Sidebar */}
						<motion.div
							className="absolute top-0 left-0 h-full w-72 max-w-full z-50"
							variants={sidebarVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="h-full w-full bg-gradient-to-b from-indigo-900 to-purple-900 backdrop-blur-xl shadow-xl p-6">
								<div className="flex justify-between items-center mb-10">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
											<LayoutDashboard size={20} />
										</div>
										<h1 className="text-white font-bold text-xl bg-gradient-to-r from-indigo-200 to-purple-300 bg-clip-text text-transparent">
											Tech Club
										</h1>
									</div>
									<button
										className="p-2 rounded-full bg-indigo-700 text-white"
										onClick={() => setIsOpen(false)}
									>
										<X size={20} />
									</button>
								</div>

								<div className="space-y-8 overflow-y-auto h-[calc(100%-100px)] pb-10">
									<div>
										<h3 className="text-indigo-300 text-xs uppercase tracking-wider mb-3 pl-2">
											Display
										</h3>
										<ul className="space-y-2">
											{navItems
												.filter((item) => item.section === 'display')
												.map((item) => (
													<motion.li
														key={item.name}
														variants={itemVariants}
														initial="hidden"
														animate="visible"
														whileHover="hover"
														className="relative"
													>
														<button
															onClick={() =>
																handleLinkClick(item.name)
															}
															className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${
																activeLink === item.name
																	? 'bg-indigo-700/50 text-white'
																	: 'text-indigo-200 hover:bg-indigo-800/30'
															}`}
														>
															{item.icon}
															<span>{item.name}</span>

															{activeLink === item.name && (
																<motion.div
																	className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
																	variants={underlineVariants}
																	initial="hidden"
																	animate="visible"
																/>
															)}
														</button>
													</motion.li>
												))}
										</ul>
									</div>

									<div>
										<h3 className="text-indigo-300 text-xs uppercase tracking-wider mb-3 pl-2">
											Account
										</h3>
										<ul className="space-y-2">
											{navItems
												.filter((item) => item.section === 'account')
												.map((item) => (
													<motion.li
														key={item.name}
														variants={itemVariants}
														initial="hidden"
														animate="visible"
														whileHover="hover"
														className="relative"
													>
														<button
															onClick={() =>
																handleLinkClick(item.name)
															}
															className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${
																activeLink === item.name
																	? 'bg-indigo-700/50 text-white'
																	: 'text-indigo-200 hover:bg-indigo-800/30'
															}`}
														>
															{item.icon}
															<span>{item.name}</span>

															{activeLink === item.name && (
																<motion.div
																	className="absolute -left-1 w-2 h-2 rounded-full bg-indigo-400"
																	variants={blobVariants}
																	initial="hidden"
																	animate="visible"
																/>
															)}
														</button>
													</motion.li>
												))}
										</ul>
									</div>

									<div>
										<h3 className="text-indigo-300 text-xs uppercase tracking-wider mb-3 pl-2">
											Other
										</h3>
										<ul className="space-y-2">
											{navItems
												.filter((item) => item.section === 'other')
												.map((item) => (
													<motion.li
														key={item.name}
														variants={itemVariants}
														initial="hidden"
														animate="visible"
														whileHover="hover"
													>
														<button
															onClick={() =>
																handleLinkClick(item.name)
															}
															className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${
																activeLink === item.name
																	? 'bg-indigo-700/50 text-white'
																	: 'text-indigo-200 hover:bg-indigo-800/30'
															}`}
														>
															{item.icon}
															<span>{item.name}</span>
														</button>
													</motion.li>
												))}
										</ul>
									</div>
								</div>

								<div className="absolute bottom-6 left-0 right-0 px-6">
									<div className="bg-indigo-800/30 backdrop-blur-sm rounded-xl p-4 text-center">
										<p className="text-indigo-200 text-sm">
											"Code. Create. Collaborate."
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Sidebar;
