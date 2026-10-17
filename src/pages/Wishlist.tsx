import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, X } from 'lucide-react';
import type { AppDispatch, RootState } from '../store';
import { removeFromWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import toast from 'react-hot-toast';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.wishlist.items);

  const handleAddToCart = (id: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    dispatch(
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: 1,
      })
    );
    toast.success(`${item.title} added to cart`);
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromWishlist(id));
    toast.success('Removed from wishlist');
  };

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty cozy-card">
          <Heart size={48} className="empty-icon" />
          <h1 className="cozy-headline">Your wishlist is empty</h1>
          <p>Save items you love for later.</p>
          <Link to="/products" className="cozy-btn">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="cozy-headline">Your Wishlist</h1>

      <div className="wishlist-grid">
        {items.map(item => (
          <div key={item.id} className="wishlist-card cozy-card">
            <button
              type="button"
              className="wishlist-remove"
              onClick={() => handleRemove(item.id)}
              aria-label="Remove from wishlist"
            >
              <X size={18} />
            </button>

            <Link to={`/product/${item.id}`} className="wishlist-image-link">
              <img
                src={item.image}
                alt={item.title}
                className="wishlist-image"
              />
            </Link>

            <div className="wishlist-info">
              <span className="product-category">{item.category}</span>
              <h3 className="wishlist-title">{item.title}</h3>
              <span className="wishlist-price">
                ${item.price.toFixed(2)}
              </span>
              <button
                type="button"
                className="cozy-btn wishlist-add-btn"
                onClick={() => handleAddToCart(item.id)}
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;