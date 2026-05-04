import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  Download,
  Search
} from 'lucide-react'
import { Card, Button, Badge } from '../components/ui'
import DashboardLayout from '../layouts/DashboardLayout'

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Employee_Handbook_2024.pdf',
      size: '2.4 MB',
      uploadDate: '2024-03-15',
      status: 'completed',
      pages: 45,
      chunks: 120
    },
    {
      id: 2,
      name: 'IT_Security_Policy.pdf',
      size: '1.8 MB',
      uploadDate: '2024-03-14',
      status: 'completed',
      pages: 32,
      chunks: 85
    },
    {
      id: 3,
      name: 'Sales_Procedures.pdf',
      size: '3.2 MB',
      uploadDate: '2024-03-13',
      status: 'processing',
      pages: 58,
      chunks: 0
    }
  ])

  const [uploading, setUploading] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 20971520,
    onDrop: (acceptedFiles) => {
      setUploading(true)
      setTimeout(() => {
        const newDoc = {
          id: documents.length + 1,
          name: acceptedFiles[0].name,
          size: `${(acceptedFiles[0].size / 1024 / 1024).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'processing',
          pages: 0,
          chunks: 0
        }
        setDocuments([newDoc, ...documents])
        setUploading(false)
      }, 2000)
    }
  })

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
          <p className="text-dark-400">Manage your knowledge base documents</p>
        </div>

        <Card glass>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-12
              transition-all duration-200 cursor-pointer
              ${isDragActive
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-dark-700 hover:border-primary-500/50 hover:bg-white/5'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {uploading ? 'Uploading...' : isDragActive ? 'Drop files here' : 'Upload Documents'}
              </h3>
              <p className="text-dark-400 mb-4">
                Drag & drop PDF files here, or click to browse
              </p>
              <p className="text-sm text-dark-500">
                Maximum file size: 20MB • Supported format: PDF
              </p>
            </div>
          </div>
        </Card>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="
              w-full pl-12 pr-4 py-3
              bg-dark-800/50 border border-dark-700
              rounded-xl text-white placeholder-dark-500
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-all
            "
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover glass>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-400" />
                  </div>
                  <Badge variant={doc.status === 'completed' ? 'success' : 'warning'}>
                    {doc.status === 'completed' ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Processed</>
                    ) : (
                      <><Clock className="w-3 h-3 mr-1" /> Processing</>
                    )}
                  </Badge>
                </div>

                <h3 className="text-white font-semibold mb-2 truncate" title={doc.name}>
                  {doc.name}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-dark-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{doc.uploadDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{doc.size}</span>
                    {doc.status === 'completed' && (
                      <span>{doc.pages} pages • {doc.chunks} chunks</span>
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
                  <button className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DocumentsPage
