
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { api } from '../api';
import type { Product, Gender } from '../types/product';

export interface ApiProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  image?: string | null;
  stock: number;
  vendor: string | { _id: string; name?: string };
  isHidden: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const determineGender = (
  title: string,
  category: string
): Gender => {
  const t = title.toLowerCase();
  const c = category.toLowerCase();

  if (c.includes('mens-shirts')) return 'male';
  if (c.includes('womens-dresses')) return 'female';

  if (
    c.includes('fragrances') ||
    c.includes('beauty') ||
    c.includes('fashion')
  ) {
    if (t.includes('men') || t.includes('male')) return 'male';
    if (t.includes('women') || t.includes('female')) return 'female';
  }

  return 'unisex';
};

const mapApiProduct = (p: ApiProduct): Product => ({
  id: p._id,
  title: p.title,
  price: p.price,
  description: p.description ?? '',
  category: p.category,
  image: p.image ?? '',
  rating: 0,
  reviews: 0,
  gender: determineGender(p.title, p.category),
  inStock: !p.isHidden && p.stock > 0,
});

export const fetchProducts = createAsyncThunk<
  Product[],
  string | undefined,
  { rejectValue: string }
>(
  'products/fetchProducts',
  async (category, { rejectWithValue }) => {
    try {
      const params =
        category && category !== 'all'
          ? { category }
          : {};

      const { data } = await api.get<ApiProduct[]>('/products', {
        params,
      });

      return data
        .filter(product => !product.isHidden)
        .map(mapApiProduct);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ??
            error.message ??
            'Failed to fetch products'
        );
      }

      return rejectWithValue('Failed to fetch products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? 'Failed to fetch products';
      });
  },
});

export default productsSlice.reducer;
