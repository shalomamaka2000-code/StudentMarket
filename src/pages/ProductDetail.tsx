
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft,Heart,ShoppingCart,Star,Truck,ShieldCheck,} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

import type { AppDispatch, RootState } from '../store';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { api } from '../api';

import './ProductDetail.css';

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
  category?: {
    id: number;
    name: string;
  } | null;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

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
    comment: 'Exactly what I needed for my room. Fast delivery!',
    date: '2 days ago',
  },
  {
    id: 2,
    author: 'Tunde A.',
    rating: 4,
    comment: 'Good quality, arrived in perfect condition.',
    date: '1 week ago',
  },
  {
    id: 3,
    author: 'Zainab M.',
    rating: 5,
    comment: 'Cozy and affordable. Would buy again.',
    date: '2 weeks ago',
  },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const inWishlist = useSelector((state: RootState) =>
    state.wishlist.items.some(item => String(item.id) === id)
  );

  useEffect(() => {
    if (!id) {
      setError('Invalid product ID.');
      setLoading(false);
      return;
    }

    let alive = true;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const { data } = await api.get<ApiProduct>(
          `/products/${id}`
        );

        if (!alive) return;

        setProduct({
          id: data.id,
          title: data.name,
          price: Number(data.price),
          description: data.description,
          category: data.category?.name ?? 'Uncategorized',
          image: data.imageUrl ?? '',
          rating: 0,
          reviews: 0,
          inStock: data.stockQuantity > 0,
        });
      } catch (err: unknown) {
        if (!alive) return;

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.status === 404
              ? 'Product not found.'
              : err.response?.data?.message ??
                  'Unable to load product. Please try again.'
          );
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      alive = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!product.inStock) {
      toast.error('This product is out of stock.');
      return;
    }

    // Adjust this payload if your cartSlice expects another shape.
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
      })
    );

    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!product.inStock) {
      toast.error('This product is out of stock.');
      return;
    }

    handleAddToCart();
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    dispatch(toggleWishlist(product));
    toast.success(
      inWishlist
        ? 'Removed from wishlist.'
        : 'Added to wishlist!'
    );
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
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

        <p role="alert">
          {error ?? 'Product not found.'}
        </p>

        <button type="button" onClick={() => navigate('/products')}>
          Browse products
        </button>
      </div>
    );
  }

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
          {product.image ? (
            <img src={product.image} alt={product.title} />
          ) : (
            <div className="product-image-placeholder">
              No image available
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-category">
            {product.category}
          </span>

          <h1 className="cozy-headline product-detail-title">
            {product.title}
          </h1>

          <div className="product-detail-rating">
            {[1, 2, 3, 4, 5].map(n => (
              <Star
                key={n}
                size={18}
                fill="none"
                color="#C67B5C"
              />
            ))}
            <span>Reviews coming soon</span>
          </div>

          <p className="product-detail-price">
            ₦{product.price.toLocaleString('en-NG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="product-detail-desc">
            {product.description}
          </p>

          <div className="product-detail-meta">
            <div className="meta-item">
              <Truck size={18} />
              <span>Delivery information available at checkout</span>
            </div>

            <div className="meta-item">
              <ShieldCheck size={18} />
              <span>Secure shopping</span>
            </div>
          </div>

          <p>
            {product.inStock
              ? 'In stock'
              : 'Out of stock'}
          </p>

          <div className="quantity-selector">
            <label htmlFor="qty">Quantity</label>

            <div className="qty-controls">
              <button
                type="button"
                onClick={() =>
                  setQuantity(q => Math.max(1, q - 1))
                }
                aria-label="Decrease quantity"
              >
                −
              </button>

              <input
                id="qty"
                type="number"
                min={1}
                max={999}
                value={quantity}
                onChange={event => {
                  const value = Number(event.target.value);

                  if (Number.isInteger(value) && value >= 1) {
                    setQuantity(Math.min(value, 999));
                  }
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setQuantity(q => Math.min(999, q + 1))
                }
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
              className={`wishlist-toggle ${
                inWishlist ? 'active' : ''
              }`}
              onClick={handleToggleWishlist}
              aria-label="Toggle wishlist"
            >
              <Heart
                size={20}
                fill={inWishlist ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2 className="cozy-subheadline">
          Customer Reviews
        </h2>

        <div className="reviews-list">
          {MOCK_REVIEWS.map(review => (
            <div
              key={review.id}
              className="review-card cozy-card"
            >
              <div className="review-header">
                <strong>{review.author}</strong>
                <span className="review-date">
                  {review.date}
                </span>
              </div>

              <div className="review-stars">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star
                    key={n}
                    size={14}
                    fill={
                      n <= review.rating
                        ? '#C67B5C'
                        : 'none'
                    }
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
