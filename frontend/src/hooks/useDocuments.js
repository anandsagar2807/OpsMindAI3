import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuthContext';
import { documentAPI } from '../services/api';
import useUploadStore from '../store/uploadStore';
import toast from 'react-hot-toast';

export const useDocuments = (params = {}) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ['documents', params],
        queryFn: async () => {
            const token = await getToken();
            const response = await documentAPI.getAll(token, params);
            return response.data;
        },
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
};

export const useDocument = (id) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ['document', id],
        queryFn: async () => {
            const token = await getToken();
            const response = await documentAPI.getOne(id, token);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDocumentStatus = (id) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ['documentStatus', id],
        queryFn: async () => {
            const token = await getToken();
            const response = await documentAPI.getStatus(id, token);
            return response.data;
        },
        enabled: !!id,
        refetchInterval: (data) => {
            if (!data) return 2000;
            if (data.status === 'completed' || data.status === 'failed') return false;
            return 2000;
        },
        staleTime: 0,
    });
};

export const useUploadDocument = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();
    const { addUpload, updateUpload, setIsUploading } = useUploadStore();

    return useMutation({
        mutationFn: async ({ file, onProgress }) => {
            const token = await getToken();

            // file can be a raw File/Blob object or a pre-built FormData.
            // If it's a File, we wrap it in FormData here (single source of truth).
            const formData = file instanceof FormData ? file : new FormData();
            if (!(file instanceof FormData)) {
                formData.append('file', file);
            }

            const fileName = file instanceof FormData ? 'document' : file.name;
            const fileSize = file instanceof FormData ? 0 : file.size;

            const uploadId = `upload-${Date.now()}`;
            addUpload({ id: uploadId, fileName, fileSize, status: 'uploading', progress: 0 });

            const response = await documentAPI.upload(formData, token, onProgress);
            // After the response interceptor unwraps { success, data }, response.data
            // is the inner data object: { document: { id, ... }, uploadLogId }
            const docId = response.data?.document?.id || response.data?.document?._id;
            updateUpload(uploadId, { status: 'processing', progress: 50, documentId: docId });
            setIsUploading(false);

            return { ...response.data, uploadId };
        },
        onSuccess: (data) => {
            // Invalidate ALL related queries so every page refreshes consistently
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['documentStatus'] });

            if (data.uploadId) {
                useUploadStore.getState().updateUpload(data.uploadId, { status: 'completed', progress: 100 });
            }
        },
        onError: (error) => {
            setIsUploading(false);

            // Show user-friendly toast based on error type
            if (error.isNetworkError) {
                toast.error('Network error — unable to reach the server. Please check your connection and try again.', { duration: 6000 });
            } else if (error.isServerError) {
                toast.error('Server error — something went wrong on our end. Please try again later.', { duration: 6000 });
            } else {
                toast.error(error.message || 'Upload failed', { duration: 4000 });
            }

            // Still track in upload store for UI display
            useUploadStore.getState().addUpload({
                id: `upload-${Date.now()}`,
                fileName: 'document',
                fileSize: 0,
                status: 'failed',
                error: error.message,
            });
        },
    });
};

export const useDocumentInsights = (id) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ['documentInsights', id],
        queryFn: async () => {
            const token = await getToken();
            const response = await documentAPI.getInsights(id, token);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
};

export const useDeleteDocument = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }) => {
            const token = await getToken();
            const response = await documentAPI.delete(id, token);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate ALL related queries for consistent state refresh
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['documentStatus'] });
        },
        onError: (error) => {
            if (error.isNetworkError) {
                toast.error('Network error — could not delete document. Please try again.', { duration: 6000 });
            } else {
                toast.error(error.message || 'Failed to delete document', { duration: 4000 });
            }
        },
    });
};