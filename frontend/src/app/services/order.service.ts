import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  private cachedStatuses: string[] | null = null;

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

  // Get available order statuses from the backend
  fetchOrderStatuses(): Observable<string[]> {
    // Return cached statuses if we have them
    if (this.cachedStatuses) {
      return of(this.cachedStatuses);
    }

    // Otherwise fetch from the server
    return this.http
      .get<string[]>(`${this.baseUrl}/admin/orders/statuses`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching order statuses:', error);
          return of(this.getDefaultOrderStatuses());
        })
      );
  }

  // Fallback method for default statuses if API fails
  getDefaultOrderStatuses(): string[] {
    return [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];
  }

  // For backward compatibility
  getOrderStatuses(): string[] {
    if (this.cachedStatuses) {
      return this.cachedStatuses;
    }
    return this.getDefaultOrderStatuses();
  }

  // Set cached statuses
  setCachedStatuses(statuses: string[]): void {
    this.cachedStatuses = statuses;
  }
}
