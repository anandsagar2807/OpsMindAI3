import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    Upload,
    Search,
    Filter,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Clock,
    Trash2,
    Eye,
    ArrowUpRight,
    Layers,
    Hash,
    File,
    BarChart3,
    RefreshCw,
    X,
    ChevronDown,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { useDocuments, useDeleteDocument } from '../hooks/useDocuments';
import { useDocumentsOverview } from '../hooks/useDashboard';
import toast from 'react-hot-toast';
import { getTimeAgo, formatFileSizeCompact } from '../utils/formatters';
import { COLORS } from '../config/constants';

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

function getStatusConfig(status) {
    const configs = {
        uploading: { icon: Upload, color: 'text-blue-400', bg: 'bg-blue-500/[0.08]', border: 'border-blue-500/[0.15]', label: 'Uploading' },
        processing: { icon: Loader2, color: 'text-amber-400', bg: 'bg-amber-500/[0.08]', border: 'border-amber-500/[0.15]', label: 'Processing', spin: true },
        chunking: { icon: Layers, color: 'text-amber-400', bg: 'bg-amber-500/[0.08]', border: 'border-amber-500/[0.15]', label: 'Chunking', spin: true },
        embedding: { icon: Hash, color: 'text-violet-400', bg: 'bg-violet-500/[0.08]', border: 'border-violet-500/[0.15]', label: 'Embedding', spin: true },
        completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/[0.15]', label: 'Completed' },
        failed: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/[0.08]', border: 'border-red-500/[0.15]', label: 'Failed' },
    };
    return configs[status] || configs.uploading;
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DocumentsPage() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');

    // Debounce the search input so we don't hammer the server on every keystroke.
    useEffect(() => {
        const handle = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
        return () => clearTimeout(handle);
    }, [searchInput]);

    // Build the query params for the server. Empty/defaults are omitted so the
    // queryKey stays stable when nothing is filtered.
    const queryParams = useMemo(() => {
        const params = { limit: 50 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (statusFilter !== 'all') params.status = statusFilter;
        params.sort = `${sortBy}:${sortDir}`;
        return params;
    }, [debouncedSearch, statusFilter, sortBy, sortDir]);

    const { data: documentsData, isLoading, isFetching, refetch } = useDocuments(queryParams);
    const { data: overviewData } = useDocumentsOverview();
    const deleteMutation = useDeleteDocument();

    const documents = documentsData?.documents || [];
    const pagination = documentsData?.pagination || null;
    const statusBreakdown = overviewData?.statusBreakdown || {};

    // The server already filters/sorts/paginates, so the displayed list is the
    // raw response. We keep the name for minimal churn in the JSX below.
    const filteredDocs = documents;

    const hasActiveFilters = debouncedSearch !== '' || statusFilter !== 'all' || sortBy !== 'createdAt' || sortDir !== 'desc';

    const clearFilters = () => {
        setSearchInput('');
        setDebouncedSearch('');
        setStatusFilter('all');
        setSortBy('createdAt');
        setSortDir('desc');
    };

    const toggleSortDir = () => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));

    const handleDelete = async (docId, docName) => {
        if (!window.confirm(`Delete "${docName}"? This action cannot be undone.`)) return;
        try {
            await deleteMutation.mutateAsync({ id: docId });
            toast.success(`"${docName}" deleted successfully`);
        } catch (err) {
            // Error toast is already handled by the mutation's onError
        }
    };

    // Status summary counts — prefer the dashboard overview (unfiltered totals),
    // fall back to counting the currently loaded page.
    const statusCounts = {
        completed: statusBreakdown.completed?.count || documents.filter(d => d.status === 'completed').length,
        processing: (statusBreakdown.processing?.count || 0) + (statusBreakdown.chunking?.count || 0) + (statusBreakdown.embedding?.count || 0) + documents.filter(d => ['processing', 'chunking', 'embedding'].includes(d.status)).length,
        failed: statusBreakdown.failed?.count || documents.filter(d => d.status === 'failed').length,
        total: statusBreakdown
            ? Object.values(statusBreakdown).reduce((sum, s) => sum + (s?.count || 0), 0)
            : documents.length,
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-4">
            {/* ─── Header ─── */}
            <motion.div {...fadeInUp} className="flex items-center justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-[-0.02em] flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[8px] bg-violet-500/[0.10] border border-violet-500/[0.15] flex items-center justify-center">
                            <FileText className="w-[16px] h-[16px] text-violet-400" />
                        </div>
                        Documents
                    </h1>
                    <p className="text-[13px] text-gray-400/70 mt-1 ml-[42px]">Manage your knowledge base documents</p>
                </div>
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => refetch()}
                        className="h-9 px-3 rounded-[8px] bg-white/[0.03] border border-white/[0.06] text-gray-400/80 hover:text-white hover:border-white/[0.10] transition-all duration-200 flex items-center gap-1.5 text-[13px] font-medium"
                    >
                        <RefreshCw className="w-[14px] h-[14px]" />
                        Refresh
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/dashboard/upload')}
                        className="h-9 px-3.5 rounded-[8px] bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-[13px] shadow-md shadow-violet-500/20 flex items-center gap-1.5"
                    >
                        <Upload className="w-[14px] h-[14px]" />
                        Upload New
                    </motion.button>
                </div>
            </motion.div>

            {/* ─── Status Summary Cards ─── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
                <StatusSummaryCard icon={File} label="Total Documents" count={statusCounts.total} color="violet" />
                <StatusSummaryCard icon={CheckCircle2} label="Completed" count={statusCounts.completed} color="emerald" />
                <StatusSummaryCard icon={Loader2} label="Processing" count={statusCounts.processing} color="amber" />
                <StatusSummaryCard icon={AlertCircle} label="Failed" count={statusCounts.failed} color="rose" />
            </motion.div>

            {/* ─── Search & Filter Bar ─── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-3"
            >
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search input (debounced) */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-gray-500/70" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by document name..."
                            className="w-full pl-9 pr-9 h-9 rounded-[8px] bg-white/[0.03] border border-white/[0.06]
                                text-white/90 placeholder-gray-500/60 text-[13px]
                                focus:outline-none focus:border-violet-500/[0.30] focus:ring-2 focus:ring-violet-500/[0.10] transition-all duration-200"
                        />
                        {searchInput && (
                            <button
                                onClick={() => setSearchInput('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] rounded-full bg-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-[10px] h-[10px]" />
                            </button>
                        )}
                    </div>

                    {/* Status filter */}
                    <div className="flex items-center gap-1.5">
                        <Filter className="w-[14px] h-[14px] text-gray-500/70" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-9 px-3 rounded-[8px] bg-white/[0.03] border border-white/[0.06] text-gray-300/80 text-[13px]
                                focus:outline-none focus:border-violet-500/[0.30] appearance-none cursor-pointer pr-8"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="processing">Processing</option>
                            <option value="chunking">Chunking</option>
                            <option value="embedding">Embedding</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    {/* Sort field */}
                    <div className="flex items-center gap-1.5">
                        <ArrowUpDown className="w-[14px] h-[14px] text-gray-500/70" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-9 px-3 rounded-[8px] bg-white/[0.03] border border-white/[0.06] text-gray-300/80 text-[13px]
                                focus:outline-none focus:border-violet-500/[0.30] appearance-none cursor-pointer pr-8"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                        >
                            <option value="createdAt">Date Added</option>
                            <option value="originalName">Name</option>
                            <option value="fileSize">File Size</option>
                            <option value="totalChunks">Chunks</option>
                            <option value="totalPages">Pages</option>
                        </select>
                    </div>

                    {/* Sort direction toggle */}
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={toggleSortDir}
                        title={sortDir === 'asc' ? 'Ascending — click for descending' : 'Descending — click for ascending'}
                        className="h-9 w-9 rounded-[8px] bg-white/[0.03] border border-white/[0.06] text-gray-300/80 hover:text-white hover:border-white/[0.10] transition-all duration-200 flex items-center justify-center"
                    >
                        {sortDir === 'asc' ? <ArrowUp className="w-[14px] h-[14px]" /> : <ArrowDown className="w-[14px] h-[14px]" />}
                    </motion.button>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={clearFilters}
                            className="h-9 px-3 rounded-[8px] bg-white/[0.03] border border-white/[0.06] text-gray-400/80 hover:text-white hover:border-white/[0.10] transition-all duration-200 flex items-center gap-1.5 text-[13px] font-medium"
                        >
                            <X className="w-[14px] h-[14px]" />
                            Clear
                        </motion.button>
                    )}
                </div>

                {/* Result count + live-fetching indicator */}
                <div className="flex items-center justify-between">
                    <p className="text-[12px] text-gray-500/70">
                        {isLoading ? (
                            'Searching…'
                        ) : pagination ? (
                            <>
                                Showing <span className="text-gray-300/90 font-medium tabular-nums">{filteredDocs.length}</span>
                                {' '}of{' '}
                                <span className="text-gray-300/90 font-medium tabular-nums">{pagination.total}</span>
                                {' '}document{pagination.total === 1 ? '' : 's'}
                                {debouncedSearch && <> for “<span className="text-gray-300/90">{debouncedSearch}</span>”</>}
                            </>
                        ) : (
                            `${filteredDocs.length} document${filteredDocs.length === 1 ? '' : 's'}`
                        )}
                    </p>
                    {isFetching && !isLoading && (
                        <Loader2 className="w-[13px] h-[13px] text-violet-400/70 animate-spin" />
                    )}
                </div>
            </motion.div>

            {/* ─── Documents Table ─── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="rounded-[12px] bg-white/[0.03] border border-white/[0.06] overflow-hidden"
            >
                {isLoading ? (
                    <div className="p-10 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                        <span className="ml-2.5 text-[13px] text-gray-400/70">Loading documents...</span>
                    </div>
                ) : filteredDocs.length > 0 ? (
                    <div className="overflow-x-auto">
                        {/* Table header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-2.5 border-b border-white/[0.05] text-[11px] font-semibold text-gray-400/60 uppercase tracking-[0.06em]">
                            <div className="col-span-4">Document</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Size</div>
                            <div className="col-span-2">Chunks</div>
                            <div className="col-span-2">Actions</div>
                        </div>

                        {/* Table rows */}
                        <div className="divide-y divide-white/[0.04]">
                            {filteredDocs.map((doc, i) => {
                                const statusConfig = getStatusConfig(doc.status);
                                return (
                                    <motion.div
                                        key={doc._id || i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-white/[0.03] transition-colors duration-200"
                                    >
                                        {/* Document name */}
                                        <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                                            <div className={`w-7 h-7 rounded-[6px] ${statusConfig.bg} ${statusConfig.border} border flex items-center justify-center ${statusConfig.color}`}>
                                                <statusConfig.icon className={`w-[14px] h-[14px] ${statusConfig.spin ? 'animate-spin' : ''}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-medium text-white/90 truncate leading-tight">{doc.originalName}</p>
                                                <p className="text-[11px] text-gray-500/70 leading-tight">{formatDate(doc.createdAt)}</p>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-[6px] text-[11px] font-medium ${statusConfig.bg} ${statusConfig.border} border ${statusConfig.color}`}>
                                                {statusConfig.label}
                                            </span>
                                        </div>

                                        {/* Size */}
                                        <div className="col-span-2 text-[13px] text-gray-300/80 tabular-nums">
                                            {formatFileSize(doc.fileSize)}
                                        </div>

                                        {/* Chunks */}
                                        <div className="col-span-2 text-[13px] text-gray-300/80">
                                            {doc.totalChunks > 0 ? (
                                                <span className="flex items-center gap-1">
                                                    <Hash className="w-[12px] h-[12px] text-violet-400/50" />
                                                    {doc.totalChunks}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500/50">—</span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2 flex items-center gap-1.5">
                                            <motion.button
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.92 }}
                                                onClick={() => handleDelete(doc._id, doc.originalName)}
                                                className="w-7 h-7 rounded-[6px] bg-red-500/[0.08] border border-red-500/[0.15] flex items-center justify-center text-red-400/80 hover:text-red-400 transition-colors duration-200"
                                                title="Delete document"
                                            >
                                                <Trash2 className="w-[14px] h-[14px]" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center">
                        <FileText className="w-10 h-10 text-gray-600/40 mx-auto mb-3" />
                        <p className="text-gray-400/80 text-[14px] font-medium">
                            {hasActiveFilters ? 'No documents match your filters' : 'No documents yet'}
                        </p>
                        <p className="text-gray-500/60 text-[12px] mt-1.5">
                            {hasActiveFilters
                                ? 'Try adjusting your search or filter criteria'
                                : 'Upload your first document to start building your knowledge base'
                            }
                        </p>
                        {hasActiveFilters ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={clearFilters}
                                className="mt-3 h-9 px-3.5 rounded-[8px] bg-white/[0.05] border border-white/[0.10] text-gray-300 font-medium text-[13px] flex items-center gap-1.5 mx-auto hover:bg-white/[0.08] transition-colors"
                            >
                                <X className="w-[14px] h-[14px]" />
                                Clear Filters
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/dashboard/upload')}
                                className="mt-3 h-9 px-3.5 rounded-[8px] bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-[13px] shadow-md shadow-violet-500/20 flex items-center gap-1.5 mx-auto"
                            >
                                <Upload className="w-[14px] h-[14px]" />
                                Upload Document
                            </motion.button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

function StatusSummaryCard({ icon: Icon, label, count, color }) {
    const colorMap = {
        violet: { bg: 'bg-violet-500/[0.08]', border: 'border-violet-500/[0.15]', icon: 'text-violet-400' },
        emerald: { bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/[0.15]', icon: 'text-emerald-400' },
        amber: { bg: 'bg-amber-500/[0.08]', border: 'border-amber-500/[0.15]', icon: 'text-amber-400' },
        rose: { bg: 'bg-rose-500/[0.08]', border: 'border-rose-500/[0.15]', icon: 'text-rose-400' },
    };
    const c = colorMap[color] || colorMap.violet;

    return (
        <div className={`rounded-[10px] ${c.bg} border ${c.border} p-3.5`}>
            <div className="flex items-center gap-2.5">
                <Icon className={`w-[18px] h-[18px] ${c.icon}`} />
                <div>
                    <p className="text-[18px] font-bold text-white/90 tabular-nums leading-tight">{count}</p>
                    <p className="text-[11px] text-gray-400/70 leading-tight">{label}</p>
                </div>
            </div>
        </div>
    );
}