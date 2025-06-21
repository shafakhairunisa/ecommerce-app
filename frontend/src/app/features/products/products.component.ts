import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

import { Product } from '../../core/models/product.model';
import { AuthService } from '../../core/services/auth.service';
import { ImageService } from '../../core/services/image.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerHeaderComponent } from '../../shared/components/customer-header/customer-header.component';

import { Subscription } from 'rxjs';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDialogModule,
    CustomerHeaderComponent,

  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = []; // Products after pagination is applied
  categories: string[] = [];
  cartItemCount: number = 0;
  cartAnimation: boolean = false;
  
  // Search and filter parameters
  searchQuery: string = '';
  selectedCategory: string = '';
  sortOrder: string = '';
  
  // Product being added to cart
  selectedProduct: Product | null = null;
  quantity: number = 1;
  
  // UI state
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';
  
  // Pagination
  pageSize = 12; // Number of products per page
  pageSizeOptions = [6, 12, 24, 48];
  pageIndex = 0;
  totalProducts = 0;

  // View mode
  viewMode: 'grid' | 'list' = 'grid';

  wishlist: Product[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private imageService: ImageService,

    private dialog: MatDialog,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.subscriptions.push(
      this.cartService.cartCount$.subscribe(count => {
        this.cartItemCount = count;
      })
    );
    this.wishlistService.wishlist$.subscribe((wishlist: Product[]) => {
      this.wishlist = wishlist;
    });
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions when component is destroyed
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Products loaded:', data.length);
        this.products = data;
        this.filteredProducts = [...this.products];
        this.totalProducts = data.length;
        this.updatePaginatedProducts();
        this.extractCategories();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set<string>();
    this.products.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    this.categories = Array.from(categorySet);
  }

  applyFilters(): void {
    this.loading = true;
    this.error = ''; // Clear any previous errors
    
    // Check if we're applying any filters
    const isFiltering = this.searchQuery || this.selectedCategory || this.sortOrder;
    
    if (!isFiltering) {
      // If no filters are applied, refresh all products
      this.productService.getAllProducts().subscribe({
        next: (data) => {
          this.products = data;
          this.filteredProducts = data;
          this.totalProducts = data.length;
          this.pageIndex = 0; // Reset to first page when filters change
          this.updatePaginatedProducts();

          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.error = 'Failed to load products. Please try again.';
          this.loading = false;
        }
      });
      return;
    }
    
    // Use the combined filter API
    const filterParams: any = {};
    
    // Only add parameters that have values
    if (this.searchQuery) filterParams.query = this.searchQuery;
    if (this.selectedCategory) filterParams.category = this.selectedCategory;
    if (this.sortOrder) filterParams.sortOrder = this.sortOrder;
    
    console.log('Applying filters with params:', filterParams);
    
    this.productService.getFilteredProducts(filterParams).subscribe({
      next: (data) => {
        console.log('Filtered products received:', data.length);
        this.filteredProducts = data;
        this.totalProducts = data.length;
        this.pageIndex = 0; // Reset to first page when filters change
        this.updatePaginatedProducts();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error applying filters:', error);
        this.error = 'Failed to filter products. Please try again.';
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortOrder = '';
    this.loading = true;
    
    // Refresh products from server
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.totalProducts = data.length;
        this.pageIndex = 0; // Reset to first page
        this.updatePaginatedProducts();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  // Handle pagination
  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaginatedProducts();
  }

  // Update the paginated products based on current page and page size
  updatePaginatedProducts(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    

  }

  openAddToCartModal(product: Product): void {
    this.selectedProduct = product;
    this.quantity = 1;
  }

  closeModal(): void {
    this.selectedProduct = null;
    this.quantity = 1;
  }

  increaseQuantity(): void {
    if (this.selectedProduct && this.quantity < this.selectedProduct.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  validateQuantity(): void {
    if (!this.selectedProduct) return;
    
    // Ensure quantity is a number
    if (isNaN(this.quantity)) {
      this.quantity = 1;
    }
    
    // Ensure quantity is an integer
    this.quantity = Math.floor(this.quantity);
    
    // Ensure quantity is within bounds
    if (this.quantity < 1) {
      this.quantity = 1;
    } else if (this.quantity > this.selectedProduct.stockQuantity) {
      this.quantity = this.selectedProduct.stockQuantity;
    }
  }

  addToCart(): void {
    if (!this.selectedProduct || !this.selectedProduct.productId) {
      this.error = 'Invalid product selected';
      this.loading = false;
      setTimeout(() => {
        this.error = '';
      }, 3000);
      return;
    }
    
    this.loading = true;
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.error = 'Please log in to add items to your cart';
      this.loading = false;
      setTimeout(() => {
        this.error = '';
      }, 3000);
      return;
    }
    
    this.cartService.addToCart(this.selectedProduct.productId, this.quantity).subscribe({
      next: (response) => {
        console.log('Added to cart:', response);
        this.successMessage = `${this.quantity} ${this.selectedProduct!.name} added to cart`;
        this.loading = false;
        this.closeModal();
        
        // Update cart count and show animation
        this.cartAnimation = true;
        setTimeout(() => {
          this.cartAnimation = false;
        }, 500);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.error = 'Failed to add item to cart. Please try again.';
        this.loading = false;
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    // Redirect to login page
    window.location.href = '/login';
  }

  getProductImagePath(product: Product): string {
    if (!product.category || !product.name) return this.imageService.getDefaultImageUrl();
    
    // If product has an imagePath, make sure it uses .png extension
    if (product.imagePath) {
      if (!product.imagePath.toLowerCase().endsWith('.png')) {
        console.log(`Converting image path to use .png extension: ${product.imagePath}`);
        const fixedPath = product.imagePath.replace(/\.[^.]+$/, '.png');
        return this.imageService.getSafeUrl(fixedPath);
      }
      return this.imageService.getSafeUrl(product.imagePath);
    }
    
    return this.imageService.getSafeProductImageUrl(product.category, product.name);
  }

  getEndIndex(): number {
    const endIndex = (this.pageIndex + 1) * this.pageSize;
    return Math.min(endIndex, this.totalProducts);
  }

  isNewProduct(product: Product): boolean {
    // Consider a product new if it was created within the last 30 days
    if (!product.createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(product.createdAt) > thirtyDaysAgo;
  }



  private showMessage(message: string, isError: boolean = false) {
    if (isError) {
      this.error = message;
      this.successMessage = '';
    } else {
      this.successMessage = message;
      this.error = '';
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
      if (isError) {
        this.error = '';
      } else {
        this.successMessage = '';
      }
    }, 3000);
  }



  addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}