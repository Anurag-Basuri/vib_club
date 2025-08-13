import { useState, useCallback } from 'react';
import { apiClient } from '../services/api.js';

// Utility for consistent error parsing
const parseError = (err) => {
	if (err?.data?.message) return err.data.message;
	if (err?.data?.error) return err.data.error;
	if (err?.message) return err.message;
	return 'Unknown error occurred';
};

// Generic hook for application actions
const useApplicationAction = (actionFn) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	const action = useCallback(
		async (...args) => {
			setLoading(true);
			setError(null);
			try {
				const result = await actionFn(...args);
				setData(result);
				return result;
			} catch (err) {
				setError(parseError(err));
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[actionFn]
	);

	const reset = () => {
		setData(null);
		setError(null);
	};

	return { action, data, loading, error, reset };
};

// Get all applications (admin)
export const useGetAllApplications = () => {
	const actionFn = async () => {
		const res = await apiClient.get('api/apply/applications');
		console.log('Applications fetched:', res.data);
		return res.data.data;
	};
	const {
		action: getAllApplications,
		data,
		loading,
		error,
		reset,
	} = useApplicationAction(actionFn);

	return {
		getAllApplications,
		applications: data?.data?.docs || [],
		total: data?.data?.totalDocs || 0,
		pagination: data?.data || {},
		loading,
		error,
		reset,
	};
};

// Get single application by ID (admin)
export const useGetApplicationById = () => {
	const actionFn = async (id) => {
		const res = await apiClient.get(`api/apply/applications/${id}`);
		return res.data;
	};
	const {
		action: getApplicationById,
		data: application,
		loading,
		error,
		reset,
	} = useApplicationAction(actionFn);

	return { getApplicationById, application: application?.data, loading, error, reset };
};

// Update application status (admin)
export const useUpdateApplicationStatus = () => {
	const actionFn = async (id, status) => {
		const res = await apiClient.patch(`api/apply/applications/${id}/status`, { status });
		return res.data;
	};
	const {
		action: updateApplicationStatus,
		data: updated,
		loading,
		error,
		reset,
	} = useApplicationAction(actionFn);

	return { updateApplicationStatus, updated: updated?.data, loading, error, reset };
};

// Mark application as seen (admin)
export const useMarkApplicationAsSeen = () => {
	const actionFn = async (id) => {
		const res = await apiClient.patch(`api/apply/applications/${id}/seen`, {});
		return res.data;
	};
	const {
		action: markAsSeen,
		data: updated,
		loading,
		error,
		reset,
	} = useApplicationAction(actionFn);

	return { markAsSeen, updated: updated?.data, loading, error, reset };
};

// Delete an application (admin)
export const useDeleteApplication = () => {
	const actionFn = async (id) => {
		const res = await apiClient.delete(`api/apply/applications/${id}/delete`);
		return res.data;
	};
	const {
		action: deleteApplication,
		data: deleted,
		loading,
		error,
		reset,
	} = useApplicationAction(actionFn);

	return { deleteApplication, deleted: deleted?.data, loading, error, reset };
};
