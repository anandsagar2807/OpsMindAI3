import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader
} from 'lucide-react'
import { Card, Button } from '../components/ui'
import DashboardLayout from '../layouts/DashboardLayout'

const UploadPage = () => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 20971520,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        file,
        name: file.name,
        size: file.size,
        status: 'pending',
        progress: 0
      }))
      setFiles([...files, ...newFiles])
    }
  })

  const handleUpload = () => {
    setUploading(true)
    files.forEach((file, index) => {
      setTimeout(() => {
        setFiles(prev => prev.map((f, i) =>
          i === index ? { ...f, status: 'uploading', progress: 0 } : f
        ))

        const interval = setInterval(() => {
          setFiles(prev => prev.map((f, i) => {
            if (i === index && f.progress < 100) {
              const newProgress = f.progress + 10
              if (newProgress >= 100) {
                clearInterval(interval)
                return { ...f, status: 'completed', progress: 100 }
              }
              return { ...f, progress: newProgress }
            }
            return f
          }))
        }, 200)
      }, index * 500)
    })

    setTimeout(() => {
      setUploading(false)
    }, files.length * 500 + 2000)
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Upload Documents</h1>
          <p className="text-dark-400">Add new documents to your knowledge base</p>
        </div>

        <Card glass>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-16
              transition-all duration-200 cursor-pointer
              ${isDragActive
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-dark-700 hover:border-primary-500/50 hover:bg-white/5'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <motion.div
                animate={{ y: isDragActive ? -10 : 0 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30"
              >
                <Upload className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                {isDragActive ? 'Drop files here' : 'Upload Documents'}
              </h3>
              <p className="text-dark-400 mb-2">
                Drag & drop PDF files here, or click to browse
              </p>
              <p className="text-sm text-dark-500">
                Maximum file size: 20MB • Supported format: PDF
              </p>
            </div>
          </div>
        </Card>

        {files.length > 0 && (
          <Card glass>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Files ({files.length})</h3>
              {!uploading && files.some(f => f.status === 'pending') && (
                <Button onClick={handleUpload} icon={Upload}>
                  Upload All
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-red-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{file.name}</p>
                          <p className="text-sm text-dark-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {file.status === 'pending' && (
                            <button
                              onClick={() => removeFile(index)}
                              className="text-dark-400 hover:text-red-400 transition-colors"
                            >
                              <AlertCircle className="w-5 h-5" />
                            </button>
                          )}
                          {file.status === 'uploading' && (
                            <Loader className="w-5 h-5 text-primary-400 animate-spin" />
                          )}
                          {file.status === 'completed' && (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      </div>

                      {file.status !== 'pending' && (
                        <div className="space-y-2">
                          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress}%` }}
                              className="h-full bg-gradient-to-r from-primary-500 to-blue-600 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-dark-400">
                            {file.status === 'uploading' ? `Uploading... ${file.progress}%` : 'Upload complete'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        <Card glass>
          <h3 className="text-lg font-semibold text-white mb-4">Upload Guidelines</h3>
          <ul className="space-y-3 text-dark-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Only PDF files are supported</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Maximum file size is 20MB per document</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Documents are automatically processed and indexed</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Processing typically takes 1-2 minutes per document</span>
            </li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default UploadPage
