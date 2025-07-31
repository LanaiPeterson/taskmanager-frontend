import react from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 


export default function Register() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/users/register', { userName, password });
      navigate('/');
    } catch {
      alert('Register failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={e => setUserName(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}