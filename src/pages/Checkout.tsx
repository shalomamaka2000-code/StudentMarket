import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../store';
import { clearCart } from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Checkout.css';

type Step = 'delivery' | 'payment' | 'confirm';

interface DeliveryInfo {
  name: string;
  hostel: string;
  roomNumber: string;
  phone: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const DELIVERY_FEE = 2.5;

const Checkout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const [step, setStep] = useState<Step>('delivery');
  const [processing, setProcessing] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryInfo>({
    name: user?.name ?? '',
    hostel: user?.hostel ?? '',
    roomNumber: user?.roomNumber ?? '',
    phone: '',
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const grandTotal = total + DELIVERY_FEE;

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty cozy-card">
          <h1 className="cozy-headline">Nothing to checkout</h1>
          <p>Your cart is empty.</p>
          <button
            type="button"
            className="cozy-btn"
            onClick={() => navigate('/products')}
          >
            Shop now
          </button>
        </div>
      </div>
    );
  }

  const handleDeliverySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    dispatch(clearCart());
    toast.success('Order placed! 🎉 Delivering to your hostel shortly.');
    setProcessing(false);
    navigate('/');
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'delivery', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' },
  ];

  return (
    <div className="checkout-page">
      <h1 className="cozy-headline">Checkout</h1>

      <div className="checkout-stepper">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div
              className={`step ${step === s.id ? 'active' : ''} ${
                steps.findIndex(x => x.id === step) > idx ? 'done' : ''
              }`}
            >
              <div className="step-circle">{idx + 1}</div>
              <span>{s.label}</span>
            </div>
            {idx < steps.length - 1 && <div className="step-line" />}
          </React.Fragment>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main cozy-card">
          {step === 'delivery' && (
            <form onSubmit={handleDeliverySubmit} className="checkout-form">
              <h2 className="cozy-subheadline">
                <MapPin size={20} /> Delivery Details
              </h2>

              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className="cozy-input"
                  value={delivery.name}
                  onChange={e =>
                    setDelivery(d => ({ ...d, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="hostel">Hostel</label>
                  <input
                    id="hostel"
                    className="cozy-input"
                    value={delivery.hostel}
                    onChange={e =>
                      setDelivery(d => ({ ...d, hostel: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="roomNumber">Room</label>
                  <input
                    id="roomNumber"
                    className="cozy-input"
                    value={delivery.roomNumber}
                    onChange={e =>
                      setDelivery(d => ({ ...d, roomNumber: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  className="cozy-input"
                  value={delivery.phone}
                  onChange={e =>
                    setDelivery(d => ({ ...d, phone: e.target.value }))
                  }
                  required
                />
              </div>

              <button type="submit" className="cozy-btn full-width">
                Continue to Payment
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="checkout-form">
              <h2 className="cozy-subheadline">
                <CreditCard size={20} /> Payment Method
              </h2>

              <div className="input-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  id="cardNumber"
                  className="cozy-input"
                  placeholder="4242 4242 4242 4242"
                  value={payment.cardNumber}
                  onChange={e =>
                    setPayment(p => ({ ...p, cardNumber: e.target.value }))
                  }
                  required
                  maxLength={19}
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="expiry">Expiry</label>
                  <input
                    id="expiry"
                    className="cozy-input"
                    placeholder="MM/YY"
                    value={payment.expiry}
                    onChange={e =>
                      setPayment(p => ({ ...p, expiry: e.target.value }))
                    }
                    required
                    maxLength={5}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    className="cozy-input"
                    placeholder="123"
                    value={payment.cvv}
                    onChange={e =>
                      setPayment(p => ({ ...p, cvv: e.target.value }))
                    }
                    required
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="cozy-btn cozy-btn-outline"
                  onClick={() => setStep('delivery')}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button type="submit" className="cozy-btn">
                  Review Order
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {step === 'confirm' && (
            <div className="checkout-form">
              <h2 className="cozy-subheadline">
                <CheckCircle2 size={20} /> Review & Confirm
              </h2>

              <div className="confirm-block">
                <h3>Delivering to</h3>
                <p>
                  {delivery.name} · {delivery.hostel}, Room{' '}
                  {delivery.roomNumber}
                </p>
                <p>{delivery.phone}</p>
              </div>

              <div className="confirm-block">
                <h3>Payment</h3>
                <p>
                  Card ending in {payment.cardNumber.slice(-4) || '••••'}
                </p>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="cozy-btn cozy-btn-outline"
                  onClick={() => setStep('payment')}
                  disabled={processing}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  type="button"
                  className="cozy-btn"
                  onClick={handlePlaceOrder}
                  disabled={processing}
                >
                  {processing ? 'Processing…' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="checkout-summary cozy-card">
          <h2 className="cozy-subheadline">Summary</h2>
          {items.map(item => (
            <div key={item.id} className="summary-item">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Delivery</span>
            <span>${DELIVERY_FEE.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;