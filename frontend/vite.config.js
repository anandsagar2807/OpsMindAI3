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
          proxy.on('error', (err, req, res) => {
            console.warn('[vite-proxy] Proxy error:', err.message);
            // Send a JSON error response to the client so axios receives
            // a proper error instead of a silent network failure
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                message: 'Proxy error — backend server is not reachable. Please ensure the backend is running on port 5002.',
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
