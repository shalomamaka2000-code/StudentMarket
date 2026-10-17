import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Heart, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content fade-in-up">
          <span className="hero-badge">🏡 Cozy campus marketplace</span>
          <h1 className="cozy-headline hero-title">
            {isAuthenticated
              ? `Welcome back, ${user?.name}!`
              : 'Everything your hostel needs'}
          </h1>
          <p className="hero-subtitle">
            Foodstuff, clothing, personal care, and domestic essentials —
            delivered right to your room.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="cozy-btn">
              Start Shopping
              <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link to="/signup" className="cozy-btn cozy-btn-outline">
                Create Account
              </Link>
            )}
          </div>
        </div>

        <div className="hero-decor" aria-hidden="true">
          <div className="decor-circle circle-1" />
          <div className="decor-circle circle-2" />
          <div className="decor-emoji">🧺</div>
          <div className="decor-emoji">☕</div>
          <div className="decor-emoji">🌿</div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card cozy-card">
          <Truck size={28} className="feature-icon" />
          <h3 className="cozy-subheadline">Fast Hostel Delivery</h3>
          <p>Under 30 minutes to any block on campus.</p>
        </div>
        <div className="feature-card cozy-card">
          <ShoppingBag size={28} className="feature-icon" />
          <h3 className="cozy-subheadline">Everything You Need</h3>
          <p>Food, fashion, care, and comfort — all in one place.</p>
        </div>
        <div className="feature-card cozy-card">
          <Heart size={28} className="feature-icon" />
          <h3 className="cozy-subheadline">Cozy & Fair Prices</h3>
          <p>Student-friendly pricing, curated by students.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;