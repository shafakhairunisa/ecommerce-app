import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
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

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // User Management
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  updateUserRole(userId: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/users/${userId}/role`, {
      role,
    });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${userId}`);
  }

  // Product Management
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      tap((products) => console.log('Products fetched:', products)),
      catchError(this.handleError<Product[]>('getProducts', []))
    );
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/admin/products/${productId}`);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/products`, {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl,
    });
  }

  updateProduct(productId: number, product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/admin/products/${productId}`,
      {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        imageUrl: product.imageUrl,
      }
    );
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/products/${productId}`);
  }

  // Order Management
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/admin/orders`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(
      `${this.apiUrl}/admin/orders/${orderId}/status`,
      {
        status,
      }
    );
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
