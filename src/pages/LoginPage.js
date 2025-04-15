import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    document.title = "Wonted Blogs - Login Page";
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.post('/login', {
        username,
        password
      });

      const token = response.data;
      
      if (token) {
        // Use the login function from AuthContext instead of direct localStorage manipulation
        login(token, username);
        navigate('/');
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h2>

        {error && (
          <div className="mb-4 p-3 text-red-200 bg-red-900/50 rounded-lg border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border rounded bg-white text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            className="w-full p-2 border rounded bg-white text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            className={`w-full px-4 py-3 rounded-lg text-white ${loading ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-500/90 hover:bg-blue-600 transition-all duration-200'} shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Don't have an account? <a href="/register" className="text-blue-500 hover:text-blue-700">Register</a></p>
        </div>
      </div>
    </div>
  );
}
