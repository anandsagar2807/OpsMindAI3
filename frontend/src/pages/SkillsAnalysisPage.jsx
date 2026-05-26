import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud,
  FileText,
  X,
  Loader2,
  Sparkles,
  Brain,
  Target,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  FileType2,
  ArrowRight,
  Zap,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Shield,
  Eye,
  BookOpen,
  ClipboardCheck,
} from 'lucide-react';
import SkillsAnalysisResults from '../components/skills/SkillsAnalysisResults';
import { useAuth } from '../hooks/useAuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function SkillsAnalysisPage() {
  const { getToken } = useAuth();

  // ─── Upload State ───
  const [sopFile, setSopFile] = useState(null);
  const [standardsFile, setStandardsFile] = useState(null);
  const [sopText, setSopText] = useState('');
  const [standardsText, setStandardsText] = useState('');
  const [description, setDescription] = useState('');

  // ─── Input Mode Toggle ───
  const [sopInputMode, setSopInputMode] = useState('upload'); // 'upload' | 'paste'
  const [standardsInputMode, setStandardsInputMode] = useState('upload'); // 'upload' | 'paste'

  // ─── Analysis State ───
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    const allowedExtensions = ['.pdf', '.docx', '.txt'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      toast.error(`Unsupported format: "${ext}". Please use PDF, DOCX, or TXT.`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`File too large: ${formatFileSize(file.size)}. Maximum size is 5MB.`);
      return false;
    }
    return true;
  };

  // ─── SOP Document Dropzone ───
  const onSopDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && validateFile(file)) {
      setSopFile(file);
      setSopText('');
      toast.success(`SOP document "${file.name}" ready for analysis`);
    }
  }, []);

  const sopDropzone = useDropzone({
    onDrop: onSopDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  // ─── Compliance Standards Dropzone ───
  const onStandardsDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && validateFile(file)) {
      setStandardsFile(file);
      setStandardsText('');
      toast.success(`Standards document "${file.name}" ready for analysis`);
    }
  }, []);

  const standardsDropzone = useDropzone({
    onDrop: onStandardsDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  // ─── Analyze Handler ───
  const handleAnalyze = async () => {
    // Validation
    if (!sopFile && !sopText.trim()) {
      toast.error('Please upload an SOP document or paste SOP content');
      return;
    }
    if (!standardsFile && !standardsText.trim()) {
      toast.error('Please upload compliance standards or paste standards content');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResults(null);

    try {
      const token = await getToken();
      const formData = new FormData();

      if (sopFile) formData.append('sopDocument', sopFile);
      if (standardsFile) formData.append('standardsDocument', standardsFile);
      if (sopText.trim()) formData.append('sopText', sopText.trim());
      if (standardsText.trim()) formData.append('standardsText', standardsText.trim());
      if (description.trim()) formData.append('query', description.trim());

      const response = await api.post('/api/skills/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        timeout: 60000,
      });

      setAnalysisResults(response.data);
      toast.success('Analysis complete! Review your operational insights below.');
    } catch (err) {
      const errorMsg = err.message || 'Analysis failed. Please try again.';
      setAnalysisError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze =
    (sopFile || sopText.trim()) && (standardsFile || standardsText.trim()) && !isAnalyzing;

  const clearResults = () => {
    setAnalysisResults(null);
    setAnalysisError(null);
  };

  return (
    <div className="min-h-screen bg-[#06080d]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ─── Page Header ─── */}
        <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 mb-6">
            <Brain className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-violet-300 tracking-wide">
              OpsMind Intelligence
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.02em] text-white mb-4">
            Analyze Your{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Operational Knowledge
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload your SOP documents and compliance standards to discover alignment gaps,
            coverage insights, and operational readiness. Ask specific questions and get
            AI-powered answers grounded in your enterprise knowledge.
          </p>
        </motion.div>

        {/* ─── Main Content ─── */}
        <AnimatePresence mode="wait">
          {!analysisResults ? (
            <motion.div
              key="input-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* ─── Two Upload Zones ─── */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8"
              >
                {/* ─── SOP Document Upload Zone ─── */}
                <motion.div variants={fadeInUp}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-violet-400" />
                      </div>
                      <h2 className="text-lg font-bold text-white">SOP Document</h2>
                    </div>
                    {/* ─── Upload/Paste Toggle ─── */}
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      <button
                        onClick={() => setSopInputMode('upload')}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
                          ${sopInputMode === 'upload'
                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/25 shadow-sm shadow-violet-500/10'
                            : 'text-gray-500 hover:text-gray-300'
                          }
                        `}
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        Upload
                      </button>
                      <button
                        onClick={() => setSopInputMode('paste')}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
                          ${sopInputMode === 'paste'
                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/25 shadow-sm shadow-violet-500/10'
                            : 'text-gray-500 hover:text-gray-300'
                          }
                        `}
                      >
                        <ClipboardPaste className="w-3.5 h-3.5" />
                        Paste
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {sopInputMode === 'upload' ? (
                      <motion.div
                        key="sop-upload"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                      >
                        {!sopFile ? (
                          <div
                            {...sopDropzone.getRootProps()}
                            className={`
                              group relative cursor-pointer rounded-2xl border-2 transition-all duration-300 ease-out
                              ${sopDropzone.isDragActive
                                ? 'border-violet-400/60 bg-violet-500/[0.08] scale-[1.02]'
                                : 'border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] hover:border-violet-500/30 hover:bg-violet-500/[0.04]'
                              }
                            `}
                          >
                            <input {...sopDropzone.getInputProps()} />

                            {/* Animated background pattern */}
                            <div className="absolute inset-0 rounded-2xl opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]"
                              style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139,92,246,0.4) 1px, transparent 0)`,
                                backgroundSize: '20px 20px',
                              }}
                            />

                            <div className="relative flex flex-col items-center justify-center py-12 sm:py-16 px-6">
                              {/* Upload icon with animated ring */}
                              <div className="relative mb-6">
                                <div className={`
                                  absolute -inset-4 rounded-2xl transition-all duration-500
                                  ${sopDropzone.isDragActive
                                    ? 'bg-violet-500/20 blur-xl'
                                    : 'bg-violet-500/[0.04] blur-lg group-hover:bg-violet-500/10 group-hover:blur-xl'
                                  }
                                `} />
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-[1.05] group-hover:border-violet-500/40">
                                  <BookOpen className={`
                                    w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300
                                    ${sopDropzone.isDragActive
                                      ? 'text-violet-300 scale-110'
                                      : 'text-violet-400/70 group-hover:text-violet-300'
                                    }
                                  `} />
                                </div>
                              </div>

                              <p className={`
                                text-base sm:text-lg font-semibold text-center mb-2 transition-colors duration-300
                                ${sopDropzone.isDragActive
                                  ? 'text-violet-300'
                                  : 'text-gray-300 group-hover:text-white'
                                }
                              `}>
                                {sopDropzone.isDragActive
                                  ? 'Drop your SOP document here'
                                  : 'Drag & drop your SOP document'
                                }
                              </p>

                              <p className="text-sm text-gray-500 text-center mb-4">
                                or click to browse files
                              </p>

                              {/* Format badges */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/15">
                                  PDF
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/15">
                                  DOCX
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                                  TXT
                                </span>
                              </div>

                              <p className="text-xs text-gray-600">
                                Maximum file size: 5MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* ─── File Selected State ─── */
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.06] to-indigo-500/[0.04] p-6"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/25 flex items-center justify-center shrink-0">
                                <FileType2 className="w-6 h-6 text-violet-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                  {sopFile.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatFileSize(sopFile.size)} • Ready for analysis
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <button
                                  onClick={() => setSopFile(null)}
                                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      /* ─── Paste Text Mode ─── */
                      <motion.div
                        key="sop-paste"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] overflow-hidden">
                          <textarea
                            value={sopText}
                            onChange={(e) => setSopText(e.target.value)}
                            placeholder="Paste your SOP document content here — procedures, workflows, operational guidelines..."
                            rows={10}
                            className="w-full bg-transparent text-gray-200 placeholder-gray-600 text-sm leading-relaxed p-5 resize-y focus:outline-none min-h-[200px]"
                          />
                          {sopText.trim() && (
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/15">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-xs font-medium text-emerald-400">
                                {sopText.trim().length} chars
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* ─── Compliance Standards Upload Zone ─── */}
                <motion.div variants={fadeInUp}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h2 className="text-lg font-bold text-white">Compliance Standards</h2>
                    </div>
                    {/* ─── Upload/Paste Toggle ─── */}
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      <button
                        onClick={() => setStandardsInputMode('upload')}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
                          ${standardsInputMode === 'upload'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 shadow-sm shadow-cyan-500/10'
                            : 'text-gray-500 hover:text-gray-300'
                          }
                        `}
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        Upload
                      </button>
                      <button
                        onClick={() => setStandardsInputMode('paste')}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
                          ${standardsInputMode === 'paste'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 shadow-sm shadow-cyan-500/10'
                            : 'text-gray-500 hover:text-gray-300'
                          }
                        `}
                      >
                        <ClipboardPaste className="w-3.5 h-3.5" />
                        Paste
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {standardsInputMode === 'upload' ? (
                      <motion.div
                        key="standards-upload"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                      >
                        {!standardsFile ? (
                          <div
                            {...standardsDropzone.getRootProps()}
                            className={`
                              group relative cursor-pointer rounded-2xl border-2 transition-all duration-300 ease-out
                              ${standardsDropzone.isDragActive
                                ? 'border-cyan-400/60 bg-cyan-500/[0.08] scale-[1.02]'
                                : 'border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04]'
                              }
                            `}
                          >
                            <input {...standardsDropzone.getInputProps()} />

                            {/* Animated background pattern */}
                            <div className="absolute inset-0 rounded-2xl opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]"
                              style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34,211,238,0.4) 1px, transparent 0)`,
                                backgroundSize: '20px 20px',
                              }}
                            />

                            <div className="relative flex flex-col items-center justify-center py-12 sm:py-16 px-6">
                              {/* Upload icon with animated ring */}
                              <div className="relative mb-6">
                                <div className={`
                                  absolute -inset-4 rounded-2xl transition-all duration-500
                                  ${standardsDropzone.isDragActive
                                    ? 'bg-cyan-500/20 blur-xl'
                                    : 'bg-cyan-500/[0.04] blur-lg group-hover:bg-cyan-500/10 group-hover:blur-xl'
                                  }
                                `} />
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-[1.05] group-hover:border-cyan-500/40">
                                  <Shield className={`
                                    w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300
                                    ${standardsDropzone.isDragActive
                                      ? 'text-cyan-300 scale-110'
                                      : 'text-cyan-400/70 group-hover:text-cyan-300'
                                    }
                                  `} />
                                </div>
                              </div>

                              <p className={`
                                text-base sm:text-lg font-semibold text-center mb-2 transition-colors duration-300
                                ${standardsDropzone.isDragActive
                                  ? 'text-cyan-300'
                                  : 'text-gray-300 group-hover:text-white'
                                }
                              `}>
                                {standardsDropzone.isDragActive
                                  ? 'Drop the compliance standards here'
                                  : 'Drag & drop compliance standards'
                                }
                              </p>

                              <p className="text-sm text-gray-500 text-center mb-4">
                                or click to browse files
                              </p>

                              {/* Format badges */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/15">
                                  PDF
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/15">
                                  DOCX
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                                  TXT
                                </span>
                              </div>

                              <p className="text-xs text-gray-600">
                                Maximum file size: 5MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* ─── File Selected State ─── */
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.06] to-blue-500/[0.04] p-6"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/25 flex items-center justify-center shrink-0">
                                <FileType2 className="w-6 h-6 text-cyan-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                  {standardsFile.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatFileSize(standardsFile.size)} • Ready for analysis
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <button
                                  onClick={() => setStandardsFile(null)}
                                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      /* ─── Paste Text Mode ─── */
                      <motion.div
                        key="standards-paste"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] overflow-hidden">
                          <textarea
                            value={standardsText}
                            onChange={(e) => setStandardsText(e.target.value)}
                            placeholder="Paste compliance standards, regulatory requirements, or operational benchmarks here..."
                            rows={10}
                            className="w-full bg-transparent text-gray-200 placeholder-gray-600 text-sm leading-relaxed p-5 resize-y focus:outline-none min-h-[200px]"
                          />
                          {standardsText.trim() && (
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/15">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-xs font-medium text-emerald-400">
                                {standardsText.trim().length} chars
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* ─── Description / Questions Text Box ─── */}
              <motion.div {...fadeInUp} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Description</h2>
                  <span className="text-xs text-gray-600 ml-2">Optional</span>
                </div>

                <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] overflow-hidden">
                  {/* Subtle top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add supplementary context, specific questions, or queries you want OpsMind to address. For example: 'What compliance gaps exist in our SOPs?' or 'How well do our procedures cover ISO 9001 requirements?'"
                    rows={6}
                    className="w-full bg-transparent text-gray-200 placeholder-gray-600 text-sm leading-relaxed p-5 pt-6 resize-y focus:outline-none min-h-[160px]"
                  />

                  {description.trim() && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/15">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-medium text-indigo-400">
                        {description.trim().length} chars
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* ─── Input Status Summary ─── */}
              <motion.div {...fadeInUp} className="mb-8">
                <div className="flex items-center gap-4 sm:gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    {sopFile || sopText.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                    )}
                    <span className={`text-sm font-medium ${sopFile || sopText.trim() ? 'text-emerald-400' : 'text-gray-600'}`}>
                      SOP Document
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {standardsFile || standardsText.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                    )}
                    <span className={`text-sm font-medium ${standardsFile || standardsText.trim() ? 'text-emerald-400' : 'text-gray-600'}`}>
                      Standards
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {description.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                    )}
                    <span className={`text-sm font-medium ${description.trim() ? 'text-indigo-400' : 'text-gray-600'}`}>
                      Questions
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* ─── Error Display ─── */}
              <AnimatePresence>
                {analysisError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-8 p-4 rounded-xl bg-red-500/[0.08] border border-red-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <p className="text-sm text-red-300">{analysisError}</p>
                      <button
                        onClick={() => setAnalysisError(null)}
                        className="ml-auto text-gray-500 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ─── Analyze Button ─── */}
              <motion.div {...fadeInUp} className="flex justify-center">
                <motion.button
                  whileHover={canAnalyze ? { scale: 1.03 } : {}}
                  whileTap={canAnalyze ? { scale: 0.97 } : {}}
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className={`
                    relative group overflow-hidden rounded-2xl font-bold text-base sm:text-lg
                    px-10 sm:px-14 py-4 sm:py-5
                    transition-all duration-300
                    flex items-center justify-center gap-3
                    ${canAnalyze
                      ? 'text-white shadow-[0_8px_40px_rgba(139,92,246,0.35)] hover:shadow-[0_12px_50px_rgba(139,92,246,0.5)]'
                      : 'text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {/* Animated gradient background */}
                  {canAnalyze && (
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-[length:200%_100%] animate-gradient-x" />
                  )}
                  {!canAnalyze && (
                    <span className="absolute inset-0 bg-white/[0.03]" />
                  )}

                  {/* Shimmer sweep on hover */}
                  {canAnalyze && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  )}

                  {/* Top accent line */}
                  {canAnalyze && (
                    <span className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}

                  {/* Border */}
                  <span className={`
                    absolute inset-0 rounded-2xl border transition-all duration-300
                    ${canAnalyze
                      ? 'border-violet-400/25 group-hover:border-violet-400/50'
                      : 'border-white/[0.06]'
                    }
                  `} />

                  <span className="relative flex items-center gap-3 z-10">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Operational Knowledge...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analyze
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>

              {/* ─── Feature Highlights ─── */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 sm:mt-14"
              >
                {[
                  {
                    icon: ClipboardCheck,
                    title: 'SOP Alignment',
                    desc: 'Discover how your procedures align with compliance and regulatory standards',
                    color: 'violet',
                  },
                  {
                    icon: Shield,
                    title: 'Gap Detection',
                    desc: 'Identify missing procedures, incomplete coverage, and compliance risks',
                    color: 'cyan',
                  },
                  {
                    icon: Eye,
                    title: 'Custom Insights',
                    desc: 'Get answers to your specific questions about operational readiness',
                    color: 'indigo',
                  },
                ].map((feature) => (
                  <motion.div
                    key={feature.title}
                    variants={fadeInUp}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group"
                  >
                    <feature.icon className={`
                      w-5 h-5 mb-3 transition-colors duration-300
                      ${feature.color === 'violet' ? 'text-violet-400/70 group-hover:text-violet-400' : ''}
                      ${feature.color === 'cyan' ? 'text-cyan-400/70 group-hover:text-cyan-400' : ''}
                      ${feature.color === 'indigo' ? 'text-indigo-400/70 group-hover:text-indigo-400' : ''}
                    `} />
                    <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            /* ─── Results View ─── */
            <motion.div
              key="results-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SkillsAnalysisResults
                results={analysisResults}
                onReset={clearResults}
                isAnalyzing={isAnalyzing}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}