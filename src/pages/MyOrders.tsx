
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { api } from '../api';
import './MyOrders.css';

interface OrderItem {
  product: string;
  title: string;
  price: number;
  quantity: number;
}

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  status: OrderStatus;
  trackingId: string;
  createdAt: string;
}

const formatNaira = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

const formatStatus = (status: OrderStatus) =>
  status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get<Order[]>('/orders/my');
      setOrders(data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Could not load your orders.'
        : 'Something went wrong while loading your orders.';

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="my-orders-page">
        <p className="orders-message">Loading your orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-orders-page">
        <h1 className="cozy-headline">My Orders</h1>
        <div className="orders-message">
          <p>{error}</p>
          <button
            type="button"
            className="cozy-btn"
            onClick={() => void fetchOrders()}
          >
            <RefreshCw size={18} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="my-orders-page">
      <header className="my-orders-header">
        <div>
          <h1 className="cozy-headline">My Orders</h1>
          <p>Keep track of your StudentMarket purchases.</p>
        </div>

        <button
          type="button"
          className="cozy-btn cozy-btn-outline"
          onClick={() => void fetchOrders()}
          disabled={loading}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </header>

      {orders.length === 0 ? (
        <section className="orders-empty cozy-card">
          <Package size={42} />
          <h2>No orders yet</h2>
          <p>Your purchases will appear here after checkout.</p>
        </section>
      ) : (
        <section className="orders-list">
          {orders.map(order => (
            <article className="order-card cozy-card" key={order._id}>
              <div className="order-card-header">
                <div>
                  <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
                  <p>
                    {new Date(order.createdAt).toLocaleString('en-NG', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <span
                  className={`order-status status-${order.status}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div
                    className="order-item"
                    key={`${item.product}-${index}`}
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>
                      {formatNaira(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div>
                  <span className="order-total-label">Order total</span>
                  <strong>{formatNaira(order.total)}</strong>
                </div>

                <div className="order-tracking">
  <span>Tracking ID</span>
  <strong>{order.trackingId || 'Not assigned'}</strong>

  {order.trackingId && (
    <button
      type="button"
      className="cozy-btn cozy-btn-outline"
      onClick={() =>
        navigate(`/track-order/${encodeURIComponent(order.trackingId)}`)
      }
    >
      Track Order
    </button>
  )}
</div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default MyOrders;
