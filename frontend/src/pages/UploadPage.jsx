import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ArrowUpRight,
  Shield,
  Brain,
  Hash,
  Layers,
  BookOpen,
  ExternalLink,
  RefreshCw,
  Zap,
  File,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { useUploadDocument, useDocumentInsights } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuthContext';
import { documentAPI } from '../services/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export default function UploadPage() {
  const navigate = useNavigate();
  const [uploadQueue, setUploadQueue] = useState([]);
  const [insightsDocId, setInsightsDocId] = useState(null);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const uploadMutation = useUploadDocument();
  const { getToken } = useAuth();

  const onDrop = useCallback(async (acceptedFiles) => {
    // Pre-upload connectivity check: verify the backend is reachable before
    // attempting file uploads. This gives the user an immediate, actionable
    // error message instead of waiting for a timeout.
    try {
      await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(5000) });
    } catch (healthErr) {
      toast.error('Backend server is not reachable. Please ensure the server is running on port 5004 and try again.', { duration: 8000, id: 'backend-unreachable' });
      for (const file of acceptedFiles) {
        setUploadQueue(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          status: 'failed',
          progress: 0,
          error: 'Backend server is not reachable',
          documentId: null,
        }]);
      }
      return;
    }

    for (const file of acceptedFiles) {
      const uploadItem = {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0,
        error: null,
        documentId: null,
      };

      setUploadQueue(prev => [...prev, uploadItem]);

      try {
        const result = await uploadMutation.mutateAsync({
          file,
          onProgress: (progressEvent) => {
            const pct = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 30;
            setUploadQueue(prev => prev.map(item =>
              item.id === uploadItem.id ? { ...item, progress: pct } : item
            ));
          },
        });

        const docId = result?.document?.id || result?.document?._id || result?.id || result?.uploadId;

        setUploadQueue(prev => prev.map(item =>
          item.id === uploadItem.id ? { ...item, progress: 100, status: 'completed', documentId: docId } : item
        ));

        toast.success(`"${file.name}" uploaded successfully`);

        // Redirect to insights page after successful upload
        if (docId) {
          setTimeout(() => navigate(`/dashboard/insights/${docId}`), 800);
        }
      } catch (err) {
        const errorMsg = err.isNetworkError
          ? 'Network error — unable to reach the server'
          : err.isServerError
            ? 'Server error — something went wrong on our end'
            : (err.response?.data?.message || err.message || 'Upload failed');
        setUploadQueue(prev => prev.map(item =>
          item.id === uploadItem.id ? { ...item, status: 'failed', error: errorMsg } : item
        ));
        // NOTE: We do NOT show a toast here — the mutation's onError handler
        // in useDocuments.js already shows a categorized toast (network vs
        // server vs generic). Showing both would produce duplicate toasts.
      }
    }
  }, [uploadMutation, navigate]);

  // Fetch insights for the first completed document
  const fetchInsights = useCallback(async (docId) => {
    setInsightsDocId(docId);
    setInsightsLoading(true);
    setInsights(null);
    try {
      const token = await getToken();
      const response = await documentAPI.getInsights(docId, token);
      const data = response.data;
      if (data.insights) {
        setInsights(data);
      } else if (data.message) {
        // Document still processing, poll after delay
        setTimeout(() => {
          if (data.status !== 'completed') {
            fetchInsights(docId);
          }
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err);
    } finally {
      setInsightsLoading(false);
    }
  }, [getToken]);

  const handleViewInsights = (docId) => {
    fetchInsights(docId);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: true,
  });

  const removeFromQueue = (id) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  const retryUpload = useCallback(async (itemId) => {
    const item = uploadQueue.find(i => i.id === itemId);
    if (!item || !item.file) return;

    // Reset the item status to uploading
    setUploadQueue(prev => prev.map(i =>
      i.id === itemId ? { ...i, status: 'uploading', progress: 0, error: null } : i
    ));

    try {
      const result = await uploadMutation.mutateAsync({
        file: item.file,
        onProgress: (progressEvent) => {
          const pct = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 30;
          setUploadQueue(prev => prev.map(i =>
            i.id === itemId ? { ...i, progress: pct } : i
          ));
        },
      });

      const docId = result?.document?.id || result?.document?._id || result?.id || result?.uploadId;

      setUploadQueue(prev => prev.map(i =>
        i.id === itemId ? { ...i, progress: 100, status: 'completed', documentId: docId } : i
      ));

      toast.success(`"${item.name}" uploaded successfully`);

      if (docId) {
        setTimeout(() => navigate(`/dashboard/insights/${docId}`), 800);
      }
    } catch (err) {
      const errorMsg = err.isNetworkError
        ? 'Network error — unable to reach the server'
        : err.isServerError
          ? 'Server error — something went wrong on our end'
          : (err.response?.data?.message || err.message || 'Upload failed');
      setUploadQueue(prev => prev.map(i =>
        i.id === itemId ? { ...i, status: 'failed', error: errorMsg } : i
      ));
      // Toast is handled by mutation's onError — no duplicate toast here
    }
  }, [uploadQueue, uploadMutation, navigate]);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const completedCount = uploadQueue.filter(item => item.status === 'completed').length;
  const failedCount = uploadQueue.filter(item => item.status === 'failed').length;

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* ─── Header ─── */}
      <motion.div {...fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-white tracking-[-0.02em] flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-violet-500/[0.10] border border-violet-500/[0.15] flex items-center justify-center">
              <Upload className="w-[20px] h-[20px] text-violet-400" />
            </div>
            Upload Documents
          </h1>
          <p className="text-[15px] text-gray-400/70 mt-1.5 ml-[52px]">Add PDFs to your knowledge base for AI-powered retrieval</p>
        </div>
      </motion.div>

      {/* ─── Upload Zone ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          {...getRootProps()}
          className={`relative rounded-[12px] border-2 transition-all duration-300 cursor-pointer overflow-hidden
            ${isDragActive
              ? 'border-violet-500/[0.40] bg-violet-500/[0.06]'
              : 'border-white/[0.06] bg-white/[0.03] hover:border-violet-500/[0.20] hover:bg-violet-500/[0.03]'
            }`}
        >
          <div className="p-16 text-center">
            {/* Animated upload icon */}
            <motion.div
              animate={isDragActive ? { scale: 1.15, y: -6 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="w-[72px] h-[72px] rounded-[12px] bg-violet-500/[0.10] border border-violet-500/[0.15]
      flex items-center justify-center mx-auto mb-6"
            >
              <UploadCloud className="w-[36px] h-[36px] text-violet-400" />
            </motion.div>

            <h3 className="text-[20px] font-semibold text-white/90 mb-2">
              {isDragActive ? 'Drop your PDFs here' : 'Upload PDF Documents'}
            </h3>
            <p className="text-[15px] text-gray-400/70 mb-5">
              {isDragActive
                ? 'Release to start processing'
                : 'Drag & drop files here, or click to browse'
              }
            </p>

            <input {...getInputProps()} />

            {!isDragActive && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-11 px-5 rounded-[10px] bg-gradient-to-r from-violet-500 to-indigo-600
        text-white font-semibold text-[15px] shadow-md shadow-violet-500/20
        inline-flex items-center gap-2"
              >
                <Upload className="w-[16px] h-[16px]" />
                Select Files
              </motion.button>
            )}

            {/* Upload info */}
            <div className="flex items-center justify-center gap-6 mt-6 text-[13px] text-gray-500/70">
              <div className="flex items-center gap-1.5">
                <FileText className="w-[15px] h-[15px]" />
                PDF only
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-[15px] h-[15px]" />
                Max 50MB per file
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-[15px] h-[15px]" />
                Auto-processing
              </div>
            </div>
          </div>

          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>
      </motion.div>

      {/* ─── Upload Queue ─── */}
      <AnimatePresence>
        {uploadQueue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-white/90 flex items-center gap-2">
                <File className="w-[16px] h-[16px] text-violet-400" />
                Upload Queue
                <span className="text-[14px] text-gray-400/70 ml-0.5">({uploadQueue.length} files)</span>
              </h2>
              {completedCount + failedCount === uploadQueue.length && (
                <div className="flex items-center gap-2">
                  {completedCount > 0 && (
                    <span className="px-2.5 py-1 rounded-[6px] bg-emerald-500/[0.08] border border-emerald-500/[0.15] text-emerald-400 text-[13px] font-medium">
                      {completedCount} completed
                    </span>
                  )}
                  {failedCount > 0 && (
                    <span className="px-2.5 py-1 rounded-[6px] bg-red-500/[0.08] border border-red-500/[0.15] text-red-400 text-[13px] font-medium">
                      {failedCount} failed
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {uploadQueue.map((item) => (
                <UploadQueueItem
                  key={item.id}
                  item={item}
                  onRemove={removeFromQueue}
                  onRetry={retryUpload}
                  onViewInsights={handleViewInsights}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Processing Pipeline Info ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="rounded-[12px] bg-white/[0.03] border border-white/[0.06] p-6"
      >
        <h3 className="text-[14px] font-semibold text-white/80 mb-4 flex items-center gap-2 uppercase tracking-[0.04em]">
          <Zap className="w-[15px] h-[15px] text-violet-400/70" />
          Processing Pipeline
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { step: '1', label: 'Upload', desc: 'File received & stored', icon: UploadCloud, color: 'violet' },
            { step: '2', label: 'Parse', desc: 'PDF text extraction', icon: FileText, color: 'blue' },
            { step: '3', label: 'Chunk', desc: 'Smart text segmentation', icon: Zap, color: 'amber' },
            { step: '4', label: 'Embed', desc: 'Vector embedding generation', icon: Shield, color: 'emerald' },
          ].map((pipelineStep, i) => (
            <PipelineStep key={i} {...pipelineStep} />
          ))}
        </div>
      </motion.div>

      {/* ─── Insights Panel ─── */}
      <AnimatePresence>
        {(insightsLoading || insights) && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="rounded-[12px] bg-white/[0.03] border border-violet-500/[0.15] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-violet-500/[0.04]">
              <div className="w-10 h-10 rounded-[10px] bg-violet-500/[0.12] border border-violet-500/[0.18] flex items-center justify-center">
                {insightsLoading ? (
                  <RefreshCw className="w-[18px] h-[18px] text-violet-400 animate-spin" />
                ) : (
                  <Brain className="w-[18px] h-[18px] text-violet-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-semibold text-white/90">AI Document Insights</h3>
                <p className="text-[13px] text-gray-400/70">
                  {insightsLoading ? 'Analyzing document content...' : insights?.documentId ? `Document ID: ${insights.documentId.substring(0, 8)}...` : 'Analysis complete'}
                </p>
              </div>
              {!insightsLoading && (
                <button
                  onClick={() => { setInsights(null); setInsightsDocId(null); }}
                  className="w-8 h-8 rounded-[8px] bg-white/[0.04] flex items-center justify-center text-gray-400/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                >
                  <X className="w-[16px] h-[16px]" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              {insightsLoading ? (
                <div className="space-y-4">
                  {/* Skeleton shimmer */}
                  <div className="space-y-2.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-4 rounded-full bg-white/[0.05] animate-pulse" style={{ width: `${85 - i * 15}%` }} />
                    ))}
                  </div>
                  <div className="h-4 rounded-full bg-white/[0.05] animate-pulse w-3/4" />
                  <div className="space-y-2.5 mt-4 pt-4 border-t border-white/[0.04]">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 rounded-full bg-white/[0.05] animate-pulse" style={{ width: `${70 - i * 12}%` }} />
                    ))}
                  </div>
                </div>
              ) : insights ? (
                <div className="space-y-3">
                  {/* Quick stats */}
                  {insights.totalPages != null && insights.totalChunks != null && (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-white/[0.04] border border-white/[0.06]">
                        <BookOpen className="w-[15px] h-[15px] text-violet-400/70" />
                        <span className="text-[13px] text-gray-300">{insights.totalPages} pages</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-white/[0.04] border border-white/[0.06]">
                        <Layers className="w-[15px] h-[15px] text-violet-400/70" />
                        <span className="text-[13px] text-gray-300">{insights.totalChunks} chunks</span>
                      </div>
                    </div>
                  )}

                  {/* Insight text */}
                  <div className="rounded-[10px] bg-violet-500/[0.04] border border-violet-500/[0.10] p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-[18px] h-[18px] text-violet-400 shrink-0 mt-0.5" />
                      <p className="text-[15px] text-gray-300/90 leading-relaxed whitespace-pre-wrap">
                        {insights.insights || 'No insights available for this document.'}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => navigate('/documents')}
                      className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-violet-500/[0.10] border border-violet-500/[0.18] text-violet-400 hover:bg-violet-500/[0.18] hover:text-violet-300 text-[14px] font-medium transition-all duration-200"
                    >
                      <ExternalLink className="w-[14px] h-[14px]" />
                      View in Documents
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadQueueItem({ item, onRemove, onRetry, onViewInsights, formatFileSize }) {
  const statusConfig = {
    uploading: { icon: Upload, color: 'text-blue-400', bg: 'bg-blue-500/[0.08]', border: 'border-blue-500/[0.15]', label: 'Uploading' },
    processing: { icon: Loader2, color: 'text-amber-400', bg: 'bg-amber-500/[0.08]', border: 'border-amber-500/[0.15]', label: 'Processing', spin: true },
    completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/[0.15]', label: 'Completed' },
    failed: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/[0.08]', border: 'border-red-500/[0.15]', label: 'Failed' },
  };
  const config = statusConfig[item.status] || statusConfig.uploading;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`flex items-center gap-3 p-4 rounded-[10px] ${config.bg} border ${config.border}`}
    >
      <config.icon className={`w-[22px] h-[22px] ${config.color} ${config.spin ? 'animate-spin' : ''}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-white/90 truncate leading-tight">{item.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[13px] text-gray-400/70">{formatFileSize(item.size)}</span>
          <span className={`text-[13px] font-medium ${config.color}`}>{config.label}</span>
          {item.status === 'uploading' || item.status === 'processing' ? (
            <div className="flex-1 max-w-[140px] h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                className="h-full rounded-full bg-violet-500/80"
              />
            </div>
          ) : null}
        </div>
        {item.error && <p className="text-[13px] text-red-400/80 mt-1">{item.error}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.status === 'failed' && onRetry && (
          <button
            onClick={() => onRetry(item.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-violet-500/[0.12] border border-violet-500/[0.20] text-violet-400 hover:bg-violet-500/[0.20] hover:text-violet-300 text-[13px] font-medium transition-all duration-200"
            title="Retry upload"
          >
            <RefreshCw className="w-[14px] h-[14px]" />
            Retry
          </button>
        )}
        {item.status === 'completed' && item.documentId && onViewInsights && (
          <button
            onClick={() => onViewInsights(item.documentId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-violet-500/[0.12] border border-violet-500/[0.20] text-violet-400 hover:bg-violet-500/[0.20] hover:text-violet-300 text-[13px] font-medium transition-all duration-200"
            title="View AI Insights"
          >
            <Lightbulb className="w-[14px] h-[14px]" />
            Insights
          </button>
        )}
        <button
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 rounded-[8px] bg-white/[0.04] flex items-center justify-center text-gray-400/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
        >
          <X className="w-[16px] h-[16px]" />
        </button>
      </div>
    </motion.div>
  );
}

function PipelineStep({ step, label, desc, icon: Icon, color }) {
  const colorMap = {
    violet: { bg: 'bg-violet-500/[0.08]', border: 'border-violet-500/[0.15]', text: 'text-violet-400' },
    blue: { bg: 'bg-blue-500/[0.08]', border: 'border-blue-500/[0.15]', text: 'text-blue-400' },
    amber: { bg: 'bg-amber-500/[0.08]', border: 'border-amber-500/[0.15]', text: 'text-amber-400' },
    emerald: { bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/[0.15]', text: 'text-emerald-400' },
  };
  const c = colorMap[color] || colorMap.violet;

  return (
    <div className={`p-4 rounded-[10px] ${c.bg} ${c.border} border text-center`}>
      <div className="text-[12px] font-bold text-white/40 mb-1">Step {step}</div>
      <Icon className={`w-[24px] h-[24px] mx-auto mb-1 ${c.text}`} />
      <p className="text-[15px] font-semibold text-white/90 leading-tight">{label}</p>
      <p className="text-[13px] text-gray-400/70 mt-1 leading-tight">{desc}</p>
    </div>
  );
}