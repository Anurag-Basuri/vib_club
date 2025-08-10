import React from "react";
import { Ban, Undo2, Trash2, Edit } from "lucide-react";
import StatusBadge from "./StatusBadge";

const MembersTable = ({
  members,
  filteredMembers,
  membersLoading,
  membersError,
  searchTerm,
  setSearchTerm,
  getAllMembers,
  setActionMemberId,
  handleUnbanMember,
  setEditMember,
  setEditFields,
}) => (
  <div>
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="relative w-full md:w-64">
        <input
          type="text"
          placeholder="Search members..."
          className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-lg flex items-center gap-2"
          onClick={() => getAllMembers()}
        >
          <Undo2 className="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>
    {membersError && (
      <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg p-3 mb-4">
        {membersError}
      </div>
    )}
    {membersLoading ? (
      <div className="flex justify-center py-8">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ) : (
      <div className="overflow-x-auto rounded-xl border border-gray-700 mt-4">
        <table className="min-w-full">
          <thead className="bg-gray-700/80">
            <tr>
              <th className="px-4 py-3 text-left text-gray-300 font-medium">Member</th>
              <th className="px-4 py-3 text-left text-gray-300 font-medium">LPU ID</th>
              <th className="px-4 py-3 text-left text-gray-300 font-medium">Department</th>
              <th className="px-4 py-3 text-left text-gray-300 font-medium">Status</th>
              <th className="px-4 py-3 text-left text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredMembers.map((member) => (
              <tr key={member._id} className="hover:bg-gray-800/50 transition">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{member.fullname}</div>
                  <div className="text-gray-400 text-sm">{member.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-300">{member.LpuId}</td>
                <td className="px-4 py-3 text-gray-300">
                  <div>{member.department}</div>
                  <div className="text-sm text-gray-500">{member.designation}</div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={member.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {member.status === "active" && (
                      <>
                        <button
                          className="p-2 rounded-lg bg-yellow-600/50 hover:bg-yellow-600"
                          onClick={() => setActionMemberId(member._id)}
                          title="Ban"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-600/50 hover:bg-red-600"
                          onClick={() => setActionMemberId(member._id + "-remove")}
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {member.status === "banned" && (
                      <button
                        className="p-2 rounded-lg bg-green-600/50 hover:bg-green-600"
                        onClick={() => handleUnbanMember(member._id)}
                        title="Unban"
                      >
                        <Undo2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      className="p-2 rounded-lg bg-blue-600/50 hover:bg-blue-600"
                      onClick={() => {
                        setEditMember(member._id);
                        setEditFields({
                          department: member.department,
                          designation: member.designation,
                          LpuId: member.LpuId,
                        });
                      }}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && (
          <div className="text-center py-8 text-gray-400">No members found</div>
        )}
      </div>
    )}
  </div>
);

export default MembersTable;