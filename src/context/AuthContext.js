import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            
            console.log('Starting auth verification...', {
                hasToken: !!token,
                hasUsername: !!username,
                tokenType: token ? typeof token : 'none',
                tokenLength: token ? token.length : 0
            });
            
            if (!token || !username) {
                console.log('No credentials found, skipping verification');
                setLoading(false);
                return;
            }

            try {
                console.log('Sending verification request...');
                const response = await authApi.get('/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                console.log('Verification response:', {
                    status: response.status,
                    hasData: !!response.data
                });

                if (response.status === 200) {
                    setCurrentUser(username);
                }
            } catch (error) {
                console.error('Verification error details:', {
                    type: error.name,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        headers: error.config?.headers
                    }
                });

                localStorage.removeItem('token');
                localStorage.removeItem('username');
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = (token, username) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setCurrentUser(username);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setCurrentUser(null);
        navigate('/login');
    };

    const value = {
        currentUser,
        loading,
        login,
        logout,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};