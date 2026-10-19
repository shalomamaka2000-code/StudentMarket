import React, { useEffect, useState } from 'react';
import { api } from '../server/src/config/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import './VendorDashboard.css';

interface VendorProduct {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
}

const CATEGORIES = ['groceries', 'fragrances', 'mens-shirts', 'womens-dresses', 'home-decoration', 'beauty'];

const VendorDashboard: React.FC = () => {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [form, setForm] = useState({
    title: '',
    price: '',
    stock: '',
    category: CATEGORIES[0],
    description: '',
    image: '',
  });

  const load = async () => {
    const { data } = await api.get<VendorProduct[]>('/products');
    setProducts(data);
  };

  useEffect(() => { void load(); }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      toast.success('Product added');
      setForm({ title: '', price: '', stock: '', category: CATEGORIES[0], description: '', image: '' });
      await load();
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message ?? 'Failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      setProducts(p => p.filter(x => x._id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message ?? 'Failed');
    }
  };

  return (
    <div className="vendor-page">
      <h1 className="cozy-headline">Vendor Dashboard</h1>

      <form onSubmit={handleCreate} className="cozy-card vendor-form">
        <h2 className="cozy-subheadline"><Plus size={18} /> Add Product</h2>

        <input className="cozy-input" placeholder="Title" value={form.title}
               onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        <input className="cozy-input" type="number" placeholder="Price" value={form.price}
               onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
        <input className="cozy-input" type="number" placeholder="Stock" value={form.stock}
               onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
        <select className="cozy-input" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="cozy-input" placeholder="Image URL" value={form.image}
               onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
        <textarea className="cozy-input" placeholder="Description" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

        <button className="cozy-btn" type="submit">Add Product</button>
      </form>

      <div className="vendor-list">
        {products.map(p => (
          <div key={p._id} className="cozy-card vendor-row">
            <div>
              <strong>{p.title}</strong>
              <span>${p.price.toFixed(2)} · {p.stock} left · {p.category}</span>
            </div>
            <button className="remove-btn" onClick={() => handleDelete(p._id)}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboard;