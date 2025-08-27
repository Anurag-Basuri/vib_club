import { useEffect, useState } from 'react';
import {
	useGetAllContacts,
	useGetContactById,
	useMarkContactAsResolved,
	useDeleteContact,
} from '../hooks/useContact.js';

const ShowContacts = () => {
	const { getAllContacts, loading, error, reset } = useGetAllContacts();
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
	const {
		deleteContact,
		loading: deleting,
		error: errorDelete,
		reset: resetDelete,
	} = useDeleteContact();

	const [contacts, setContacts] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [totalDocs, setTotalDocs] = useState(0);

	const [expandedId, setExpandedId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [showExportOptions, setShowExportOptions] = useState(false);
	const [exportType, setExportType] = useState('current');
	const [exportFormat, setExportFormat] = useState('csv');
	const [copiedEmail, setCopiedEmail] = useState(null);

	// Fetch contacts for current page
	const fetchContacts = async (pageNum = 1) => {
		const data = await getAllContacts({ page: pageNum, limit });
		const docs = data?.data?.docs || [];
		setContacts(docs);
		setTotalPages(data?.data?.totalPages || 1);
		setTotalDocs(data?.data?.totalDocs || 0);
	};

	useEffect(() => {
		fetchContacts(page);
		// eslint-disable-next-line
	}, [page]);

	const handleRefresh = async () => {
		await fetchContacts(page);
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
		setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, status: 'resolved' } : c)));
	};

	const handleCopyEmail = (email) => {
		navigator.clipboard.writeText(email);
		setCopiedEmail(email);
		setTimeout(() => setCopiedEmail(null), 2000);
	};

	const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;
        try {
            await deleteContact(id);
            // If last item on page, go to previous page if not on first
            if (contacts.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                await fetchContacts(page);
            }
            if (expandedId === id) setExpandedId(null);
        } catch (e) {
            alert('Failed to delete contact. Please try again.');
        }
    };

	const filteredContacts = contacts
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
				return 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30';
			case 'pending':
			default:
				return 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30';
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
		const headers = [
			'Name',
			'Email',
			'Phone',
			'LPU ID',
			'Subject',
			'Status',
			'Created At',
			'Message',
		];

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
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Close"
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
													? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
													: 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
											}`}
										>
											{type === 'current' ? 'Current View' : 'All Data'}
										</button>
									))}
								</div>
								<p className="text-xs text-gray-400 mt-1">
									{exportType === 'current'
										? `Exporting ${filteredContacts.length} filtered contacts`
										: `Exporting all ${contacts.length} contacts`}
								</p>
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
													? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
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
									className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={exportData}
									className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center transition-colors shadow-lg shadow-cyan-500/30"
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
							className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg flex items-center shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
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
							className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm transition-colors flex items-center"
							disabled={loading}
						>
							{loading ? (
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
							) : (
								<svg
									className="w-4 h-4 mr-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									></path>
								</svg>
							)}
							{loading ? 'Refreshing...' : 'Refresh'}
						</button>
						<div className="relative">
							<input
								type="text"
								placeholder="Search contacts..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="bg-gray-800/50 backdrop-blur-lg rounded-xl py-2 pl-10 pr-4 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none w-52 shadow-lg shadow-cyan-500/10 transition-colors"
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
						<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl sticky top-4">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold text-white">Filters</h3>
								<button
									onClick={() => {
										setSearchTerm('');
										setStatusFilter('all');
									}}
									className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center"
								>
									<svg
										className="w-4 h-4 mr-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										></path>
									</svg>
									Clear filters
								</button>
							</div>

							<div className="mb-6">
								<label className="block text-gray-300 mb-2">Status</label>
								<div className="space-y-2">
									{['all', 'pending', 'resolved'].map((status) => (
										<div key={status} className="flex items-center group">
											<input
												type="radio"
												id={`status-${status}`}
												name="status"
												value={status}
												checked={statusFilter === status}
												onChange={() => setStatusFilter(status)}
												className="mr-2 accent-cyan-500 cursor-pointer"
											/>
											<label
												htmlFor={`status-${status}`}
												className="text-gray-300 capitalize cursor-pointer group-hover:text-white transition-colors"
											>
												{status}
											</label>
										</div>
									))}
								</div>
							</div>

							<div className="mt-6 pt-4 border-t border-gray-700">
								<div className="flex items-center justify-between mb-2">
									<span className="text-gray-300">Total Contacts</span>
									<span className="text-white font-medium bg-gray-700/50 px-2 py-1 rounded-md">
										{totalDocs}
									</span>
								</div>
								<div className="flex items-center justify-between mb-2">
									<span className="text-gray-300">Pending</span>
									<span className="text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded-md">
										{contacts.filter((c) => c.status === 'pending').length}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-300">Resolved</span>
									<span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-md">
										{contacts.filter((c) => c.status === 'resolved').length}
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
										/>
									</svg>
									<span className="text-lg font-medium">
										Error loading contacts: {error}
									</span>
								</div>
								<button
									onClick={reset}
									className="mt-4 px-4 py-2 bg-red-700/50 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
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
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										></path>
									</svg>
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
											className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-colors"
										>
											Clear Filters
										</button>
									</div>
								) : (
									<div className="space-y-4">
										{filteredContacts.map((contact) => (
											<div
												key={contact._id}
												className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30 ${
													expandedId === contact._id
														? 'ring-2 ring-cyan-500 border-cyan-500/50'
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
																	<span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full animate-pulse flex items-center">
																		<svg
																			className="w-3 h-3 mr-1"
																			fill="none"
																			stroke="currentColor"
																			viewBox="0 0 24 24"
																		>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth="2"
																				d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
																			/>
																		</svg>
																		New
																	</span>
																)}
															</div>
															<div className="flex items-center mt-1 text-sm">
																<span className="text-gray-400 truncate flex items-center">
																	<svg
																		className="w-4 h-4 mr-1"
																		fill="none"
																		stroke="currentColor"
																		viewBox="0 0 24 24"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth="2"
																			d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
																		/>
																	</svg>
																	{contact.email}
																</span>
																<span className="mx-2 text-gray-600">
																	•
																</span>
																<span className="text-cyan-400 truncate flex items-center">
																	<svg
																		className="w-4 h-4 mr-1"
																		fill="none"
																		stroke="currentColor"
																		viewBox="0 0 24 24"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth="2"
																			d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
																		/>
																	</svg>
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
															<div className="text-xs text-gray-500 flex items-center">
																<svg
																	className="w-4 h-4 mr-1"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
																	/>
																</svg>
																{new Date(
																	contact.createdAt
																).toLocaleDateString()}
															</div>
														</div>
													</div>

													{expandedId === contact._id &&
														(loadingContact ? (
															<div className="mt-4 pt-4 border-t border-gray-700 flex justify-center">
																<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-500"></div>
																<p className="text-gray-400 ml-2">
																	Loading details...
																</p>
															</div>
														) : selectedContact ? (
															<div className="mt-4 pt-4 border-t border-gray-700">
																<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
																			<svg
																				className="w-4 h-4 mr-1"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth="2"
																					d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
																				/>
																			</svg>
																			Name
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.name}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
																			<svg
																				className="w-4 h-4 mr-1"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth="2"
																					d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
																				/>
																			</svg>
																			Email
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.email}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
																			<svg
																				className="w-4 h-4 mr-1"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth="2"
																					d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
																				/>
																			</svg>
																			Phone
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.phone}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
																			<svg
																				className="w-4 h-4 mr-1"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth="2"
																					d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0"
																			/>
																			</svg>
																			<svg
																				className="w-4 h-4 mr-1"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth="2"
																					d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
																			/>
																			</svg>
																			Subject
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{
																				selectedContact.subject
																			}
																		</p>
																	</div>
																	<div className="md:col-span-2">
																		<h4 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
																			<svg
																				className="w-4 h-4 mr-1"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth="2"
																					d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
																				/>
																			</svg>
																			Message
																		</h4>
																		<p className="text-gray-300 text-sm bg-gray-900/30 rounded-lg p-3 whitespace-pre-wrap">
																			{
																				selectedContact.message
																			}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
																			<svg
																				className="w-4 h-4 mr-1"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth="2"
																					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
																				/>
																			</svg>
																			Status
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{selectedContact.status}
																		</p>
																	</div>
																	<div>
																		<h4 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
																			<svg
																				className="w-4 h-4 mr-1"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth="2"
																					d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
																				/>
																			</svg>
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
																			className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition flex items-center disabled:opacity-50"
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
																				<>
																					<svg
																						className="w-4 h-4 mr-1"
																						fill="none"
																						stroke="currentColor"
																						viewBox="0 0 24 24"
																					>
																						<path
																							strokeLinecap="round"
																							strokeLinejoin="round"
																							strokeWidth="2"
																							d="M5 13l4 4L19 7"
																						></path>
																					</svg>
																					Mark as Resolved
																				</>
																			)}
																		</button>
																	)}
																	<button
																		className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition flex items-center"
																		onClick={() =>
																			handleCopyEmail(
																				contact.email
																			)
																		}
																	>
																		{copiedEmail ===
																		contact.email ? (
																			<>
																				<svg
																					className="w-4 h-4 mr-1 text-emerald-400"
																					fill="none"
																					stroke="currentColor"
																					viewBox="0 0 24 24"
																				>
																					<path
																						strokeLinecap="round"
																						strokeLinejoin="round"
																						strokeWidth="2"
																						d="M5 13l4 4L19 7"
																					></path>
																				</svg>
																				Copied!
																			</>
																		) : (
																			<>
																				<svg
																					className="w-4 h-4 mr-1"
																					fill="none"
																					stroke="currentColor"
																					viewBox="0 0 24 24"
																				>
																					<path
																						strokeLinecap="round"
																						strokeLinejoin="round"
																						strokeWidth="2"
																						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
																					/>
																				</svg>
																				Copy Email
																			</>
																		)}
																	</button>
																</div>
																{errorResolve && (
																	<div className="text-red-400 mt-2 text-sm">
																		{errorResolve}
																	</div>
																)}
															</div>
														) : (
															<div className="mt-4 pt-4 border-t border-gray-700 text-center text-gray-400">
																Failed to load contact details
															</div>
														))}
												</div>
												<div className="px-5 py-3 bg-gray-800/70 border-t border-gray-700 flex justify-between items-center">
													<div className="text-xs text-gray-500 font-mono">
														ID: {contact._id}
													</div>
													<div>
														{/*Give a delete button here*/}
														<button
															onClick={() => handleDelete(contact._id)}
															className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
														>
															Delete
														</button>
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

				{/* Pagination Controls */}
				{totalPages > 1 && (
					<div className="flex justify-center mt-8">
						<nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
							<button
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								className={`px-3 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-gray-300 hover:bg-cyan-700 hover:text-white transition ${
									page === 1 ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							>
								Prev
							</button>
							{Array.from({ length: totalPages }, (_, i) => (
								<button
									key={i + 1}
									onClick={() => setPage(i + 1)}
									className={`px-3 py-2 border-t border-b border-gray-700 bg-gray-800 text-gray-300 hover:bg-cyan-700 hover:text-white transition ${
										page === i + 1 ? 'bg-cyan-700 text-white font-bold' : ''
									}`}
								>
									{i + 1}
								</button>
							))}
							<button
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
								className={`px-3 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-gray-300 hover:bg-cyan-700 hover:text-white transition ${
									page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							>
								Next
							</button>
						</nav>
					</div>
				)}
			</div>
		</div>
	);
};

export default ShowContacts;
