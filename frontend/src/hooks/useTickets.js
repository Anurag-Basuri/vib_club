import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';

// Hook to toggle ticket status
export const useToggleTicketStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleStatus = useCallback(async (ticketId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get(`/api/tickets/${ticketId}`);
            const newStatus = data.isUsed === true ? false : true;
            await apiClient.put(`/api/tickets/${ticketId}/status`, { isUsed: newStatus });
        } catch (err) {
            setError(err?.message || err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { toggleStatus, loading, error };
};

// Hook to get ticket by id
export const useTicketById = (ticketId) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTicket = useCallback(async () => {
        if (!ticketId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/api/tickets/${ticketId}`);
            setTicket(response.data);
        } catch (err) {
            setError(err?.message || err);
        } finally {
            setLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        fetchTicket();
    }, [fetchTicket]);

    return { ticket, loading, error, fetchTicket };
};
