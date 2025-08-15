import { BarChart2, Ticket, CheckCircle, XCircle, Clock } from 'lucide-react';

const TicketStats = ({ stats }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
			<div className="bg-gray-750 rounded-lg p-4 flex items-center">
				<div className="bg-blue-900/30 p-3 rounded-full mr-4">
					<Ticket className="h-6 w-6 text-blue-400" />
				</div>
				<div>
					<p className="text-gray-400 text-sm">Total Tickets</p>
					<p className="text-xl font-bold text-white">{stats.total}</p>
				</div>
			</div>

			<div className="bg-gray-750 rounded-lg p-4 flex items-center">
				<div className="bg-yellow-900/30 p-3 rounded-full mr-4">
					<Clock className="h-6 w-6 text-yellow-400" />
				</div>
				<div>
					<p className="text-gray-400 text-sm">Pending</p>
					<p className="text-xl font-bold text-yellow-400">{stats.pending}</p>
				</div>
			</div>

			<div className="bg-gray-750 rounded-lg p-4 flex items-center">
				<div className="bg-green-900/30 p-3 rounded-full mr-4">
					<CheckCircle className="h-6 w-6 text-green-400" />
				</div>
				<div>
					<p className="text-gray-400 text-sm">Approved</p>
					<p className="text-xl font-bold text-green-400">{stats.approved}</p>
				</div>
			</div>

			<div className="bg-gray-750 rounded-lg p-4 flex items-center">
				<div className="bg-red-900/30 p-3 rounded-full mr-4">
					<XCircle className="h-6 w-6 text-red-400" />
				</div>
				<div>
					<p className="text-gray-400 text-sm">Rejected</p>
					<p className="text-xl font-bold text-red-400">{stats.rejected}</p>
				</div>
			</div>

			<div className="bg-gray-750 rounded-lg p-4 flex items-center">
				<div className="bg-purple-900/30 p-3 rounded-full mr-4">
					<BarChart2 className="h-6 w-6 text-purple-400" />
				</div>
				<div>
					<p className="text-gray-400 text-sm">Checked In</p>
					<p className="text-xl font-bold text-purple-400">{stats.checkedIn}</p>
				</div>
			</div>
		</div>
	);
};

export default TicketStats;
