import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../services/api.js';
import useContact from '../hooks/useContact.js';
import { getToken, decodeToken } from '../utils/handleTokens.js';
import { AnimatePresence } from 'framer-motion';

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		lpuID: '',
		subject: '',
		message: '',
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			await apiClient.post('/api/contacts/send', formData);
			setSuccess(true);
			setFormData({
				name: '',
				email: '',
				phone: '',
				lpuID: '',
				subject: '',
				message: '',
			});
			setTimeout(() => setSuccess(false), 3000);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to send message');
		} finally {
			setLoading(false);
		}
	};

	const getAllContacts = async () => {
		try {
			const response = await apiClient.get('/api/contacts/getall');
			return response.data;
		} catch (error) {
			console.error('Error fetching contacts:', error);
			throw error;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e6e9ff] py-12 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
			>
				<div className="md:flex">
					<div className="md:w-1/3 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] text-white p-8">
						<div className="flex flex-col items-center text-center">
							<Mail className="h-12 w-12 mb-4" />
							<h2 className="text-2xl font-bold mb-2">Contact Us</h2>
							<p className="opacity-80">
								Have questions? Reach out to our team for assistance
							</p>
						</div>

						<div className="mt-10 space-y-4">
							<div className="flex items-start">
								<div className="mt-1 mr-3">
									<svg
										className="h-5 w-5 text-white opacity-80"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="font-medium">Support</h3>
									<p className="text-sm opacity-80">+91 987 654 3210</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="mt-1 mr-3">
									<svg
										className="h-5 w-5 text-white opacity-80"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="font-medium">Email</h3>
									<p className="text-sm opacity-80">support@vibranta.com</p>
								</div>
							</div>
						</div>
					</div>

					<div className="md:w-2/3 p-8">
						<h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h3>

						<AnimatePresence>
							{success && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center"
								>
									<CheckCircle2 className="h-5 w-5 mr-2" />
									Your message has been sent successfully!
								</motion.div>
							)}

							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg"
								>
									{error}
								</motion.div>
							)}
						</AnimatePresence>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Full Name
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										LPU ID
									</label>
									<input
										type="text"
										name="lpuID"
										value={formData.lpuID}
										onChange={handleChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Email Address
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Phone Number
									</label>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Subject
								</label>
								<input
									type="text"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Message
								</label>
								<textarea
									name="message"
									value={formData.message}
									onChange={handleChange}
									required
									rows={4}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								></textarea>
							</div>

							<div>
								<motion.button
									type="submit"
									disabled={loading}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="w-full py-3 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-medium rounded-lg flex items-center justify-center"
								>
									{loading ? (
										<svg
											className="animate-spin h-5 w-5 mr-2 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
									) : (
										<Send className="h-5 w-5 mr-2" />
									)}
									{loading ? 'Sending...' : 'Send Message'}
								</motion.button>
							</div>
						</form>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default ContactPage;