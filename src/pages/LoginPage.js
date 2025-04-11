import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/axios'; // Remove duplicate import

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
            localStorage.setItem('token', token);
            const storedToken = localStorage.getItem('token');
            
            if (storedToken) {
                console.log('Auth token stored successfully');
                navigate('/');
            } else {
                throw new Error('Failed to store token');
            }
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
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <button 
          className={`w-full px-4 py-2 rounded text-white ${
            loading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}