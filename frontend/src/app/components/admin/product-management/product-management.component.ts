import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Product } from '../../../services/admin.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Product Management</h2>
        <button
          (click)="showAddProductForm = true"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Product
        </button>
      </div>

      <!-- Add Product Form -->
      <div *ngIf="showAddProductForm" class="mb-6 p-4 border rounded-md">
        <h3 class="text-lg font-medium mb-4">Add New Product</h3>
        <form (ngSubmit)="createProduct()" #productForm="ngForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                [(ngModel)]="newProduct.name"
                name="name"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                [(ngModel)]="newProduct.price"
                name="price"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                [(ngModel)]="newProduct.stock"
                name="stock"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                [(ngModel)]="newProduct.category"
                name="category"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                [(ngModel)]="newProduct.description"
                name="description"
                required
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                [(ngModel)]="newProduct.imageUrl"
                name="imageUrl"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
            </div>
          </div>
          <div class="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              (click)="showAddProductForm = false"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="!productForm.form.valid"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

      <!-- Products Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let product of products">
              <td class="px-6 py-4 whitespace-nowrap">
                <img [src]="product.imageUrl" [alt]="product.name" class="h-10 w-10 rounded-full object-cover">
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ product.price }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.stock }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  (click)="editProduct(product)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  (click)="deleteProduct(product.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  showAddProductForm = false;
  newProduct: Omit<Product, 'id'> = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe(
      products => this.products = products,
      error => console.error('Error loading products:', error)
    );
  }

  createProduct() {
    this.adminService.createProduct(this.newProduct).subscribe(
      product => {
        this.products.push(product);
        this.showAddProductForm = false;
        this.resetNewProduct();
      },
      error => console.error('Error creating product:', error)
    );
  }

  editProduct(product: Product) {
    // TODO: Implement edit functionality
    console.log('Edit product:', product);
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(productId).subscribe(
        () => {
          this.products = this.products.filter(product => product.id !== productId);
        },
        error => console.error('Error deleting product:', error)
      );
    }
  }

  private resetNewProduct() {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      imageUrl: ''
    };
  }
} 