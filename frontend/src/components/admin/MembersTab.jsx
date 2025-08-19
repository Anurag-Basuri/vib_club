import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, UserPlus, Users, User, Info, Pencil } from 'lucide-react';
import {
    useGetAllMembers,
    useBanMember,
    useUnbanMember,
    useRemoveMember,
    useUpdateMemberByAdmin
} from '../../hooks/useMembers.js';
import { memberRegister } from '../../services/authServices.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import StatusBadge from './StatusBadge.jsx';
import Modal from './Modal.jsx';

const statusString = (member) => {
    if (member.isBanned) return 'Banned';
    if (member.isRemoved) return 'Removed';
    return 'Active';
};

const MembersTab = ({ token, setDashboardError }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [actionMemberId, setActionMemberId] = useState(null);
    const [banReason, setBanReason] = useState('');
    const [banReviewTime, setBanReviewTime] = useState('');
    const [removeReason, setRemoveReason] = useState('');
    const [removeReviewTime, setRemoveReviewTime] = useState('');

    // For update modal
    const [editData, setEditData] = useState({ department: '', designation: '', LpuId: '' });
    const [editError, setEditError] = useState('');

    // For register modal
    const [showRegister, setShowRegister] = useState(false);
    const [registerData, setRegisterData] = useState({
        fullname: '',
        LpuId: '',
        email: '',
        password: '',
        department: '',
        program: ''
    });
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');

    const {
        getAllMembers,
        members,
        loading: membersLoading,
        error: membersError,
    } = useGetAllMembers();

    const { banMember, loading: banLoading, error: banError, reset: resetBan } = useBanMember();
    const { unbanMember, loading: unbanLoading } = useUnbanMember();
    const { removeMember, loading: removeLoading, error: removeError, reset: resetRemove } = useRemoveMember();
    const { updateMemberByAdmin, loading: updateLoading, error: updateError, reset: resetUpdate } = useUpdateMemberByAdmin();

    // Fetch members on mount
    useEffect(() => {
        getAllMembers().catch(() => {
            setDashboardError('Failed to load members');
        });
        // eslint-disable-next-line
    }, []);

    // Reset modal state on close
    const closeModal = () => {
        setActionMemberId(null);
        setBanReason('');
        setBanReviewTime('');
        setRemoveReason('');
        setRemoveReviewTime('');
        setEditData({ department: '', designation: '', LpuId: '' });
        setEditError('');
        resetBan();
        resetRemove();
        resetUpdate();
    };

    // Reset register modal
    const closeRegisterModal = () => {
        setShowRegister(false);
        setRegisterData({
            fullname: '',
            LpuId: '',
            email: '',
            password: '',
            department: '',
            program: ''
        });
        setRegisterError('');
        setRegisterSuccess('');
        setRegisterLoading(false);
    };

    const handleBanMember = async (id) => {
        if (!banReason) return;
        try {
            await banMember(id, banReason, banReviewTime, token);
            closeModal();
            await getAllMembers();
        } catch {
            // error handled by banError
        }
    };

    const handleUnbanMember = async (id) => {
        try {
            await unbanMember(id, token);
            closeModal();
            await getAllMembers();
        } catch {
            setDashboardError('Unban failed');
        }
    };

    const handleRemoveMember = async (id) => {
        if (!removeReason) return;
        try {
            await removeMember(id, removeReason, removeReviewTime, token);
            closeModal();
            await getAllMembers();
        } catch {
            // error handled by removeError
        }
    };

    // Handle update by admin
    const handleEditMember = async () => {
        setEditError('');
        try {
            await updateMemberByAdmin(
                actionMemberId.replace('-edit', ''),
                editData,
                token
            );
            closeModal();
            await getAllMembers();
        } catch (err) {
            setEditError(updateError || 'Failed to update member');
        }
    };

    // Handle register new member
    const handleRegisterMember = async (e) => {
        e.preventDefault();
        setRegisterError('');
        setRegisterSuccess('');
        setRegisterLoading(true);
        try {
            await memberRegister(registerData);
            setRegisterSuccess('Member registered successfully!');
            setTimeout(() => {
                closeRegisterModal();
                getAllMembers();
            }, 1000);
        } catch (err) {
            setRegisterError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Registration failed'
            );
        } finally {
            setRegisterLoading(false);
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
                            aria-label="Search members"
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
                        onClick={() => setShowRegister(true)}
                        title="Register new member"
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">LPU ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Program</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Restriction</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
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
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.LpuId || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.department || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.program || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <StatusBadge
                                                status={
                                                    member.isBanned
                                                        ? 'banned'
                                                        : member.isRemoved
                                                        ? 'removed'
                                                        : 'active'
                                                }
                                            />
                                            <span className="text-xs text-gray-400">{statusString(member)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {member.isAdmin
                                            ? 'Admin'
                                            : member.isLeader
                                            ? 'Leader'
                                            : 'Member'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                        {(member.isBanned || member.isRemoved) && member.restriction ? (
                                            <div className="flex flex-col gap-1">
                                                <span>
                                                    <b>Reason:</b> {member.restriction.reason || '-'}
                                                </span>
                                                {member.restriction.time && (
                                                    <span>
                                                        <b>Review:</b>{' '}
                                                        {new Date(member.restriction.time).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            className="text-blue-400 hover:text-blue-300"
                                            title="View Details (coming soon)"
                                            disabled
                                        >
                                            <Info className="inline h-4 w-4" />
                                        </button>
                                        <button
                                            className="text-gray-400 hover:text-gray-200"
                                            title="Edit member"
                                            onClick={() => {
                                                setActionMemberId(`${member._id}-edit`);
                                                setEditData({
                                                    department: member.department || '',
                                                    designation: member.designation || '',
                                                    LpuId: member.LpuId || ''
                                                });
                                            }}
                                        >
                                            <Pencil className="inline h-4 w-4" />
                                        </button>
                                        {!member.isBanned && !member.isRemoved && (
                                            <button
                                                onClick={() => setActionMemberId(`${member._id}-ban`)}
                                                className="text-yellow-500 hover:text-yellow-400"
                                                title="Ban member"
                                            >
                                                Ban
                                            </button>
                                        )}
                                        {member.isBanned && (
                                            <button
                                                onClick={() => handleUnbanMember(member._id)}
                                                disabled={unbanLoading}
                                                className="text-green-500 hover:text-green-400 disabled:opacity-50"
                                                title="Unban member"
                                            >
                                                Unban
                                            </button>
                                        )}
                                        {!member.isRemoved && !member.isBanned && (
                                            <button
                                                onClick={() => setActionMemberId(`${member._id}-remove`)}
                                                className="text-red-500 hover:text-red-400"
                                                title="Remove member"
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
                <Modal title="Ban Member" onClose={closeModal}>
                    <div className="space-y-4">
                        {banError && <ErrorMessage error={banError} />}
                        <div>
                            <label className="block text-gray-300 mb-1">
                                Reason <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Enter reason"
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                required
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
                                onClick={closeModal}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg"
                                onClick={() => handleBanMember(actionMemberId.replace('-ban', ''))}
                                disabled={banLoading || !banReason}
                                type="button"
                            >
                                {banLoading ? 'Banning...' : 'Ban Member'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Remove Modal */}
            {actionMemberId && actionMemberId.includes('-remove') && (
                <Modal title="Remove Member" onClose={closeModal}>
                    <div className="space-y-4">
                        {removeError && <ErrorMessage error={removeError} />}
                        <div>
                            <label className="block text-gray-300 mb-1">
                                Reason <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter reason"
                                value={removeReason}
                                onChange={(e) => setRemoveReason(e.target.value)}
                                required
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
                                onClick={closeModal}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
                                onClick={() => handleRemoveMember(actionMemberId.replace('-remove', ''))}
                                disabled={removeLoading || !removeReason}
                                type="button"
                            >
                                {removeLoading ? 'Removing...' : 'Remove Member'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Edit Member Modal */}
            {actionMemberId && actionMemberId.includes('-edit') && (
                <Modal title="Update Member" onClose={closeModal}>
                    <div className="space-y-4">
                        {editError && <ErrorMessage error={editError} />}
                        <div>
                            <label className="block text-gray-300 mb-1">Department</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                value={editData.department}
                                onChange={e => setEditData({ ...editData, department: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Designation</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                value={editData.designation}
                                onChange={e => setEditData({ ...editData, designation: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">LPU ID</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                value={editData.LpuId}
                                onChange={e => setEditData({ ...editData, LpuId: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                                onClick={closeModal}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                                onClick={handleEditMember}
                                disabled={updateLoading}
                                type="button"
                            >
                                {updateLoading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Register Member Modal */}
            {showRegister && (
                <Modal title="Register New Member" onClose={closeRegisterModal}>
                    <form className="space-y-4" onSubmit={handleRegisterMember}>
                        {registerError && <ErrorMessage error={registerError} />}
                        {registerSuccess && (
                            <div className="text-green-400 text-sm">{registerSuccess}</div>
                        )}
                        <div>
                            <label className="block text-gray-300 mb-1">Full Name <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                value={registerData.fullname}
                                onChange={e => setRegisterData({ ...registerData, fullname: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">LPU ID <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                value={registerData.LpuId}
                                onChange={e => setRegisterData({ ...registerData, LpuId: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                value={registerData.email}
                                onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Password <span className="text-red-400">*</span></label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                value={registerData.password}
                                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Department <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                value={registerData.department}
                                onChange={e => setRegisterData({ ...registerData, department: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Program</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                value={registerData.program}
                                onChange={e => setRegisterData({ ...registerData, program: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                                onClick={closeRegisterModal}
                                type="button"
                                disabled={registerLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                                type="submit"
                                disabled={registerLoading}
                            >
                                {registerLoading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default MembersTab;
