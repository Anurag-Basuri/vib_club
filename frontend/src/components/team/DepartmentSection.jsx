import React from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard from './TeamMemberCard';

const DepartmentSection = ({ department, members, onClick }) => {
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
					<div className="flex flex-col items-center mb-8">
						<motion.div
							className="flex items-center space-x-4 p-4 rounded-2xl bg-[#0d1326]/70 border border-[#2a3a72] mb-4"
							whileHover={{ scale: 1.03 }}
						>
							<h3 className="text-xl md:text-2xl font-bold text-white">
								{designation}
							</h3>
						</motion.div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
						{membersInDesignation.map((member, index) => (
							<TeamMemberCard
								key={member._id || index}
								member={member}
								delay={index}
								onClick={onClick}
							/>
						))}
					</div>
				</motion.div>
			)
	);
};

export default DepartmentSection;
