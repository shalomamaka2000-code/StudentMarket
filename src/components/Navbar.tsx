import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart, Heart, Home, Store, LogOut, User, Search } from 'lucide-react';
import { type RootState } from '../store';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Home size={24} />
          <span>HostelMarket</span>
        </Link>

        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for items..." 
            className="search-input"
          />
        </div>

        <div className="navbar-links">
          <Link to="/products" className="nav-link">
            <Store size={20} />
            <span>Shop</span>
          </Link>

          <Link to="/wishlist" className="nav-link">
            <div className="icon-wrapper">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="badge">{wishlistItems.length}</span>
              )}
            </div>
            <span>Wishlist</span>
          </Link>

          <Link to="/cart" className="nav-link">
            <div className="icon-wrapper">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="badge">{cartCount}</span>
              )}
            </div>
            <span>Cart</span>
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <User size={18} />
                <span>{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="cozy-btn login-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;