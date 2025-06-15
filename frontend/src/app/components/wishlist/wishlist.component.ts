import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../model/product.model'; // Import your Product model
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlist = this.wishlistService.getWishlist();
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
    this.loadWishlist();
  }
}
