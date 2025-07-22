import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

const useContact = (contactId) => {
    const [contact, setContact] = useState(null);
    const [resolved, setResolved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resolveContact = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(`/api/contacts/${contactId}/resolve`);
            setResolved(true);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [contactId]);

    useEffect(() => {
        const fetchContact = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/contacts/${contactId}`);
                setContact(response.data.contact);
                setResolved(response.data.contact?.resolved || false);
            } catch (err) {
                setError(err);
                setContact(null);
            } finally {
                setLoading(false);
            }
        };

        if (contactId) {
            fetchContact();
        }
    }, [contactId]);

    useEffect(() => {
        if (resolved) {
            resolveContact();
        }
    }, [resolved, resolveContact]);

    return { contact, loading, error, resolved, setResolved, resolveContact };
};

export default useContact;