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
            console.log('Request with token:', {
                url: config.url,
                method: config.method,
                tokenPrefix: token.substring(0, 20) + '...'
            });
        }
        return config;
    }
);

export { authApi, apiInstance };