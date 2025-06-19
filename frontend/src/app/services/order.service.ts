import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal?: number;
  imagePath?: string;
}

export interface Order {
  id: number;
  userId: number;
  username: string;
  status: string;
  total: number;
  deliveryFee?: number;
  createdAt: string;
  itemCount?: number;
  items?: OrderItem[];
  shippingAddress?: string;
  paymentMethod?: string;
  voucherCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Get all orders (admin only)
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/admin/orders`);
  }

  // Get order by ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/admin/orders/${id}`);
  }

  // Update order status
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(
      `${this.baseUrl}/admin/orders/${orderId}/status`,
      { status }
    );
  }

  // Get available order statuses
  getOrderStatuses(): string[] {
    return [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];
  }

  // Get order counts by status (for dashboard)
  getOrderCounts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/orders/counts`);
  }

  // Cancel an order
  cancelOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/orders/${orderId}/cancel`, {});
  }
}
