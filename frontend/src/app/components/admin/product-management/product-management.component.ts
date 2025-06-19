import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Product } from '../../../services/admin.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  showAddProductForm = false;
  showEditProductForm = false;
  loading = false;
  error = '';
  success = '';

  // For creating a new product
  newProduct: Omit<Product, 'id'> = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
  };

  // For editing an existing product
  editingProduct: Product | null = null;

  // For category selection
  categories: string[] = [
    'Sos',
    'Rempah',
    'Minuman',
    'Mee',
    'Madu',
    'Lain-lain',
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';

    this.adminService.getProducts().subscribe({
      next: (products) => {
        console.log('Products loaded:', products);
        this.products = this.mapApiProductsToFrontend(products);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = `Failed to load products: ${
          error.message || 'Unknown error'
        }`;
        this.loading = false;
      },
    });
  }

  createProduct() {
    this.loading = true;
    this.error = '';

    console.log('Creating product:', this.newProduct);

    this.adminService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        console.log('Product created:', product);
        this.products.push(this.mapApiProductToFrontend(product));
        this.showAddProductForm = false;
        this.resetNewProduct();
        this.loading = false;
        this.success = 'Product created successfully!';
        setTimeout(() => (this.success = ''), 3000);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.error = `Failed to create product: ${
          error.error?.message || error.message || 'Unknown error'
        }`;
        this.loading = false;
      },
    });
  }

  startEdit(product: Product) {
    console.log('Starting edit for product:', product);
    this.editingProduct = { ...product };
    this.showEditProductForm = true;
  }

  cancelEdit() {
    this.editingProduct = null;
    this.showEditProductForm = false;
  }

  updateProduct() {
    if (!this.editingProduct) return;

    this.loading = true;
    this.error = '';

    console.log('Updating product:', this.editingProduct);

    this.adminService
      .updateProduct(this.editingProduct.id, this.editingProduct)
      .subscribe({
        next: (updatedProduct) => {
          console.log('Product updated:', updatedProduct);
          const frontendProduct = this.mapApiProductToFrontend(updatedProduct);
          const index = this.products.findIndex(
            (p) => p.id === frontendProduct.id
          );
          if (index !== -1) {
            this.products[index] = frontendProduct;
          }

          this.cancelEdit();
          this.loading = false;
          this.success = 'Product updated successfully!';
          setTimeout(() => (this.success = ''), 3000);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.error = `Failed to update product: ${
            error.error?.message || error.message || 'Unknown error'
          }`;
          this.loading = false;
        },
      });
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.error = '';

      console.log('Deleting product:', productId);

      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Product deleted:', productId);
          this.products = this.products.filter(
            (product) => product.id !== productId
          );
          this.loading = false;
          this.success = 'Product deleted successfully!';
          setTimeout(() => (this.success = ''), 3000);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.error = `Failed to delete product: ${
            error.error?.message || error.message || 'Unknown error'
          }`;
          this.loading = false;
        },
      });
    }
  }

  // Map API response to frontend model
  private mapApiProductsToFrontend(apiProducts: any[]): Product[] {
    return apiProducts.map((p) => this.mapApiProductToFrontend(p));
  }

  private mapApiProductToFrontend(p: any): Product {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.quantity,
      category: p.category?.name || '',
      imageUrl: p.imagePath || '',
    };
  }

  private resetNewProduct() {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      imageUrl: '',
    };
  }

  // Helper method to check if stock is low (less than 10)
  isLowStock(stock: number): boolean {
    return stock < 10;
  }

  // Method to get stock level class for styling
  getStockLevelClass(stock: number): string {
    if (stock === 0) return 'text-red-600 font-bold';
    if (stock < 5) return 'text-red-500';
    if (stock < 10) return 'text-orange-500';
    return 'text-green-500';
  }

  // Cancel add product form
  cancelAddProduct() {
    this.showAddProductForm = false;
    this.resetNewProduct();
  }

  // Dismiss error message
  dismissError() {
    this.error = '';
  }

  // Dismiss success message
  dismissSuccess() {
    this.success = '';
  }
}
