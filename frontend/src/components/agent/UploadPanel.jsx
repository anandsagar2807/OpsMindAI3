import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
    Upload, FileText, X, CheckCircle, AlertCircle,
    Loader2, Trash2, ChevronDown, ChevronUp, UploadCloud
} from 'lucide-react';
import useUploadStore from '../../store/uploadStore';
import useUIStore from '../../store/uiStore';
import { useUploadDocument, useDocuments, useDeleteDocument, useDocumentStatus } from '../../hooks/useDocuments';
import toast from 'react-hot-toast';

const UploadPanel = () => {
    const { uploadPanelOpen, setUploadPanelOpen } = useUIStore();
    const { uploads, isUploading, dragActive, setDragActive, clearCompleted, getActiveUploads, getCompletedUploads } = useUploadStore();
    const uploadDocument = useUploadDocument();
    const { data: documentsData } = useDocuments();
    const deleteDocument = useDeleteDocument();

    const documents = documentsData?.documents || documentsData || [];
    const activeUploads = getActiveUploads();
    const completedUploads = getCompletedUploads();

    const onDrop = useCallback(async (acceptedFiles) => {
        for (const file of acceptedFiles) {
            if (file.type !== 'application/pdf') {
                toast.error(`Only PDF files are supported. "${file.name}" was rejected.`);
                continue;
            }
            if (file.size > 50 * 1024 * 1024) {
                toast.error(`File "${file.name}" exceeds 50MB limit.`);
                continue;
            }
            try {
                await uploadDocument.mutateAsync({ file });
                toast.success(`"${file.name}" uploaded successfully! Processing in background...`);
            } catch (error) {
                toast.error(`Failed to upload "${file.name}": ${error.message}`);
            }
        }
    }, [uploadDocument]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 5,
        maxSize: 50 * 1024 * 1024,
        onDragEnter: () => setDragActive(true),
        onDragLeave: () => setDragActive(false),
    });

    const handleDeleteDocument = async (docId, docName) => {
        try {
            await deleteDocument.mutateAsync(docId);
            toast.success(`"${docName}" deleted successfully`);
        } catch (error) {
            toast.error(`Failed to delete "${docName}"`);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle size={14} className="text-emerald-400" />;
            case 'failed':
                return <AlertCircle size={14} className="text-red-400" />;
            case 'uploading':
            case 'processing':
            case 'chunking':
            case 'embedding':
                return <Loader2 size={14} className="text-cyan-400 animate-spin" />;
            default:
                return <FileText size={14} className="text-gray-400" />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed': return 'Ready';
            case 'failed': return 'Failed';
            case 'uploading': return 'Uploading...';
            case 'processing': return 'Processing...';
            case 'chunking': return 'Chunking...';
            case 'embedding': return 'Embedding...';
            default: return status;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <AnimatePresence>
            {uploadPanelOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="border-b border-white/5 bg-[#060a14]/80"
                >
                    <div className="px-4 py-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <UploadCloud size={18} className="text-cyan-400" />
                                <h3 className="text-sm font-semibold text-white">Document Upload</h3>
                            </div>
                            <button
                                onClick={() => setUploadPanelOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronUp size={16} />
                            </button>
                        </div>

                        {/* Dropzone */}
                        <div
                            {...getRootProps()}
                            className={`relative rounded-xl border-2 transition-all cursor-pointer ${isDragActive
                                ? 'border-cyan-400 bg-cyan-500/10'
                                : 'border-white/10 bg-white/5 hover:border-cyan-500/30 hover:bg-white/[0.07]'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center py-6 px-4">
                                <motion.div
                                    animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Upload size={28} className={isDragActive ? 'text-cyan-400' : 'text-gray-400'} />
                                </motion.div>
                                <p className="text-sm text-gray-300 mt-2">
                                    {isDragActive ? 'Drop your PDF here' : 'Drag & drop PDF files here'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    or click to browse • Max 50MB per file
                                </p>
                            </div>
                        </div>

                        {/* Active Uploads */}
                        {activeUploads.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Processing</p>
                                {activeUploads.map((upload) => (
                                    <div key={upload.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
                                        {getStatusIcon(upload.status)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">{upload.fileName}</p>
                                            <p className="text-xs text-gray-500">{getStatusLabel(upload.status)}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{formatFileSize(upload.fileSize)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Document Library */}
                        {documents.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Document Library</p>
                                    {completedUploads.length > 0 && (
                                        <button
                                            onClick={clearCompleted}
                                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            Clear completed
                                        </button>
                                    )}
                                </div>
                                {documents.map((doc) => {
                                    const docId = doc._id || doc.id;
                                    return (
                                        <div key={docId} className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/[0.07] transition-colors">
                                            {getStatusIcon(doc.status)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{doc.originalName || doc.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-500">{getStatusLabel(doc.status)}</span>
                                                    {doc.totalChunks > 0 && (
                                                        <span className="text-xs text-gray-500">• {doc.totalChunks} chunks</span>
                                                    )}
                                                    {doc.totalPages > 0 && (
                                                        <span className="text-xs text-gray-500">• {doc.totalPages} pages</span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">{formatFileSize(doc.fileSize)}</span>
                                            <button
                                                onClick={() => handleDeleteDocument(docId, doc.originalName || doc.name)}
                                                className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UploadPanel;