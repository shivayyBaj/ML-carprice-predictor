import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const getCompanies = () => api.get('/companies');
export const getModels = (company) => api.get('/models', { params: { company } });
export const predictPrice = (data) => api.post('/predict', data);
export const getMetrics = () => api.get('/metrics');
export const getAnalytics = () => api.get('/analytics');
export const healthCheck = () => api.get('/health');

export default api;
