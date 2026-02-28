import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach auth token if present
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('ciphersql_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getAssignments = () => API.get('/assignments');
export const getAssignment = (id) => API.get(`/assignments/${id}`);
export const runQuery = (data) => API.post('/query', data);
export const getHint = (data) => API.post('/hint', data);
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// New features
export const getProgress = () => API.get('/progress');
export const saveProgress = (assignmentId) => API.post(`/progress/${assignmentId}`);
export const getHistory = (assignmentId) => API.get(`/history/${assignmentId}`);
export const getLeaderboard = () => API.get('/leaderboard');
export const getUserProfile = () => API.get('/users/profile');
export const updateUserProfile = (data) => API.put('/users/profile', data);
