import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLink, FiX, FiPlus, FiExternalLink } from 'react-icons/fi';

const SocialLinksSection = ({
	isEditing,
	socialLinks,
	handleSocialLinkChange,
	addSocialLink,
	removeSocialLink,
	member,
}) => {
	if (isEditing) {
		return (
			<motion.div
				key="social"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -20 }}
				className="space-y-6"
			>
				<motion.div
					whileHover={{ y: -2 }}
					className="glass-card p-6 rounded-2xl border border-white/5"
				>
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
						<FiLink className="w-5 h-5 mr-2 text-cyan-400" />
						Social Links
					</h3>

					<div className="space-y-4">
						<AnimatePresence>
							{socialLinks.map((link, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 glass-card rounded-xl border border-white/5"
								>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											Platform
										</label>
										<select
											value={link.platform}
											onChange={(e) =>
												handleSocialLinkChange(
													index,
													'platform',
													e.target.value
												)
											}
											className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-300"
											aria-label={`Platform for social link ${index + 1}`}
										>
											<option value="" className="bg-gray-800">
												Select Platform
											</option>
											{SOCIAL_PLATFORMS.map((platform) => (
												<option
													key={platform}
													value={platform}
													className="bg-gray-800"
												>
													{platform}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											URL
										</label>
										<div className="flex space-x-2">
											<input
												type="url"
												value={link.url}
												onChange={(e) =>
													handleSocialLinkChange(
														index,
														'url',
														e.target.value
													)
												}
												className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
												placeholder="https://..."
												aria-label={`URL for social link ${index + 1}`}
											/>
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => removeSocialLink(index)}
												className="bg-red-500/20 text-red-300 hover:bg-red-500/30 p-3 rounded-xl transition-colors duration-300 border border-red-400/20"
												title={`Remove social link ${index + 1}`}
												aria-label={`Remove social link ${index + 1}`}
											>
												<FiX className="w-4 h-4" />
											</motion.button>
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={addSocialLink}
							className="w-full py-3 border-2 border-dashed border-white/20 hover:border-blue-400/40 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
							aria-label="Add new social link"
						>
							<FiPlus className="w-4 h-4" />
							<span>Add Social Link</span>
						</motion.button>
					</div>
				</motion.div>
			</motion.div>
		);
	}

	return (
		member.socialLinks &&
		member.socialLinks.length > 0 && (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="glass-card p-6 rounded-2xl border border-white/5"
			>
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
					<FiLink className="w-5 h-5 mr-2 text-cyan-400" />
					Social Links
				</h3>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
					{member.socialLinks.map((link, index) => (
						<motion.a
							key={index}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							className="glass-card-primary p-3 rounded-xl text-center border border-blue-400/20 hover:border-blue-300/40 transition-all duration-300"
							onClick={() => toast(`Opening ${link.platform}...`, { icon: '🔗' })}
						>
							<div className="text-blue-300 font-medium text-sm">{link.platform}</div>
						</motion.a>
					))}
				</div>
			</motion.div>
		)
	);
};

export default SocialLinksSection;
