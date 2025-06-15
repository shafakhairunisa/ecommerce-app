import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // ✅ ADD THIS

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: Product[] = [];

  constructor(private http: HttpClient) {} // ✅ INJECT HttpClient PROPERLY

  addToWishlist(product: Product): void {
    // Avoid duplicates
    const exists = this.wishlistItems.find(item => item.id === product.id);
    if (!exists) {
      this.wishlistItems.push(product);
    }
  }


  removeFromWishlist(productId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
  }

  getWishlist(): Product[] {
    return this.wishlistItems;
  }

  clearWishlist(): void {
    this.wishlistItems = [];
  }
}
