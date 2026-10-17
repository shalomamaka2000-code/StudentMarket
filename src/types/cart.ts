export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}