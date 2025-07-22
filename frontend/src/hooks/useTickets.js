import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

// Hook to toggle ticket status
export const useToggleTicketStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleStatus = useCallback(async (ticketId) => {
        setLoading(true);
        setError(null);
        try {
            // Get current ticket status
            const { data } = await axios.get(`/api/tickets/${ticketId}`);
            const newStatus = data.isUsed === true ? false : true;
            await axios.put(`/api/tickets/${ticketId}/status`, { isUsed: newStatus });
        } catch (err) {
            setError(err);
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
            const response = await axios.get(`/api/tickets/${ticketId}`);
            setTicket(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        fetchTicket();
    }, [fetchTicket]);

    return { ticket, loading, error, fetchTicket };
};
