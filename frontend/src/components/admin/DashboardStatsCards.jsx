import React from "react";
import { Users, ShieldCheck, CalendarDays, Ticket } from "lucide-react";

const DashboardStatsCards = ({
  membersLoading,
  total,
  leadersLoading,
  leaders,
  eventsLoading,
  events,
  ticketsLoading,
  tickets,
  selectedEventId,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-6 w-6 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Total Members</h3>
      </div>
      <div className="text-3xl font-bold text-green-400">
        {membersLoading ? "..." : total}
      </div>
    </div>
    <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="h-6 w-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Leaders</h3>
      </div>
      <div className="text-3xl font-bold text-yellow-400">
        {leadersLoading ? "..." : leaders.length}
      </div>
    </div>
    <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
      <div className="flex items-center gap-3 mb-4">
        <CalendarDays className="h-6 w-6 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Events</h3>
      </div>
      <div className="text-3xl font-bold text-purple-400">
        {eventsLoading ? "..." : events.length}
      </div>
    </div>
    <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
      <div className="flex items-center gap-3 mb-4">
        <Ticket className="h-6 w-6 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Tickets</h3>
      </div>
      <div className="text-3xl font-bold text-cyan-400">
        {selectedEventId ? (ticketsLoading ? "..." : tickets.length) : "0"}
      </div>
    </div>
  </div>
);

export default DashboardStatsCards;