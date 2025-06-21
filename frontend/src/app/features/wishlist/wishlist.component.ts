import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { ImageService } from '../../core/services/image.service';
import { Product } from '../../core/models/product.model';
import { CustomerHeaderComponent } from '../../shared/components/customer-header/customer-header.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, CustomerHeaderComponent]
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe((items: Product[]) => {
      this.wishlist = items;
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  getProductImagePath(product: Product): string {
    if (!product.category || !product.name) {
      return this.imageService.getDefaultImageUrl();
    }
    
    // If product has an imagePath, make sure it uses .png extension
    if (product.imagePath) {
      if (!product.imagePath.toLowerCase().endsWith('.png')) {
        const fixedPath = product.imagePath.replace(/\.[^.]+$/, '.png');
        return this.imageService.getSafeUrl(fixedPath);
      }
      return this.imageService.getSafeUrl(product.imagePath);
    }
    
    // Fallback to safe product image URL using category and name
    return this.imageService.getSafeProductImageUrl(
      product.category,
      product.name
    );
  }

  continueShopping(): void {
    window.location.href = '/products';
  }
}