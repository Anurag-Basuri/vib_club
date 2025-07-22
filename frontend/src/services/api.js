import axios from 'axios';
import { getToken, removeToken } from '../utils/handleTokens.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Public client for unauthenticated requests
const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

apiClient.interceptors.request.use(config => {
  const { accessToken } = getToken();
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => {
    // Handle successful responses
    return response;
  },
  error => {
    // Handle errors
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // Token expired or invalid
        removeToken();
      }
      return Promise.reject(data);
    }
    return Promise.reject(error);
  }
);

export { apiClient, publicClient };