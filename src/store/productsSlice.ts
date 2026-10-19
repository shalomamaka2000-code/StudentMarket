
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { api } from '../server/src/config/api';
import type { Product, Gender } from '../types/product';

interface ApiCategory {
  id: number;
  name: string;
}

interface ApiVendor {
  id: number;
  businessName: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
  active: boolean;
  createdAt?: string;
  category: ApiCategory | null;
  vendor: ApiVendor | null;
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

  if (
    c.includes('fragrance') ||
    c.includes('beauty') ||
    c.includes('fashion')
  ) {
    if (t.includes('men') || t.includes('male')) {
      return 'male';
    }

    if (t.includes('women') || t.includes('female')) {
      return 'female';
    }
  }

  return 'unisex';
};

const mapApiProduct = (p: ApiProduct): Product => ({
  id: p.id,
  title: p.name,
  price: p.price,
  description: p.description,
  category: p.category?.name ?? 'Uncategorized',
  image: p.imageUrl ?? '',
  rating: 0,
  reviews: 0,
  gender: determineGender(
    p.name,
    p.category?.name ?? ''
  ),
  inStock: p.active && p.stockQuantity > 0,
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

      const { data } = await api.get<ApiProduct[]>(
        '/products',
        { params }
      );

      return data
        .filter(product => product.active)
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
