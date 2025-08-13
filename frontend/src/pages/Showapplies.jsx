import { useEffect } from "react";
import { useGetAllApplications, useMarkApplicationAsSeen } from "../hooks/useApply";
import { useAuth } from "../hooks/useAuth";

const ShowApplies = () => {
    const { user, token } = useAuth();
    const {
        getAllApplications,
        applications,
        loading,
        error,
        reset,
    } = useGetAllApplications();
    const {
        markAsSeen,
        loading: markLoading,
        error: markError,
        reset: resetMark,
    } = useMarkApplicationAsSeen();

    useEffect(() => {
        if (token) {
            getAllApplications({}, token);
        }
        // eslint-disable-next-line
    }, [token]);

    const handleMarkAsSeen = async (id) => {
        try {
            await markAsSeen(id, token);
            getAllApplications({}, token); // Refresh list after marking as seen
        } catch (e) {
            // Optionally handle error
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6">Applications</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <ul className="space-y-4">
                {applications.map((apply) => (
                    <li
                        key={apply._id}
                        className={`p-4 rounded border ${
                            apply.seen
                                ? "bg-gray-100 text-gray-700"
                                : "bg-blue-50 border-blue-400 text-blue-900"
                        } flex items-center justify-between`}
                    >
                        <div>
                            <div className="font-semibold">{apply.fullName}</div>
                            <div className="text-xs text-gray-500">{apply.email}</div>
                            <div className="text-xs">Status: {apply.status}</div>
                            {!apply.seen && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded">
                                    Unseen
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {!apply.seen && (
                                <button
                                    onClick={() => handleMarkAsSeen(apply._id)}
                                    disabled={markLoading}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                >
                                    {markLoading ? "Marking..." : "Mark as Seen"}
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            {markError && <div className="text-red-500 mt-4">{markError}</div>}
        </div>
    );
};

export default ShowApplies;
