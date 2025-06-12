import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // User Management
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUserRole(userId: number, role: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, { role });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  // Product Management
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(productId: number, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${productId}`, product);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`);
  }

  // Order Management
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}`, { status });
  }
} 