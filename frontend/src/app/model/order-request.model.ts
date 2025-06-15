export interface OrderItem {
  product: { id: number };
  quantity: number;
  price: number;
}

export interface OrderRequest {
  orderItems: OrderItem[];
  userVoucherId?: number;
  deliveryFee: number;
}
