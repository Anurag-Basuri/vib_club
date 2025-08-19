import { useState } from 'react';
import {
    User,
    Mail,
    Smartphone,
    GraduationCap,
    Ticket,
    X,
    QrCode,
    Calendar,
    AtSign,
    Building2,
    BadgeCheck,
    MapPin,
} from 'lucide-react';
import { useCreateTicket } from '../../hooks/useTickets.js';
import ErrorMessage from './ErrorMessage.jsx';
import StatusBadge from './StatusBadge.jsx';

const CreateTicket = ({ token, events, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        lpuId: '',
        gender: '',
        hosteler: false,
        hostel: '',
        course: '',
        club: '',
        eventId: events?.[0]?._id || '',
        eventName: events?.[0]?.title || '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [ticketDetails, setTicketDetails] = useState(null);

    const { createTicket, loading } = useCreateTicket();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'eventId'
                ? {
                      eventName:
                          events.find((ev) => ev._id === value)?.title || '',
                  }
                : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.fullName || !formData.email || !formData.eventId) {
            setError('Please fill in all required fields');
            return;
        }

        const payload = {
            ...formData,
            hosteler: formData.hosteler === 'true' || formData.hosteler === true,
            gender:
                formData.gender.charAt(0).toUpperCase() +
                formData.gender.slice(1).toLowerCase(),
        };

        try {
            const ticket = await createTicket(payload, token);
            setSuccess(true);
            setTicketDetails(ticket);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                lpuId: '',
                gender: '',
                hosteler: false,
                hostel: '',
                course: '',
                club: '',
                eventId: events?.[0]?._id || '',
                eventName: events?.[0]?.title || '',
            });
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    'Failed to create ticket'
            );
        }
    };

    // Helper to get event details for ticket summary
    const getEventDetails = (eventId) => {
        return events.find((ev) => ev._id === eventId) || {};
    };

    return (
        <div className="bg-gray-800 rounded-xl max-w-2xl w-full mx-auto relative">
            <div className="p-4 md:p-6 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {success && ticketDetails ? (
                    <div className="text-center py-8 space-y-4">
                        <div className="mx-auto bg-green-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-2">
                            <Ticket className="h-8 w-8 text-green-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                            Ticket Created Successfully!
                        </h4>
                        <div className="flex flex-col items-center gap-4 mt-6">
                            {ticketDetails.qrCode?.url ? (
                                <img
                                    src={ticketDetails.qrCode.url}
                                    alt="QR Code"
                                    className="w-40 h-40 mx-auto rounded-lg border border-gray-700 bg-white"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center w-40 h-40 mx-auto rounded-lg border border-gray-700 bg-gray-900">
                                    <QrCode className="h-16 w-16 text-gray-400" />
                                    <span className="text-xs text-gray-500 mt-2">
                                        QR not available
                                    </span>
                                </div>
                            )}
                            <div className="w-full max-w-xs mx-auto text-left space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <BadgeCheck className="h-4 w-4" /> Ticket ID:
                                    </span>
                                    <span className="text-white font-mono">
                                        {ticketDetails.ticketId || ticketDetails._id}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <User className="h-4 w-4" /> Name:
                                    </span>
                                    <span className="text-white">
                                        {ticketDetails.fullName}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <AtSign className="h-4 w-4" /> Email:
                                    </span>
                                    <span className="text-white">
                                        {ticketDetails.email}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <Smartphone className="h-4 w-4" /> Phone:
                                    </span>
                                    <span className="text-white">
                                        {ticketDetails.phone || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <Building2 className="h-4 w-4" /> LPU ID:
                                    </span>
                                    <span className="text-white">
                                        {ticketDetails.lpuId || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <GraduationCap className="h-4 w-4" /> Course:
                                    </span>
                                    <span className="text-white">
                                        {ticketDetails.course || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <User className="h-4 w-4" /> Gender:
                                    </span>
                                    <span className="text-white">
                                        {ticketDetails.gender || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <Building2 className="h-4 w-4" /> Hosteler:
                                    </span>
                                    <span className="text-white">
                                        {ticketDetails.hosteler ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                {ticketDetails.hosteler && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 flex items-center gap-1">
                                            <Building2 className="h-4 w-4" /> Hostel:
                                        </span>
                                        <span className="text-white">
                                            {ticketDetails.hostel || 'N/A'}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <Ticket className="h-4 w-4" /> Event:
                                    </span>
                                    <span className="text-white">
                                        {ticketDetails.eventName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-6 md:flex-row">
                            {/* Personal Info */}
                            <div className="flex-1 space-y-4">
                                <h4 className="text-md font-semibold text-white flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-400" />
                                    Personal Information
                                </h4>
                                <div>
                                    <label
                                        className="block text-sm text-gray-400 mb-1"
                                        htmlFor="fullName"
                                    >
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="John Doe"
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm text-gray-400 mb-1"
                                        htmlFor="email"
                                    >
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="john@example.com"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        className="block text-sm text-gray-400 mb-1"
                                        htmlFor="phone"
                                    >
                                        Phone
                                    </label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="+91 9876543210"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        className="block text-sm text-gray-400 mb-1"
                                        htmlFor="lpuId"
                                    >
                                        LPU ID
                                    </label>
                                    <input
                                        type="text"
                                        id="lpuId"
                                        name="lpuId"
                                        value={formData.lpuId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="12345678"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            className="block text-sm text-gray-400 mb-1"
                                            htmlFor="gender"
                                        >
                                            Gender
                                        </label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm text-gray-400 mb-1"
                                            htmlFor="hosteler"
                                        >
                                            Hosteler
                                        </label>
                                        <select
                                            id="hosteler"
                                            name="hosteler"
                                            value={formData.hosteler}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={false}>No</option>
                                            <option value={true}>Yes</option>
                                        </select>
                                    </div>
                                </div>
                                {(formData.hosteler === true ||
                                    formData.hosteler === 'true') && (
                                    <div>
                                        <label
                                            className="block text-sm text-gray-400 mb-1"
                                            htmlFor="hostel"
                                        >
                                            Hostel
                                        </label>
                                        <input
                                            type="text"
                                            id="hostel"
                                            name="hostel"
                                            value={formData.hostel}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Hostel Name"
                                            autoComplete="off"
                                        />
                                    </div>
                                )}
                            </div>
                            {/* Academic Info */}
                            <div className="flex-1 space-y-4 mt-8 md:mt-0">
                                <h4 className="text-md font-semibold text-white flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-blue-400" />
                                    Academic Information
                                </h4>
                                <div>
                                    <label
                                        className="block text-sm text-gray-400 mb-1"
                                        htmlFor="course"
                                    >
                                        Course
                                    </label>
                                    <input
                                        type="text"
                                        id="course"
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="B.Tech CSE"
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm text-gray-400 mb-1"
                                        htmlFor="club"
                                    >
                                        Club
                                    </label>
                                    <input
                                        type="text"
                                        id="club"
                                        name="club"
                                        value={formData.club}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="DSC, IEEE, etc."
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm text-gray-400 mb-1"
                                        htmlFor="eventId"
                                    >
                                        Event ID
                                    </label>
                                    <input
                                        type="text"
                                        id="eventId"
                                        name="eventId"
                                        value={formData.eventId}
                                        disabled
                                        className="w-full px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm text-gray-400 mb-1"
                                        htmlFor="eventName"
                                    >
                                        Event Name
                                    </label>
                                    <input
                                        type="text"
                                        id="eventName"
                                        name="eventName"
                                        value={formData.eventName}
                                        disabled
                                        className="w-full px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                        {error && <ErrorMessage error={error} />}
                        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 rounded-lg text-white ${
                                    loading
                                        ? 'bg-blue-500/50 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-500'
                                }`}
                            >
                                {loading ? 'Creating Ticket...' : 'Create Ticket'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateTicket;
