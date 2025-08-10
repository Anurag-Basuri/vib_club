import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
	User,
	Users,
	LogOut,
	ShieldCheck,
	Ticket,
	CalendarDays,
	Info,
	Ban,
	Undo2,
	Trash2,
	Edit,
	Plus,
	BadgeCheck,
	Clock,
	BarChart2,
	Filter,
	Search,
	ChevronDown,
	ChevronUp,
	Star,
	Activity,
	RefreshCw,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import {
	useGetAllMembers,
	useGetLeaders,
	useBanMember,
	useRemoveMember,
	useUnbanMember,
	useUpdateMemberByAdmin,
} from '../hooks/useMembers.js';
import {
	useGetAllEvents,
	useCreateEvent,
	useUpdateEvent,
	useDeleteEvent,
} from '../hooks/useEvents.js';
import {
	useGetTicketsByEvent,
	useGetTicketById,
	useUpdateTicketStatus,
	useDeleteTicket,
} from '../hooks/useTickets.js';
import LoadingSpinner from '../components/admin/LoadingSpinner.jsx';
import ErrorMessage from '../components/admin/ErrorMessage.jsx';
import StatusBadge from '../components/admin/StatusBadge.jsx';
import Modal from '../components/admin/Modal.jsx';
import MembersTable from '../components/admin/MembersTable.jsx';
import LeadersSection from '../components/admin/LeadersSection.jsx';
import DashboardStatsCards from '../components/admin/DashboardStatsCards.jsx';
import UpcomingEventsSection from '../components/admin/UpcomingEventsSection.jsx';
import RecentActivitySection from '../components/admin/RecentActivitySection.jsx';
import EventCardList from '../components/admin/EventCardList.jsx';
import TicketTable from '../components/admin/TicketTable.jsx';
import TicketStatusDistribution from '../components/admin/TicketStatusDistribution.jsx';
import EventModal from '../components/admin/EventModal.jsx';
import EditMemberModal from '../components/admin/EditMemberModal.jsx';

// Main Admin Dashboard Component
const AdminDash = () => {
	const { user, loading: authLoading, logoutAdmin, token } = useAuth();
	const [activeTab, setActiveTab] = useState('dashboard');
	const [dashboardError, setDashboardError] = useState('');

	// Members
	const {
		getAllMembers,
		members,
		total,
		loading: membersLoading,
		error: membersError,
	} = useGetAllMembers();
	const { getLeaders, leaders, loading: leadersLoading, error: leadersError } = useGetLeaders();
	const { banMember, loading: banLoading, error: banError } = useBanMember();
	const { unbanMember, loading: unbanLoading, error: unbanError } = useUnbanMember();
	const { removeMember, loading: removeLoading, error: removeError } = useRemoveMember();
	const {
		updateMemberByAdmin,
		loading: updateLoading,
		error: updateError,
	} = useUpdateMemberByAdmin();

	// Events
	const { getAllEvents, events, loading: eventsLoading, error: eventsError } = useGetAllEvents();
	const {
		createEvent,
		event: createdEvent,
		loading: createLoading,
		error: createError,
	} = useCreateEvent();
	const {
		updateEvent,
		event: updatedEvent,
		loading: updateEventLoading,
		error: updateEventError,
	} = useUpdateEvent();
	const { deleteEvent, loading: deleteLoading, error: deleteError } = useDeleteEvent();

	// Tickets
	const {
		getTicketsByEvent,
		tickets,
		loading: ticketsLoading,
		error: ticketsError,
	} = useGetTicketsByEvent();
	const {
		getTicketById,
		ticket,
		loading: ticketLoading,
		error: ticketError,
	} = useGetTicketById();
	const {
		updateTicketStatus,
		ticket: updatedTicket,
		loading: updateTicketLoading,
		error: updateTicketError,
	} = useUpdateTicketStatus();
	const {
		deleteTicket,
		loading: deleteTicketLoading,
		error: deleteTicketError,
	} = useDeleteTicket();

	// UI State
	const [selectedEventId, setSelectedEventId] = useState(null);
	const [actionMemberId, setActionMemberId] = useState(null);
	const [banReason, setBanReason] = useState('');
	const [banReviewTime, setBanReviewTime] = useState('');
	const [removeReason, setRemoveReason] = useState('');
	const [removeReviewTime, setRemoveReviewTime] = useState('');
	const [editMember, setEditMember] = useState(null);
	const [editFields, setEditFields] = useState({ department: '', designation: '', LpuId: '' });
	const [showCreateEvent, setShowCreateEvent] = useState(false);
	const [showEditEvent, setShowEditEvent] = useState(false);
	const [eventFields, setEventFields] = useState({
		title: '',
		date: '',
		location: '',
		description: '',
		status: 'upcoming',
	});
	const [editEventId, setEditEventId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [ticketFilters, setTicketFilters] = useState({
		status: 'all',
		sort: 'newest',
	});
	const [expandedEvents, setExpandedEvents] = useState({});

	// Ticket status distribution
	const ticketStatusCount = tickets.reduce((acc, ticket) => {
		acc[ticket.status] = (acc[ticket.status] || 0) + 1;
		return acc;
	}, {});

	// Filtered members
	const filteredMembers = members.filter(
		(member) =>
			(member.fullname ? member.fullname : '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			(member.email ? member.email : '').toLowerCase().includes(searchTerm.toLowerCase()) ||
			(member.LpuId ? member.LpuId : '').toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Filtered tickets
	const filteredTickets = tickets
		.filter(
			(ticket) => ticketFilters.status === 'all' || ticket.status === ticketFilters.status
		)
		.sort((a, b) => {
			if (ticketFilters.sort === 'newest') {
				return new Date(b.createdAt) - new Date(a.createdAt);
			}
			return new Date(a.createdAt) - new Date(b.createdAt);
		});

	// Upcoming events with tickets
	const upcomingEvents = events.filter(
		(event) => event.status === 'upcoming' || new Date(event.date) > new Date()
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				await Promise.all([getAllMembers(), getLeaders(), getAllEvents()]);
			} catch (err) {
				setDashboardError('Failed to load dashboard data');
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (selectedEventId) {
			getTicketsByEvent(selectedEventId, token).catch((err) =>
				setDashboardError('Failed to load tickets')
			);
		}
	}, [selectedEventId, token]);

	const handleLogout = async () => {
		try {
			await logoutAdmin();
			window.location.href = '/admin/auth';
		} catch (error) {
			setDashboardError('Logout failed');
		}
	};

	// Member actions
	const handleBanMember = async (id) => {
		if (!banReason) return;
		try {
			await banMember(id, banReason, banReviewTime, token);
			setBanReason('');
			setBanReviewTime('');
			setActionMemberId(null);
			await getAllMembers();
		} catch (err) {
			setDashboardError('Ban failed');
		}
	};

	const handleUnbanMember = async (id) => {
		try {
			await unbanMember(id, token);
			setActionMemberId(null);
			await getAllMembers();
		} catch (err) {
			setDashboardError('Unban failed');
		}
	};

	const handleRemoveMember = async (id) => {
		if (!removeReason) return;
		try {
			await removeMember(id, removeReason, removeReviewTime, token);
			setRemoveReason('');
			setRemoveReviewTime('');
			setActionMemberId(null);
			await getAllMembers();
		} catch (err) {
			setDashboardError('Remove failed');
		}
	};

	const handleEditMember = async (id) => {
		try {
			await updateMemberByAdmin(id, editFields, token);
			setEditMember(null);
			setEditFields({ department: '', designation: '', LpuId: '' });
			await getAllMembers();
		} catch (err) {
			setDashboardError('Update failed');
		}
	};

	// Event actions
	const handleCreateEvent = async () => {
		try {
			await createEvent(eventFields);
			setShowCreateEvent(false);
			setEventFields({
				title: '',
				date: '',
				location: '',
				description: '',
				status: 'upcoming',
			});
			await getAllEvents();
		} catch (err) {
			setDashboardError('Create event failed');
		}
	};

	const handleEditEvent = async () => {
		try {
			await updateEvent(editEventId, eventFields);
			setShowEditEvent(false);
			setEditEventId(null);
			setEventFields({
				title: '',
				date: '',
				location: '',
				description: '',
				status: 'upcoming',
			});
			await getAllEvents();
		} catch (err) {
			setDashboardError('Update event failed');
		}
	};

	const handleDeleteEvent = async (id) => {
		try {
			await deleteEvent(id);
			await getAllEvents();
			if (selectedEventId === id) setSelectedEventId(null);
		} catch (err) {
			setDashboardError('Delete event failed');
		}
	};

	// Ticket actions
	const handleUpdateTicketStatus = async (ticketId, status) => {
		try {
			await updateTicketStatus(ticketId, { status }, token);
			if (selectedEventId) {
				await getTicketsByEvent(selectedEventId, token);
			}
		} catch (err) {
			setDashboardError('Ticket update failed');
		}
	};

	const handleDeleteTicket = async (ticketId) => {
		try {
			await deleteTicket(ticketId, token);
			if (selectedEventId) {
				await getTicketsByEvent(selectedEventId, token);
			}
		} catch (err) {
			setDashboardError('Ticket deletion failed');
		}
	};

	// UI Helpers
	const toggleEventExpansion = (eventId) => {
		setExpandedEvents((prev) => ({
			...prev,
			[eventId]: !prev[eventId],
		}));
	};

	const openEditEventModal = (event) => {
		setEditEventId(event._id);
		setEventFields({
			title: event.title || '',
			date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
			location: event.location || '',
			description: event.description || '',
			status: event.status || 'upcoming',
		});
		setShowEditEvent(true);
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
							<User className="h-5 w-5 text-blue-300" />
							<span className="text-white">{user?.fullname || 'Admin'}</span>
						</div>
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
					{/* Dashboard Tab */}
					{activeTab === 'dashboard' && (
						<div className="space-y-8">
							<DashboardStatsCards
								membersLoading={membersLoading}
								total={total}
								leadersLoading={leadersLoading}
								leaders={leaders}
								eventsLoading={eventsLoading}
								events={events}
								ticketsLoading={ticketsLoading}
								tickets={tickets}
								selectedEventId={selectedEventId}
							/>
							<UpcomingEventsSection
								eventsLoading={eventsLoading}
								upcomingEvents={upcomingEvents}
								setShowCreateEvent={setShowCreateEvent}
								openEditEventModal={openEditEventModal}
								handleDeleteEvent={handleDeleteEvent}
								tickets={tickets}
								setSelectedEventId={setSelectedEventId}
								setActiveTab={setActiveTab}
							/>
							<RecentActivitySection members={members} />
						</div>
					)}

					{/* Members Tab */}
					{activeTab === 'members' && (
						<div className="space-y-6">
							<MembersTable
								members={members}
								filteredMembers={filteredMembers}
								membersLoading={membersLoading}
								membersError={membersError}
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
								getAllMembers={getAllMembers}
								setActionMemberId={setActionMemberId}
								handleUnbanMember={handleUnbanMember}
								setEditMember={setEditMember}
								setEditFields={setEditFields}
							/>

							<LeadersSection leaders={leaders} leadersLoading={leadersLoading} />
						</div>
					)}

					{/* Events Tab */}
					{activeTab === 'events' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<h2 className="text-xl font-bold text-white">Event Management</h2>
								<button
									className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
									onClick={() => setShowCreateEvent(true)}
								>
									<Plus className="h-4 w-4" />
									Create Event
								</button>
							</div>

							<ErrorMessage error={eventsError} />

							{eventsLoading ? (
								<LoadingSpinner />
							) : events.length === 0 ? (
								<div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
									<CalendarDays className="h-12 w-12 mx-auto text-gray-500" />
									<h3 className="text-xl font-bold text-gray-400 mt-4">
										No events found
									</h3>
									<p className="text-gray-500 mt-2">
										Create your first event to get started
									</p>
								</div>
							) : (
								<EventCardList
									events={events}
									eventsLoading={eventsLoading}
									handleDeleteEvent={handleDeleteEvent}
									openEditEventModal={openEditEventModal}
								/>
							)}
						</div>
					)}

					{/* Tickets Tab */}
					{activeTab === 'tickets' && (
						<div className="space-y-6">
							<div className="flex flex-col md:flex-row justify-between gap-4">
								<div className="flex gap-2">
									<div className="relative">
										<select
											className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={selectedEventId || ''}
											onChange={(e) =>
												setSelectedEventId(e.target.value || null)
											}
										>
											<option value="">Select an event</option>
											{events.map((event) => (
												<option key={event._id} value={event._id}>
													{event.title}
												</option>
											))}
										</select>
										<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
									</div>

									<div className="relative">
										<select
											className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={ticketFilters.status}
											onChange={(e) =>
												setTicketFilters((prev) => ({
													...prev,
													status: e.target.value,
												}))
											}
										>
											<option value="all">All Statuses</option>
											<option value="pending">Pending</option>
											<option value="approved">Approved</option>
											<option value="rejected">Rejected</option>
											<option value="checked-in">Checked In</option>
										</select>
										<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
									</div>

									<div className="relative">
										<select
											className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={ticketFilters.sort}
											onChange={(e) =>
												setTicketFilters((prev) => ({
													...prev,
													sort: e.target.value,
												}))
											}
										>
											<option value="newest">Newest First</option>
											<option value="oldest">Oldest First</option>
										</select>
										<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
									</div>
								</div>

								<div className="relative w-full md:w-64">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<input
										type="text"
										placeholder="Search tickets..."
										className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
							</div>

							{selectedEventId && (
								<TicketStatusDistribution
									ticketStatusCount={ticketStatusCount}
									tickets={tickets}
								/>
							)}

							<ErrorMessage error={ticketsError} />

							{ticketsLoading ? (
								<LoadingSpinner />
							) : selectedEventId ? (
								filteredTickets.length === 0 ? (
									<div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
										<Ticket className="h-12 w-12 mx-auto text-gray-500" />
										<h3 className="text-xl font-bold text-gray-400 mt-4">
											No tickets found
										</h3>
										<p className="text-gray-500 mt-2">
											Try changing your filters or select a different event
										</p>
									</div>
								) : (
									<TicketTable
										filteredTickets={filteredTickets}
										ticketsLoading={ticketsLoading}
										selectedEventId={selectedEventId}
										handleUpdateTicketStatus={handleUpdateTicketStatus}
										handleDeleteTicket={handleDeleteTicket}
									/>
								)
							) : (
								<div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
									<Ticket className="h-12 w-12 mx-auto text-gray-500" />
									<h3 className="text-xl font-bold text-gray-400 mt-4">
										Select an Event
									</h3>
									<p className="text-gray-500 mt-2">
										Choose an event from the dropdown to view its tickets
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</motion.div>

			{/* Modals */}
			{showCreateEvent && (
				<EventModal
					isEdit={false}
					open={showCreateEvent}
					onClose={() => setShowCreateEvent(false)}
					eventFields={eventFields}
					setEventFields={setEventFields}
					onSubmit={handleCreateEvent}
					loading={createLoading}
				/>
			)}
			{showEditEvent && (
				<EventModal
					isEdit={true}
					open={showEditEvent}
					onClose={() => setShowEditEvent(false)}
					eventFields={eventFields}
					setEventFields={setEventFields}
					onSubmit={handleEditEvent}
					loading={updateEventLoading}
				/>
			)}
			{actionMemberId && actionMemberId.includes('-remove') && (
				<Modal title="Remove Member" onClose={() => setActionMemberId(null)}>
					<div className="space-y-4">
						<div>
							<label className="block text-gray-300 mb-1">Reason</label>
							<input
								type="text"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
								placeholder="Enter reason"
								value={removeReason}
								onChange={(e) => setRemoveReason(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-gray-300 mb-1">Review Date</label>
							<input
								type="datetime-local"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
								value={removeReviewTime}
								onChange={(e) => setRemoveReviewTime(e.target.value)}
							/>
						</div>
						<div className="flex justify-end gap-3 pt-4">
							<button
								className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
								onClick={() => setActionMemberId(null)}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
								onClick={() =>
									handleRemoveMember(actionMemberId.replace('-remove', ''))
								}
								disabled={removeLoading}
							>
								{removeLoading ? 'Removing...' : 'Remove Member'}
							</button>
						</div>
					</div>
				</Modal>
			)}

			{editMember && (
				<EditMemberModal
					open={!!editMember}
					onClose={() => setEditMember(null)}
					editFields={editFields}
					setEditFields={setEditFields}
					onSubmit={() => handleEditMember(editMember)}
					loading={updateLoading}
				/>
			)}
		</div>
	);
};

export default AdminDash;
