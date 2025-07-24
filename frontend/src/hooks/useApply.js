import { useState, useEffect, useCallback } from 'react';
import { publicClient } from '../services/api';

const useApply = (applicationId) => {
    const [application, setApplication] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApplication = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await publicClient.get(`/api/applications/${applicationId}`);
            setApplication(response.data.application);
            setStatus(response.data.application.status);
        } catch (err) {
            setError(err?.message || err);
            setApplication(null);
            setStatus(null);
        } finally {
            setLoading(false);
        }
    }, [applicationId]);

    useEffect(() => {
        if (applicationId) {
            fetchApplication();
        }
    }, [applicationId, fetchApplication]);

    return { application, status, loading, error, setStatus, fetchApplication };
};

export default useApply;