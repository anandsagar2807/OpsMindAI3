import { useState, useEffect } from 'react'
import { FileText, Trash2, Eye, Loader, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [vectors, setVectors] = useState([])
  const [loadingVectors, setLoadingVectors] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents')
      setDocuments(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch documents')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await api.delete(`/documents/${id}`)
      toast.success('Document deleted successfully')
      setDocuments(documents.filter(doc => doc._id !== id))
      if (selectedDoc?._id === id) {
        setSelectedDoc(null)
        setVectors([])
      }
    } catch (error) {
      toast.error('Failed to delete document')
    }
  }

  const handleViewVectors = async (doc) => {
    setSelectedDoc(doc)
    setLoadingVectors(true)
    try {
      const response = await api.get(`/documents/${doc._id}/vectors`)
      setVectors(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch vectors')
    } finally {
      setLoadingVectors(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing':
        return <Loader className="w-5 h-5 text-primary-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-dark-400" />
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-500/10 text-green-400 border-green-500/20',
      processing: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
      failed: 'bg-red-500/10 text-red-400 border-red-500/20'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Documents</h1>
        <p className="text-dark-400">Manage your uploaded SOP documents and view their vectors</p>
      </div>

      {documents.length === 0 ? (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <FileText className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No documents yet</h3>
          <p className="text-dark-400">Upload your first SOP document to get started</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Documents List */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc._id} className="glass-effect rounded-xl p-6 hover:bg-white/10 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(doc.status)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold mb-1 truncate">{doc.name}</h3>
                      <p className="text-sm text-dark-400">
                        {new Date(doc.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-dark-500">Pages</p>
                    <p className="text-white font-medium">{doc.totalPages || 0}</p>
                  </div>
                  <div>
                    <p className="text-dark-500">Chunks</p>
                    <p className="text-white font-medium">{doc.totalChunks || 0}</p>
                  </div>
                  <div>
                    <p className="text-dark-500">Size</p>
                    <p className="text-white font-medium">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewVectors(doc)}
                    disabled={doc.status !== 'completed'}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Vectors</span>
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Vectors Panel */}
          <div className="glass-effect rounded-xl p-6 lg:sticky lg:top-6 h-fit max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-4">Document Vectors</h2>

            {!selectedDoc ? (
              <div className="flex-1 flex items-center justify-center text-center py-12">
                <div>
                  <Eye className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                  <p className="text-dark-400">Select a document to view its vectors</p>
                </div>
              </div>
            ) : loadingVectors ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {vectors.map((vector, index) => (
                  <div key={vector._id} className="bg-dark-800/50 rounded-lg p-4 border border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary-400">
                        Chunk #{vector.chunkIndex + 1}
                      </span>
                      <span className="text-xs text-dark-500">Page {vector.pageNumber}</span>
                    </div>
                    <p className="text-sm text-dark-300 line-clamp-3">{vector.text}</p>
                    <div className="mt-2 pt-2 border-t border-dark-700">
                      <p className="text-xs text-dark-500">
                        Embedding: {vector.metadata?.chunkSize || 0} chars
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentsPage
