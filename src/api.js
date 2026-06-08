import axios from 'axios';

const api = axios.create({
  baseURL: 'https://studyplanner-bbhj.onrender.com/api'
});

// Automatically inject JWT token into the headers if it exists
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

export default api;