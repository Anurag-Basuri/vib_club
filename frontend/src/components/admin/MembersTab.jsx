import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, UserPlus, Users, User } from 'lucide-react';
import {
    useGetAllMembers,
    useBanMember,
    useUnbanMember,
    useRemoveMember,
} from '../../hooks/useMembers.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import StatusBadge from './StatusBadge.jsx';
import Modal from './Modal.jsx';

const MembersTab = ({ token, setDashboardError }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [actionMemberId, setActionMemberId] = useState(null);
    const [banReason, setBanReason] = useState('');
    const [banReviewTime, setBanReviewTime] = useState('');
    const [removeReason, setRemoveReason] = useState('');
    const [removeReviewTime, setRemoveReviewTime] = useState('');

    const {
        getAllMembers,
        members,
        loading: membersLoading,
        error: membersError,
    } = useGetAllMembers();

    const { banMember, loading: banLoading } = useBanMember();
    const { unbanMember, loading: unbanLoading } = useUnbanMember();
    const { removeMember, loading: removeLoading } = useRemoveMember();

    // Fetch members on mount
    useEffect(() => {
        getAllMembers().catch(() => {
            setDashboardError('Failed to load members');
        });
        // eslint-disable-next-line
    }, []);

    const handleBanMember = async (id) => {
        if (!banReason) return;
        try {
            await banMember(id, banReason, banReviewTime, token);
            setBanReason('');
            setBanReviewTime('');
            setActionMemberId(null);
            await getAllMembers();
        } catch {
            setDashboardError('Ban failed');
        }
    };

    const handleUnbanMember = async (id) => {
        try {
            await unbanMember(id, token);
            setActionMemberId(null);
            await getAllMembers();
        } catch {
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
        } catch {
            setDashboardError('Remove failed');
        }
    };

    // Memoized filtered members for performance
    const filteredMembers = useMemo(
        () =>
            members.filter(
                (member) =>
                    member.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.LpuId?.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [members, searchTerm]
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <h2 className="text-xl font-bold text-white">Member Management</h2>

                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                        disabled
                        title="Coming soon"
                    >
                        <Filter className="h-5 w-5" />
                        Filters
                    </button>

                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
                        disabled
                        title="Coming soon"
                    >
                        <UserPlus className="h-5 w-5" />
                        Add Member
                    </button>
                </div>
            </div>

            <ErrorMessage error={membersError} />

            {membersLoading ? (
                <LoadingSpinner />
            ) : filteredMembers.length === 0 ? (
                <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
                    <Users className="h-12 w-12 mx-auto text-gray-500" />
                    <h3 className="text-xl font-bold text-gray-400 mt-4">No members found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-750">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    LPU ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredMembers.map((member) => (
                                <tr key={member._id} className="hover:bg-gray-750/50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">
                                                    {member.fullname}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {member.department}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {member.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {member.LpuId || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge
                                            status={
                                                member.isBanned
                                                    ? 'banned'
                                                    : member.isRemoved
                                                    ? 'removed'
                                                    : 'active'
                                            }
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {member.isAdmin
                                            ? 'Admin'
                                            : member.isLeader
                                            ? 'Leader'
                                            : 'Member'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {!member.isBanned && !member.isRemoved && (
                                            <button
                                                onClick={() =>
                                                    setActionMemberId(`${member._id}-ban`)
                                                }
                                                className="text-yellow-500 hover:text-yellow-400"
                                            >
                                                Ban
                                            </button>
                                        )}
                                        {member.isBanned && (
                                            <button
                                                onClick={() => handleUnbanMember(member._id)}
                                                disabled={unbanLoading}
                                                className="text-green-500 hover:text-green-400 disabled:opacity-50"
                                            >
                                                Unban
                                            </button>
                                        )}
                                        {!member.isRemoved && !member.isBanned && (
                                            <button
                                                onClick={() =>
                                                    setActionMemberId(`${member._id}-remove`)
                                                }
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Ban Modal */}
            {actionMemberId && actionMemberId.includes('-ban') && (
                <Modal title="Ban Member" onClose={() => setActionMemberId(null)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-1">Reason</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Enter reason"
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Review Date</label>
                            <input
                                type="datetime-local"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                value={banReviewTime}
                                onChange={(e) => setBanReviewTime(e.target.value)}
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
                                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg"
                                onClick={() => handleBanMember(actionMemberId.replace('-ban', ''))}
                                disabled={banLoading}
                            >
                                {banLoading ? 'Banning...' : 'Ban Member'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Remove Modal */}
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
        </div>
    );
};

export default MembersTab;
