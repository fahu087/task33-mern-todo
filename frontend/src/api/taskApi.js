import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/tasks',
});

export const fetchTasks = (params = {}) => API.get('/', { params });
export const createTask = (taskData) => API.post('/', taskData);
export const updateTask = (id, updates) => API.patch(`/${id}`, updates);
export const deleteTask = (id) => API.delete(`/${id}`);