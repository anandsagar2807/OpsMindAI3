import { create } from 'zustand';

const useUploadStore = create((set, get) => ({
    // Upload state
    uploads: [],
    isUploading: false,
    uploadProgress: 0,
    dragActive: false,

    // Actions
    setDragActive: (active) => set({ dragActive: active }),
    setIsUploading: (uploading) => set({ isUploading: uploading }),
    setUploadProgress: (progress) => set({ uploadProgress: progress }),

    addUpload: (upload) => set((state) => ({
        uploads: [...state.uploads, {
            ...upload,
            id: upload.id || `upload-${Date.now()}`,
            status: upload.status || 'uploading',
            progress: upload.progress || 0,
            createdAt: new Date().toISOString()
        }]
    })),

    updateUpload: (id, updates) => set((state) => ({
        uploads: state.uploads.map(u =>
            u.id === id ? { ...u, ...updates } : u
        )
    })),

    removeUpload: (id) => set((state) => ({
        uploads: state.uploads.filter(u => u.id !== id)
    })),

    clearCompleted: () => set((state) => ({
        uploads: state.uploads.filter(u => u.status !== 'completed' && u.status !== 'failed')
    })),

    getActiveUploads: () => {
        const { uploads } = get();
        return uploads.filter(u => u.status === 'uploading' || u.status === 'processing');
    },

    getCompletedUploads: () => {
        const { uploads } = get();
        return uploads.filter(u => u.status === 'completed');
    },
}));

export default useUploadStore;