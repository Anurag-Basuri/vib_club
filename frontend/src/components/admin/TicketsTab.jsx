import { useState, useEffect, useMemo } from 'react';
import { 
    Ticket, Download, Search, ChevronDown, Trash2, CheckCircle, 
    XCircle, ArrowUpDown, Filter, User, Mail, Phone, Home, Users, Calendar, 
    ChevronRight, MoreVertical, Loader2 
} from 'lucide-react';
import {
    useGetTicketsByEvent,
    useDeleteTicket,
    useUpdateTicket
} from '../../hooks/useTickets.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import StatusBadge from './StatusBadge.jsx';
import TicketStats from './TicketStats.jsx';

const TicketsTab = ({ token, events, setDashboardError }) => {
    const [selectedEventId, setSelectedEventId] = useState('');
    const [ticketFilters, setTicketFilters] = useState({
        sort: 'newest',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [ticketStats, setTicketStats] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);
    const [exportError, setExportError] = useState('');
    const [exportSuccess, setExportSuccess] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const {
        getTicketsByEvent,
        tickets,
        loading: ticketsLoading,
        error: ticketsError,
    } = useGetTicketsByEvent();

    const { updateTicket, loading: updateTicketLoading } = useUpdateTicket();
    const { deleteTicket, loading: deleteTicketLoading } = useDeleteTicket();

    // Fetch tickets when event changes
    useEffect(() => {
        if (selectedEventId) {
            getTicketsByEvent(selectedEventId, token).catch(() =>
                setDashboardError('Failed to load tickets')
            );
        }
        // eslint-disable-next-line
    }, [selectedEventId, token]);

    // Calculate ticket stats
    useEffect(() => {
        if (tickets && tickets.length > 0) {
            const stats = {
                total: tickets.length,
                cancelled: tickets.filter((t) => t.isCancelled === true).length,
                used: tickets.filter((t) => t.isUsed === true).length,
            };
            setTicketStats(stats);
        } else {
            setTicketStats(null);
        }
    }, [tickets]);

    // Handle ticket deletion
    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) return;
        try {
            await deleteTicket(ticketId, token);
            if (selectedEventId) {
                await getTicketsByEvent(selectedEventId, token);
            }
        } catch {
            setDashboardError('Ticket deletion failed');
        }
    };

    // Only update isUsed field
    const handleToggleIsUsed = async (ticketId, currentIsUsed) => {
        try {
            await updateTicket(ticketId, { isUsed: !currentIsUsed }, token);
            if (selectedEventId) {
                await getTicketsByEvent(selectedEventId, token);
            }
        } catch {
            setDashboardError('Ticket update failed');
        }
    };

    // CSV Export handled on frontend, exporting all model fields
    const handleExportTickets = async () => {
        setExportError('');
        setExportSuccess('');
        setExportLoading(true);
        try {
            if (!tickets || tickets.length === 0) {
                setExportError('No tickets to export.');
                setExportLoading(false);
                return;
            }
            const headers = [
                'Ticket ID',
                'Full Name',
                'Email',
                'Phone',
                'LPU ID',
                'Gender',
                'Hosteler',
                'Hostel',
                'Course',
                'Club',
                'Event ID',
                'Event Name',
                'Is Used',
                'QR Code URL',
                'QR Code Public ID',
                'Is Cancelled',
                'Created At',
                'Email Failed'
            ];
            const rows = tickets.map((t) => [
                t.ticketId || t._id || '',
                t.fullName || '',
                t.email || '',
                t.phone || '',
                t.lpuId || '',
                t.gender || '',
                t.hosteler === true ? 'Yes' : 'No',
                t.hostel || '',
                t.course || '',
                t.club || '',
                t.eventId || '',
                t.eventName || '',
                t.isUsed === true ? 'Yes' : 'No',
                t.qrCode?.url || '',
                t.qrCode?.publicId || '',
                t.isCancelled === true ? 'Yes' : 'No',
                t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
                t.emailFailed === true ? 'Yes' : 'No'
            ]);
            const csvContent =
                '\uFEFF' +
                [headers, ...rows]
                    .map((row) =>
                        row
                            .map((cell) =>
                                typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
                                    ? `"${cell.replace(/"/g, '""')}"`
                                    : cell
                            )
                            .join(',')
                    )
                    .join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tickets_' + selectedEventId + '.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setExportSuccess('Tickets exported successfully!');
        } catch (err) {
            setExportError('Export failed: ' + (err?.message || 'Unknown error'));
        }
        setExportLoading(false);
    };


    // Filter and sort tickets
    const filteredTickets = useMemo(() => {
        let filtered = tickets || [];
        if (ticketFilters.status !== 'all') {
            filtered = filtered.filter((t) => t.status === ticketFilters.status);
        }
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (t) =>
                    t.lpuId?.toString().toLowerCase().includes(searchLower) ||
                    t.email?.toLowerCase().includes(searchLower) ||
                    t.fullName?.toLowerCase().includes(searchLower)
            );
        }
        filtered = filtered.sort((a, b) => {
            if (ticketFilters.sort === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        return filtered;
    }, [tickets, ticketFilters, searchTerm]);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Mobile Filter Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-gray-900/80 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-gray-800 p-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Filters</h3>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                                <XCircle size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Event</label>
                                <select
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                    value={selectedEventId}
                                    onChange={(e) => setSelectedEventId(e.target.value)}
                                >
                                    <option value="">Select an event</option>
                                    {events.map((event) => (
                                        <option key={event._id} value={event._id}>
                                            {event.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                                <select
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                    value={ticketFilters.sort}
                                    onChange={(e) =>
                                        setTicketFilters((prev) => ({ ...prev, sort: e.target.value }))
                                    }
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>

                            <button
                                onClick={handleExportTickets}
                                disabled={exportLoading || !selectedEventId}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                                    exportLoading || !selectedEventId
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-cyan-700/80 hover:bg-cyan-600'
                                } transition text-white mt-4`}
                            >
                                {exportLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-5 w-5" />
                                )}
                                {exportLoading ? 'Exporting...' : 'Export CSV'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <select
                            className="appearance-none w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
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
                    
                    <div className="hidden sm:flex gap-2">
                        <div className="relative">
                            <select
                                className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={ticketFilters.sort}
                                onChange={(e) =>
                                    setTicketFilters((prev) => ({ ...prev, sort: e.target.value }))
                                }
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    
                    {/* Mobile Filter Button */}
                    <button 
                        className="sm:hidden flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Filter size={16} />
                        <span>Filters</span>
                    </button>
                </div>
                
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by LPU ID, name or email"
                            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <button
                        onClick={handleExportTickets}
                        disabled={exportLoading || !selectedEventId}
                        className={
                            `hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg ${
                                exportLoading || !selectedEventId
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-cyan-700/80 hover:bg-cyan-600'
                            } transition text-white`
                        }
                        title="Export Tickets CSV"
                        type="button"
                    >
                        {exportLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="h-5 w-5" />
                        )}
                        <span className="hidden md:inline">{exportLoading ? 'Exporting' : 'Export'}</span>
                    </button>
                </div>
            </div>

            {/* Status Messages */}
            {exportSuccess && (
                <div className="bg-green-700/20 border border-green-500 text-green-300 px-4 py-2 rounded flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {exportSuccess}
                </div>
            )}
            {exportError && <ErrorMessage error={exportError} />}

            {/* Stats */}
            {selectedEventId && ticketStats && <TicketStats stats={ticketStats} />}

            {/* Error Message */}
            <ErrorMessage error={ticketsError} />

            {/* Loading State */}
            {ticketsLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : selectedEventId ? (
                filteredTickets.length === 0 ? (
                    <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
                        <Ticket className="h-12 w-12 mx-auto text-gray-500" />
                        <h3 className="text-xl font-bold text-gray-400 mt-4">No tickets found</h3>
                        <p className="text-gray-500 mt-2">
                            Try changing your filters or search term
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-750">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            <button 
                                                className="flex items-center"
                                                onClick={() => setTicketFilters(prev => ({
                                                    ...prev,
                                                    sort: prev.sort === 'newest' ? 'oldest' : 'newest'
                                                }))}
                                            >
                                                <span>LPU ID</span>
                                                <ArrowUpDown className="ml-1 h-3 w-3" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Hostel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Club
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Is Used
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {filteredTickets.map((ticket) => (
                                        <tr key={ticket._id} className="hover:bg-gray-750/50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {ticket.lpuId || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                {ticket.fullName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 truncate max-w-xs">
                                                {ticket.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {ticket.phone || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {ticket.hostel || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {ticket.club || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {ticket.isUsed
                                                    ? <span className="flex items-center text-green-400"><CheckCircle className="h-4 w-4 mr-1" />Yes</span>
                                                    : <span className="flex items-center text-gray-400"><XCircle className="h-4 w-4 mr-1" />No</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                {ticket.createdAt
                                                    ? formatDate(ticket.createdAt)
                                                    : ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => handleToggleIsUsed(ticket._id, ticket.isUsed)}
                                                    disabled={updateTicketLoading}
                                                    className={`${
                                                        ticket.isUsed
                                                            ? 'text-yellow-600 hover:text-yellow-400'
                                                            : 'text-green-700 hover:text-green-500'
                                                    } disabled:opacity-50 flex items-center gap-1`}
                                                    title={ticket.isUsed ? 'Mark as Not Used' : 'Mark as Used'}
                                                >
                                                    {ticket.isUsed ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                                    <span className="hidden lg:inline">
                                                        {ticket.isUsed ? 'Mark Not Used' : 'Mark Used'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTicket(ticket._id)}
                                                    disabled={deleteTicketLoading}
                                                    className="text-red-700 hover:text-red-500 disabled:opacity-50 flex items-center gap-1"
                                                    title="Delete Ticket"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="hidden lg:inline">Delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card List */}
                        <div className="md:hidden space-y-3">
                            {filteredTickets.map((ticket) => (
                                <div key={ticket._id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-900/20 p-1 rounded">
                                                    <Ticket className="h-4 w-4 text-blue-400" />
                                                </div>
                                                <span className="font-medium text-white">{ticket.lpuId || 'N/A'}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mt-1">{ticket.fullName}</h3>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full ${ticket.isUsed ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                            {ticket.isUsed ? 'Used' : 'Not Used'}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-300 truncate">{ticket.email || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-300">{ticket.phone || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-sm">
                                            <Home className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-300">{ticket.hostel || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-300">{ticket.club || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-300">
                                                {ticket.createdAt ? formatDate(ticket.createdAt) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-700">
                                        <button
                                            onClick={() => handleToggleIsUsed(ticket._id, ticket.isUsed)}
                                            disabled={updateTicketLoading}
                                            className={`${
                                                ticket.isUsed
                                                    ? 'text-yellow-600 hover:text-yellow-400'
                                                    : 'text-green-700 hover:text-green-500'
                                            } disabled:opacity-50 flex items-center gap-1 text-sm`}
                                        >
                                            {ticket.isUsed ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                            {ticket.isUsed ? 'Mark Not Used' : 'Mark Used'}
                                        </button>
                                        
                                        <button
                                            onClick={() => handleDeleteTicket(ticket._id)}
                                            disabled={deleteTicketLoading}
                                            className="text-red-700 hover:text-red-500 disabled:opacity-50 flex items-center gap-1 text-sm"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )
            ) : (
                <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
                    <Ticket className="h-12 w-12 mx-auto text-gray-500" />
                    <h3 className="text-xl font-bold text-gray-400 mt-4">Select an Event</h3>
                    <p className="text-gray-500 mt-2">
                        Choose an event from the dropdown to view its tickets
                    </p>
                </div>
            )}
        </div>
    );
};

export default TicketsTab;