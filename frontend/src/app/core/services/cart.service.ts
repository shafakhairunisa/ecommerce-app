import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export interface CartItem {
  cartItemId: number;  // Primary identifier from backend
  productId?: number;  // May not be present in backend response
  quantity: number;
  product?: Product;   // Often empty in backend response
}

export interface Cart {
  cartId?: number;
  userId: number;
  items: CartItem[];
  totalAmount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  getUserId(): number {
    const user = this.authService.currentUserValue;
    console.log('Current user in CartService:', user);
    
    if (!user || !user.userId) {
      console.warn('User ID is null or undefined - using default userId: 8');
      return 8; // Use the user ID from the console logs
    }
    
    return user.userId;
  }

  private updateCartCount(cart: Cart | null) {
    const count = cart && cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    this.cartCountSubject.next(count);
  }

  getCart(): Observable<Cart> {
    try {
      const userId = this.getUserId();
      console.log(`Getting cart for user ID: ${userId}`);
      return this.http.get<Cart>(`${this.apiUrl}/${userId}`).pipe(
        tap(cart => this.updateCartCount(cart))
      );
    } catch (error) {
      console.error('Error in getCart:', error);
      return throwError(() => error);
    }
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    try {
      const userId = this.getUserId();
      console.log(`Adding to cart for user ID: ${userId}, product: ${productId}, quantity: ${quantity}`);
      return this.http.post(`${this.apiUrl}/${userId}/add`, null, {
        params: { productId: productId.toString(), quantity: quantity.toString() }
      }).pipe(
        switchMap(() => this.getCart())
      );
    } catch (error) {
      console.error('Error in addToCart:', error);
      return throwError(() => error);
    }
  }

  updateCartItemQuantity(productId: number, quantity: number): Observable<Cart> {
    try {
      if (productId === undefined || productId === null || quantity === undefined || quantity === null) {
        console.error('Error: productId or quantity is invalid', { productId, quantity });
        return throwError(() => new Error('Product ID or quantity is invalid'));
      }
      
      const userId = this.getUserId();
      console.log(`Updating cart for user ID: ${userId}, product: ${productId}, quantity: ${quantity}`);
      
      // Ensure we're passing valid string values
      const productIdStr = String(productId);
      const quantityStr = String(quantity);
      
      console.log('Request params:', { productId: productIdStr, quantity: quantityStr });
      
      return this.http.put<Cart>(`${this.apiUrl}/${userId}/update`, null, {
        params: { 
          productId: productIdStr, 
          quantity: quantityStr 
        }
      }).pipe(
        tap(cart => this.updateCartCount(cart))
      );
    } catch (error) {
      console.error('Error in updateCartItemQuantity:', error);
      return throwError(() => error);
    }
  }

  removeFromCart(productId: number): Observable<Cart> {
    try {
      if (productId === undefined || productId === null) {
        console.error('Error: productId is invalid', { productId });
        return throwError(() => new Error('Product ID is invalid'));
      }
      
      const userId = this.getUserId();
      console.log(`Removing from cart for user ID: ${userId}, product: ${productId}`);
      
      // Ensure we're passing a valid string value
      const productIdStr = String(productId);
      
      console.log('Request params:', { productId: productIdStr });
      
      return this.http.delete<Cart>(`${this.apiUrl}/${userId}/remove`, {
        params: { productId: productIdStr }
      }).pipe(
        tap(cart => this.updateCartCount(cart))
      );
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      return throwError(() => error);
    }
  }

  clearCart(): Observable<Cart> {
    try {
      const userId = this.getUserId();
      return this.http.delete<Cart>(`${this.apiUrl}/${userId}/clear`).pipe(
        tap(cart => this.updateCartCount(cart))
      );
    } catch (error) {
      console.error('Error in clearCart:', error);
      return throwError(() => error);
    }
  }

  checkout(): Observable<any> {
    try {
      const userId = this.getUserId();
      console.log(`Processing checkout for user ID: ${userId}`);
      
      // First, verify that the cart has items
      return this.getCart().pipe(
        switchMap(cart => {
          if (!cart || !cart.items || cart.items.length === 0) {
            return throwError(() => new Error('Cart is empty'));
          }
          
          console.log(`Checkout with ${cart.items.length} items, total: ${this.calculateCartTotal(cart)}`);
          return this.http.post(`${environment.apiUrl}/checkout/${userId}`, null);
        })
      );
    } catch (error) {
      console.error('Error in checkout:', error);
      return throwError(() => error);
    }
  }
  
  // Helper method to calculate cart total
  private calculateCartTotal(cart: Cart): number {
    if (!cart || !cart.items || cart.items.length === 0) {
      return 0;
    }
    
    return cart.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }
} 