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
  filteredProducts: Product[] = [];
  showAddProductForm = false;
  showEditProductForm = false;
  loading = false;
  error = '';
  success = '';
  searchTerm = '';
  selectedCategory = 'all';

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
    console.log('ProductManagementComponent initialized');
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    console.log('Attempting to load products...');

    this.adminService.getProducts().subscribe({
      next: (products) => {
        console.log('Products loaded:', products);
        this.products = Array.isArray(products) ? products : [];
        this.filteredProducts = [...this.products];
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

  // Add methods for filtering
  filterProducts() {
    let results = [...this.products];

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      if (this.selectedCategory === 'lowStock') {
        results = results.filter((product) => product.stock < 10);
      } else {
        results = results.filter(
          (product) => product.category === this.selectedCategory
        );
      }
    }

    // Apply search filter if there is a search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = results;
  }

  // Set active category for filtering
  setCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  // Clear search term
  clearSearch() {
    this.searchTerm = '';
    this.filterProducts();
  }

  // Clear all filters
  clearAllFilters() {
    this.selectedCategory = 'all';
    this.searchTerm = '';
    this.filteredProducts = [...this.products];
  }

  // Calculate inventory value
  calculateInventoryValue(): number {
    return this.products.reduce(
      (total, product) => total + product.price * product.stock,
      0
    );
  }

  // Get count of products in a category
  getCategoryCount(category: string): number {
    return this.products.filter((product) => product.category === category)
      .length;
  }

  // Check if product has low stock
  isLowStock(stock: number): boolean {
    return stock < 10;
  }

  // Dismiss success message
  dismissSuccess() {
    this.success = '';
  }

  // Dismiss error message
  dismissError() {
    this.error = '';
  }

  createProduct() {
    this.loading = true;
    this.error = '';

    console.log('Creating product:', this.newProduct);

    this.adminService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        console.log('Product created:', product);
        this.products.push(product);
        this.filterProducts(); // Re-apply filters after adding product
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
          const index = this.products.findIndex(
            (p) => p.id === updatedProduct.id
          );
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.filterProducts(); // Re-apply filters after updating
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
          this.filterProducts(); // Re-apply filters after deleting
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

  // Cancel add product form
  cancelAddProduct() {
    this.showAddProductForm = false;
    this.resetNewProduct();
  }
}
