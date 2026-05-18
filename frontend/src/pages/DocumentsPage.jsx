import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useUser } from '@clerk/react'
import toast from 'react-hot-toast'
import {
  Upload,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  Download,
  Search,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { Card, Button, Badge } from '../components/ui'
import DashboardLayout from '../layouts/DashboardLayout'
import { documentAPI } from '../services/api'

const DocumentsPage = () => {
  const { user } = useUser()
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const token = await user?.getToken()
      console.log('[DocumentsPage] Token available:', !!token)
      console.log('[DocumentsPage] Token preview:', token?.substring(0, 20) + '...')
      const response = await documentAPI.getAll(token)
      console.log('[DocumentsPage] Response:', response.status, response.data)
      setDocuments(response.data.data || [])
    } catch (error) {
      console.error('[DocumentsPage] Failed to load documents:', error)
      console.error('[DocumentsPage] Error response:', error.response?.status, error.response?.data)
      console.error('[DocumentsPage] Error message:', error.message)
      toast.error(error.response?.data?.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 20971520,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return

      setUploading(true)
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])

      try {
        const token = await user?.getToken()
        await documentAPI.upload(formData, token)
        toast.success('Document uploaded successfully')
        loadDocuments()
      } catch (error) {
        console.error('Upload failed:', error)
        toast.error(error.response?.data?.message || 'Failed to upload document')
      } finally {
        setUploading(false)
      }
    }
  })

  const handleDelete = async (docId) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const token = await user?.getToken()
      await documentAPI.delete(docId, token)
      toast.success('Document deleted')
      loadDocuments()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error(error.response?.data?.message || 'Failed to delete document')
    }
  }

  // Filter and search documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter)
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(doc =>
        (doc.filename || doc.name || doc.originalName || '').toLowerCase().includes(query)
      )
    }

    return filtered
  }, [documents, searchQuery, statusFilter])

  // Document stats
  const docStats = useMemo(() => {
    return {
      total: documents.length,
      completed: documents.filter(d => d.status === 'completed').length,
      processing: documents.filter(d => d.status === 'processing').length,
      failed: documents.filter(d => d.status === 'failed').length
    }
  }, [documents])

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { variant: 'success', icon: CheckCircle2, text: 'Processed', color: 'green' }
      case 'processing':
        return { variant: 'warning', icon: Clock, text: 'Processing', color: 'yellow' }
      case 'failed':
        return { variant: 'error', icon: XCircle, text: 'Failed', color: 'red' }
      default:
        return { variant: 'warning', icon: Clock, text: status || 'Pending', color: 'yellow' }
    }
  }

  // Static color mappings for Tailwind JIT (dynamic classes won't work)
  const statusColorMap = {
    green: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400'
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400'
    },
    red: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400'
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
            <p className="text-slate-400">Manage your knowledge base documents</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            iconPosition="left"
            onClick={loadDocuments}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: docStats.total, color: 'from-blue-500 to-cyan-500' },
            { label: 'Completed', value: docStats.completed, color: 'from-green-500 to-emerald-500' },
            { label: 'Processing', value: docStats.processing, color: 'from-yellow-500 to-orange-500' },
            { label: 'Failed', value: docStats.failed, color: 'from-red-500 to-pink-500' }
          ].map((stat, idx) => (
            <Card key={idx} glass hover={true} className="text-center py-4">
              <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {loading ? '...' : stat.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Upload Zone */}
        <Card glass hover={true}>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-12
              transition-all duration-200 cursor-pointer
              ${isDragActive
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-700 hover:border-indigo-500/50 hover:bg-white/5'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {uploading ? 'Uploading...' : isDragActive ? 'Drop files here' : 'Upload Documents'}
              </h3>
              <p className="text-slate-400 mb-4">
                Drag & drop PDF files here, or click to browse
              </p>
              <p className="text-sm text-slate-500">
                Maximum file size: 20MB • Supported format: PDF
              </p>
            </div>
          </div>
        </Card>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-12 pr-4 py-3
                bg-slate-800/50 border border-slate-700
                rounded-xl text-white placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                transition-all
              "
            />
          </div>
          <div className="flex gap-2">
            {['all', 'completed', 'processing', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 mt-4">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                {searchQuery || statusFilter !== 'all'
                  ? 'No documents match your search criteria'
                  : 'No documents uploaded yet'}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first PDF to get started'}
              </p>
            </div>
          ) : (
            filteredDocuments.map((doc, index) => {
              const statusInfo = getStatusBadge(doc.status)
              const StatusIcon = statusInfo.icon
              return (
                <motion.div
                  key={doc._id || doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover={true} glass>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${statusColorMap[statusInfo.color]?.bg || 'bg-yellow-500/20'} ${statusColorMap[statusInfo.color]?.border || 'border-yellow-500/30'} border flex items-center justify-center`}>
                        <FileText className={`w-6 h-6 ${statusColorMap[statusInfo.color]?.text || 'text-yellow-400'}`} />
                      </div>
                      <Badge variant={statusInfo.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.text}
                      </Badge>
                    </div>

                    <h3 className="text-white font-semibold mb-2 truncate" title={doc.filename || doc.name || doc.originalName}>
                      {doc.filename || doc.name || doc.originalName}
                    </h3>

                    <div className="space-y-2 mb-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(doc.uploadedAt || doc.uploadDate || doc.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{doc.size || formatFileSize(doc.fileSize)}</span>
                        {doc.status === 'completed' && (
                          <span>{doc.pages || doc.totalPages || 0} pages • {doc.chunks || doc.totalChunks || doc.chunkCount || 0} chunks</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id || doc.id)}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DocumentsPage
