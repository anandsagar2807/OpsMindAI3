import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Get Clerk token if available
    if (window.Clerk?.session) {
      try {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Document APIs
 * Note: some pages need to pass a Clerk token explicitly because relying on window.Clerk may not work reliably.
 */
export const documentAPI = {
  getAll: (token) =>
    api.get('/documents', token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),

  upload: (formData, token) =>
    api.post(
      '/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    ),

  delete: (id, token) =>
    api.delete(`/documents/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),

  getById: (id, token) =>
    api.get(`/documents/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data, token) =>
    api.post('/groq-chat/ask', data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
  getHistory: (token) =>
    api.get('/groq-chat/history', token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
  getChat: (chatId, token) =>
    api.get(`/groq-chat/${chatId}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
  deleteChat: (chatId, token) =>
    api.delete(`/groq-chat/${chatId}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
  renameChat: (chatId, title, token) =>
    api.patch(`/groq-chat/${chatId}`, { title }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: (token) =>
    api.get('/dashboard/stats', token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export default api;
