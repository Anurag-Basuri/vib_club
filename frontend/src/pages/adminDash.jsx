import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Users, Mail, LogOut, ShieldCheck, Ticket, CalendarDays, Info, Star, Ban, Undo2, Trash2, Edit, Plus, X, Save } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import {
    useGetAllMembers,
    useGetLeaders,
    useBanMember,
    useRemoveMember,
    useUnbanMember,
    useUpdateMemberByAdmin
} from "../hooks/useMembers.js";
import {
    useGetAllEvents,
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent
} from "../hooks/useEvents.js";
import { useGetTicketsByEvent } from "../hooks/useTickets.js";

const AdminDash = () => {
    const { user, loading: authLoading, logoutAdmin, token } = useAuth();

    // Members
    const { getAllMembers, members, total, loading: membersLoading, error: membersError, reset: resetMembers } = useGetAllMembers();
    const { getLeaders, leaders, loading: leadersLoading, error: leadersError, reset: resetLeaders } = useGetLeaders();
    const { banMember, loading: banLoading, error: banError, reset: resetBan } = useBanMember();
    const { unbanMember, loading: unbanLoading, error: unbanError, reset: resetUnban } = useUnbanMember();
    const { removeMember, loading: removeLoading, error: removeError, reset: resetRemove } = useRemoveMember();
    const { updateMemberByAdmin, loading: updateLoading, error: updateError, reset: resetUpdate } = useUpdateMemberByAdmin();

    // Events
    const { getAllEvents, events, loading: eventsLoading, error: eventsError, reset: resetEvents } = useGetAllEvents();
    const { createEvent, event: createdEvent, loading: createLoading, error: createError, reset: resetCreate } = useCreateEvent();
    const { updateEvent, event: updatedEvent, loading: updateEventLoading, error: updateEventError, reset: resetUpdateEvent } = useUpdateEvent();
    const { deleteEvent, loading: deleteLoading, error: deleteError, reset: resetDelete } = useDeleteEvent();

    // Tickets
    const { getTicketsByEvent, tickets, loading: ticketsLoading, error: ticketsError, reset: resetTickets } = useGetTicketsByEvent();

    // UI State
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [actionMemberId, setActionMemberId] = useState(null);
    const [banReason, setBanReason] = useState("");
    const [banReviewTime, setBanReviewTime] = useState("");
    const [removeReason, setRemoveReason] = useState("");
    const [removeReviewTime, setRemoveReviewTime] = useState("");
    const [editMember, setEditMember] = useState(null);
    const [editFields, setEditFields] = useState({ department: "", designation: "", LpuId: "" });

    // Event modals
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [showEditEvent, setShowEditEvent] = useState(false);
    const [eventFields, setEventFields] = useState({ title: "", date: "", location: "", description: "", status: "" });
    const [editEventId, setEditEventId] = useState(null);

    useEffect(() => {
        getAllMembers();
        getLeaders();
        getAllEvents();
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            getTicketsByEvent(selectedEventId, token);
        }
    }, [selectedEventId, token]);

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            window.location.href = '/admin/auth';
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Member actions
    const handleBanMember = async (id) => {
        if (!banReason) return;
        await banMember(id, banReason, banReviewTime, token);
        setBanReason("");
        setBanReviewTime("");
        setActionMemberId(null);
        getAllMembers();
    };

    const handleUnbanMember = async (id) => {
        await unbanMember(id, token);
        setActionMemberId(null);
        getAllMembers();
    };

    const handleRemoveMember = async (id) => {
        if (!removeReason) return;
        await removeMember(id, removeReason, removeReviewTime, token);
        setRemoveReason("");
        setRemoveReviewTime("");
        setActionMemberId(null);
        getAllMembers();
    };

    const handleEditMember = async (id) => {
        await updateMemberByAdmin(id, editFields, token);
        setEditMember(null);
        setEditFields({ department: "", designation: "", LpuId: "" });
        getAllMembers();
    };

    // Event actions
    const handleCreateEvent = async () => {
        await createEvent(eventFields);
        setShowCreateEvent(false);
        setEventFields({ title: "", date: "", location: "", description: "", status: "" });
        getAllEvents();
    };

    const handleEditEvent = async () => {
        await updateEvent(editEventId, eventFields);
        setShowEditEvent(false);
        setEditEventId(null);
        setEventFields({ title: "", date: "", location: "", description: "", status: "" });
        getAllEvents();
    };

    const handleDeleteEvent = async (id) => {
        await deleteEvent(id);
        getAllEvents();
        if (selectedEventId === id) setSelectedEventId(null);
    };

    // Fill event fields for edit
    const openEditEvent = (event) => {
        setEditEventId(event._id);
        setEventFields({
            title: event.title || "",
            date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
            location: event.location || "",
            description: event.description || "",
            status: event.status || ""
        });
        setShowEditEvent(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex flex-col items-center py-8 px-4 sm:px-6">
            <motion.div
                className="w-full max-w-7xl bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="h-8 w-8 text-blue-400" />
                        <span className="text-xl font-bold text-white">Admin Dashboard</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700/80 text-white hover:bg-red-800 transition"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
                {/* Stats & User Info */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Info */}
                    <motion.div
                        className="bg-white/10 rounded-xl p-6 flex flex-col gap-2 shadow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <User className="h-6 w-6 text-blue-300" />
                            <span className="font-semibold text-white text-lg">Welcome, {user?.fullname || "Admin"}</span>
                        </div>
                        <div className="text-gray-300 text-sm">
                            <div><span className="font-medium">Email:</span> {user?.email}</div>
                            <div><span className="font-medium">Role:</span> {user?.designation || "Admin"}</div>
                            <div><span className="font-medium">Department:</span> {user?.department || "N/A"}</div>
                            <div><span className="font-medium">Joined:</span> {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "N/A"}</div>
                        </div>
                    </motion.div>
                    {/* Stats */}
                    <motion.div
                        className="bg-white/10 rounded-xl p-6 flex flex-col gap-4 shadow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3">
                            <Users className="h-6 w-6 text-green-300" />
                            <span className="font-semibold text-white text-lg">Total Members</span>
                            <span className="ml-auto text-2xl font-bold text-green-400">{membersLoading ? "..." : total}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-yellow-300" />
                            <span className="font-semibold text-white text-lg">Leaders</span>
                            <span className="ml-auto text-2xl font-bold text-yellow-400">{leadersLoading ? "..." : leaders.length}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Ticket className="h-6 w-6 text-purple-300" />
                            <span className="font-semibold text-white text-lg">Events</span>
                            <span className="ml-auto text-2xl font-bold text-purple-400">{eventsLoading ? "..." : events.length}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarDays className="h-6 w-6 text-cyan-300" />
                            <span className="font-semibold text-white text-lg">Tickets</span>
                            <span className="ml-auto text-2xl font-bold text-cyan-400">
                                {selectedEventId ? (ticketsLoading ? "..." : tickets.length) : "-"}
                            </span>
                        </div>
                    </motion.div>
                </div>
                {/* Members List with Actions */}
                <div className="p-6">
                    <h2 className="text-lg font-bold text-white mb-4">All Members</h2>
                    {membersLoading ? (
                        <div className="text-gray-400">Loading members...</div>
                    ) : membersError ? (
                        <div className="text-red-400">{membersError}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white/10 rounded-lg">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-white">Name</th>
                                        <th className="px-4 py-2 text-left text-white">LPU ID</th>
                                        <th className="px-4 py-2 text-left text-white">Email</th>
                                        <th className="px-4 py-2 text-left text-white">Department</th>
                                        <th className="px-4 py-2 text-left text-white">Designation</th>
                                        <th className="px-4 py-2 text-left text-white">Status</th>
                                        <th className="px-4 py-2 text-left text-white">Joined</th>
                                        <th className="px-4 py-2 text-left text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map(member => (
                                        <tr key={member._id} className="border-b border-white/10">
                                            <td className="px-4 py-2 text-gray-200">{member.fullname}</td>
                                            <td className="px-4 py-2 text-gray-200">{member.LpuId}</td>
                                            <td className="px-4 py-2 text-gray-200">{member.email}</td>
                                            <td className="px-4 py-2 text-gray-200">{member.department}</td>
                                            <td className="px-4 py-2 text-gray-200">{member.designation}</td>
                                            <td className="px-4 py-2 text-gray-200">{member.status}</td>
                                            <td className="px-4 py-2 text-gray-200">{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : ""}</td>
                                            <td className="px-4 py-2 flex gap-2">
                                                {member.status === "active" && (
                                                    <>
                                                        <button
                                                            className="px-2 py-1 bg-yellow-700 text-white rounded flex items-center gap-1"
                                                            onClick={() => setActionMemberId(member._id)}
                                                            title="Ban"
                                                        >
                                                            <Ban className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 bg-red-700 text-white rounded flex items-center gap-1"
                                                            onClick={() => setActionMemberId(member._id + "-remove")}
                                                            title="Remove"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 bg-blue-700 text-white rounded flex items-center gap-1"
                                                            onClick={() => { setEditMember(member._id); setEditFields({ department: member.department, designation: member.designation, LpuId: member.LpuId }); }}
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {member.status === "banned" && (
                                                    <button
                                                        className="px-2 py-1 bg-green-700 text-white rounded flex items-center gap-1"
                                                        onClick={() => handleUnbanMember(member._id)}
                                                        title="Unban"
                                                    >
                                                        <Undo2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {members.length === 0 && (
                                <div className="text-gray-400 mt-4">No members found.</div>
                            )}
                        </div>
                    )}
                    {/* Ban Modal */}
                    {actionMemberId && !actionMemberId.includes("-remove") && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2">Ban Member</h3>
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Reason"
                                    value={banReason}
                                    onChange={e => setBanReason(e.target.value)}
                                />
                                <input
                                    type="datetime-local"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Review Time"
                                    value={banReviewTime}
                                    onChange={e => setBanReviewTime(e.target.value)}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="px-4 py-2 bg-yellow-700 text-white rounded"
                                        onClick={() => handleBanMember(actionMemberId)}
                                        disabled={banLoading}
                                    >
                                        {banLoading ? "Banning..." : "Ban"}
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-black rounded"
                                        onClick={() => { setActionMemberId(null); setBanReason(""); setBanReviewTime(""); resetBan(); }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {banError && <div className="text-red-500 mt-2">{banError}</div>}
                            </div>
                        </div>
                    )}
                    {/* Remove Modal */}
                    {actionMemberId && actionMemberId.includes("-remove") && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2">Remove Member</h3>
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Reason"
                                    value={removeReason}
                                    onChange={e => setRemoveReason(e.target.value)}
                                />
                                <input
                                    type="datetime-local"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Review Time"
                                    value={removeReviewTime}
                                    onChange={e => setRemoveReviewTime(e.target.value)}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="px-4 py-2 bg-red-700 text-white rounded"
                                        onClick={() => handleRemoveMember(actionMemberId.replace("-remove", ""))}
                                        disabled={removeLoading}
                                    >
                                        {removeLoading ? "Removing..." : "Remove"}
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-black rounded"
                                        onClick={() => { setActionMemberId(null); setRemoveReason(""); setRemoveReviewTime(""); resetRemove(); }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {removeError && <div className="text-red-500 mt-2">{removeError}</div>}
                            </div>
                        </div>
                    )}
                    {/* Edit Modal */}
                    {editMember && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2">Edit Member</h3>
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Department"
                                    value={editFields.department}
                                    onChange={e => setEditFields({ ...editFields, department: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Designation"
                                    value={editFields.designation}
                                    onChange={e => setEditFields({ ...editFields, designation: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="LPU ID"
                                    value={editFields.LpuId}
                                    onChange={e => setEditFields({ ...editFields, LpuId: e.target.value })}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="px-4 py-2 bg-blue-700 text-white rounded"
                                        onClick={() => handleEditMember(editMember)}
                                        disabled={updateLoading}
                                    >
                                        {updateLoading ? "Updating..." : "Update"}
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-black rounded"
                                        onClick={() => { setEditMember(null); setEditFields({ department: "", designation: "", LpuId: "" }); resetUpdate(); }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {updateError && <div className="text-red-500 mt-2">{updateError}</div>}
                            </div>
                        </div>
                    )}
                </div>
                {/* Leaders List */}
                <div className="p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Leaders</h2>
                    {leadersLoading ? (
                        <div className="text-gray-400">Loading leaders...</div>
                    ) : leadersError ? (
                        <div className="text-red-400">{leadersError}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white/10 rounded-lg">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-white">Name</th>
                                        <th className="px-4 py-2 text-left text-white">Designation</th>
                                        <th className="px-4 py-2 text-left text-white">Department</th>
                                        <th className="px-4 py-2 text-left text-white">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaders.map(leader => (
                                        <tr key={leader._id} className="border-b border-white/10">
                                            <td className="px-4 py-2 text-gray-200">{leader.fullname}</td>
                                            <td className="px-4 py-2 text-gray-200">{leader.designation}</td>
                                            <td className="px-4 py-2 text-gray-200">{leader.department}</td>
                                            <td className="px-4 py-2 text-gray-200">{leader.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {leaders.length === 0 && (
                                <div className="text-gray-400 mt-4">No leaders found.</div>
                            )}
                        </div>
                    )}
                </div>
                {/* Events and Tickets */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-white">Events</h2>
                        <button
                            className="flex items-center gap-2 px-3 py-1 rounded bg-blue-700 text-white hover:bg-blue-800"
                            onClick={() => setShowCreateEvent(true)}
                        >
                            <Plus className="h-4 w-4" /> Add Event
                        </button>
                    </div>
                    {eventsLoading ? (
                        <div className="text-gray-400">Loading events...</div>
                    ) : eventsError ? (
                        <div className="text-red-400">{eventsError}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map(event => (
                                <div
                                    key={event._id}
                                    className={`bg-white/10 rounded-lg p-4 cursor-pointer border transition ${
                                        selectedEventId === event._id ? "border-blue-400" : "border-transparent"
                                    }`}
                                    onClick={() => setSelectedEventId(event._id)}
                                >
                                    <div className="font-semibold text-white">{event.title}</div>
                                    <div className="text-gray-300 text-sm">{event.date ? new Date(event.date).toLocaleDateString() : ""}</div>
                                    <div className="text-gray-400 text-xs">{event.status}</div>
                                    <div className="text-gray-400 text-xs">{event.location || "No location"}</div>
                                    <div className="text-gray-400 text-xs">{event.description || ""}</div>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="px-2 py-1 bg-blue-700 text-white rounded flex items-center gap-1"
                                            onClick={e => { e.stopPropagation(); openEditEvent(event); }}
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="px-2 py-1 bg-red-700 text-white rounded flex items-center gap-1"
                                            onClick={e => { e.stopPropagation(); handleDeleteEvent(event._id); }}
                                            title="Delete"
                                            disabled={deleteLoading}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Create Event Modal */}
                    {showCreateEvent && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2">Create Event</h3>
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Title"
                                    value={eventFields.title}
                                    onChange={e => setEventFields({ ...eventFields, title: e.target.value })}
                                />
                                <input
                                    type="datetime-local"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Date"
                                    value={eventFields.date}
                                    onChange={e => setEventFields({ ...eventFields, date: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Location"
                                    value={eventFields.location}
                                    onChange={e => setEventFields({ ...eventFields, location: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Description"
                                    value={eventFields.description}
                                    onChange={e => setEventFields({ ...eventFields, description: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Status"
                                    value={eventFields.status}
                                    onChange={e => setEventFields({ ...eventFields, status: e.target.value })}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="px-4 py-2 bg-blue-700 text-white rounded"
                                        onClick={handleCreateEvent}
                                        disabled={createLoading}
                                    >
                                        {createLoading ? "Creating..." : "Create"}
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-black rounded"
                                        onClick={() => { setShowCreateEvent(false); setEventFields({ title: "", date: "", location: "", description: "", status: "" }); resetCreate(); }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {createError && <div className="text-red-500 mt-2">{createError}</div>}
                            </div>
                        </div>
                    )}
                    {/* Edit Event Modal */}
                    {showEditEvent && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2">Edit Event</h3>
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Title"
                                    value={eventFields.title}
                                    onChange={e => setEventFields({ ...eventFields, title: e.target.value })}
                                />
                                <input
                                    type="datetime-local"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Date"
                                    value={eventFields.date}
                                    onChange={e => setEventFields({ ...eventFields, date: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Location"
                                    value={eventFields.location}
                                    onChange={e => setEventFields({ ...eventFields, location: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Description"
                                    value={eventFields.description}
                                    onChange={e => setEventFields({ ...eventFields, description: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="Status"
                                    value={eventFields.status}
                                    onChange={e => setEventFields({ ...eventFields, status: e.target.value })}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="px-4 py-2 bg-blue-700 text-white rounded"
                                        onClick={handleEditEvent}
                                        disabled={updateEventLoading}
                                    >
                                        {updateEventLoading ? "Updating..." : "Update"}
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-black rounded"
                                        onClick={() => { setShowEditEvent(false); setEditEventId(null); setEventFields({ title: "", date: "", location: "", description: "", status: "" }); resetUpdateEvent(); }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {updateEventError && <div className="text-red-500 mt-2">{updateEventError}</div>}
                            </div>
                        </div>
                    )}
                </div>
                {/* Tickets for selected event */}
                {selectedEventId && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Tickets for Selected Event</h2>
                        {ticketsLoading ? (
                            <div className="text-gray-400">Loading tickets...</div>
                        ) : ticketsError ? (
                            <div className="text-red-400">{ticketsError}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white/10 rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-white">Ticket ID</th>
                                            <th className="px-4 py-2 text-left text-white">Member</th>
                                            <th className="px-4 py-2 text-left text-white">Status</th>
                                            <th className="px-4 py-2 text-left text-white">Created</th>
                                            <th className="px-4 py-2 text-left text-white">Info</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map(ticket => (
                                            <tr key={ticket._id} className="border-b border-white/10">
                                                <td className="px-4 py-2 text-gray-200">{ticket._id}</td>
                                                <td className="px-4 py-2 text-gray-200">{ticket.member?.fullname || "N/A"}</td>
                                                <td className="px-4 py-2 text-gray-200">{ticket.status}</td>
                                                <td className="px-4 py-2 text-gray-200">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ""}</td>
                                                <td className="px-4 py-2 text-gray-200">
                                                    <Info className="inline h-4 w-4 text-blue-400" title={ticket.description || "No info"} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {tickets.length === 0 && (
                                    <div className="text-gray-400 mt-4">No tickets for this event.</div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminDash;