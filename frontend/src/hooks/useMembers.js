import { useState, useCallback } from 'react';
import { publicClient, apiClient } from '../services/api.js';

// Utility for consistent error parsing
const parseError = (err) => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return "Unknown error occurred";
};

// Generic hook creator for member actions
const useMemberAction = (actionFn) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const action = useCallback(async (...args) => {
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
    }, [actionFn]);

    const reset = () => {
        setData(null);
        setError(null);
    };

    return { action, data, loading, error, reset };
};

// Get all members
export const useGetAllMembers = () => {
    const actionFn = async () => {
        const res = await publicClient.get('api/member/getall');
        return {
            members: res.data.data.members,
            total: res.data.data.totalMembers
        };
    };
    const { action: getAllMembers, data, loading, error, reset } = useMemberAction(actionFn);

    return {
        getAllMembers,
        members: data?.members || [],
        total: data?.total || 0,
        loading,
        error,
        reset
    };
};

// Get leaders
export const useGetLeaders = () => {
    const actionFn = async () => {
        const res = await publicClient.get('api/member/getleaders');
        return res.data.data.members;
    };
    const { action: getLeaders, data: leaders, loading, error, reset } = useMemberAction(actionFn);

    return { getLeaders, leaders: leaders || [], loading, error, reset };
};

// Ban member (admin only)
export const useBanMember = () => {
    const actionFn = async (id, reason, reviewTime, token) => {
        const res = await apiClient.put(
            `api/member/${id}/ban`,
            { reason, reviewTime },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.data.member;
    };
    const { action: banMember, data: member, loading, error, reset } = useMemberAction(actionFn);

    return { banMember, member, loading, error, reset };
};

// Remove member (admin only)
export const useRemoveMember = () => {
    const actionFn = async (id, reason, reviewTime, token) => {
        const res = await apiClient.put(
            `api/member/${id}/remove`,
            { reason, reviewTime },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.data.member;
    };
    const { action: removeMember, data: member, loading, error, reset } = useMemberAction(actionFn);

    return { removeMember, member, loading, error, reset };
};

// Unban member (admin only)
export const useUnbanMember = () => {
    const actionFn = async (id, token) => {
        const res = await apiClient.put(
            `api/member/${id}/unban`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.data.member;
    };
    const { action: unbanMember, data: member, loading, error, reset } = useMemberAction(actionFn);

    return { unbanMember, member, loading, error, reset };
};

// Get current member
export const useGetCurrentMember = () => {
    const actionFn = async (token) => {
        const res = await apiClient.get('api/member/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data.member;
    };
    const { action: getCurrentMember, data: member, loading, error, reset } = useMemberAction(actionFn);

    return { getCurrentMember, member, loading, error, reset };
};

// Update member by admin
export const useUpdateMemberByAdmin = () => {
    const actionFn = async (id, updateData, token) => {
        const res = await apiClient.put(
            `api/member/${id}/admin`,
            updateData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.data.member;
    };
    const { action: updateMemberByAdmin, data: member, loading, error, reset } = useMemberAction(actionFn);

    return { updateMemberByAdmin, member, loading, error, reset };
};