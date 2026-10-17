import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import type { AppDispatch, RootState } from '../store';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/cartSlice';
import toast from 'react-hot-toast';
import './Cart.css';

const DELIVERY_FEE = 2.5;

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleRemove = (id: number, title: string) => {
    dispatch(removeFromCart(id));
    toast.success(`${title} removed from cart`);
  };

  const handleQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClear = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  const grandTotal = total + (items.length > 0 ? DELIVERY_FEE : 0);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty cozy-card">
          <ShoppingBag size={48} className="empty-icon" />
          <h1 className="cozy-headline">Your cart is empty</h1>
          <p>Browse the marketplace and add some cozy finds.</p>
          <Link to="/products" className="cozy-btn">
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cozy-headline">Your Cart</h1>
        <button type="button" className="clear-btn" onClick={handleClear}>
          Clear all
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item cozy-card">
              <img
                src={item.image}
                alt={item.title}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <span className="product-category">{item.category}</span>
                <h3 className="cart-item-title">{item.title}</h3>
                <span className="cart-item-price">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <div className="cart-item-controls">
                <div className="qty-controls">
                  <button
                    type="button"
                    onClick={() => handleQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="cart-item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemove(item.id, item.title)}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary cozy-card">
          <h2 className="cozy-subheadline">Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Hostel delivery</span>
            <span>${DELIVERY_FEE.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className="cozy-btn checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>

          <Link to="/products" className="continue-link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;