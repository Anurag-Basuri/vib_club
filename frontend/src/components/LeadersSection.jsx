import React from "react";
import { Star, User } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import StatusBadge from "./StatusBadge";

const LeadersSection = ({ leaders, leadersLoading }) => (
  <div className="mt-10">
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <Star className="h-5 w-5 text-yellow-400" />
      Leadership Team
    </h2>
    {leadersLoading ? (
      <LoadingSpinner />
    ) : leaders.length === 0 ? (
      <div className="text-gray-400 text-center py-8">No leaders found</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaders.map((leader) => (
          <div
            key={leader._id}
            className="bg-gray-700/50 rounded-xl p-5 border border-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-white">{leader.fullname}</div>
                <div className="text-gray-300">{leader.designation}</div>
                <div className="text-gray-400 text-sm">{leader.department}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600 text-sm">
              <div className="text-gray-400">{leader.email}</div>
              <div className="text-gray-500">
                Joined:{" "}
                {leader.joinedAt
                  ? new Date(leader.joinedAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default LeadersSection;