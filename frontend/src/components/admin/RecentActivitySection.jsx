import React from "react";
import { Activity, User } from "lucide-react";
import StatusBadge from "./StatusBadge";

const RecentActivitySection = ({ members }) => (
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
            <div className="font-medium text-white">{member.fullname}</div>
            <div className="text-gray-400 text-sm">
              Joined{" "}
              {member.joinedAt
                ? new Date(member.joinedAt).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
          <div className="ml-auto">
            <StatusBadge status={member.status} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentActivitySection;