import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import axios from 'axios';
import './TrackOrder.css';

interface TrackData {
  trackingId: string;
  status: string;
  items: { title: string; quantity: number }[];
  createdAt: string;
}

const STEPS = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];

const TrackOrder: React.FC = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [data, setData] = useState<TrackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<TrackData>(`/orders/track/${trackingId}`);
        setData(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) setError(err.response?.data?.message ?? 'Not found');
      }
    })();
  }, [trackingId]);

  if (error) return <div className="track-page"><p>{error}</p></div>;
  if (!data) return <div className="track-page"><p>Loading…</p></div>;

  const currentIdx = STEPS.indexOf(data.status);

  return (
    <div className="track-page">
      <h1 className="cozy-headline">Track Your Order</h1>
      <p className="track-id">Tracking ID: <strong>{data.trackingId}</strong></p>

      <div className="track-steps">
        {STEPS.map((step, i) => (
          <div key={step} className={`track-step ${i <= currentIdx ? 'done' : ''}`}>
            <div className="track-dot" />
            <span>{step.replace(/-/g, ' ')}</span>
          </div>
        ))}
      </div>

      <div className="track-items cozy-card">
        <h2 className="cozy-subheadline">Items</h2>
        {data.items.map((i, idx) => (
          <div key={idx} className="track-item">
            <span>{i.title}</span>
            <span>× {i.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackOrder;