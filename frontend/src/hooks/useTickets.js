import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';

// Utility for consistent error parsing
const parseError = (err) => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return "Unknown error occurred";
};

// Get ticket by ID
export const useGetTicketById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ticket, setTicket] = useState(null);

    const getTicketById = useCallback(async (ticketId, token) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(`/ticket/${ticketId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTicket(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(parseError(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = () => {
        setTicket(null);
        setError(null);
    };

    return { getTicketById, ticket, loading, error, reset };
};

// Update ticket status
export const useUpdateTicketStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ticket, setTicket] = useState(null);

    const updateTicketStatus = useCallback(async (ticketId, statusData, token) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.put(
                `/ticket/${ticketId}/status`,
                statusData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTicket(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(parseError(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = () => {
        setTicket(null);
        setError(null);
    };

    return { updateTicketStatus, ticket, loading, error, reset };
};

// Get all tickets for an event
export const useGetTicketsByEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tickets, setTickets] = useState([]);

    const getTicketsByEvent = useCallback(async (eventId, token) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(`/ticket/event/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(parseError(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = () => {
        setTickets([]);
        setError(null);
    };

    return { getTicketsByEvent, tickets, loading, error, reset };
};

// Delete a ticket
export const useDeleteTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const deleteTicket = useCallback(async (ticketId, token) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await apiClient.delete(`/ticket/${ticketId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
            return true;
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

    return { deleteTicket, success, loading, error, reset };
};
