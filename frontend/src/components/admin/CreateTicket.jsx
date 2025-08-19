import { useState } from 'react';
import {
    User,
    Mail,
    Smartphone,
    BookOpen,
    GraduationCap,
    Ticket,
    X,
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
        eventId: events?.[0]?._id || '68859a199ec482166f0e8523',
        eventName: events?.[0]?.title || 'RaveYard 2025',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

        // Prepare payload for backend
        const payload = {
            ...formData,
            hosteler: formData.hosteler === 'yes',
            gender:
                formData.gender.charAt(0).toUpperCase() +
                formData.gender.slice(1).toLowerCase(),
        };

        try {
            await createTicket(payload, token);
            setSuccess(true);
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
                eventId: events?.[0]?._id || '68859a199ec482166f0e8523',
                eventName: events?.[0]?.title || 'RaveYard 2025',
            });

            // Auto close after success
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    'Failed to create ticket'
            );
        }
    };

	return (
		<div className="bg-gray-800 rounded-xl p-4 md:p-6 max-w-3xl w-full mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
					<Ticket className="h-6 w-6 text-blue-400" />
					Create New Ticket
				</h3>
				<button onClick={onClose} className="text-gray-400 hover:text-white">
					<X className="h-6 w-6" />
				</button>
			</div>

			{success ? (
				<div className="text-center py-8">
					<div className="mx-auto bg-green-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
						<Ticket className="h-8 w-8 text-green-400" />
					</div>
					<h4 className="text-lg font-semibold text-white">
						Ticket Created Successfully!
					</h4>
					<p className="text-gray-400 mt-2">
						The ticket has been added to the system
					</p>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Personal Info */}
						<div className="space-y-4">
							<h4 className="text-md font-semibold text-white flex items-center gap-2">
								<User className="h-4 w-4 text-blue-400" />
								Personal Information
							</h4>

							<div>
								<label className="block text-sm text-gray-400 mb-1" htmlFor="fullName">
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
								<label className="block text-sm text-gray-400 mb-1" htmlFor="email">
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
								<label className="block text-sm text-gray-400 mb-1" htmlFor="phone">
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
								<label className="block text-sm text-gray-400 mb-1" htmlFor="lpuId">
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

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm text-gray-400 mb-1" htmlFor="gender">
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
									<label className="block text-sm text-gray-400 mb-1" htmlFor="hosteler">
										Hosteler
									</label>
									<select
										id="hosteler"
										name="hosteler"
										value={formData.hosteler}
										onChange={handleChange}
										className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="false">No</option>
										<option value="true">Yes</option>
									</select>
								</div>
							</div>

							{formData.hosteler === true && (
								<div>
									<label className="block text-sm text-gray-400 mb-1" htmlFor="hostel">
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
						<div className="space-y-4">
							<h4 className="text-md font-semibold text-white flex items-center gap-2">
								<GraduationCap className="h-4 w-4 text-blue-400" />
								Academic Information
							</h4>

							<div>
								<label className="block text-sm text-gray-400 mb-1" htmlFor="course">
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
								<label className="block text-sm text-gray-400 mb-1" htmlFor="club">
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
								<label className="block text-sm text-gray-400 mb-1" htmlFor="eventId">
									Event Name
								</label>
								<input
									type="text"
									id="eventName"
									name="eventName"
									value={formData.eventName}
									onChange={handleChange}
									className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Event Name"
									autoComplete="off"
									disabled
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-400 mb-1" htmlFor="eventId">
									Event ID
								</label>
								<input
									type="text"
									id="eventId"
									name="eventId"
									value={formData.eventId}
									onChange={handleChange}
									className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Event ID"
									autoComplete="off"
									disabled
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
	);
};

export default CreateTicket;
