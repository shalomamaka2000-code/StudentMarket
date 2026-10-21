import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Home, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
  await login(email, password);
  toast.success('Welcome back!');
  navigate('/products');
} catch (err) {
  if (axios.isAxiosError(err)) {
    toast.error(err.response?.data?.message ?? 'Login failed');
  } else {
    toast.error('Login failed');
  }
} finally {
      setLoading(false);
  }

  };

  return (
    <div className="auth-page">
      <div className="auth-decoration">
        <div className="floating-item">🧺</div>
        <div className="floating-item">📚</div>
        <div className="floating-item">☕</div>
        <div className="floating-item">🌿</div>
        <div className="floating-item">🛏️</div>
      </div>

      <div className="auth-card cozy-card">
        <div className="auth-header">
          <div className="auth-icon">
            <Home size={32} />
          </div>
          <h1 className="cozy-headline">Welcome Back!</h1>
          <p className="auth-subtitle">Your one-stop marketplace for your convenience</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="cozy-input"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="cozy-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="cozy-btn auth-submit"
            disabled={loading}
          >
            {loading ? (
              'Signing in...'
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New to the hostel?{' '}
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;