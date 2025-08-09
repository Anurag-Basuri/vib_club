import { useState, useCallback } from 'react';
import { publicClient, privateClient } from '../services/api';

// Create Event (admin only)
export const useCreateEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [event, setEvent] = useState(null);

    const createEvent = useCallback(async (eventData, token) => {
        setLoading(true);
        setError(null);
        try {
            const res = await privateClient.post('/event/create', eventData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvent(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createEvent, event, loading, error };
};

// Update Event (admin only)
export const useUpdateEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [event, setEvent] = useState(null);

    const updateEvent = useCallback(async (id, eventData, token) => {
        setLoading(true);
        setError(null);
        try {
            const res = await privateClient.put(`/event/${id}/update`, eventData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvent(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateEvent, event, loading, error };
};

// Delete Event (admin only)
export const useDeleteEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const deleteEvent = useCallback(async (id, token) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await privateClient.delete(`/event/${id}/delete`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteEvent, success, loading, error };
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
            const res = await publicClient.get('/event/getall', {
                params: status ? { status } : {}
            });
            setEvents(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getAllEvents, events, loading, error };
};

