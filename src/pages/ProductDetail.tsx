import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../store/productsSlice';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import toast from 'react-hot-toast';
import './ProductDetail.css';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Amara O.',
    rating: 5,
    comment: 'Exactly what I needed for my room. Fast delivery to Block C!',
    date: '2 days ago',
  },
  {
    id: 2,
    author: 'Tunde A.',
    rating: 4,
    comment: 'Good quality, arrived in perfect condition. Would buy again.',
    date: '1 week ago',
  },
  {
    id: 3,
    author: 'Zainab M.',
    rating: 5,
    comment: 'Cozy and affordable. Perfect for hostel life.',
    date: '2 weeks ago',
  },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading } = useSelector((state: RootState) => state.products);
  const inWishlist = useSelector((state: RootState) =>
    state.wishlist.items.some(i => String(i.id) === id)
  );

  const [quantity, setQuantity] = useState(1);

  const product = items.find(p => String(p.id) === id);

  useEffect(() => {
    if (!product && !loading) {
      void dispatch(fetchProducts('all'));
    }
  }, [dispatch, product, loading]);

  if (loading || !product) {
    return (
      <div className="product-detail-status">
        {loading ? 'Loading…' : 'Product not found.'}
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity,
      })
    );
    toast.success(`${quantity} × ${product.title} added to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
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
    <div className="product-detail-page">
      <button
        type="button"
        className="back-link"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="product-detail-grid">
        <div className="product-detail-image cozy-card">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1 className="cozy-headline product-detail-title">
            {product.title}
          </h1>

          <div className="product-detail-rating">
            {[1, 2, 3, 4, 5].map(n => (
              <Star
                key={n}
                size={18}
                fill={n <= Math.round(product.rating) ? '#C67B5C' : 'none'}
                color="#C67B5C"
              />
            ))}
            <span>
              {product.rating.toFixed(1)} · {product.reviews} reviews
            </span>
          </div>

          <p className="product-detail-price">
            ${product.price.toFixed(2)}
          </p>

          <p className="product-detail-desc">{product.description}</p>

          <div className="product-detail-meta">
            <div className="meta-item">
              <Truck size={18} />
              <span>Hostel delivery in 30 min</span>
            </div>
            <div className="meta-item">
              <ShieldCheck size={18} />
              <span>Verified campus seller</span>
            </div>
          </div>

          <div className="quantity-selector">
            <label htmlFor="qty">Quantity</label>
            <div className="qty-controls">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id="qty"
                type="number"
                min={1}
                value={quantity}
                onChange={e =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
              />
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="product-detail-actions">
            <button
              type="button"
              className="cozy-btn"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              type="button"
              className="cozy-btn cozy-btn-outline"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
            </button>
            <button
              type="button"
              className={`wishlist-toggle ${inWishlist ? 'active' : ''}`}
              onClick={handleToggleWishlist}
              aria-label="Toggle wishlist"
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2 className="cozy-subheadline">Customer Reviews</h2>
        <div className="reviews-list">
          {MOCK_REVIEWS.map(review => (
            <div key={review.id} className="review-card cozy-card">
              <div className="review-header">
                <strong>{review.author}</strong>
                <span className="review-date">{review.date}</span>
              </div>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star
                    key={n}
                    size={14}
                    fill={n <= review.rating ? '#C67B5C' : 'none'}
                    color="#C67B5C"
                  />
                ))}
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;