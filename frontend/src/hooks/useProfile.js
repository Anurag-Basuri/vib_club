import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

const useProfile = (memberId) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/members/${memberId}`);
            setProfile(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [memberId]);

    useEffect(() => {
        if (memberId) {
            fetchProfile();
        }
    }, [fetchProfile, memberId]);

    return { profile, loading, error, refetch: fetchProfile };
}

export default useProfile;