import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
	Mail,
	Phone,
	GraduationCap,
	Calendar,
	Building,
	Award,
	Users,
	FileText,
	Download,
} from 'lucide-react';

const ProfileDisplay = ({ member, onEditToggle, onResumeUpload, uploadResumeLoading }) => {
	const resumeInputRef = useRef(null);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="grid grid-cols-1 md:grid-cols-2 gap-5"
		>
			<div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
					<Mail className="w-5 h-5 text-cyan-500" />
					Contact Information
				</h3>
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<Mail className="w-5 h-5 text-cyan-500" />
						<div>
							<p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
							<p className="text-gray-800 dark:text-white text-sm">
								{member.email || 'Not provided'}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Phone className="w-5 h-5 text-green-500" />
						<div>
							<p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
							<p className="text-gray-800 dark:text-white text-sm">
								{member.phone || 'Not provided'}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
					<GraduationCap className="w-5 h-5 text-violet-500" />
					Academic Information
				</h3>
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<GraduationCap className="w-5 h-5 text-violet-500" />
						<div>
							<p className="text-xs text-gray-500 dark:text-gray-400">Program</p>
							<p className="text-gray-800 dark:text-white text-sm">
								{member.program || 'Not provided'}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Calendar className="w-5 h-5 text-orange-500" />
						<div>
							<p className="text-xs text-gray-500 dark:text-gray-400">Year</p>
							<p className="text-gray-800 dark:text-white text-sm">
								{member.year
									? `${member.year}${member.year === 1 ? 'st' : member.year === 2 ? 'nd' : member.year === 3 ? 'rd' : 'th'} Year`
									: 'Not provided'}
							</p>
						</div>
					</div>
					{member.hosteler && (
						<div className="flex items-center gap-3">
							<Building className="w-5 h-5 text-blue-500" />
							<div>
								<p className="text-xs text-gray-500 dark:text-gray-400">Hostel</p>
								<p className="text-gray-800 dark:text-white text-sm">
									{member.hostel || 'Not specified'}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{member.skills && member.skills.length > 0 && (
				<div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
						<Award className="w-5 h-5 text-amber-500" />
						Skills
					</h3>
					<div className="flex flex-wrap gap-2">
						{member.skills.map((skill, index) => (
							<span
								key={index}
								className="px-3 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 rounded-full text-xs border border-cyan-200 dark:border-cyan-500/30"
							>
								{skill}
							</span>
						))}
					</div>
				</div>
			)}

			{member.socialLinks && member.socialLinks.length > 0 && (
				<div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
						<Users className="w-5 h-5 text-pink-500" />
						Social Links
					</h3>
					<div className="space-y-2">
						{member.socialLinks.map((link, index) => (
							<a
								key={index}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
							>
								<div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
								<div className="min-w-0">
									<p className="text-gray-800 dark:text-white font-medium text-sm truncate">
										{link.platform}
									</p>
									<p className="text-gray-500 dark:text-gray-400 text-xs truncate">
										{link.url}
									</p>
								</div>
							</a>
						))}
					</div>
				</div>
			)}

			{member.bio && (
				<div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
						<FileText className="w-5 h-5 text-emerald-500" />
						About
					</h3>
					<p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
						{member.bio}
					</p>
				</div>
			)}

			{member.resume?.url && (
				<div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
						<FileText className="w-5 h-5 text-rose-500" />
						Resume
					</h3>
					<div className="space-y-3">
						<a
							href={member.resume.url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-500/10 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors border border-rose-200 dark:border-rose-500/20"
						>
							<FileText className="w-6 h-6 text-rose-500" />
							<div className="flex-1">
								<p className="text-gray-800 dark:text-white font-medium text-sm">
									View Resume
								</p>
								<p className="text-gray-500 dark:text-gray-400 text-xs">
									Click to open in new tab
								</p>
							</div>
							<div className="flex gap-2 items-center">
								<div className="w-2 h-2 bg-rose-400 rounded-full"></div>
								<span className="text-xs text-rose-500">PDF</span>
							</div>
						</a>

						<button
							onClick={() => resumeInputRef.current?.click()}
							className="w-full flex items-center justify-center gap-2 p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
						>
							<Download className="w-4 h-4" />
							Update Resume
						</button>
						<input
							ref={resumeInputRef}
							type="file"
							accept=".pdf,.doc,.docx"
							onChange={onResumeUpload}
							className="hidden"
						/>
					</div>
				</div>
			)}
		</motion.div>
	);
};

export default ProfileDisplay;
