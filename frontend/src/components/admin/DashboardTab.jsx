import { useState, useEffect } from 'react';
import { 
  Ticket, Download, Search, ChevronDown, BarChart2, Filter 
} from 'lucide-react';
import { 
  useGetTicketsByEvent, 
  useUpdateTicketStatus,
  useDeleteTicket,
  useExportTickets
} from '../../hooks/useTickets.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import StatusBadge from './StatusBadge.jsx';
import TicketStats from './TicketStats.jsx';

const TicketsTab = ({ token, events, setDashboardError }) => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [ticketFilters, setTicketFilters] = useState({
    status: 'all',
    sort: 'newest',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketStats, setTicketStats] = useState(null);

  const {
    getTicketsByEvent,
    tickets,
    loading: ticketsLoading,
    error: ticketsError,
  } = useGetTicketsByEvent();

  const {
    updateTicketStatus,
    loading: updateTicketLoading,
  } = useUpdateTicketStatus();

  const {
    deleteTicket,
    loading: deleteTicketLoading,
  } = useDeleteTicket();

  const {
    exportTickets,
    loading: exportLoading,
    error: exportError,
  } = useExportTickets();

  useEffect(() => {
    if (selectedEventId) {
      getTicketsByEvent(selectedEventId, token).catch((err) =>
        setDashboardError('Failed to load tickets')
      );
    }
  }, [selectedEventId, token]);

  useEffect(() => {
    if (tickets && tickets.length > 0) {
      // Calculate ticket statistics
      const stats = {
        total: tickets.length,
        pending: tickets.filter(t => t.status === 'pending').length,
        approved: tickets.filter(t => t.status === 'approved').length,
        rejected: tickets.filter(t => t.status === 'rejected').length,
        checkedIn: tickets.filter(t => t.status === 'checked-in').length,
      };
      setTicketStats(stats);
    } else {
      setTicketStats(null);
    }
  }, [tickets]);

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

  const handleExportTickets = async () => {
    if (!selectedEventId) return;
    try {
      await exportTickets(selectedEventId, token);
    } catch (err) {
      setDashboardError('Export failed: ' + (err.message || 'Unknown error'));
    }
  };

  // Filter and sort tickets
  const filteredTickets = tickets
    .filter(ticket => {
      // Status filter
      if (ticketFilters.status !== 'all' && ticket.status !== ticketFilters.status) {
        return false;
      }
      
      // Search filter (LPU ID or email only)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesLpuId = ticket.lpuId?.toLowerCase().includes(searchLower);
        const matchesEmail = ticket.email?.toLowerCase().includes(searchLower);
        return matchesLpuId || matchesEmail;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (ticketFilters.sort === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <select
              className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedEventId || ''}
              onChange={(e) => setSelectedEventId(e.target.value || null)}
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
                setTicketFilters(prev => ({ ...prev, status: e.target.value }))
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
                setTicketFilters(prev => ({ ...prev, sort: e.target.value }))
              }
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by LPU ID or email"
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleExportTickets}
            disabled={exportLoading || !selectedEventId}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              exportLoading || !selectedEventId
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-cyan-700/80 hover:bg-cyan-600'
            } transition text-white`}
            title="Export Tickets CSV"
          >
            <Download className="h-5 w-5" />
            {exportLoading ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {selectedEventId && ticketStats && (
        <TicketStats stats={ticketStats} />
      )}

      <ErrorMessage error={ticketsError || exportError} />

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
              Try changing your filters or search term
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    LPU ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
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
                      {ticket.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {ticket.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {ticket.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateTicketStatus(ticket._id, 'approved')}
                          disabled={updateTicketLoading}
                          className="text-green-500 hover:text-green-400 disabled:opacity-50"
                          title="Approve Ticket"
                        >
                          Approve
                        </button>
                      )}
                      {ticket.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateTicketStatus(ticket._id, 'rejected')}
                          disabled={updateTicketLoading}
                          className="text-red-500 hover:text-red-400 disabled:opacity-50"
                          title="Reject Ticket"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTicket(ticket._id)}
                        disabled={deleteTicketLoading}
                        className="text-red-700 hover:text-red-500 disabled:opacity-50"
                        title="Delete Ticket"
                      >
                        Delete
                      </button>
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
  );
};

export default TicketsTab;