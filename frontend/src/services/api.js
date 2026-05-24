import axios from 'axios';

// In development with vite proxy, use empty baseURL so requests go through
// the proxy (same-origin, no CORS issues, more resilient).
// In production builds, use the full API URL for direct connections.
const API_URL = import.meta.env.DEV
  ? ''  // Vite proxy handles /api → http://localhost:5002
  : (import.meta.env.VITE_API_URL || 'http://localhost:5002');

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Auth token storage (per-request via interceptor, not global mutation) ───
let currentAuthToken = null;

export const setAuthToken = (token) => {
  currentAuthToken = token;
};

// Request interceptor: attach token per-request from module-level storage
api.interceptors.request.use((config) => {
  if (currentAuthToken) {
    config.headers.Authorization = `Bearer ${currentAuthToken}`;
  }
  return config;
});

// ─── Response interceptor: retry on transient failures + normalize errors ───
const MAX_RETRIES = 3;
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];
const RETRY_DELAY_MS = 1000; // base delay, exponential backoff applied

function transformError(error) {
  if (error.response) {
    // Server responded with an error status code
    const message = error.response.data?.message || error.response.data?.error || error.response.statusText;
    const enhanced = new Error(message);
    enhanced.status = error.response.status;
    enhanced.data = error.response.data;
    enhanced.isNetworkError = false;
    enhanced.isServerError = error.response.status >= 500;
    enhanced.isAuthError = error.response.status === 401 || error.response.status === 403;
    return enhanced;
  }

  if (error.request) {
    // Request was made but no response received (network error, timeout, CORS failure)
    const code = error.code || '';
    const isTimeout = code === 'ECONNABORTED' || code === 'ETIMEDOUT';
    const message = isTimeout
      ? 'Request timed out — the server took too long to respond. Please try again.'
      : 'Network error — unable to reach the server. Please check your connection and try again.';
    const enhanced = new Error(message);
    enhanced.isNetworkError = true;
    enhanced.isServerError = false;
    enhanced.isAuthError = false;
    enhanced.code = code;
    enhanced.originalError = error;
    return enhanced;
  }

  // Something happened in setting up the request
  return error;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Don't retry if no config, already retried max times, or non-retryable status
    if (!config || config.__retryCount >= MAX_RETRIES) {
      return Promise.reject(transformError(error));
    }

    // Only retry on network errors (no response) or retryable status codes
    const status = error.response?.status;
    const shouldRetry = !error.response || RETRYABLE_STATUS_CODES.includes(status);

    if (!shouldRetry) {
      return Promise.reject(transformError(error));
    }

    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;

    // Exponential backoff: 1s, 2s, 4s
    const delay = RETRY_DELAY_MS * Math.pow(2, config.__retryCount - 1);
    console.warn(`[api] Retrying request (${config.__retryCount}/${MAX_RETRIES}) after ${delay}ms — ${error.message || status}`);

    await new Promise(resolve => setTimeout(resolve, delay));
    return api(config);
  }
);

// ─── Document APIs ───
export const documentAPI = {
  upload: (file, token, onUploadProgress) => {
    setAuthToken(token);
    return api.post('/api/documents/upload', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes for large PDF uploads
      onUploadProgress: onUploadProgress || undefined,
      // Don't retry uploads — they're too expensive and the progress tracking breaks
      __retryCount: MAX_RETRIES, // skip retry interceptor
    });
  },
  getAll: (token) => {
    setAuthToken(token);
    return api.get('/api/documents');
  },
  getOne: (id, token) => {
    setAuthToken(token);
    return api.get(`/api/documents/${id}`);
  },
  getStatus: (id, token) => {
    setAuthToken(token);
    return api.get(`/api/documents/${id}/status`);
  },
  delete: (id, token) => {
    setAuthToken(token);
    return api.delete(`/api/documents/${id}`);
  },
};

// ─── Chat APIs ───
export const chatAPI = {
  create: (title, token) => {
    setAuthToken(token);
    return api.post('/api/chat', { title });
  },
  getAll: (params, token) => {
    setAuthToken(token);
    return api.get('/api/chat', { params });
  },
  getOne: (id, token) => {
    setAuthToken(token);
    return api.get(`/api/chat/${id}`);
  },
  updateTitle: (id, title, token) => {
    setAuthToken(token);
    return api.patch(`/api/chat/${id}`, { title });
  },
  delete: (id, token) => {
    setAuthToken(token);
    return api.delete(`/api/chat/${id}`);
  },
};

// ─── RAG APIs ───
export const ragAPI = {
  ask: (query, conversationId, token) => {
    setAuthToken(token);
    return api.post('/api/rag/ask', { query, conversationId });
  },
  search: (query, topK, token) => {
    setAuthToken(token);
    return api.get('/api/rag/search', { params: { query, topK } });
  },
};

// ─── SSE Streaming ───
export const streamRAGResponse = async (query, conversationId, token, onMetadata, onContent, onComplete, onError) => {
  try {
    // Build URL — in dev mode API_URL is empty (proxy), in prod it's the full URL
    const streamUrl = API_URL
      ? `${API_URL}/api/rag/stream`
      : '/api/rag/stream';

    const response = await fetch(streamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query, conversationId }),
    });

    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data.trim() === '') continue;

          try {
            const parsed = JSON.parse(data);

            switch (parsed.type) {
              case 'metadata':
                onMetadata?.(parsed.data);
                break;
              case 'content':
                onContent?.(parsed.data);
                break;
              case 'generation_complete':
                onComplete?.(parsed.data);
                break;
              case 'done':
                return;
              case 'error':
                onError?.(parsed.data);
                return;
            }
          } catch (e) {
            // Not JSON, might be partial data
          }
        }
      }
    }
  } catch (error) {
    onError?.(error.message);
  }
};

// ─── Dashboard APIs ───
export const dashboardAPI = {
  getStats: (token) => {
    setAuthToken(token);
    return api.get('/api/dashboard/stats');
  },
  getRecentActivity: (token, limit = 10) => {
    setAuthToken(token);
    return api.get('/api/dashboard/recent-activity', { params: { limit } });
  },
  getDocumentsOverview: (token) => {
    setAuthToken(token);
    return api.get('/api/dashboard/documents-overview');
  },
};

// ─── Public APIs ───
export const publicAPI = {
  health: () => api.get('/api/public/health'),
  stats: () => api.get('/api/public/stats'),
};

export default api;
