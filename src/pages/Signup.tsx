import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Home, DoorOpen, ArrowRight } from 'lucide-react';
import { useAuth, type SignupData } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    hostel: '',
    roomNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      toast.success('Welcome to HostelMarket! 🎉');
      navigate('/products');
    } catch {
      toast.error('Signup failed. Please try again.');
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

      <div className="auth-card cozy-card signup-card">
        <div className="auth-header">
          <div className="auth-icon">
            <Home size={32} />
          </div>
          <h1 className="cozy-headline">Join HostelMarket</h1>
          <p className="auth-subtitle">Your cozy corner for campus essentials</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* name, email, password fields — same pattern as before */}
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="cozy-input"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="cozy-input"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="hostel">Hostel</label>
              <div className="input-wrapper">
                <Home size={18} className="input-icon" />
                <input
                  id="hostel"
                  type="text"
                  value={formData.hostel}
                  onChange={handleChange}
                  placeholder="e.g., Maple Hall"
                  className="cozy-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="roomNumber">Room</label>
              <div className="input-wrapper">
                <DoorOpen size={18} className="input-icon" />
                <input
                  id="roomNumber"
                  type="text"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="e.g., 204"
                  className="cozy-input"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="cozy-btn auth-submit"
            disabled={loading}
          >
            {loading ? (
              'Creating account...'
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;