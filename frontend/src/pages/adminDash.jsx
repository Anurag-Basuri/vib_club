import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Users, Mail, LogOut, ShieldCheck, Ticket, CalendarDays, Info, Star } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { useGetAllMembers, useGetLeaders } from "../hooks/useMembers.js";
import { useGetAllEvents } from "../hooks/useEvents.js";
import { useGetTicketsByEvent } from "../hooks/useTickets.js";

const AdminDash = () => {
    const { user, loading: authLoading, logoutAdmin, token } = useAuth();

    // Members
    const { getAllMembers, members, total, loading: membersLoading, error: membersError } = useGetAllMembers();
    // Leaders
    const { getLeaders, leaders, loading: leadersLoading, error: leadersError } = useGetLeaders();
    // Events
    const { getAllEvents, events, loading: eventsLoading, error: eventsError } = useGetAllEvents();
    // Tickets (for selected event)
    const { getTicketsByEvent, tickets, loading: ticketsLoading, error: ticketsError } = useGetTicketsByEvent();

    const [selectedEventId, setSelectedEventId] = useState(null);

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

    // Helper: Get member by ID
    const getMemberById = (id) => members.find(m => m._id === id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex flex-col items-center py-8 px-4 sm:px-6">
            <motion.div
                className="w-full max-w-6xl bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative"
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
                {/* Members List */}
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {members.length === 0 && (
                                <div className="text-gray-400 mt-4">No members found.</div>
                            )}
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
                    <h2 className="text-lg font-bold text-white mb-4">Events</h2>
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
                                </div>
                            ))}
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