import { useState, useRef, useEffect } from 'react';
import {
    User,
    Mail,
    Smartphone,
    GraduationCap,
    Ticket,
    X,
    QrCode,
    AtSign,
    Building2,
    BadgeCheck,
    AlertTriangle,
    Loader2,
} from 'lucide-react';
import { useCreateTicket } from '../../hooks/useTickets.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s]{7,15}$/;

const CreateTicket = ({ token, events, onClose, loadingEvents }) => {
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
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [ticketDetails, setTicketDetails] = useState(null);
    const firstFieldRef = useRef(null);

    // Refs for focusing on error fields
    const refs = {
        fullName: useRef(),
        email: useRef(),
        eventId: useRef(),
        phone: useRef(),
        gender: useRef(),
        hostel: useRef(),
    };

    const { createTicket, loading } = useCreateTicket();

    useEffect(() => {
        if (firstFieldRef.current) {
            firstFieldRef.current.focus();
        }
    }, []);

    useEffect(() => {
        // Update event when events prop changes
        if (events && events.length > 0) {
            setFormData(prev => ({
                ...prev,
                eventId: events[0]._id,
                eventName: events[0].title
            }));
        }
    }, [events]);

    useEffect(() => {
        // Focus on the first field with error after submit
        const firstError = Object.keys(fieldErrors)[0];
        if (firstError && refs[firstError]?.current) {
            refs[firstError].current.focus();
        }
    }, [fieldErrors]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = value;
        // Always keep hosteler as string
        if (name === 'hosteler') {
            newValue = value;
        }
        setFormData(prev => ({
            ...prev,
            [name]: newValue,
            ...(name === 'eventId' && events
                ? {
                    eventName: events.find(ev => ev._id === value)?.title || '',
                }
                : {}
            ),
            ...(name === 'hosteler' && value === 'false'
                ? { hostel: '' }
                : {}
            ),
        }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateFields = () => {
        const errors = {};
        if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
        if (!formData.email) errors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) errors.email = 'Enter a valid email address';
        if (!formData.eventId) errors.eventId = 'Event selection is required';
        if (formData.phone && !phoneRegex.test(formData.phone)) errors.phone = 'Enter a valid phone number';
        if (formData.gender && !['Male', 'Female'].includes(formData.gender)) errors.gender = 'Select a valid gender';
        if (formData.hosteler === 'true' && !formData.hostel.trim()) errors.hostel = 'Hostel name is required';
        return errors;
    };

    const handleDismissError = () => setError('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        const errors = validateFields();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setError('Please correct the highlighted fields.');
            return;
        }

        const payload = {
            ...formData,
            hosteler: formData.hosteler === 'true',
            gender: formData.gender,
        };

        try {
            const ticket = await createTicket(payload, token);
            setSuccess(true);
            setTicketDetails(ticket);
            setFieldErrors({});
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
            if (err?.response?.data?.errors) {
                const backendErrors = err.response.data.errors;
                const newFieldErrors = Array.isArray(backendErrors)
                    ? backendErrors.reduce((acc, e) => {
                        if (e.path && e.msg) acc[e.path] = e.msg;
                        return acc;
                    }, {})
                    : backendErrors;
                setFieldErrors(newFieldErrors);
                setError('Please correct the highlighted fields.');
            } else {
                setError(err?.response?.data?.message || err?.message || 'Failed to create ticket');
            }
        }
    };

    // Helper function to render input field
    const renderField = (name, label, icon, type = 'text', options = [], extraProps = {}) => {
        const Icon = icon;
        const hasError = !!fieldErrors[name];
        const refProp = extraProps.ref || refs[name];

        return (
            <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor={name}>
                    {label}
                </label>
                <div className="relative">
                    {icon && (
                        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                    {type === 'select' ? (
                        <select
                            id={name}
                            name={name}
                            ref={refProp}
                            value={formData[name]}
                            onChange={handleChange}
                            className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 bg-gray-700/50 border ${
                                hasError ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg text-white focus:outline-none focus:ring-2 ${
                                hasError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                            } ${extraProps.disabled ? 'cursor-not-allowed opacity-70' : ''}`}
                            aria-invalid={hasError}
                            {...extraProps}
                        >
                            {options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={type}
                            id={name}
                            name={name}
                            ref={refProp}
                            value={formData[name]}
                            onChange={handleChange}
                            className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 bg-gray-700/50 border ${
                                hasError ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg text-white focus:outline-none focus:ring-2 ${
                                hasError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                            } ${extraProps.disabled ? 'cursor-not-allowed opacity-70' : ''}`}
                            placeholder={extraProps.placeholder || ''}
                            autoComplete="off"
                            aria-invalid={hasError}
                            {...extraProps}
                        />
                    )}
                    {hasError && (
                        <div className="flex items-center gap-1 text-xs text-red-400 mt-1">
                            <AlertTriangle className="h-4 w-4" />
                            {fieldErrors[name]}
                        </div>
                    )}
                </div>
            </div>
        );
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
                        <button
                            onClick={onClose}
                            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
                        >
                            Close
                        </button>
                    </div>
                ) : loadingEvents ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-400">Loading events...</p>
                    </div>
                ) : events?.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="mx-auto bg-red-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-2">
                            <AlertTriangle className="h-8 w-8 text-red-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-white">No Events Available</h4>
                        <p className="text-gray-400 mt-2">Cannot create ticket without events.</p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center bg-red-700/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-2">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                <span className="flex-1">{error}</span>
                                <button
                                    type="button"
                                    onClick={handleDismissError}
                                    className="ml-2 text-red-300 hover:text-white"
                                    aria-label="Dismiss error"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col gap-6 md:flex-row">
                            {/* Personal Info */}
                            <div className="flex-1 space-y-4">
                                <h4 className="text-md font-semibold text-white flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-400" />
                                    Personal Information
                                </h4>

                                {renderField(
                                    'fullName',
                                    'Full Name *',
                                    User,
                                    'text',
                                    [],
                                    {
                                        placeholder: 'John Doe',
                                        ref: firstFieldRef,
                                        autoFocus: true
                                    }
                                )}

                                {renderField(
                                    'email',
                                    'Email *',
                                    Mail,
                                    'email',
                                    [],
                                    { placeholder: 'john@example.com' }
                                )}

                                {renderField(
                                    'phone',
                                    'Phone',
                                    Smartphone,
                                    'tel',
                                    [],
                                    { placeholder: '+91 9876543210' }
                                )}

                                {renderField(
                                    'lpuId',
                                    'LPU ID',
                                    null,
                                    'text',
                                    [],
                                    { placeholder: '12345678' }
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {renderField(
                                        'gender',
                                        'Gender',
                                        null,
                                        'select',
                                        [
                                            { value: '', label: 'Select Gender' },
                                            { value: 'Male', label: 'Male' },
                                            { value: 'Female', label: 'Female' }
                                        ]
                                    )}

                                    {renderField(
                                        'hosteler',
                                        'Hosteler',
                                        null,
                                        'select',
                                        [
                                            { value: false, label: 'No' },
                                            { value: true, label: 'Yes' }
                                        ]
                                    )}
                                </div>

                                {(formData.hosteler) && (
                                    renderField(
                                        'hostel',
                                        'Hostel *',
                                        Building2,
                                        'text',
                                        [],
                                        { placeholder: 'Hostel Name' }
                                    )
                                )}
                            </div>

                            {/* Academic Info */}
                            <div className="flex-1 space-y-4 mt-8 md:mt-0">
                                <h4 className="text-md font-semibold text-white flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-blue-400" />
                                    Academic Information
                                </h4>

                                {renderField(
                                    'course',
                                    'Course',
                                    null,
                                    'text',
                                    [],
                                    { placeholder: 'B.Tech CSE' }
                                )}

                                {renderField(
                                    'club',
                                    'Club',
                                    null,
                                    'text',
                                    [],
                                    { placeholder: 'DSC, IEEE, etc.' }
                                )}

                                {renderField(
                                    'eventId',
                                    'Event ID',
                                    null,
                                    'text',
                                    events?.map(event => ({
                                        value: event._id,
                                    })) || [],
                                    {disabled:true}
                                )}

                                {renderField(
                                    'eventName',
                                    'Event Name',
                                    null,
                                    'text',
                                    [],
                                    { disabled: true }
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !events?.length}
                                className={`px-6 py-2 rounded-lg text-white ${
                                    loading
                                        ? 'bg-blue-500/50 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-500'
                                } flex items-center justify-center gap-2`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating Ticket...
                                    </>
                                ) : 'Create Ticket'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateTicket;