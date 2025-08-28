import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiAward, FiShield, FiMapPin } from 'react-icons/fi';
import StatCard from './StatCard';

const MemberStats = ({ member }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case 'active':
				return 'green';
			case 'banned':
				return 'red';
			default:
				return 'orange';
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
			className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
		>
			<StatCard
				icon={FiCalendar}
				label="Member Since"
				value={new Date(member.joinedAt).getFullYear()}
				color="blue"
			/>
			<StatCard
				icon={FiAward}
				label="Designation"
				value={
					member.designation
						? member.designation.charAt(0).toUpperCase() + member.designation.slice(1)
						: 'Member'
				}
				color="purple"
			/>
			<StatCard
				icon={FiShield}
				label="Status"
				value={member.status === 'active' ? 'Active' : member.status}
				color={getStatusColor(member.status)}
			/>
			<StatCard
				icon={FiMapPin}
				label="Department"
				value={member.department || 'Not Set'}
				color="orange"
			/>
		</motion.div>
	);
};

export default MemberStats;
