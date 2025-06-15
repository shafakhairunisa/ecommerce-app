export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  category: { id: number | string, name: string };
  available: boolean;
}
