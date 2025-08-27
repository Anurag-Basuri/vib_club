import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';

// Utility for consistent error parsing
const parseError = (err) => {
	if (err?.data?.message) return err.data.message;
	if (err?.data?.error) return err.data.error;
	if (err?.message) return err.message;
	return 'Unknown error occurred';
};

// Generic hook for contact actions
const useContactAction = (actionFn) => {
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

// Get all contacts (admin)
export const useGetAllContacts = () => {
	const actionFn = async (params = {}) => {
		const res = await apiClient.get('/api/contact/getall', { params });
		return res.data;
	};
	const { action: getAllContacts, data, loading, error, reset } = useContactAction(actionFn);

	// Always return an array, even if data is undefined/null
	const contacts = Array.isArray(data?.data?.docs) ? data.data.docs : [];

	return {
		getAllContacts,
		contacts,
		loading,
		error,
		reset,
	};
};

// Get single contact by ID (admin)
export const useGetContactById = () => {
	const actionFn = async (id) => {
		const res = await apiClient.get(`/api/contact/${id}`);
		return res.data;
	};
	const {
		action: getContactById,
		data: contact,
		loading,
		error,
		reset,
	} = useContactAction(actionFn);

	return { getContactById, contact: contact?.data, loading, error, reset };
};

// Mark contact as resolved (admin)
export const useMarkContactAsResolved = () => {
	const actionFn = async (id) => {
		const res = await apiClient.patch(`/api/contact/${id}/resolve`);
		return res.data;
	};
	const {
		action: markAsResolved,
		data: updated,
		loading,
		error,
		reset,
	} = useContactAction(actionFn);

	return { markAsResolved, updated: updated?.data, loading, error, reset };
};

export const useDeleteContact = () => {
	const actionFn = async (id) => {
		const res = await apiClient.delete(`/api/contact/${id}`);
		return res.data;
	};
	const {
		action: deleteContact,
		data: deleted,
		loading,
		error,
		reset,
	} = useContactAction(actionFn);

	return { deleteContact, deleted: deleted?.data, loading, error, reset };
};
