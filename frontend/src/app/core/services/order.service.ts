import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Product } from '../models/product.model';
import { Order, OrderItem } from '../models/order.model';

// Interface to match backend structure
interface BackendOrderItem {
  orderItemId: number;
  quantity: number;
  unitPrice: number;
  product: Product;
}

// Interface to match backend structure
interface BackendOrder {
  orderId: number;
  totalAmount: number;
  status: string;
  orderDate: string;
  user: {
    userId: number;
    username: string;
    email: string;
  };
  orderItems: BackendOrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getUserId(): number | null {
    const user = this.authService.currentUserValue;
    return user?.userId || null;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Map backend order to frontend order model
  private mapOrder(backendOrder: BackendOrder): Order {
    console.log('Mapping backend order:', backendOrder);
    
    // Map order items from backend to frontend model
    const items = backendOrder.orderItems?.map(item => {
      // Ensure product has all necessary fields for image display
      const product = item.product ? {
        ...item.product,
        category: item.product.category || '',
        name: item.product.name || 'Unknown Product',
        // Make sure imagePath is properly set if available
        imagePath: item.product.imagePath || null
      } : { 
        productId: 0, 
        name: 'Unknown Product', 
        price: 0, 
        category: '', 
        description: '', 
        stockQuantity: 0 
      };
      
      return {
        orderItemId: item.orderItemId,
        productId: product.productId || 0,
        quantity: item.quantity,
        price: item.unitPrice,
        product: product
      };
    }) || [];
    
    return {
      orderId: backendOrder.orderId,
      userId: backendOrder.user?.userId || 0,
      orderDate: new Date(backendOrder.orderDate),
      totalAmount: backendOrder.totalAmount,
      status: backendOrder.status,
      items: items,
      user: backendOrder.user
    };
  }

  getUserOrders(): Observable<Order[]> {
    const userId = this.getUserId();
    if (!userId) {
      console.warn('No user ID available, using fallback ID 8');
      return this.http.get<BackendOrder[]>(`${this.apiUrl}/8`)
        .pipe(
          map(orders => orders.map(order => this.mapOrder(order))),
          catchError(this.handleError)
        );
    }
    
    return this.http.get<BackendOrder[]>(`${this.apiUrl}/${userId}`)
      .pipe(
        map(orders => orders.map(order => this.mapOrder(order))),
        catchError(this.handleError)
      );
  }

  getOrderSummary(orderId: number): Observable<Order> {
    return this.http.get<BackendOrder>(`${this.apiUrl}/${orderId}/summary`)
      .pipe(
        map(order => this.mapOrder(order)),
        catchError(this.handleError)
      );
  }
  
  // Admin method to get all orders
  getAllOrders(): Observable<Order[]> {
    const url = `${this.apiUrl}/admin/all`;
    console.log('Fetching all orders from:', url);
    
    // Try the main endpoint first
    return this.http.get<BackendOrder[]>(url)
      .pipe(
        map(orders => {
          console.log('Received orders from API:', orders);
          return orders.map(order => this.mapOrder(order));
        }),
        catchError((error) => {
          console.error('Error fetching orders from primary endpoint:', error);
          
          // If the primary endpoint fails, try the admin controller endpoint
          if (!environment.production && (error.status === 404 || error.status === 500)) {
            console.log('Trying alternative admin endpoint...');
            return this.http.get<any>(`${environment.apiUrl}/admin/orders`)
              .pipe(
                map(response => {
                  console.log('Received orders from admin endpoint:', response);
                  if (Array.isArray(response)) {
                    return response.map(order => this.mapAdminOrder(order));
                  }
                  return [];
                }),
                catchError(adminError => {
                  console.error('Error fetching from admin endpoint:', adminError);
                  console.warn('Using mock order data for development');
                  return of(this.getMockOrders());
                })
              );
          }
          
          // If we're in development mode and all endpoints fail, return mock data
          if (!environment.production) {
            console.warn('Using mock order data for development');
            return of(this.getMockOrders());
          }
          
          return this.handleError(error);
        })
      );
  }
  
  // Map order from admin controller format
  private mapAdminOrder(adminOrder: any): Order {
    // Map order items from admin controller format
    const items = adminOrder.orderItems?.map((item: any) => {
      // Ensure product has all necessary fields for image display
      const product = item.product ? {
        ...item.product,
        category: item.product.category || '',
        name: item.product.name || 'Unknown Product',
        // Make sure imagePath is properly set if available
        imagePath: item.product.imagePath || null
      } : { 
        productId: 0, 
        name: 'Unknown Product', 
        price: 0, 
        category: '', 
        description: '', 
        stockQuantity: 0 
      };
      
      return {
        orderItemId: item.orderItemId,
        productId: product.productId || 0,
        quantity: item.quantity,
        price: item.unitPrice,
        product: product
      };
    }) || [];
    
    return {
      orderId: adminOrder.orderId,
      userId: adminOrder.user?.userId || 0,
      orderDate: new Date(adminOrder.orderDate),
      totalAmount: adminOrder.totalAmount,
      status: adminOrder.status,
      items: items,
      user: adminOrder.user
    };
  }
  
  // Admin method to update order status
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    console.log(`Updating order ${orderId} status to ${status}`);
    
    // Using the admin API endpoint instead of the regular orders endpoint
    const url = `${environment.apiUrl}/admin/orders/${orderId}/status`;
    
    return this.http.patch<BackendOrder>(
      url, 
      { status }
    ).pipe(
      map(order => this.mapOrder(order)),
      catchError((error) => {
        console.error('Error updating order status:', error);
        
        // If in development mode, simulate a successful update
        if (!environment.production && (error.status === 404 || error.status === 500)) {
          console.warn('Simulating successful order status update in development mode');
          // Return a mock updated order
          const mockOrder = this.getMockOrders().find(o => o.orderId === orderId);
          if (mockOrder) {
            mockOrder.status = status;
            return of(mockOrder);
          }
        }
        
        // Extract error message from response if available
        let errorMessage = 'Failed to update order status';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  // Mock data for development/testing
  private getMockOrders(): Order[] {
    return [
      {
        orderId: 1,
        userId: 9,
        orderDate: new Date('2023-11-10T08:30:00'),
        totalAmount: 42.50,
        status: 'DELIVERED',
        items: [
          {
            orderItemId: 1,
            productId: 1,
            quantity: 2,
            price: 12.50,
            product: {
              productId: 1,
              name: 'Nasi Lemak',
              description: 'Traditional Malaysian coconut rice dish',
              price: 12.50,
              category: 'Malaysian',
              stockQuantity: 50,
              imagePath: 'assets/default-product.jpg'
            }
          },
          {
            orderItemId: 2,
            productId: 3,
            quantity: 1,
            price: 17.50,
            product: {
              productId: 3,
              name: 'Chicken Rice',
              description: 'Fragrant rice with steamed chicken',
              price: 17.50,
              category: 'Chinese',
              stockQuantity: 30
            }
          }
        ],
        user: {
          userId: 9,
          username: 'testuser',
          email: 'test@example.com'
        }
      },
      {
        orderId: 2,
        userId: 9,
        orderDate: new Date('2023-11-15T14:20:00'),
        totalAmount: 35.00,
        status: 'PROCESSING',
        items: [
          {
            orderItemId: 3,
            productId: 5,
            quantity: 2,
            price: 17.50,
            product: {
              productId: 5,
              name: 'Mee Goreng',
              description: 'Spicy fried noodles',
              price: 17.50,
              category: 'Malaysian',
              stockQuantity: 25
            }
          }
        ],
        user: {
          userId: 9,
          username: 'testuser',
          email: 'test@example.com'
        }
      },
      {
        orderId: 3,
        userId: 9,
        orderDate: new Date('2023-11-20T18:45:00'),
        totalAmount: 63.00,
        status: 'PENDING',
        items: [
          {
            orderItemId: 4,
            productId: 8,
            quantity: 3,
            price: 21.00,
            product: {
              productId: 8,
              name: 'Satay',
              description: 'Grilled meat skewers with peanut sauce',
              price: 21.00,
              category: 'Malaysian',
              stockQuantity: 40
            }
          }
        ],
        user: {
          userId: 9,
          username: 'testuser',
          email: 'test@example.com'
        }
      }
    ];
  }
} 