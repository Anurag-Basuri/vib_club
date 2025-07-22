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
  const { accessToken } = getToken();
  return !!accessToken;
}

export const memberRegister = async (data) => {
  try {
    const response = await publicApiClient.post('/api/members/register', data);

    const { accessToken, refreshToken } = response.data;
    setToken({ accessToken, refreshToken });

    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const memberLogin = async (data) => {
  try {
    const response = await publicApiClient.post('/api/members/login', data);

    const { accessToken, refreshToken } = response.data;
    setToken({ accessToken, refreshToken });

    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const memberLogout = async () => {
  try {
    const { refreshToken } = getToken();
    const response = await apiClient.post('/api/members/logout', { refreshToken });

    removeToken(); // Clear tokens on logout
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const getCurrentMember = async () => {
    try {
        const response = await apiClient.get('/api/members/me');
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
}

export const updateProfile = async (data) => {
  try {
    const response = await apiClient.put(`/api/members/${data.id}/update`, data);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await apiClient.post(`/api/members/${data.id}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const resetPassword = async (data) => {
  try {
    const response = await apiClient.post('/api/members/reset-password', data);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const forgotPassword = async (data) => {
  try {
    const response = await publicApiClient.post('/api/members/send-reset-email', data);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const adminRegister = async (data) => {
  try {
    const response = await apiClient.post('/api/admin/register', data);

    const { accessToken, refreshToken } = response.data;
    setToken({ accessToken, refreshToken });

    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const adminLogin = async (data) => {
  try {
    const response = await apiClient.post('/api/admin/login', data);

    const { accessToken, refreshToken } = response.data;
    setToken({ accessToken, refreshToken });

    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const adminLogout = async () => {
  try {
    const { refreshToken } = getToken();
    const response = await apiClient.post('/api/admin/logout', { refreshToken });

    removeToken(); // Clear tokens on logout
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export const getCurrentAdmin = async () => {
    try {
        const response = await apiClient.get('/api/admin/me');
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
}
