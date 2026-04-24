import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

const taskService = {
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  toggleTaskStatus: async (id) => {
    const response = await api.post(`/tasks/update-status/${id}`);
    return response.data;
  },

  bulkDeleteTasks: async (ids) => {
    const response = await api.delete('/tasks/bulk-delete', { data: { ids } });
    return response.data;
  },
};

export default taskService;
