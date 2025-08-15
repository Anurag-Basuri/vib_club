import { motion } from 'framer-motion';
import { CalendarDays, Users, Ticket, Activity } from 'lucide-react';
import StatsCard from './StatsCard.jsx';
import UpcomingEvents from './UpcomingEvents.jsx';
import RecentActivity from './RecentActivity.jsx';

const DashboardTab = ({ events, eventsLoading, setActiveTab }) => {
	return (
		<div className="space-y-8">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<StatsCard
					icon={<Users size={24} />}
					title="Total Members"
					value="1,254"
					change="+12%"
					color="blue"
				/>
				<StatsCard
					icon={<Ticket size={24} />}
					title="Tickets Sold"
					value="3,421"
					change="+24%"
					color="green"
				/>
				<StatsCard
					icon={<CalendarDays size={24} />}
					title="Upcoming Events"
					value={eventsLoading ? '...' : events.length}
					change="+3 new"
					color="purple"
				/>
				<StatsCard
					icon={<Activity size={24} />}
					title="Engagement Rate"
					value="78.2%"
					change="+5.4%"
					color="orange"
				/>
			</div>

			{/* Charts and Activity */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-lg font-semibold text-white">Activity Overview</h3>
						<div className="flex gap-2">
							<button className="px-3 py-1 text-sm bg-gray-700 rounded-lg">
								Week
							</button>
							<button className="px-3 py-1 text-sm bg-blue-600 rounded-lg">
								Month
							</button>
							<button className="px-3 py-1 text-sm bg-gray-700 rounded-lg">
								Year
							</button>
						</div>
					</div>

					<div className="h-64 flex items-end gap-2 pt-4">
						{[40, 60, 75, 50, 80, 65, 90].map((height, index) => (
							<motion.div
								key={index}
								className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg"
								initial={{ height: 0 }}
								animate={{ height: `${height}%` }}
								transition={{ duration: 0.8, delay: index * 0.1 }}
							/>
						))}
					</div>
				</div>

				<RecentActivity />
			</div>

			{/* Upcoming Events */}
			<UpcomingEvents
				events={events}
				eventsLoading={eventsLoading}
				setActiveTab={setActiveTab}
			/>
		</div>
	);
};

export default DashboardTab;
