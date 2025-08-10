import React, { useState } from 'react';
import { useCreateTicket } from '../../hooks/useTickets.js';

const initialForm = {
	fullName: '',
	email: '',
	phone: '',
	lpuId: '',
	gender: '',
	hosteler: false,
	hostel: '',
	course: '',
	club: '',
	eventId: '68859a199ec482166f0e8523',
	eventName: 'Raveyard 2025',
};

const CreateTicket = () => {
	const [form, setForm] = useState(initialForm);
	const [error, setError] = useState('');
	const [fieldErrors, setFieldErrors] = useState({});
	const [success, setSuccess] = useState('');
	const [createdTicket, setCreatedTicket] = useState(null);
	const { createTicket, loading } = useCreateTicket();

	// Validate fields and return error object
	const validate = () => {
		const errors = {};
		if (!form.fullName.trim()) errors.fullName = 'Full Name is required';
		if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
			errors.email = 'Valid Email is required';
		if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
			errors.phone = 'Valid 10-digit Phone is required';
		if (!form.lpuId.trim()) errors.lpuId = 'LPU ID is required';
		if (!form.gender) errors.gender = 'Gender is required';
		if (!form.course.trim()) errors.course = 'Course is required';
		if (!form.club.trim()) errors.club = 'Club is required';
		if (form.hosteler && !form.hostel.trim()) errors.hostel = 'Hostel Name is required';
		return errors;
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
		setFieldErrors((prev) => ({ ...prev, [name]: '' }));
		setError('');
		setSuccess('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setCreatedTicket(null);
		const errors = validate();
		setFieldErrors(errors);
		if (Object.keys(errors).length) {
			setError('Please fix the highlighted errors.');
			return;
		}
		try {
			const ticket = await createTicket(form);
			setSuccess('Ticket created successfully!');
			setCreatedTicket(ticket);
			setForm(initialForm);
			setFieldErrors({});
		} catch (err) {
			setError(err?.response?.data?.message || err?.message || 'Failed to create ticket.');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-4">
			<form
				className="w-full max-w-lg mx-auto bg-blue-900/60 backdrop-blur-xl border border-blue-700/30 rounded-2xl shadow-2xl shadow-blue-900/30 p-8"
				onSubmit={handleSubmit}
				noValidate
			>
				<h2 className="text-3xl font-bold mb-6 text-blue-100 text-center drop-shadow">
					Create Ticket
				</h2>
				{error && (
					<div className="mb-3 text-red-400 bg-red-900/30 border border-red-700/30 rounded-lg p-2 text-center">
						{error}
					</div>
				)}
				{success && (
					<div className="mb-3 text-green-400 bg-green-900/30 border border-green-700/30 rounded-lg p-2 text-center">
						{success}
					</div>
				)}
				{!createdTicket ? (
					<div className="space-y-4">
						<div>
							<label className="block text-blue-200 mb-1">Full Name</label>
							<input
								name="fullName"
								value={form.fullName}
								onChange={handleChange}
								className={`w-full px-4 py-2 rounded-xl bg-blue-950/40 border ${fieldErrors.fullName ? 'border-red-500' : 'border-blue-800'} text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
								required
							/>
							{fieldErrors.fullName && (
								<span className="text-red-400 text-sm">{fieldErrors.fullName}</span>
							)}
						</div>
						<div>
							<label className="block text-blue-200 mb-1">Email</label>
							<input
								name="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								className={`w-full px-4 py-2 rounded-xl bg-blue-950/40 border ${fieldErrors.email ? 'border-red-500' : 'border-blue-800'} text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
								required
							/>
							{fieldErrors.email && (
								<span className="text-red-400 text-sm">{fieldErrors.email}</span>
							)}
						</div>
						<div>
							<label className="block text-blue-200 mb-1">Phone</label>
							<input
								name="phone"
								value={form.phone}
								onChange={handleChange}
								className={`w-full px-4 py-2 rounded-xl bg-blue-950/40 border ${fieldErrors.phone ? 'border-red-500' : 'border-blue-800'} text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
								required
							/>
							{fieldErrors.phone && (
								<span className="text-red-400 text-sm">{fieldErrors.phone}</span>
							)}
						</div>
						<div>
							<label className="block text-blue-200 mb-1">LPU ID</label>
							<input
								name="lpuId"
								value={form.lpuId}
								onChange={handleChange}
								className={`w-full px-4 py-2 rounded-xl bg-blue-950/40 border ${fieldErrors.lpuId ? 'border-red-500' : 'border-blue-800'} text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
								required
							/>
							{fieldErrors.lpuId && (
								<span className="text-red-400 text-sm">{fieldErrors.lpuId}</span>
							)}
						</div>
						<div>
							<label className="block text-blue-200 mb-1">Gender</label>
							<select
								name="gender"
								value={form.gender}
								onChange={handleChange}
								className={`w-full px-4 py-2 rounded-xl bg-blue-950/40 border ${fieldErrors.gender ? 'border-red-500' : 'border-blue-800'} text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
								required
							>
								<option value="">Select</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</select>
							{fieldErrors.gender && (
								<span className="text-red-400 text-sm">{fieldErrors.gender}</span>
							)}
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								name="hosteler"
								checked={form.hosteler}
								onChange={handleChange}
								className="accent-blue-600"
							/>
							<label className="text-blue-200">Hosteler</label>
						</div>
						{form.hosteler && (
							<div>
								<label className="block text-blue-200 mb-1">Hostel Name</label>
								<input
									name="hostel"
									value={form.hostel}
									onChange={handleChange}
									className={`w-full px-4 py-2 rounded-xl bg-blue-950/40 border ${fieldErrors.hostel ? 'border-red-500' : 'border-blue-800'} text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
									required
								/>
								{fieldErrors.hostel && (
									<span className="text-red-400 text-sm">
										{fieldErrors.hostel}
									</span>
								)}
							</div>
						)}
						<div>
							<label className="block text-blue-200 mb-1">Course</label>
							<input
								name="course"
								value={form.course}
								onChange={handleChange}
								className={`w-full px-4 py-2 rounded-xl bg-blue-950/40 border ${fieldErrors.course ? 'border-red-500' : 'border-blue-800'} text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
								required
							/>
							{fieldErrors.course && (
								<span className="text-red-400 text-sm">{fieldErrors.course}</span>
							)}
						</div>
						<div>
							<label className="block text-blue-200 mb-1">Club</label>
							<input
								name="club"
								value={form.club}
								onChange={handleChange}
								className={`w-full px-4 py-2 rounded-xl bg-blue-950/40 border ${fieldErrors.club ? 'border-red-500' : 'border-blue-800'} text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
								required
							/>
							{fieldErrors.club && (
								<span className="text-red-400 text-sm">{fieldErrors.club}</span>
							)}
						</div>
						<div>
							<label className="block text-blue-200 mb-1">Event ID</label>
							<input
								name="eventId"
								value={form.eventId}
								readOnly
								className="w-full px-4 py-2 rounded-xl bg-blue-950/30 border border-blue-800 text-blue-400 cursor-not-allowed"
							/>
						</div>
						<div>
							<label className="block text-blue-200 mb-1">Event Name</label>
							<input
								name="eventName"
								value={form.eventName}
								readOnly
								className="w-full px-4 py-2 rounded-xl bg-blue-950/30 border border-blue-800 text-blue-400 cursor-not-allowed"
							/>
						</div>
					</div>
				) : (
					<div className="bg-blue-950/40 rounded-xl p-6 border border-blue-800 text-blue-100 shadow-lg">
						<h3 className="text-2xl font-bold mb-4 text-blue-200">Ticket Details</h3>
						<div className="space-y-2">
							<div>
								<span className="font-semibold">Ticket ID:</span>{' '}
								{createdTicket.ticketId || createdTicket._id}
							</div>
							<div>
								<span className="font-semibold">Full Name:</span>{' '}
								{createdTicket.fullName}
							</div>
							<div>
								<span className="font-semibold">Email:</span> {createdTicket.email}
							</div>
							<div>
								<span className="font-semibold">Phone:</span> {createdTicket.phone}
							</div>
							<div>
								<span className="font-semibold">LPU ID:</span> {createdTicket.lpuId}
							</div>
							<div>
								<span className="font-semibold">Gender:</span>{' '}
								{createdTicket.gender}
							</div>
							<div>
								<span className="font-semibold">Hosteler:</span>{' '}
								{createdTicket.hosteler ? 'Yes' : 'No'}
							</div>
							{createdTicket.hosteler && (
								<div>
									<span className="font-semibold">Hostel:</span>{' '}
									{createdTicket.hostel}
								</div>
							)}
							<div>
								<span className="font-semibold">Course:</span>{' '}
								{createdTicket.course}
							</div>
							<div>
								<span className="font-semibold">Club:</span> {createdTicket.club}
							</div>
							<div>
								<span className="font-semibold">Event ID:</span>{' '}
								{createdTicket.eventId}
							</div>
							<div>
								<span className="font-semibold">Event Name:</span>{' '}
								{createdTicket.eventName}
							</div>
							<div>
								<span className="font-semibold">Created At:</span>{' '}
								{new Date(createdTicket.createdAt).toLocaleString()}
							</div>
							<div>
								<span className="font-semibold">QR Code:</span>
								<br />
								{createdTicket.qrCode?.url && (
									<img
										src={createdTicket.qrCode.url}
										alt="QR Code"
										className="mt-2 w-32 h-32 object-contain bg-white rounded"
									/>
								)}
							</div>
						</div>
						<button
							type="button"
							className="mt-6 w-full py-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold shadow-lg hover:from-blue-800 hover:to-cyan-700 transition"
							onClick={() => {
								setCreatedTicket(null);
								setSuccess('');
							}}
						>
							Create Another Ticket
						</button>
					</div>
				)}
				{!createdTicket && (
					<button
						type="submit"
						disabled={loading}
						className="w-full py-3 mt-6 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold shadow-lg hover:from-blue-800 hover:to-cyan-700 transition"
					>
						{loading ? 'Creating...' : 'Create Ticket'}
					</button>
				)}
			</form>
		</div>
	);
};

export default CreateTicket;
