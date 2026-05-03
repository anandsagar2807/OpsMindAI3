import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const UploadPage = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size must be less than 20MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', file.name)

    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadedFile({
        name: file.name,
        status: 'processing',
        id: response.data.data.documentId
      })

      toast.success('Document uploaded successfully! Processing started.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
      setUploadedFile(null)
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Documents</h1>
        <p className="text-dark-400">Upload SOP PDFs to build your corporate knowledge base</p>
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          glass-effect rounded-2xl p-12 border-2 border-dashed transition cursor-pointer
          ${isDragActive ? 'border-primary-500 bg-primary-500/5' : 'border-dark-700 hover:border-dark-600'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 mb-4">
            {uploading ? (
              <Loader className="w-8 h-8 text-primary-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-primary-500" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {uploading ? 'Uploading...' : isDragActive ? 'Drop your PDF here' : 'Upload PDF Document'}
          </h3>
          <p className="text-dark-400 mb-4">
            Drag and drop your PDF file here, or click to browse
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-dark-500">
            <span>• PDF only</span>
            <span>• Max 20MB</span>
            <span>• SOP documents</span>
          </div>
        </div>
      </div>

      {/* Upload Status */}
      {uploadedFile && (
        <div className="mt-6 glass-effect rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {uploadedFile.status === 'processing' && (
                <Loader className="w-6 h-6 text-primary-500 animate-spin" />
              )}
              {uploadedFile.status === 'completed' && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {uploadedFile.status === 'failed' && (
                <AlertCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-dark-400" />
                <span className="text-white font-medium">{uploadedFile.name}</span>
              </div>
              <p className="text-sm text-dark-400">
                {uploadedFile.status === 'processing' && 'Processing document... Extracting text and generating embeddings.'}
                {uploadedFile.status === 'completed' && 'Document processed successfully!'}
                {uploadedFile.status === 'failed' && 'Processing failed. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="glass-effect rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="text-white font-semibold mb-1">Text Extraction</h3>
          <p className="text-sm text-dark-400">Automatically extracts text from all PDF pages</p>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">Smart Chunking</h3>
          <p className="text-sm text-dark-400">Splits content into 1000-char chunks with overlap</p>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">AI Embeddings</h3>
          <p className="text-sm text-dark-400">Generates vector embeddings for semantic search</p>
        </div>
      </div>
    </div>
  )
}

export default UploadPage
