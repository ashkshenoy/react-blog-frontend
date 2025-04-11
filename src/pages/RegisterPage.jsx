import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/axios'; // Import authApi instead of using fetch

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any existing error when user types
    if (error) setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Log the request details
    console.log('Registration request:', {
      url: `${authApi.defaults.baseURL}/register`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: { username: form.username }
    });

    try {
      const response = await authApi.post('/register', form, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true // Add this to handle CORS
      });

      console.log('Registration response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Registration successful');
        alert('Registration successful!');
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.message,
        data: err.response?.data,
        headers: err.response?.headers
      });

      if (err.response?.status === 403) {
        setError('Server rejected the request. Please try again or contact support.');
      } else if (err.response?.status === 409) {
        setError('Username already exists.');
      } else if (!err.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl border">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;