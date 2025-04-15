import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/axios';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Wonted Blogs - Register Page";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any existing error when user types
    if (error) setError('');
  };

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Create a copy of the form without confirmPassword
    const formData = { ...form };
    delete formData.confirmPassword;
    
    // Log the request details
    console.log('Registration request:', {
      url: `${authApi.defaults.baseURL}/register`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: { username: form.username, email: form.email }
    });
    
    try {
      const response = await authApi.post('/register', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
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
        setError('Username or email already exists.');
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
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} form autoComplete="off" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              style={{ backgroundColor: 'white' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              style={{ backgroundColor: 'white' }}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: 'white' }}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            name="user_name"
            placeholder="Username"
            autoComplete="off"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: 'white' }}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
          <input
            name="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: 'white' }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: 'white' }}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            name="pass_word"
            type="password"
            autoComplete="off"
            placeholder="Password (min. 8 characters)"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: 'white' }}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ backgroundColor: 'white' }}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Register'}
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;  