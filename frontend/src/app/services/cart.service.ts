import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = '/api/customer/cart';
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const stored = localStorage.getItem('cartItems');
    if (stored) {
      this.cartItemsSubject.next(JSON.parse(stored));
    }
  }

  private saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  addToCart(product: Product): void {
    const currentCart = this.cartItemsSubject.value;

    // Check if product already in cart
    const existingItem = currentCart.find(item => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      // Increase existing quantity by 1
      updatedCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Add new product with quantity 1
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }

    this.cartItemsSubject.next(updatedCart);
    this.saveCartToStorage();
  }


  getCartItems(): Product[] {
    return this.cartItemsSubject.value;
  }

  removeFromCart(productId: number): void {
    const updated = this.cartItemsSubject.value.filter(item => item.id !== productId);
    this.cartItemsSubject.next(updated);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cartItems');
  }

  refreshCart(): void {
    this.loadCartFromStorage();
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

}
