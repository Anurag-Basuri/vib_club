import { useEffect, useState, useRef } from 'react';
import {
	useGetAllContacts,
	useGetContactById,
	useMarkContactAsResolved,
} from '../hooks/useContact.js';

const ShowContacts = () => {
	const { getAllContacts, contacts, loading, error, reset } = useGetAllContacts();
	const {
		getContactById,
		contact: selectedContact,
		loading: loadingContact,
		error: errorContact,
		reset: resetContact,
	} = useGetContactById();
	const {
		markAsResolved,
		loading: resolving,
		error: errorResolve,
		reset: resetResolve,
	} = useMarkContactAsResolved();

	const [expandedId, setExpandedId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [showExportOptions, setShowExportOptions] = useState(false);
	const [exportType, setExportType] = useState('current');
	const [exportFormat, setExportFormat] = useState('csv');
	const [localContacts, setLocalContacts] = useState([]);

	// Track if initial fetch is done
	const initialFetchDone = useRef(false);

	// Fetch contacts only once on mount
	useEffect(() => {
		getAllContacts();
		// eslint-disable-next-line
	}, []);

	// Set localContacts only on first fetch or manual refresh
	useEffect(() => {
		if (!initialFetchDone.current && contacts.length) {
			setLocalContacts(contacts);
			initialFetchDone.current = true;
		}
	}, [contacts]);

	// Manual refresh if needed
	const handleRefresh = async () => {
		const data = await getAllContacts();
		if (data?.data?.docs) {
			setLocalContacts(data.data.docs);
		}
	};

	const handleExpand = async (id) => {
		if (expandedId === id) {
			setExpandedId(null);
			resetContact();
		} else {
			setExpandedId(id);
			await getContactById(id);
		}
	};

	const handleResolve = async (id) => {
		await markAsResolved(id);
		setLocalContacts((prev) =>
			prev.map((c) => (c._id === id ? { ...c, status: 'resolved' } : c))
		);
	};

	const filteredContacts = localContacts
		.filter(
			(c) =>
				c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(c.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
		)
		.filter((c) => statusFilter === 'all' || c.status === statusFilter);

	const getStatusColor = (status) => {
		switch (status) {
			case 'resolved':
				return 'bg-emerald-500/20 text-emerald-300';
			case 'closed':
				return 'bg-rose-500/20 text-rose-300';
			case 'pending':
			default:
				return 'bg-amber-500/20 text-amber-300';
		}
	};

	// Export functionality
	const exportData = () => {
		const dataToExport = exportType === 'current' ? filteredContacts : contacts;

		if (dataToExport.length === 0) {
			alert('No data to export');
			return;
		}

		let content = '';
		const headers = ['Name', 'Email', 'Phone', 'LPU ID', 'Subject', 'Status', 'Created At', 'Message'];

		// CSV format
		if (exportFormat === 'csv') {
			content += headers.join(',') + '\n';
			dataToExport.forEach((contact) => {
				content += `"${contact.name}","${contact.email}","${contact.phone}","${contact.lpuID}","${contact.subject || ''}","${contact.status}","${new Date(contact.createdAt).toLocaleString()}","${contact.message.replace(/"/g, '""')}"\n`;
			});

			const blob = new Blob([content], { type: 'text/csv' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
		// JSON format
		else {
			const jsonData = dataToExport.map((contact) => ({
				name: contact.name,
				email: contact.email,
				phone: contact.phone,
				lpuID: contact.lpuID,
				subject: contact.subject,
				status: contact.status,
				createdAt: new Date(contact.createdAt).toISOString(),
				message: contact.message,
			}));

			const jsonString = JSON.stringify(jsonData, null, 2);
			const blob = new Blob([jsonString], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `contacts-${new Date().toISOString().slice(0, 10)}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}

		setShowExportOptions(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
			{/* Export Modal */}
			{showExportOptions && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
					<div className="bg-gray-800/80 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-bold text-cyan-300">Export Options</h3>
							<button
								onClick={() => setShowExportOptions(false)}
								className="text-gray-400 hover:text-white"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-gray-300 mb-2">Export Type</label>
								<div className="flex gap-3">
									{['current', 'all'].map((type) => (
										<button
											key={type}
											onClick={() => setExportType(type)}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
												exportType === type
													? 'bg-cyan-600 text-white'
													: 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
											}`}
										>
											{type === 'current' ? 'Current View' : 'All Data'}
										</button>
									))}
								</div>
							</div>

							<div>
								<label className="block text-gray-300 mb-2">Format</label>
								<div className="flex gap-3">
									{['csv', 'json'].map((format) => (
										<button
											key={format}
											onClick={() => setExportFormat(format)}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
												exportFormat === format
													? 'bg-cyan-600 text-white'
													: 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
											}`}
										>
											{format.toUpperCase()}
										</button>
									))}
								</div>
							</div>

							<div className="pt-4 flex justify-end gap-3">
								<button
									onClick={() => setShowExportOptions(false)}
									className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg"
								>
									Cancel
								</button>
								<button
									onClick={exportData}
									className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center"
								>
									<svg
										className="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
										/>
									</svg>
									Export Data
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col md:flex-row justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
							Contact Queries
						</h1>
						<p className="text-gray-400 mt-2">Manage all user contact requests</p>
					</div>
					<div className="mt-4 md:mt-0 flex items-center space-x-3">
						<button
							onClick={() => setShowExportOptions(true)}
							className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg flex items-center shadow-lg shadow-blue-500/20"
						>
							<svg
								className="w-5 h-5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							Export
						</button>
						<button
							onClick={handleRefresh}
							className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm"
						>
							Refresh
						</button>
						<div className="relative">
							<input
								type="text"
								placeholder="Search contacts..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="bg-gray-800/50 backdrop-blur-lg rounded-xl py-2 pl-10 pr-4 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none w-52 shadow-lg shadow-cyan-500/10"
							/>
							<svg
								className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
					{/* Filters sidebar */}
					<div className="md:col-span-3">
						<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold text-white">Filters</h3>
								<button
									onClick={() => {
										setSearchTerm('');
										setStatusFilter('all');
									}}
									className="text-xs text-cyan-400 hover:text-cyan-300"
								>
									Clear filters
								</button>
							</div>

							<div className="mb-6">
								<label className="block text-gray-300 mb-2">Status</label>
								<div className="space-y-2">
									{['all', 'pending', 'resolved', 'closed'].map((status) => (
										<div key={status} className="flex items-center">
											<input
												type="radio"
												id={`status-${status}`}
												name="status"
												value={status}
												checked={statusFilter === status}
												onChange={() => setStatusFilter(status)}
												className="mr-2 accent-cyan-500"
											/>
											<label
												htmlFor={`status-${status}`}
												className="text-gray-300 capitalize"
											>
												{status}
											</label>
										</div>
									))}
								</div>
							</div>

							<div className="mt-6 pt-4 border-t border-gray-700">
								<div className="flex items-center justify-between">
									<span className="text-gray-300">Total Contacts</span>
									<span className="text-white font-medium">
										{contacts.length}
									</span>
								</div>
								<div className="flex items-center justify-between mt-2">
									<span className="text-gray-300">Pending</span>
									<span className="text-amber-400 font-medium">
										{contacts.filter((c) => c.status === 'pending').length}
									</span>
								</div>
								<div className="flex items-center justify-between mt-2">
									<span className="text-gray-300">Resolved</span>
									<span className="text-emerald-400 font-medium">
										{contacts.filter((c) => c.status === 'resolved').length}
									</span>
								</div>
								<div className="flex items-center justify-between mt-2">
									<span className="text-gray-300">Closed</span>
									<span className="text-rose-400 font-medium">
										{contacts.filter((c) => c.status === 'closed').length}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Main content */}
					<div className="md:col-span-9">
						{loading && (
							<div className="flex flex-col items-center justify-center h-64 bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
								<p className="text-gray-400">Loading contacts...</p>
							</div>
						)}

						{error && (
							<div className="bg-red-900/30 backdrop-blur-lg rounded-2xl p-6 border border-red-700 shadow-xl">
								<div className="flex items-center text-red-300">
									<svg
										className="w-6 h-6 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										></path>
									</svg>
									<span className="text-lg font-medium">
										Error loading contacts: {error}
									</span>
								</div>
								<button
									onClick={reset}
									className="mt-4 px-4 py-2 bg-red-700/50 hover:bg-red-700 text-white rounded-lg transition"
								>
									Try Again
								</button>
							</div>
						)}

						{!loading && !error && (
							<>
								{filteredContacts.length === 0 ? (
									<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-xl text-center">
										<div className="flex justify-center mb-4">
											<svg
												className="w-16 h-16 text-gray-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												></path>
											</svg>
										</div>
										<h3 className="text-xl font-medium text-gray-300 mb-2">
											No contacts found
										</h3>
										<p className="text-gray-500 max-w-md mx-auto">
											{statusFilter !== 'all'
												? `There are no contacts with status "${statusFilter}" matching your search.`
												: 'No contacts match your search criteria. Try adjusting your filters.'}
										</p>
										<button
											onClick={() => {
												setSearchTerm('');
												setStatusFilter('all');
											}}
											className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition"
										>
											Clear Filters
										</button>
									</div>
								) : (
									<div className="space-y-4">
										{filteredContacts.map((contact) => (
											<div
												key={contact._id}
												className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-xl overflow-hidden transition-all duration-300 ${
													expandedId === contact._id
														? 'ring-2 ring-cyan-500'
														: ''
												}`}
											>
												<div
													className={`p-5 cursor-pointer transition-all duration-200 ${
														contact.status === 'pending'
															? 'bg-gradient-to-r from-cyan-900/10 to-blue-900/10 border-l-4 border-cyan-500'
															: ''
													}`}
													onClick={() => handleExpand(contact._id)}
												>
													<div className="flex items-start justify-between">
														<div className="flex-1 min-w-0">
															<div className="flex items-center">
																<h3 className="text-lg font-semibold text-white truncate">
																	{contact.name}
																</h3>
																{contact.status === 'pending' && (
																	<span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full animate-pulse">
																		New
																	</span>
																)}
															</div>
															<div className="flex items-center mt-1 text-sm">
																<span className="text-gray-400 truncate">
																	{contact.email}
																</span>
																<span className="mx-2 text-gray-600">
																	•
																</span>
																<span className="text-cyan-400 truncate">
																	{contact.subject}
																</span>
															</div>
														</div>
														<div className="flex items-center space-x-3">
															<div
																className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
																	contact.status
																)}`}
															>
																{contact.status}
															</div>
															<div className="text-xs text-gray-500">
																{new Date(
																	contact.createdAt
																).toLocaleDateString()}
															</div>
														</div>
													</div>

													{expandedId === contact._id &&
														selectedContact && (
															<div className="mt-4 pt-4 border-t border-gray-700">
																<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1">
																			Name
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.name}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1">
																			Email
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.email}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1">
																			Phone
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.phone}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1">
																			LPU ID
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.lpuID}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1">
																			Subject
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.subject}
																		</p>
																	</div>
																	<div className="md:col-span-2">
																		<h4 className="text-gray-400 text-sm font-medium mb-1">
																			Message
																		</h4>
																		<p className="text-gray-300 text-sm bg-gray-900/30 rounded-lg p-3 whitespace-pre-wrap">
																			{selectedContact.message}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1">
																			Status
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.status}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1">
																			Created At
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{new Date(
																				selectedContact.createdAt
																			).toLocaleString()}
																		</p>
																	</div>
																</div>
																<div className="mt-4 flex gap-2">
																	{selectedContact.status ===
																		'pending' && (
																		<button
																			className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition flex items-center"
																			disabled={resolving}
																			onClick={() =>
																				handleResolve(
																					contact._id
																				)
																			}
																		>
																			{resolving ? (
																				<>
																					<svg
																						className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
																					Processing...
																				</>
																			) : (
																				'Mark as Resolved'
																			)}
																		</button>
																	)}
																	<button
																		className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition"
																		onClick={() => {
																			navigator.clipboard.writeText(
																				contact.email
																			);
																		}}
																	>
																		Copy Email
																	</button>
																</div>
																{errorResolve && (
																	<div className="text-red-400 mt-2">
																		{errorResolve}
																	</div>
																)}
															</div>
														)}
												</div>
												<div className="px-5 py-3 bg-gray-800/70 border-t border-gray-700 flex justify-between items-center">
													<div className="text-xs text-gray-500">
														ID: {contact._id}
													</div>
													<div>
														{contact.status === 'pending' && (
															<button
																onClick={() =>
																	handleResolve(contact._id)
																}
																disabled={resolving}
																className="px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
															>
																Resolve
															</button>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShowContacts;
