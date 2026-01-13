import axios from 'axios';

// Use relative URL in production (Vercel), or environment variable, or localhost for dev
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
});

export const employeeAPI = {
    getAll: () => api.get('/employees'),
    create: (data) => api.post('/employees', data),
    delete: (id) => api.delete(`/employees/${id}`),
};

export const attendanceAPI = {
    getForEmployee: (employeeId, params) => api.get(`/attendance/${employeeId}`, { params }),
    mark: (data) => api.post('/attendance', data),
};

export const statsAPI = {
    getDashboard: () => api.get('/stats/dashboard'),
};

export default api;
