import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForms.css'; // <-- 1. Import the new CSS
import { FiEye, FiEyeOff } from 'react-icons/fi'; // <-- 2. Import icons

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- 3. Add state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/auth/register', { username, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Registration failed'));
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        
        <div className="auth-form-group">
          <label>Username</label>
          <input 
            type="text" 
            className="auth-input" // <-- 4. Use new class
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
        </div>
        
        <div className="auth-form-group">
          <label>Password</label>
          {/* 5. Use the password wrapper */}
          <div className="password-wrapper">
            <input 
              type={showPassword ? 'text' : 'password'} // <-- 6. Toggle type
              className="auth-input password-input" // <-- 7. Use new classes
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            {/* 8. The Icon Button */}
            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>
        </div>
        
        <button type="submit" className="auth-button">Sign Up</button>

        <p className="auth-switch-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;