import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Adjust the import path as needed

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle user login
  const handleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/users/login', { userName, password });
      navigate('/');
    } catch {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };
// Render the login form
  // It includes fields for username and password, and a submit button
  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={e => setUserName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;