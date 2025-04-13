import axios from 'axios';

const authApi = axios.create({
    baseURL: 'http://localhost:8080/auth',
    headers: {
        'Content-Type': 'application/json'
    }
});

const apiInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for protected routes
apiInstance.interceptors.request.use(
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
  
  // Add response interceptor
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        // Only clear token if it's an auth error
        const isAuthError = error.response.data?.message?.includes('token');
        if (isAuthError) {
          localStorage.removeItem('token');
        }
      }
      return Promise.reject(error);
    }
  );

export { authApi, apiInstance };