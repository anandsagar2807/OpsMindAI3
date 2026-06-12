import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/')
          if (!normalizedId.includes('/node_modules/')) return undefined

          const packagePath = normalizedId.split('/node_modules/').pop()
          const packageName = packagePath.startsWith('@')
            ? packagePath.split('/').slice(0, 2).join('/')
            : packagePath.split('/')[0]

          if (['react', 'react-dom', 'react-router-dom', 'scheduler'].includes(packageName)) {
            return 'vendor-react'
          }

          if (packageName.startsWith('@clerk/')) return 'vendor-clerk'
          if (packageName === 'recharts' || packageName.startsWith('d3-')) return 'vendor-charts'
          if (packageName.startsWith('@tanstack/')) return 'vendor-query'
          if (packageName === 'framer-motion') return 'vendor-motion'
          if (packageName === 'lucide-react') return 'vendor-icons'
          if (packageName === 'react-dropzone') return 'vendor-upload'
          if (packageName === 'axios') return 'vendor-api'
          if (packageName === 'zustand') return 'vendor-state'
          if (packageName === 'react-hot-toast') return 'vendor-toast'

          return undefined
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5004',
        changeOrigin: true,
        // Increase timeout for large file uploads (2 minutes)
        timeout: 120000,
        // Configure proxy for multipart form-data uploads
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.warn('[vite-proxy] Proxy error:', err.message);
            // Send a JSON error response to the client so axios receives
            // a proper error instead of a silent network failure
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                message: 'Proxy error — backend server is not reachable. Please ensure the backend is running on port 5004.',
                proxyError: err.message,
              }));
            }
          });
          // NOTE: We intentionally do NOT remove Content-Length for multipart
          // uploads.  The browser sets the correct Content-Length for FormData,
          // and removing it forces chunked transfer-encoding which can cause
          // http-proxy to fail to stream the body correctly, resulting in the
          // backend never receiving the full request → "network error" on the
          // client side.  The original Content-Length must be forwarded intact.
        },
      },
    },
  },
})
