import { apiClient, publicApiClient } from './api.js';
import { setToken, getToken, removeToken } from './tokenService.js';

// Function to handle authentication errors globally
const handleAuthError = error => {
  if (error.response) {
    const { status } = error.response;

    if (status === 401) {
      removeToken();
      window.location.href = '/login'; // Or use router redirect
    }
  }
  return Promise.reject(error);
};

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  response => response,
  error => {
    handleAuthError(error);
    return Promise.reject(error);
  },
);

export const isAuthenticated = () => {
    
}