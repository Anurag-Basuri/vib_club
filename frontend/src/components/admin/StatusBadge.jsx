import React from "react";

const statusColors = {
  active: "bg-green-500/20 text-green-400",
  banned: "bg-red-500/20 text-red-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-blue-500/20 text-blue-400",
  upcoming: "bg-purple-500/20 text-purple-400",
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      statusColors[status] || "bg-gray-500/20"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;