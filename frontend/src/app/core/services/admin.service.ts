import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Order management
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }

  // Helper method to get info about image paths for product categories
  getProductImageGuidelines(): { category: string, examples: string[] }[] {
    return [
      {
        category: 'Books',
        examples: [
          'Book1.png',
          'Book2.png',
          'Book3.png'
        ]
      },
      {
        category: 'Electronics',
        examples: [
          'Electronics1.png',
          'Electronics2.png'
        ]
      },
      {
        category: 'Clothing',
        examples: [
          'Clothing1.png',
          'Clothing2.png',
          'Clothing3.png'
        ]
      }
    ];
  }
} 