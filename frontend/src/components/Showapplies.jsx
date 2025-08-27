import { useState, useEffect, useRef } from 'react';
import {
    useGetAllApplications,
    useGetApplicationById,
    useUpdateApplicationStatus,
    useDeleteApplication,
    useMarkApplicationAsSeen,
} from '../hooks/useApply.js';

const ShowApplies = () => {
    const { getAllApplications, loading, error, reset } = useGetAllApplications();
    const {
        getApplicationById,
        application: selectedApplication,
        loading: loadingApplication,
        error: errorApplication,
        reset: resetApplication,
    } = useGetApplicationById();
    const {
        updateApplicationStatus,
        loading: updatingStatus,
        error: errorStatus,
        reset: resetStatus,
    } = useUpdateApplicationStatus();
    const {
        deleteApplication,
        loading: deleting,
        error: errorDelete,
        reset: resetDelete,
    } = useDeleteApplication();
    const {
        markAsSeen,
        loading: markLoading,
        error: markError,
        reset: resetMark,
    } = useMarkApplicationAsSeen();

    const [applications, setApplications] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [exportType, setExportType] = useState('current');
    const [exportFormat, setExportFormat] = useState('csv');
    const [copiedEmail, setCopiedEmail] = useState(null);
    const [seenFilter, setSeenFilter] = useState('all'); // NEW

    // Fetch applications for current page
    const fetchApplications = async (pageNum = 1) => {
        // Pass seen filter as query param if not 'all'
        const params = { page: pageNum, limit };
        if (seenFilter !== 'all') params.seen = seenFilter === 'seen' ? 'true' : 'false';
        const data = await getAllApplications(params);
        const docs = data?.data?.docs || [];
        setApplications(docs);
        setTotalPages(data?.data?.totalPages || 1);
        setTotalDocs(data?.data?.totalDocs || 0);
    };

    useEffect(() => {
        fetchApplications(page);
        // eslint-disable-next-line
    }, [page, seenFilter]); // Add seenFilter as dependency

    const handleRefresh = async () => {
        await fetchApplications(page);
    };

    const handleExpand = async (id) => {
        if (expandedId === id) {
            setExpandedId(null);
            resetApplication();
        } else {
            setExpandedId(id);
            await getApplicationById(id);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateApplicationStatus(id, status);
            setApplications((prev) =>
                prev.map((app) => (app._id === id ? { ...app, status } : app))
            );
        } catch (e) {}
    };

    const handleMarkAsSeen = async (id) => {
        try {
            await markAsSeen(id);
            setApplications((prev) =>
                prev.map((app) => (app._id === id ? { ...app, seen: true } : app))
            );
        } catch (e) {}
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;
        try {
            await deleteApplication(id);
            // If last item on page, go to previous page if not on first
            if (applications.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                await fetchApplications(page);
            }
            if (expandedId === id) setExpandedId(null);
        } catch (e) {
            alert('Failed to delete application. Please try again.');
        }
    };

    const handleCopyEmail = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30';
            case 'rejected':
                return 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30';
            case 'pending':
                return 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30';
            default:
                return 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30';
        }
    };

    const filteredApplications = applications
        .filter(
            (app) =>
                app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (app.position || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((app) => statusFilter === 'all' || app.status === statusFilter)
        // Remove seen filter here, as it's now handled by backend
        .sort((a, b) => {
            if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
        });

    // Export functionality
    const exportData = () => {
        const dataToExport = exportType === 'current' ? filteredApplications : applications;
        if (dataToExport.length === 0) {
            alert('No data to export');
            return;
        }
        let content = '';
        const headers = ['Name', 'Email', 'Position', 'Status', 'Seen', 'Created At'];
        if (exportFormat === 'csv') {
            content += headers.join(',') + '\n';
            dataToExport.forEach((app) => {
                content += `"${app.fullName}","${app.email}","${app.position || ''}","${app.status}","${app.seen ? 'Yes' : 'No'}","${new Date(app.createdAt).toLocaleString()}"\n`;
            });
            const blob = new Blob([content], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            const jsonData = dataToExport.map((app) => ({
                name: app.fullName,
                LpuId: app.LpuId,
                email: app.email,
                phone: app.phone,
                gender: app.gender,
                domains: app.domains?.join(', ') || '',
                accommodation: app.accommodation?.join(', ') || '',
                experience: app.previousExperience,
                anyOtherOrg: app.anyotherorg,
                bio: app.bio,
                seen: app.seen,
                status: app.status,
                createdAt: new Date(app.createdAt).toISOString(),
            }));
            const jsonString = JSON.stringify(jsonData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `applications-${new Date().toISOString().slice(0, 10)}.json`;
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
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
                                        ? `Exporting ${filteredApplications.length} filtered applications`
                                        : `Exporting all ${applications.length} applications`}
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
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Export Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Job Applications
                        </h1>
                        <p className="text-gray-400 mt-2">Manage all submitted job applications</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        <button
                            onClick={() => setShowExportOptions(true)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg flex items-center shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm transition-colors flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                            )}
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search applications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-800/50 backdrop-blur-lg rounded-xl py-2 pl-10 pr-4 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none w-52 shadow-lg shadow-cyan-500/10 transition-colors"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                    Clear filters
                                </button>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Sort by</label>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Status</label>
                                <div className="space-y-2">
                                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
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
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Seen Status</label>
                                <div className="space-y-2">
                                    {['all', 'seen', 'notseen'].map((seen) => (
                                        <div key={seen} className="flex items-center group">
                                            <input
                                                type="radio"
                                                id={`seen-${seen}`}
                                                name="seen"
                                                value={seen}
                                                checked={seenFilter === seen}
                                                onChange={() => setSeenFilter(seen)}
                                                className="mr-2 accent-cyan-500 cursor-pointer"
                                            />
                                            <label
                                                htmlFor={`seen-${seen}`}
                                                className="text-gray-300 capitalize cursor-pointer group-hover:text-white transition-colors"
                                            >
                                                {seen === 'all'
                                                    ? 'All'
                                                    : seen === 'seen'
                                                    ? 'Seen'
                                                    : 'Not Seen'}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300">Total Applications</span>
                                    <span className="text-white font-medium bg-gray-700/50 px-2 py-1 rounded-md">
                                        {totalDocs}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300">Unseen</span>
                                    <span className="text-cyan-400 font-medium bg-cyan-500/10 px-2 py-1 rounded-md">
                                        {applications.filter((app) => !app.seen).length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">Pending</span>
                                    <span className="text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded-md">
                                        {applications.filter((app) => app.status === 'pending').length}
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
                                <p className="text-gray-400">Loading applications...</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-900/30 backdrop-blur-lg rounded-2xl p-6 border border-red-700 shadow-xl">
                                <div className="flex items-center text-red-300">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-lg font-medium">
                                        Error loading applications: {error}
                                    </span>
                                </div>
                                <button
                                    onClick={reset}
                                    className="mt-4 px-4 py-2 bg-red-700/50 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Try Again
                                </button>
                            </div>
                        )}
                        {!loading && !error && (
                            <>
                                {filteredApplications.length === 0 ? (
                                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-xl text-center">
                                        <div className="flex justify-center mb-4">
                                            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-300 mb-2">
                                            No applications found
                                        </h3>
                                        <p className="text-gray-500 max-w-md mx-auto">
                                            {statusFilter !== 'all'
                                                ? `There are no applications with status "${statusFilter}" matching your search.`
                                                : 'No applications match your search criteria. Try adjusting your filters.'}
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
                                        {filteredApplications.map((apply) => (
                                            <div
                                                key={apply._id}
                                                className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30 ${
                                                    expandedId === apply._id ? 'ring-2 ring-cyan-500 border-cyan-500/50' : ''
                                                }`}
                                            >
                                                <div
                                                    className={`p-5 cursor-pointer transition-all duration-200 ${
                                                        apply.seen
                                                            ? ''
                                                            : 'bg-gradient-to-r from-cyan-900/10 to-blue-900/10 border-l-4 border-cyan-500'
                                                    }`}
                                                    onClick={() => handleExpand(apply._id)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center">
                                                                <h3 className="text-lg font-semibold text-white truncate">
                                                                    {apply.fullName}
                                                                </h3>
                                                                {!apply.seen && (
                                                                    <span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full animate-pulse flex items-center">
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                                        </svg>
                                                                        New
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center mt-1 text-sm">
                                                                <span className="text-gray-400 truncate flex items-center">
                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                    </svg>
                                                                    {apply.email}
                                                                </span>
                                                                <span className="mx-2 text-gray-600">•</span>
                                                                <span className="text-cyan-400 truncate flex items-center">
                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    {apply.position}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <div
                                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                                    apply.status
                                                                )}`}
                                                            >
                                                                {apply.status}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                {new Date(apply.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Delete Button */}
                                                    <div className="flex justify-end mt-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(apply._id);
                                                            }}
                                                            disabled={deleting}
                                                            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
                                                        >
                                                            {deleting ? (
                                                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            )}
                                                            {deleting ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </div>
                                                </div>
                                                {expandedId === apply._id && (
                                                    <div className="p-5 pt-0 bg-gray-900/50 border-t border-gray-700">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                                                                    Application Details
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <span className="text-gray-400">Full Name:</span>{' '}
                                                                        <span className="text-white">{apply.fullName}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-400">Email:</span>{' '}
                                                                        <span className="text-white">{apply.email}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-400">Phone:</span>{' '}
                                                                        <span className="text-white">{apply.phone}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-400">Position:</span>{' '}
                                                                        <span className="text-white">{apply.position}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-400">Status:</span>{' '}
                                                                        <span className={`text-sm font-medium ${getStatusColor(apply.status)}`}>
                                                                            {apply.status}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-400">Seen:</span>{' '}
                                                                        <span className="text-white">
                                                                            {apply.seen ? 'Yes' : 'No'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-400">Created At:</span>{' '}
                                                                        <span className="text-white">
                                                                            {new Date(apply.createdAt).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                                                                    Previous Experience
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {apply.previousExperience?.length > 0 ? (
                                                                        apply.previousExperience.map((exp, index) => (
                                                                            <div
                                                                                key={index}
                                                                                className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                                                                            >
                                                                                <div className="flex justify-between items-center mb-2">
                                                                                    <span className="text-gray-400 text-sm">
                                                                                        {exp.role}
                                                                                    </span>
                                                                                    <span className="text-xs font-medium text-gray-300">
                                                                                        {new Date(exp.from).toLocaleString()} -{' '}
                                                                                        {exp.to ? new Date(exp.to).toLocaleString() : 'Present'}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="text-gray-500 text-sm">
                                                                                    {exp.description}
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="text-gray-500 text-sm">
                                                                            No previous experience listed.
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <h4 className="text-sm font-semibold text-gray-300 mb-2">
                                                                Additional Information
                                                            </h4>
                                                            <div className="space-y-2">
                                                                <div>
                                                                    <span className="text-gray-400">Gender:</span>{' '}
                                                                    <span className="text-white">{apply.gender}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">Domains:</span>{' '}
                                                                    <span className="text-white">
                                                                        {apply.domains?.join(', ') || 'N/A'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">Accommodation:</span>{' '}
                                                                    <span className="text-white">
                                                                        {apply.accommodation?.join(', ') || 'N/A'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">Any Other Organization:</span>{' '}
                                                                    <span className="text-white">
                                                                        {apply.anyotherorg ? 'Yes' : 'No'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">Bio:</span>{' '}
                                                                    <span className="text-white">{apply.bio}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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

export default ShowApplies;
