import React from "react";

const TicketStatusDistribution = ({ ticketStatusCount, tickets }) => (
  <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-white">Ticket Status Distribution</h3>
      <div className="text-cyan-400">{tickets.length} tickets</div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Object.entries(ticketStatusCount).map(([status, count]) => (
        <div key={status} className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-white font-medium capitalize">{status}</div>
          <div className="text-2xl font-bold mt-1 text-cyan-400">{count}</div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-cyan-500"
              style={{
                width: `${(count / tickets.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TicketStatusDistribution;