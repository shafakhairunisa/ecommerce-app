import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { AdminTableComponent } from '../../../shared/components/admin-table/admin-table.component';
import { TopNavbarComponent } from '../../../shared/components/top-navbar/top-navbar.component';
import { ProductFormComponent } from '../../../shared/components/product-form/product-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    RouterModule,
    AdminTableComponent,
    TopNavbarComponent,
    ProductFormComponent
  ],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  activeTab: 'products' | 'add-product' = 'products';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  sortOrder: string = '';
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  productColumns = [
    { key: 'imagePath', header: 'Image' },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'price', header: 'Price' },
    { key: 'category', header: 'Category' },
    { key: 'stockQuantity', header: 'Stock' }
  ];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        if (this.products.length > 0) {
          this.applyFilters();
        }
      }
    });
    this.setActiveTabFromUrl(this.router.url);
  }

  setActiveTabFromUrl(url: string) {
    this.activeTab = url.includes('/add-product') ? 'add-product' : 'products';
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.extractCategories();
        if (this.selectedCategory) {
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
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
    if (!this.searchQuery && !this.selectedCategory && !this.sortOrder) {
      this.filteredProducts = [...this.products];
      this.loading = false;
      return;
    }
    this.productService.getFilteredProducts({
      query: this.searchQuery,
      category: this.selectedCategory,
      sortOrder: this.sortOrder
    }).subscribe({
      next: (data) => {
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error applying filters:', error);
        this.error = 'Failed to filter products';
        this.loading = false;
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortOrder = '';
    this.filteredProducts = [...this.products];
  }

  openAddProduct() {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.productService.createProduct(result).subscribe({
          next: () => {
            this.loadProducts();
            this.successMessage = 'Product created successfully';
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error creating product:', error);
            this.error = 'Failed to create product';
            this.loading = false;
            setTimeout(() => this.error = '', 3000);
          }
        });
      }
    });
  }

  handleProductFormSubmit(productData: any) {
    this.loading = true;
    this.productService.createProduct(productData).subscribe({
      next: () => {
        this.loadProducts();
        this.successMessage = 'Product created successfully';
        setTimeout(() => this.successMessage = '', 3000);
        this.router.navigate(['/adminpage/products']);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.error = 'Failed to create product';
        this.loading = false;
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  openEditProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        result.productId = product.productId;
        this.productService.updateProduct(product.productId!, result).subscribe({
          next: () => {
            this.loadProducts();
            this.successMessage = 'Product updated successfully';
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.error = 'Failed to update product';
            this.loading = false;
            setTimeout(() => this.error = '', 3000);
          }
        });
      }
    });
  }

  openDeleteProduct(product: Product) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Are you sure you want to delete ${product.name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loading = true;
        this.productService.deleteProduct(product.productId!).subscribe({
          next: () => {
            this.loadProducts();
            this.successMessage = 'Product deleted successfully';
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.error = 'Failed to delete product';
            this.loading = false;
            setTimeout(() => this.error = '', 3000);
          }
        });
      }
    });
  }
}