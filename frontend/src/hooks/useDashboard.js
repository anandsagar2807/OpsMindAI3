import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../services/api';
import { useAuth } from './useAuthContext';

export const useDashboardStats = () => {
    const { getToken } = useAuth();
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const token = await getToken();
            const { data } = await dashboardAPI.getStats(token);
            return data;
        },
        staleTime: 30000,
        refetchInterval: 60000,
    });
};

export const useRecentActivity = (limit = 10) => {
    const { getToken } = useAuth();
    return useQuery({
        queryKey: ['dashboard', 'recent-activity', limit],
        queryFn: async () => {
            const token = await getToken();
            const { data } = await dashboardAPI.getRecentActivity(token, limit);
            return data;
        },
        staleTime: 15000,
        refetchInterval: 30000,
    });
};

export const useDocumentsOverview = () => {
    const { getToken } = useAuth();
    return useQuery({
        queryKey: ['dashboard', 'documents-overview'],
        queryFn: async () => {
            const token = await getToken();
            const { data } = await dashboardAPI.getDocumentsOverview(token);
            return data;
        },
        staleTime: 30000,
    });
};