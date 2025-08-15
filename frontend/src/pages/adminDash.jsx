import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Ticket, LogOut, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useGetAllEvents } from '../hooks/useEvents.js';
import DashboardTab from '../components/admin/DashboardTab.jsx';
import MembersTab from '../components/admin/MembersTab.jsx';
import EventsTab from '../components/admin/EventsTab.jsx';
import TicketsTab from '../components/admin/TicketsTab.jsx';
import CreateTicket from '../components/admin/CreateTicket.jsx';
import LoadingSpinner from '../components/admin/LoadingSpinner.jsx';
import ErrorMessage from '../components/admin/ErrorMessage.jsx';
import Modal from '../components/admin/Modal.jsx';

const AdminDash = () => {
	const { user, loading: authLoading, logoutAdmin, token } = useAuth();
	const [activeTab, setActiveTab] = useState('dashboard');
	const [dashboardError, setDashboardError] = useState('');
	const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);

	// Events
	const { getAllEvents, events, loading: eventsLoading, error: eventsError } = useGetAllEvents();

	useEffect(() => {
		const fetchData = async () => {
			try {
				await getAllEvents();
			} catch (err) {
				setDashboardError('Failed to load dashboard data');
			}
		};
		fetchData();
	}, []);

	const handleLogout = async () => {
		try {
			await logoutAdmin();
			window.location.href = '/admin/auth';
		} catch (error) {
			setDashboardError('Logout failed');
		}
	};

	if (authLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
				<span className="text-lg font-semibold text-blue-400 animate-pulse">
					Loading Dashboard...
				</span>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center py-8 px-4 sm:px-6">
			<motion.div
				className="w-full max-w-7xl bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{/* Header */}
				<div className="flex justify-between items-center p-6 border-b border-gray-700">
					<div className="flex items-center gap-3">
						<ShieldCheck className="h-8 w-8 text-blue-400" />
						<h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
							Admin Dashboard
						</h1>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-4 py-2">
							<span className="text-white">{user?.fullname || 'Admin'}</span>
						</div>

						<button
							onClick={() => setShowCreateTicketModal(true)}
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700/80 text-white hover:bg-blue-600 transition"
						>
							<Ticket className="h-5 w-5" />
							Create Ticket
						</button>

						<button
							onClick={handleLogout}
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700/80 text-white hover:bg-red-600 transition"
						>
							<LogOut className="h-5 w-5" />
							Logout
						</button>
					</div>
				</div>

				{dashboardError && <ErrorMessage error={dashboardError} />}

				{/* Tab Navigation */}
				<div className="flex border-b border-gray-700 px-6">
					{['dashboard', 'members', 'events', 'tickets'].map((tab) => (
						<button
							key={tab}
							className={`px-4 py-3 font-medium relative ${
								activeTab === tab
									? 'text-blue-400'
									: 'text-gray-400 hover:text-gray-200'
							}`}
							onClick={() => setActiveTab(tab)}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
							{activeTab === tab && (
								<motion.div
									className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"
									layoutId="tabIndicator"
								/>
							)}
						</button>
					))}
				</div>

				{/* Dashboard Content */}
				<div className="p-6">
					{activeTab === 'dashboard' && (
						<DashboardTab
							events={events}
							eventsLoading={eventsLoading}
							setActiveTab={setActiveTab}
						/>
					)}

					{activeTab === 'members' && (
						<MembersTab token={token} setDashboardError={setDashboardError} />
					)}

					{activeTab === 'events' && (
						<EventsTab
							events={events}
							eventsLoading={eventsLoading}
							eventsError={eventsError}
							token={token}
							setDashboardError={setDashboardError}
							getAllEvents={getAllEvents}
						/>
					)}

					{activeTab === 'tickets' && (
						<TicketsTab
							token={token}
							events={events}
							setDashboardError={setDashboardError}
						/>
					)}
				</div>
			</motion.div>

			{/* Create Ticket Modal */}
			{showCreateTicketModal && (
				<Modal
					title="Create Ticket"
					onClose={() => setShowCreateTicketModal(false)}
					size="lg"
				>
					<CreateTicket
						token={token}
						events={events}
						onClose={() => setShowCreateTicketModal(false)}
					/>
				</Modal>
			)}
		</div>
	);
};

export default AdminDash;
