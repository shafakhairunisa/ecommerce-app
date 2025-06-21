import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { Product } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';
import { TopNavbarComponent } from '../../../shared/components/top-navbar/top-navbar.component';
import { MatIconModule } from '@angular/material/icon';  // Add this import

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    TopNavbarComponent,
    MatIconModule  // Include MatIconModule for icons
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  categories: string[] = [];
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.extractCategories();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders';
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

  navigateToAddProduct() {
    this.router.navigate(['/adminpage/add-product']);
  }
}