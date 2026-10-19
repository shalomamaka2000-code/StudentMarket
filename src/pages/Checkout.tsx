
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
import axios from 'axios';
import toast from 'react-hot-toast';

import type { AppDispatch, RootState } from '../store';
import { clearCart } from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';
import { api } from '../server/src/config/api';

import './Checkout.css';

type Step = 'delivery' | 'payment' | 'confirm';

interface DeliveryInfo {
  name: string;
  hostel: string;
  roomNumber: string;
  phone: string;
}

const DELIVERY_FEE = 2500;

const Checkout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { items, total } = useSelector(
    (state: RootState) => state.cart
  );

  const [step, setStep] = useState<Step>('delivery');
  const [processing, setProcessing] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryInfo>({
    name: user?.name ?? '',
    hostel: user?.hostel ?? '',
    roomNumber: user?.roomNumber ?? '',
    phone: '',
  });

  const grandTotal = total + DELIVERY_FEE;

  const handleDeliverySubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (processing || items.length === 0) {
      return;
    }

    if (
      !delivery.name.trim() ||
      !delivery.hostel.trim() ||
      !delivery.roomNumber.trim() ||
      !delivery.phone.trim()
    ) {
      toast.error('Please complete all delivery details.');
      setStep('delivery');
      return;
    }

    setProcessing(true);

    try {
      const shippingAddress = [
        delivery.name.trim(),
        delivery.hostel.trim(),
        `Room ${delivery.roomNumber.trim()}`,
        `Phone: ${delivery.phone.trim()}`,
      ].join(', ');

      // The backend should obtain the authenticated user
      // and their cart from the server-side session/JWT.
      const { data } = await api.post('/orders', {
        shippingAddress,
      });

      // Clear the cart only after the backend accepts the order.
      dispatch(clearCart());

      toast.success('Order placed successfully!');

      const orderId = data?.id ?? data?.orderId;

      if (orderId != null) {
        navigate(`/orders/${orderId}`);
      } else {
        navigate('/orders');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        const message =
          responseData?.message ??
          (status === 401
            ? 'Please log in to place your order.'
            : status === 403
              ? 'You are not authorized to place this order.'
              : 'Could not place your order. Please try again.');

        toast.error(message);

        if (status === 401) {
          navigate('/login');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'delivery', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' },
  ];

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

  return (
    <div className="checkout-page">
      <h1 className="cozy-headline">Checkout</h1>

      <div className="checkout-stepper">
        {steps.map((item, index) => {
          const currentIndex = steps.findIndex(
            current => current.id === step
          );

          return (
            <React.Fragment key={item.id}>
              <div
                className={`step ${
                  step === item.id ? 'active' : ''
                } ${currentIndex > index ? 'done' : ''}`}
              >
                <div className="step-circle">{index + 1}</div>
                <span>{item.label}</span>
              </div>

              {index < steps.length - 1 && (
                <div className="step-line" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main cozy-card">
          {step === 'delivery' && (
            <form
              onSubmit={handleDeliverySubmit}
              className="checkout-form"
            >
              <h2 className="cozy-subheadline">
                <MapPin size={20} />
                Delivery Details
              </h2>

              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className="cozy-input"
                  value={delivery.name}
                  onChange={event =>
                    setDelivery(current => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="hostel">Address / Hostel</label>
                  <input
                    id="hostel"
                    className="cozy-input"
                    value={delivery.hostel}
                    onChange={event =>
                      setDelivery(current => ({
                        ...current,
                        hostel: event.target.value,
                      }))
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
                    onChange={event =>
                      setDelivery(current => ({
                        ...current,
                        roomNumber: event.target.value,
                      }))
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
                  onChange={event =>
                    setDelivery(current => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="cozy-btn full-width"
              >
                Continue to Payment
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="checkout-form">
              <h2 className="cozy-subheadline">
                <CreditCard size={20} />
                Payment Method
              </h2>

              <p>
                Online payment has not been integrated yet.
                This demo flow allows you to review and submit
                your order, but it does not collect payment.
              </p>

              <div className="button-row">
                <button
                  type="button"
                  className="cozy-btn cozy-btn-outline"
                  onClick={() => setStep('delivery')}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>

                <button
                  type="button"
                  className="cozy-btn"
                  onClick={() => setStep('confirm')}
                >
                  Review Order
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="checkout-form">
              <h2 className="cozy-subheadline">
                <CheckCircle2 size={20} />
                Review &amp; Confirm
              </h2>

              <div className="confirm-block">
                <h3>Delivering to</h3>
                <p>{delivery.name}</p>
                <p>
                  {delivery.hostel}, Room {delivery.roomNumber}
                </p>
                <p>{delivery.phone}</p>
              </div>

              <div className="confirm-block">
                <h3>Payment</h3>
                <p>
                  Payment will be handled when a payment provider
                  is integrated.
                </p>
              </div>

              <div className="confirm-block">
                <h3>Order total</h3>
                <p>
                  ₦{grandTotal.toLocaleString('en-NG')}
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
                  disabled={processing || items.length === 0}
                >
                  {processing ? 'Placing order…' : 'Place Order'}
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

              <span>
                ₦
                {(item.price * item.quantity).toLocaleString(
                  'en-NG'
                )}
              </span>
            </div>
          ))}

          <div className="summary-row">
            <span>Delivery</span>
            <span>
              ₦{DELIVERY_FEE.toLocaleString('en-NG')}
            </span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>
              ₦{grandTotal.toLocaleString('en-NG')}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
