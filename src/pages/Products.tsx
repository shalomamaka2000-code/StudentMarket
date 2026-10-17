import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom'; 
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
  { id: 'beauty', label: 'Beauty' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

const isCategoryId = (v: string | null): v is CategoryId =>
  !!v && CATEGORIES.some(c => c.id === v);

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const initial =
    isCategoryId(searchParams.get('category'))
      ? (searchParams.get('category') as CategoryId)
      : 'all';

  const [activeCategory, setActiveCategory] = useState<CategoryId>(initial);
  const [query, setQuery] = useState('');

  const { items, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    void dispatch(fetchProducts(activeCategory));
  }, [dispatch, activeCategory]);

  // Keep URL in sync when user clicks a tab
  const handleCategoryClick = (id: CategoryId) => {
    setActiveCategory(id);
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams, { replace: true });
  };

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
      {/* ...header & search unchanged... */}

      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`category-tab ${
              activeCategory === cat.id ? 'active' : ''
            }`}
            onClick={() => handleCategoryClick(cat.id)}
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