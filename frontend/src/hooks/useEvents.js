import { useState, useCallback } from 'react';
import { apiClient, publicClient } from '../services/api';

// Utility for consistent error parsing
const parseError = (err) => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return "Unknown error occurred";
};

// Create Event (admin only)
export const useCreateEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [event, setEvent] = useState(null);

    const createEvent = useCallback(async (eventData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('api/event/create', eventData);
            setEvent(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(parseError(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = () => {
        setEvent(null);
        setError(null);
    };

    return { createEvent, event, loading, error, reset };
};

// Update Event (admin only)
export const useUpdateEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [event, setEvent] = useState(null);

    const updateEvent = useCallback(async (id, eventData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.put(`api/event/${id}/update`, eventData);
            setEvent(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(parseError(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = () => {
        setEvent(null);
        setError(null);
    };

    return { updateEvent, event, loading, error, reset };
};

// Delete Event (admin only)
export const useDeleteEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const deleteEvent = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await apiClient.delete(`api/event/${id}/delete`);
            setSuccess(true);
        } catch (err) {
            setError(parseError(err));
            setSuccess(false);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = () => {
        setSuccess(false);
        setError(null);
    };

    return { deleteEvent, success, loading, error, reset };
};

// Get All Events (public)
export const useGetAllEvents = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);

    const getAllEvents = useCallback(async (status) => {
        setLoading(true);
        setError(null);
        try {
            const res = await publicClient.get('api/event/getall', {
                params: status ? { status } : {}
            });
            setEvents(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(parseError(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = () => {
        setEvents([]);
        setError(null);
    };

    return { getAllEvents, events, loading, error, reset };
};

