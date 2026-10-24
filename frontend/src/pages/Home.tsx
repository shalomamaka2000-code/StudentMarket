import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight,ShoppingBag,Heart,Truck,Apple,Sparkles,Shirt,Home as HomeIcon,} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'groceries',
    label: 'Foodstuff',
    icon: <Apple size={28} />,
    description: 'Snacks, staples & ingredients',
  },
  {
    id: 'fragrances',
    label: 'Personal Care',
    icon: <Sparkles size={28} />,
    description: 'Skincare, hygiene & wellness',
  },
  {
    id: 'mens-shirts',
    label: 'Men’s Wear',
    icon: <Shirt size={28} />,
    description: 'Shirts, tees & casuals',
  },
  {
    id: 'womens-dresses',
    label: 'Women’s Wear',
    icon: <Shirt size={28} />,
    description: 'Dresses, tops & more',
  },
  {
    id: 'home-decoration',
    label: 'Domestic',
    icon: <HomeIcon size={28} />,
    description: 'Room decor & essentials',
  },
  {
    id: 'beauty',
    label: 'Beauty',
    icon: <Sparkles size={28} />,
    description: 'Cosmetics & grooming',
  },
];

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content fade-in-up">
          <span className="hero-badge">🏡 Campus marketplace</span>
          <h1 className="cozy-headline hero-title">
            {isAuthenticated
              ? `Welcome back, ${user?.name}!`
              : 'Buy, Sell, and Discover Students Businesses on Campus'}
          </h1>
          <p className="hero-subtitle">
            An online space built for trust and convenience.
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
          <h3 className="cozy-subheadline">Same Day Delivery</h3>
          <p>Under 30 minutes to any block on campus.</p>
        </div>
        <div className="feature-card cozy-card">
          <ShoppingBag size={28} className="feature-icon" />
          <h3 className="cozy-subheadline">Everything You Need</h3>
          <p>Food, fashion, care, and comfort — all in one place.</p>
        </div>
        <div className="feature-card cozy-card">
          <Heart size={28} className="feature-icon" />
          <h3 className="cozy-subheadline">Fair Prices</h3>
          <p>Student-friendly pricing, curated by students.</p>
        </div>
      </section>

       <section className="categories-section">
        <div className="section-heading">
          <h2 className="cozy-subheadline">Browse Categories</h2>
          <p className="section-subtitle">
            Find what you need — one cozy aisle at a time
          </p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className="category-card cozy-card"
              onClick={() =>
                (`/products?category=${encodeURIComponent(cat.id)}`)
              }
            >
              <div className="category-icon">{cat.icon}</div>
              <h3 className="category-label">{cat.label}</h3>
              <p className="category-desc">{cat.description}</p>
              <span className="category-cta">
                Browse <ArrowRight size={14} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;