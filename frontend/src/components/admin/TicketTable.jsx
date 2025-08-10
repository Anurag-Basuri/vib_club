import React from "react";
import { BadgeCheck, Ban, Trash2, Ticket } from "lucide-react";
import StatusBadge from "./StatusBadge";

const TicketTable = ({
  filteredTickets,
  ticketsLoading,
  selectedEventId,
  handleUpdateTicketStatus,
  handleDeleteTicket,
}) => {
  if (ticketsLoading)
    return (
      <div className="flex justify-center py-8">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!selectedEventId)
    return (
      <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
        <Ticket className="h-12 w-12 mx-auto text-gray-500" />
        <h3 className="text-xl font-bold text-gray-400 mt-4">Select an Event</h3>
        <p className="text-gray-500 mt-2">
          Choose an event from the dropdown to view its tickets
        </p>
      </div>
    );
  if (filteredTickets.length === 0)
    return (
      <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
        <Ticket className="h-12 w-12 mx-auto text-gray-500" />
        <h3 className="text-xl font-bold text-gray-400 mt-4">No tickets found</h3>
        <p className="text-gray-500 mt-2">
          Try changing your filters or select a different event
        </p>
      </div>
    );
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700">
      <table className="min-w-full">
        <thead className="bg-gray-700/80">
          <tr>
            <th className="px-4 py-3 text-left text-gray-300 font-medium">Ticket ID</th>
            <th className="px-4 py-3 text-left text-gray-300 font-medium">Member</th>
            <th className="px-4 py-3 text-left text-gray-300 font-medium">Status</th>
            <th className="px-4 py-3 text-left text-gray-300 font-medium">Created</th>
            <th className="px-4 py-3 text-left text-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {filteredTickets.map((ticket) => (
            <tr key={ticket._id} className="hover:bg-gray-800/50 transition">
              <td className="px-4 py-3 text-gray-300 font-mono text-sm">
                {ticket._id.slice(-8)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-white">
                  {ticket.member?.fullname || "N/A"}
                </div>
                <div className="text-gray-400 text-sm">
                  {ticket.member?.email || "N/A"}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3 text-gray-400 text-sm">
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleDateString()
                  : ""}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {ticket.status !== "approved" && (
                    <button
                      className="p-2 rounded-lg bg-green-600/50 hover:bg-green-600"
                      onClick={() =>
                        handleUpdateTicketStatus(ticket._id, "approved")
                      }
                      title="Approve"
                    >
                      <BadgeCheck className="h-4 w-4" />
                    </button>
                  )}
                  {ticket.status !== "rejected" && (
                    <button
                      className="p-2 rounded-lg bg-red-600/50 hover:bg-red-600"
                      onClick={() =>
                        handleUpdateTicketStatus(ticket._id, "rejected")
                      }
                      title="Reject"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                    onClick={() => handleDeleteTicket(ticket._id)}
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
  );
};

export default TicketTable;