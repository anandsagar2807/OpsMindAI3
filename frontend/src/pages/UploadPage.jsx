import { useState, useCallback } from 'react';
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
  Zap,
  File
} from 'lucide-react';
import { useUploadDocument } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuthContext';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export default function UploadPage() {
  const navigate = useNavigate();
  const [uploadQueue, setUploadQueue] = useState([]);
  const uploadMutation = useUploadDocument();
  const { getToken } = useAuth();

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const uploadItem = {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0,
        error: null,
      };

      setUploadQueue(prev => [...prev, uploadItem]);

      try {
        await uploadMutation.mutateAsync({
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

        setUploadQueue(prev => prev.map(item =>
          item.id === uploadItem.id ? { ...item, progress: 100, status: 'completed' } : item
        ));

        toast.success(`"${file.name}" uploaded successfully`);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Upload failed';
        setUploadQueue(prev => prev.map(item =>
          item.id === uploadItem.id ? { ...item, status: 'failed', error: errorMsg } : item
        ));
        toast.error(`Failed to upload "${file.name}": ${errorMsg}`);
      }
    }
  }, [uploadMutation]);

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
    <div className="max-w-[800px] mx-auto space-y-4">
      {/* ─── Header ─── */}
      <motion.div {...fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-white tracking-[-0.02em] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-violet-500/[0.10] border border-violet-500/[0.15] flex items-center justify-center">
              <Upload className="w-[16px] h-[16px] text-violet-400" />
            </div>
            Upload Documents
          </h1>
          <p className="text-[13px] text-gray-400/70 mt-1 ml-[42px]">Add PDFs to your knowledge base for AI-powered retrieval</p>
        </div>
        {completedCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/agent')}
            className="h-9 px-3.5 rounded-[8px] bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-[13px] shadow-md shadow-violet-500/20 flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-[14px] h-[14px]" />
            Start Chatting
          </motion.button>
        )}
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
          <div className="p-10 text-center">
            {/* Animated upload icon */}
            <motion.div
              animate={isDragActive ? { scale: 1.15, y: -6 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="w-14 h-14 rounded-[10px] bg-violet-500/[0.10] border border-violet-500/[0.15]
                flex items-center justify-center mx-auto mb-5"
            >
              <UploadCloud className="w-[28px] h-[28px] text-violet-400" />
            </motion.div>

            <h3 className="text-[16px] font-semibold text-white/90 mb-1.5">
              {isDragActive ? 'Drop your PDFs here' : 'Upload PDF Documents'}
            </h3>
            <p className="text-[13px] text-gray-400/70 mb-4">
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
                className="h-9 px-4 rounded-[8px] bg-gradient-to-r from-violet-500 to-indigo-600
                  text-white font-semibold text-[13px] shadow-md shadow-violet-500/20
                  inline-flex items-center gap-1.5"
              >
                <Upload className="w-[14px] h-[14px]" />
                Select Files
              </motion.button>
            )}

            {/* Upload info */}
            <div className="flex items-center justify-center gap-5 mt-5 text-[11px] text-gray-500/70">
              <div className="flex items-center gap-1">
                <FileText className="w-[13px] h-[13px]" />
                PDF only
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-[13px] h-[13px]" />
                Max 50MB per file
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-[13px] h-[13px]" />
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
            className="space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-white/90 flex items-center gap-1.5">
                <File className="w-[14px] h-[14px] text-violet-400" />
                Upload Queue
                <span className="text-[12px] text-gray-400/70 ml-0.5">({uploadQueue.length} files)</span>
              </h2>
              {completedCount + failedCount === uploadQueue.length && (
                <div className="flex items-center gap-1.5">
                  {completedCount > 0 && (
                    <span className="px-2 py-[3px] rounded-[6px] bg-emerald-500/[0.08] border border-emerald-500/[0.15] text-emerald-400 text-[11px] font-medium">
                      {completedCount} completed
                    </span>
                  )}
                  {failedCount > 0 && (
                    <span className="px-2 py-[3px] rounded-[6px] bg-red-500/[0.08] border border-red-500/[0.15] text-red-400 text-[11px] font-medium">
                      {failedCount} failed
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              {uploadQueue.map((item) => (
                <UploadQueueItem
                  key={item.id}
                  item={item}
                  onRemove={removeFromQueue}
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
        className="rounded-[12px] bg-white/[0.03] border border-white/[0.06] p-4"
      >
        <h3 className="text-[12px] font-semibold text-white/80 mb-3 flex items-center gap-1.5 uppercase tracking-[0.04em]">
          <Zap className="w-[13px] h-[13px] text-violet-400/70" />
          Processing Pipeline
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
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
    </div>
  );
}

function UploadQueueItem({ item, onRemove, formatFileSize }) {
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
      className={`flex items-center gap-2.5 p-3 rounded-[10px] ${config.bg} border ${config.border}`}
    >
      <config.icon className={`w-[18px] h-[18px] ${config.color} ${config.spin ? 'animate-spin' : ''}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-white/90 truncate leading-tight">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-gray-400/70">{formatFileSize(item.size)}</span>
          <span className={`text-[11px] font-medium ${config.color}`}>{config.label}</span>
          {item.status === 'uploading' || item.status === 'processing' ? (
            <div className="flex-1 max-w-[100px] h-[4px] rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                className="h-full rounded-full bg-violet-500/80"
              />
            </div>
          ) : null}
        </div>
        {item.error && <p className="text-[11px] text-red-400/80 mt-0.5">{item.error}</p>}
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 rounded-[6px] bg-white/[0.04] flex items-center justify-center text-gray-400/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
      >
        <X className="w-[14px] h-[14px]" />
      </button>
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
    <div className={`p-2.5 rounded-[8px] ${c.bg} ${c.border} border text-center`}>
      <div className="text-[10px] font-bold text-white/40 mb-0.5">Step {step}</div>
      <Icon className={`w-[18px] h-[18px] mx-auto mb-0.5 ${c.text}`} />
      <p className="text-[13px] font-semibold text-white/90 leading-tight">{label}</p>
      <p className="text-[11px] text-gray-400/70 mt-0.5 leading-tight">{desc}</p>
    </div>
  );
}