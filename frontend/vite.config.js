import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        // Increase timeout for large file uploads (2 minutes)
        timeout: 120000,
        // Configure proxy for multipart form-data uploads
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.warn('[vite-proxy] Proxy error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq) => {
            // For multipart uploads, let the Content-Type be set by the browser
            // (includes the boundary parameter) — don't override it
            if (proxyReq.getHeader('Content-Type')?.includes('multipart/form-data')) {
              proxyReq.removeHeader('Content-Length');
            }
          });
        },
      },
    },
  },
})
