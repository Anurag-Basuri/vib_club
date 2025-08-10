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
import LoadingSpinner from '../components/LoadingSpinner.js';
import ErrorMessage from '../components/ErrorMessage.js';
import StatusBadge from '../components/StatusBadge.js';
import Modal from '../components/Modal.js';
import MembersTable from '../components/MembersTable.js';
import LeadersSection from '../components/LeadersSection.js';

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
							{/* Stats Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
									<div className="flex items-center gap-3 mb-4">
										<Users className="h-6 w-6 text-green-400" />
										<h3 className="text-lg font-semibold text-white">
											Total Members
										</h3>
									</div>
									<div className="text-3xl font-bold text-green-400">
										{membersLoading ? '...' : total}
									</div>
								</div>

								<div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
									<div className="flex items-center gap-3 mb-4">
										<ShieldCheck className="h-6 w-6 text-yellow-400" />
										<h3 className="text-lg font-semibold text-white">
											Leaders
										</h3>
									</div>
									<div className="text-3xl font-bold text-yellow-400">
										{leadersLoading ? '...' : leaders.length}
									</div>
								</div>

								<div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
									<div className="flex items-center gap-3 mb-4">
										<CalendarDays className="h-6 w-6 text-purple-400" />
										<h3 className="text-lg font-semibold text-white">Events</h3>
									</div>
									<div className="text-3xl font-bold text-purple-400">
										{eventsLoading ? '...' : events.length}
									</div>
								</div>

								<div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
									<div className="flex items-center gap-3 mb-4">
										<Ticket className="h-6 w-6 text-cyan-400" />
										<h3 className="text-lg font-semibold text-white">
											Tickets
										</h3>
									</div>
									<div className="text-3xl font-bold text-cyan-400">
										{selectedEventId
											? ticketsLoading
												? '...'
												: tickets.length
											: '0'}
									</div>
								</div>
							</div>

							{/* Upcoming Events */}
							<div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-xl font-bold text-white flex items-center gap-2">
										<Clock className="h-5 w-5 text-cyan-400" />
										Upcoming Events
									</h2>
									<button
										className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
										onClick={() => setShowCreateEvent(true)}
									>
										<Plus className="h-4 w-4" />
										Create Event
									</button>
								</div>

								{eventsLoading ? (
									<LoadingSpinner />
								) : upcomingEvents.length === 0 ? (
									<div className="text-gray-400 text-center py-8">
										No upcoming events found
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{upcomingEvents.map((event) => (
											<div
												key={event._id}
												className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-blue-500/50 transition cursor-pointer"
												onClick={() => {
													setSelectedEventId(event._id);
													setActiveTab('tickets');
												}}
											>
												<div className="flex justify-between items-start">
													<div>
														<h3 className="font-bold text-white text-lg mb-1">
															{event.title}
														</h3>
														<div className="flex items-center gap-2 mb-3">
															<StatusBadge status={event.status} />
															<span className="text-gray-400 text-sm">
																{event.date
																	? new Date(
																			event.date
																		).toLocaleDateString()
																	: ''}
															</span>
														</div>
													</div>
													<div className="flex gap-2">
														<button
															className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
															onClick={(e) => {
																e.stopPropagation();
																openEditEventModal(event);
															}}
														>
															<Edit className="h-4 w-4" />
														</button>
														<button
															className="p-2 rounded-full bg-gray-700 hover:bg-red-600"
															onClick={(e) => {
																e.stopPropagation();
																handleDeleteEvent(event._id);
															}}
														>
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												</div>
												<p className="text-gray-400 text-sm mb-4 line-clamp-2">
													{event.description || 'No description'}
												</p>
												<div className="flex items-center justify-between text-sm">
													<span className="text-gray-400">
														{event.location || 'No location'}
													</span>
													<span className="flex items-center gap-1 text-cyan-400">
														<Ticket className="h-4 w-4" />
														{
															tickets.filter(
																(t) => t.event === event._id
															).length
														}{' '}
														tickets
													</span>
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Recent Activity */}
							<div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
								<h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
									<Activity className="h-5 w-5 text-purple-400" />
									Recent Activity
								</h2>

								<div className="space-y-4">
									{members.slice(0, 5).map((member) => (
										<div
											key={member._id}
											className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg"
										>
											<div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
												<User className="h-5 w-5 text-blue-400" />
											</div>
											<div>
												<div className="font-medium text-white">
													{member.fullname}
												</div>
												<div className="text-gray-400 text-sm">
													Joined{' '}
													{member.joinedAt
														? new Date(
																member.joinedAt
															).toLocaleDateString()
														: 'N/A'}
												</div>
											</div>
											<div className="ml-auto">
												<StatusBadge status={member.status} />
											</div>
										</div>
									))}
								</div>
							</div>
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
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{events.map((event) => (
										<div
											key={event._id}
											className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 hover:border-blue-500/50 transition"
										>
											<div className="flex justify-between items-start mb-3">
												<h3 className="font-bold text-white text-lg">
													{event.title}
												</h3>
												<StatusBadge status={event.status} />
											</div>

											<div className="text-gray-400 text-sm mb-4">
												{event.date
													? new Date(event.date).toLocaleString()
													: ''}
											</div>

											<p className="text-gray-400 text-sm mb-4 line-clamp-2">
												{event.description || 'No description'}
											</p>

											<div className="flex justify-between items-center">
												<span className="text-gray-500 text-sm">
													{event.location || 'No location'}
												</span>

												<div className="flex gap-2">
													<button
														className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
														onClick={() => openEditEventModal(event)}
													>
														<Edit className="h-4 w-4" />
													</button>
													<button
														className="p-2 rounded-lg bg-gray-700 hover:bg-red-600"
														onClick={() => handleDeleteEvent(event._id)}
														disabled={deleteLoading}
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
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
								<div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-lg font-bold text-white">
											Ticket Status Distribution
										</h3>
										<div className="text-cyan-400">
											{tickets.length} tickets
										</div>
									</div>

									<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
										{Object.entries(ticketStatusCount).map(
											([status, count]) => (
												<div
													key={status}
													className="bg-gray-800/50 rounded-lg p-4"
												>
													<div className="text-white font-medium capitalize">
														{status}
													</div>
													<div className="text-2xl font-bold mt-1 text-cyan-400">
														{count}
													</div>
													<div className="mt-2 w-full bg-gray-700 rounded-full h-2">
														<div
															className="h-2 rounded-full bg-cyan-500"
															style={{
																width: `${(count / tickets.length) * 100}%`,
															}}
														></div>
													</div>
												</div>
											)
										)}
									</div>
								</div>
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
									<div className="overflow-x-auto rounded-xl border border-gray-700">
										<table className="min-w-full">
											<thead className="bg-gray-700/80">
												<tr>
													<th className="px-4 py-3 text-left text-gray-300 font-medium">
														Ticket ID
													</th>
													<th className="px-4 py-3 text-left text-gray-300 font-medium">
														Member
													</th>
													<th className="px-4 py-3 text-left text-gray-300 font-medium">
														Status
													</th>
													<th className="px-4 py-3 text-left text-gray-300 font-medium">
														Created
													</th>
													<th className="px-4 py-3 text-left text-gray-300 font-medium">
														Actions
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-700">
												{filteredTickets.map((ticket) => (
													<tr
														key={ticket._id}
														className="hover:bg-gray-800/50 transition"
													>
														<td className="px-4 py-3 text-gray-300 font-mono text-sm">
															{ticket._id.slice(-8)}
														</td>
														<td className="px-4 py-3">
															<div className="font-medium text-white">
																{ticket.member?.fullname || 'N/A'}
															</div>
															<div className="text-gray-400 text-sm">
																{ticket.member?.email || 'N/A'}
															</div>
														</td>
														<td className="px-4 py-3">
															<StatusBadge status={ticket.status} />
														</td>
														<td className="px-4 py-3 text-gray-400 text-sm">
															{ticket.createdAt
																? new Date(
																		ticket.createdAt
																	).toLocaleDateString()
																: ''}
														</td>
														<td className="px-4 py-3">
															<div className="flex gap-2">
																{ticket.status !== 'approved' && (
																	<button
																		className="p-2 rounded-lg bg-green-600/50 hover:bg-green-600"
																		onClick={() =>
																			handleUpdateTicketStatus(
																				ticket._id,
																				'approved'
																			)
																		}
																		title="Approve"
																	>
																		<BadgeCheck className="h-4 w-4" />
																	</button>
																)}
																{ticket.status !== 'rejected' && (
																	<button
																		className="p-2 rounded-lg bg-red-600/50 hover:bg-red-600"
																		onClick={() =>
																			handleUpdateTicketStatus(
																				ticket._id,
																				'rejected'
																			)
																		}
																		title="Reject"
																	>
																		<Ban className="h-4 w-4" />
																	</button>
																)}
																<button
																	className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
																	onClick={() =>
																		handleDeleteTicket(
																			ticket._id
																		)
																	}
																	title="Delete"
																>
																	<Trash2 className="h-4 w-4" />
																</button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
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
				<Modal title="Create Event" onClose={() => setShowCreateEvent(false)}>
					<div className="space-y-4">
						<div>
							<label className="block text-gray-300 mb-1">Event Title</label>
							<input
								type="text"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter title"
								value={eventFields.title}
								onChange={(e) =>
									setEventFields({ ...eventFields, title: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-300 mb-1">Date & Time</label>
							<input
								type="datetime-local"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={eventFields.date}
								onChange={(e) =>
									setEventFields({ ...eventFields, date: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-300 mb-1">Location</label>
							<input
								type="text"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter location"
								value={eventFields.location}
								onChange={(e) =>
									setEventFields({ ...eventFields, location: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-300 mb-1">Description</label>
							<textarea
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter description"
								rows="3"
								value={eventFields.description}
								onChange={(e) =>
									setEventFields({ ...eventFields, description: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-300 mb-1">Status</label>
							<select
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={eventFields.status}
								onChange={(e) =>
									setEventFields({ ...eventFields, status: e.target.value })
								}
							>
								<option value="upcoming">Upcoming</option>
								<option value="ongoing">Ongoing</option>
								<option value="completed">Completed</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>

						<div className="flex justify-end gap-3 pt-4">
							<button
								className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
								onClick={() => setShowCreateEvent(false)}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2"
								onClick={handleCreateEvent}
								disabled={createLoading}
							>
								{createLoading ? 'Creating...' : 'Create Event'}
							</button>
						</div>
					</div>
				</Modal>
			)}

			{showEditEvent && (
				<Modal title="Edit Event" onClose={() => setShowEditEvent(false)}>
					<div className="space-y-4">
						<div>
							<label className="block text-gray-300 mb-1">Event Title</label>
							<input
								type="text"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter title"
								value={eventFields.title}
								onChange={(e) =>
									setEventFields({ ...eventFields, title: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-300 mb-1">Date & Time</label>
							<input
								type="datetime-local"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={eventFields.date}
								onChange={(e) =>
									setEventFields({ ...eventFields, date: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-300 mb-1">Location</label>
							<input
								type="text"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter location"
								value={eventFields.location}
								onChange={(e) =>
									setEventFields({ ...eventFields, location: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-300 mb-1">Description</label>
							<textarea
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter description"
								rows="3"
								value={eventFields.description}
								onChange={(e) =>
									setEventFields({ ...eventFields, description: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-gray-300 mb-1">Status</label>
							<select
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={eventFields.status}
								onChange={(e) =>
									setEventFields({ ...eventFields, status: e.target.value })
								}
							>
								<option value="upcoming">Upcoming</option>
								<option value="ongoing">Ongoing</option>
								<option value="completed">Completed</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>

						<div className="flex justify-end gap-3 pt-4">
							<button
								className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
								onClick={() => setShowEditEvent(false)}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2"
								onClick={handleEditEvent}
								disabled={updateEventLoading}
							>
								{updateEventLoading ? 'Updating...' : 'Update Event'}
							</button>
						</div>
					</div>
				</Modal>
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
				<Modal title="Edit Member" onClose={() => setEditMember(null)}>
					<div className="space-y-4">
						<div>
							<label className="block text-gray-300 mb-1">Department</label>
							<input
								type="text"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter department"
								value={editFields.department}
								onChange={(e) =>
									setEditFields({ ...editFields, department: e.target.value })
								}
							/>
						</div>
						<div>
							<label className="block text-gray-300 mb-1">Designation</label>
							<input
								type="text"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter designation"
								value={editFields.designation}
								onChange={(e) =>
									setEditFields({ ...editFields, designation: e.target.value })
								}
							/>
						</div>
						<div>
							<label className="block text-gray-300 mb-1">LPU ID</label>
							<input
								type="text"
								className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter LPU ID"
								value={editFields.LpuId}
								onChange={(e) =>
									setEditFields({ ...editFields, LpuId: e.target.value })
								}
							/>
						</div>
						<div className="flex justify-end gap-3 pt-4">
							<button
								className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
								onClick={() => setEditMember(null)}
								type="button"
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2"
								onClick={() => handleEditMember(editMember)}
								disabled={updateLoading}
								type="button"
							>
								{updateLoading ? 'Updating...' : 'Update Member'}
							</button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default AdminDash;
