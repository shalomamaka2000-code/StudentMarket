import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import type { Product } from '../types/product';
import type { AppDispatch, RootState } from '../store';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import toast from 'react-hot-toast';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const inWishlist = useSelector((state: RootState) =>
    state.wishlist.items.some(i => i.id === product.id)
  );

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1,
      })
    );
    toast.success(`${product.title} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
      })
    );
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card cozy-card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
        <button
          type="button"
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
        {!product.inStock && <span className="out-of-stock">Out of stock</span>}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>

        <div className="product-rating">
          <Star size={14} fill="#C67B5C" color="#C67B5C" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="review-count">({product.reviews})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            type="button"
            className="cozy-btn add-btn"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;