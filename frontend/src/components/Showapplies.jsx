import { useState, useEffect } from 'react';
import {
    useGetAllApplications,
    useGetApplicationById,
    useUpdateApplicationStatus,
    useDeleteApplication,
    useMarkApplicationAsSeen,
} from '../hooks/useApply.js';

const ShowApplies = () => {
    const { getAllApplications, applications, loading, error, reset } = useGetAllApplications();
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

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [exportType, setExportType] = useState('current');
    const [exportFormat, setExportFormat] = useState('csv');
    const [localApplications, setLocalApplications] = useState([]);

    // Fetch applications only once on mount
    useEffect(() => {
        getAllApplications({});
        // eslint-disable-next-line
    }, []);

    // When applications are fetched, set localApplications
    useEffect(() => {
        if (applications.length) setLocalApplications(applications);
    }, [applications]);

    // Optimistic update: update localApplications only, do NOT refetch all
    const handleMarkAsSeen = async (id) => {
        try {
            await markAsSeen(id);
            setLocalApplications((prev) =>
                prev.map((app) => (app._id === id ? { ...app, seen: true } : app))
            );
        } catch (e) {
            // handle error
        }
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
            setLocalApplications((prev) =>
                prev.map((app) => (app._id === id ? { ...app, status } : app))
            );
        } catch (e) {
            console.error('Error updating application status:', e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;
        try {
            await deleteApplication(id);
            setLocalApplications((prev) => prev.filter((app) => app._id !== id));
        } catch (e) {
            console.error('Error deleting application:', e);
        }
    };

    const toggleExpand = (id) => handleExpand(id);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-500/20 text-emerald-300';
            case 'rejected':
                return 'bg-rose-500/20 text-rose-300';
            case 'pending':
                return 'bg-amber-500/20 text-amber-300';
            default:
                return 'bg-blue-500/20 text-blue-300';
        }
    };

    const filteredApplications = localApplications
        .filter(
            (app) =>
                app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (app.position || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((app) => statusFilter === 'all' || app.status === statusFilter)
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

        // CSV format
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
        }
        // JSON format
        else {
            const jsonData = dataToExport.map((app) => ({
                name: app.fullName,
                email: app.email,
                position: app.position,
                status: app.status,
                seen: app.seen,
                createdAt: new Date(app.createdAt).toISOString(),
                phone: app.phone,
                experience: app.experience,
                coverLetter: app.coverLetter,
                resume: app.resume,
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
            {/* Confirmation Modal */}
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

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search applications..."
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
                                <label className="block text-gray-300 mb-2">Sort by</label>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">Status</label>
                                <div className="space-y-2">
                                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
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
                                    <span className="text-gray-300">Total Applications</span>
                                    <span className="text-white font-medium">
                                        {applications.length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-gray-300">Unseen</span>
                                    <span className="text-cyan-400 font-medium">
                                        {applications.filter((app) => !app.seen).length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-gray-300">Pending</span>
                                    <span className="text-amber-400 font-medium">
                                        {
                                            applications.filter((app) => app.status === 'pending')
                                                .length
                                        }
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
                                        Error loading applications: {error}
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
                                {filteredApplications.length === 0 ? (
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
                                            className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredApplications.map((apply) => (
                                            <div
                                                key={apply._id}
                                                className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-xl overflow-hidden transition-all duration-300 ${
                                                    expandedId === apply._id
                                                        ? 'ring-2 ring-cyan-500'
                                                        : ''
                                                }`}
                                            >
                                                <div
                                                    className={`p-5 cursor-pointer transition-all duration-200 ${
                                                        apply.seen
                                                            ? ''
                                                            : 'bg-gradient-to-r from-cyan-900/10 to-blue-900/10 border-l-4 border-cyan-500'
                                                    }`}
                                                    onClick={() => toggleExpand(apply._id)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center">
                                                                <h3 className="text-lg font-semibold text-white truncate">
                                                                    {apply.fullName}
                                                                </h3>
                                                                {!apply.seen && (
                                                                    <span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full animate-pulse">
                                                                        New
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center mt-1 text-sm">
                                                                <span className="text-gray-400 truncate">
                                                                    {apply.email}
                                                                </span>
                                                                <span className="mx-2 text-gray-600">
                                                                    •
                                                                </span>
                                                                <span className="text-cyan-400 truncate">
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
                                                            <div className="text-xs text-gray-500">
                                                                {new Date(
                                                                    apply.createdAt
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {expandedId === apply._id &&
                                                        selectedApplication && (
                                                            <div className="mt-4 pt-4 border-t border-gray-700">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="text-gray-400 text-sm font-medium mb-1">
                                                                            Cover Letter
                                                                        </h4>
                                                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                                                                            {selectedApplication.coverLetter ||
                                                                                'No cover letter provided'}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-gray-400 text-sm font-medium mb-1">
                                                                            Experience
                                                                        </h4>
                                                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                                                                            {selectedApplication.experience ||
                                                                                'No experience details provided'}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-gray-400 text-sm font-medium mb-1">
                                                                            Phone
                                                                        </h4>
                                                                        <p className="text-gray-300 text-sm">
                                                                            {selectedApplication.phone ||
                                                                                'Not provided'}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-gray-400 text-sm font-medium mb-1">
                                                                            Resume
                                                                        </h4>
                                                                        <p className="text-gray-300 text-sm">
                                                                            {selectedApplication.resume ? (
                                                                                <a
                                                                                    href={
                                                                                        selectedApplication.resume
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-cyan-400 hover:text-cyan-300 hover:underline"
                                                                                >
                                                                                    View Resume
                                                                                </a>
                                                                            ) : (
                                                                                'No resume uploaded'
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4 flex flex-wrap gap-2">
                                                                    <button
                                                                        className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition flex items-center"
                                                                        disabled={updatingStatus}
                                                                        onClick={() =>
                                                                            handleStatusUpdate(
                                                                                apply._id,
                                                                                'approved'
                                                                            )
                                                                        }
                                                                    >
                                                                        {updatingStatus && (
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
                                                                        )}
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        className="px-3 py-1.5 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition flex items-center"
                                                                        disabled={updatingStatus}
                                                                        onClick={() =>
                                                                            handleStatusUpdate(
                                                                                apply._id,
                                                                                'rejected'
                                                                            )
                                                                        }
                                                                    >
                                                                        {updatingStatus && (
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
                                                                        )}
                                                                        Reject
                                                                    </button>
                                                                    <button
                                                                        className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition flex items-center"
                                                                        onClick={() =>
                                                                            handleDelete(apply._id)
                                                                        }
                                                                        disabled={deleting}
                                                                    >
                                                                        {deleting && (
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
                                                                        )}
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                                {(errorStatus || errorDelete) && (
                                                                    <div className="text-red-400 mt-2">
                                                                        {errorStatus || errorDelete}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                </div>

                                                <div className="px-5 py-3 bg-gray-800/70 border-t border-gray-700 flex justify-between items-center">
                                                    <div>
                                                        {!apply.seen && (
                                                            <button
                                                                onClick={() =>
                                                                    handleMarkAsSeen(apply._id)
                                                                }
                                                                disabled={markLoading}
                                                                className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center"
                                                            >
                                                                {markLoading ? (
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
                                                                    'Mark as Seen'
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="text-xs text-gray-500">
                                                        ID: {apply._id}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {markError && (
                            <div className="mt-6 bg-red-900/30 backdrop-blur-lg rounded-2xl p-4 border border-red-700 shadow-xl flex items-center">
                                <svg
                                    className="w-6 h-6 text-red-400 mr-3"
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
                                <div>
                                    <p className="text-red-300">
                                        Error marking application: {markError}
                                    </p>
                                    <button
                                        onClick={resetMark}
                                        className="mt-1 text-sm text-red-400 hover:text-red-300"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowApplies;
