import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlistKey = 'wishlist';
  private wishlistSubject = new BehaviorSubject<Product[]>(this.getWishlistFromStorage());

  get wishlist$(): Observable<Product[]> {
    return this.wishlistSubject.asObservable();
  }

  private getWishlistFromStorage(): Product[] {
    const data = localStorage.getItem(this.wishlistKey);
    return data ? JSON.parse(data) : [];
  }

  private saveWishlistToStorage(wishlist: Product[]) {
    localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
  }

  getWishlist(): Product[] {
    return this.wishlistSubject.value;
  }

  addToWishlist(product: Product) {
    const wishlist = this.getWishlist();
    if (!wishlist.find(p => p.productId === product.productId)) {
      wishlist.push(product);
      this.saveWishlistToStorage(wishlist);
      this.wishlistSubject.next(wishlist);
    }
  }

  removeFromWishlist(productId: number) {
    let wishlist = this.getWishlist();
    wishlist = wishlist.filter(p => p.productId !== productId);
    this.saveWishlistToStorage(wishlist);
    this.wishlistSubject.next(wishlist);
  }

  isInWishlist(productId: number): boolean {
    return !!this.getWishlist().find(p => p.productId === productId);
  }

  clearWishlist() {
    this.saveWishlistToStorage([]);
    this.wishlistSubject.next([]);
  }
}