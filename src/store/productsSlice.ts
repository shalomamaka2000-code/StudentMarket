import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type {
  Product,
  Gender,
  ApiProduct,
  ApiProductsResponse,
} from '../types/product';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

const determineGender = (title: string, category: string): Gender => {
  const lowerTitle = title.toLowerCase();
  const lowerCategory = category.toLowerCase();

  const isGenderedCategory =
    lowerCategory.includes('fragrance') || lowerCategory.includes('beauty');

  if (isGenderedCategory) {
    if (lowerTitle.includes('men') || lowerTitle.includes('male')) return 'male';
    if (lowerTitle.includes('women') || lowerTitle.includes('female')) return 'female';
  }

  return 'unisex';
};

const mapApiProduct = (item: ApiProduct): Product => ({
  id: item.id,
  title: item.title,
  price: item.price,
  description: item.description,
  category: item.category,
  image: item.thumbnail,
  rating: item.rating,
  reviews: item.stock,
  gender: determineGender(item.title, item.category),
  inStock: item.stock > 0,
});

export const fetchProducts = createAsyncThunk<
  Product[],
  string | undefined,
  { rejectValue: string }
>('products/fetchProducts', async (category, { rejectWithValue }) => {
  try {
    const url =
      category && category !== 'all'
        ? `https://dummyjson.com/products/category/${category}`
        : 'https://dummyjson.com/products?limit=100';

    const response = await axios.get<ApiProductsResponse>(url);
    return response.data.products.map(mapApiProduct);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Failed to fetch products');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
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
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
      });
  },
});

export const { setSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;