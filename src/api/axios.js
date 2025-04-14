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

authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// Add request interceptor for protected routes
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request with token:', {
                url: config.url,
                method: config.method,
                tokenPrefix: token.substring(0, 20) + '...'
            });
        }
        return config;
    },
    (error) => {
        // Add error handling for request errors
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);
apiInstance.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });
        return Promise.reject(error);
    }
);

export { authApi, apiInstance };