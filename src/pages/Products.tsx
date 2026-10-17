import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import type { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../store/productsSlice';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'groceries', label: 'Foodstuff' },
  { id: 'fragrances', label: 'Personal Care' },
  { id: 'womens-dresses', label: 'Women' },
  { id: 'mens-shirts', label: 'Men' },
  { id: 'home-decoration', label: 'Domestic' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    void dispatch(fetchProducts(activeCategory));
  }, [dispatch, activeCategory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="cozy-headline">Campus Essentials</h1>
        <p className="products-subtitle">
          Cozy finds for your hostel room 🏡
        </p>

        <div className="products-search">
          <Search size={18} className="search-icon" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search items..."
            className="cozy-input"
            aria-label="Search products"
          />
        </div>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`category-tab ${
              activeCategory === cat.id ? 'active' : ''
            }`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && <div className="products-status">Loading cozy finds…</div>}

      {error && !loading && (
        <div className="products-status error">
          Couldn&apos;t load products: {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="products-status">No items match your search.</div>
      )}

      <div className="products-grid">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;