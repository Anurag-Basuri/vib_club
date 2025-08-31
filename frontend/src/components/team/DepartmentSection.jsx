import React from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard from './TeamMemberCard';
import { ChevronRight } from 'lucide-react';

const DepartmentSection = ({ department, members, onClick, isAuthenticated }) => {
	const designationGroups = members.reduce((acc, member) => {
		if (!acc[member.designation]) acc[member.designation] = [];
		acc[member.designation].push(member);
		return acc;
	}, {});

	return Object.entries(designationGroups).map(
		([designation, membersInDesignation]) =>
			membersInDesignation.length > 0 && (
				<motion.div
					key={designation}
					className="mb-16"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-100px' }}
					transition={{ duration: 0.8 }}
				>
					<div className="flex flex-col items-center mb-8 relative">
						{/* Background glow */}
						<div className="absolute inset-0 bg-gradient-to-r from-[#3a56c9]/5 to-[#5d7df5]/5 rounded-2xl blur-2xl"></div>

						<motion.div
							className="flex items-center space-x-2 py-3 px-6 rounded-2xl bg-gradient-to-br from-[#0d1326]/90 to-[#1a1f3a]/80 border border-[#2a3a72] mb-4 relative z-10"
							whileHover={{ scale: 1.03 }}
						>
							<ChevronRight size={18} className="text-[#5d7df5]" />
							<h3 className="text-xl md:text-2xl font-bold text-white">
								{designation}
							</h3>
						</motion.div>

						{/* Decorative line */}
						<div className="w-20 h-1 bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] rounded-full mb-8"></div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
						{membersInDesignation.map((member, index) => (
							<TeamMemberCard
								key={member._id || index}
								member={member}
								delay={index}
								onClick={onClick}
								isAuthenticated={isAuthenticated}
							/>
						))}
					</div>
				</motion.div>
			)
	);
};

export default DepartmentSection;
