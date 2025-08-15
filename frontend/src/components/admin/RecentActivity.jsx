import { Activity, User, Ticket, CheckCircle, XCircle } from 'lucide-react';

const RecentActivity = () => {
	const activities = [
		{
			id: 1,
			user: 'John Doe',
			action: 'created a new ticket',
			target: 'Tech Fest 2023',
			time: '2 mins ago',
			icon: <Ticket className="h-4 w-4 text-blue-400" />,
			status: 'success',
		},
		{
			id: 2,
			user: 'Sarah Smith',
			action: 'approved a ticket request',
			target: 'Cultural Night',
			time: '15 mins ago',
			icon: <CheckCircle className="h-4 w-4 text-green-400" />,
			status: 'success',
		},
		{
			id: 3,
			user: 'Admin',
			action: 'banned a member',
			target: 'Robert Johnson',
			time: '1 hour ago',
			icon: <XCircle className="h-4 w-4 text-red-400" />,
			status: 'warning',
		},
		{
			id: 4,
			user: 'Mike Wilson',
			action: 'registered for event',
			target: 'Hackathon Finals',
			time: '3 hours ago',
			icon: <Ticket className="h-4 w-4 text-blue-400" />,
			status: 'success',
		},
	];

	return (
		<div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-lg font-semibold text-white flex items-center gap-2">
					<Activity className="h-5 w-5 text-cyan-400" />
					Recent Activity
				</h3>
				<button className="text-sm text-cyan-400 hover:text-cyan-300">View All</button>
			</div>

			<div className="space-y-4">
				{activities.map((activity) => (
					<div key={activity.id} className="flex gap-3">
						<div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
							{activity.icon}
						</div>
						<div className="flex-1">
							<p className="text-sm text-white">
								<span className="font-medium">{activity.user}</span>{' '}
								{activity.action}
								{activity.target && (
									<span className="font-medium"> for {activity.target}</span>
								)}
							</p>
							<p className="text-xs text-gray-400 mt-1">{activity.time}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default RecentActivity;
