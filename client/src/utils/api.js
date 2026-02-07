/**
 * API Utility Functions
 * 
 * Handles all API calls to the backend server.
 * Includes authentication token management.
 */

import axios from 'axios';

// Base URL for API
const API_URL =
  process.env.REACT_APP_API_URL || 'https://skillshub-backend.onrender.com/api';



// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Log error for debugging
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error: No response received', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Skills API
export const skillsAPI = {
  getAll: (params) => api.get('/skills', { params }),
  getById: (id) => api.get(`/skills/${id}`),
  create: (skillData) => api.post('/skills', skillData),
  update: (id, skillData) => api.put(`/skills/${id}`, skillData),
  delete: (id) => api.delete(`/skills/${id}`)
};

// Messages API
export const messagesAPI = {
  send: (messageData) => api.post('/messages', messageData),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  getConversations: () => api.get('/messages/conversations')
};

// Users API
export const usersAPI = {
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (profileData) => api.put('/users/profile', profileData)
};

export default api;
