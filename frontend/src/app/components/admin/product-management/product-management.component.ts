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
  newProduct: Omit<Product, 'id'> = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe(
      (products) => (this.products = products),
      (error) => console.error('Error loading products:', error)
    );
  }

  createProduct() {
    this.adminService.createProduct(this.newProduct).subscribe(
      (product) => {
        this.products.push(product);
        this.showAddProductForm = false;
        this.resetNewProduct();
      },
      (error) => console.error('Error creating product:', error)
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
          this.products = this.products.filter(
            (product) => product.id !== productId
          );
        },
        (error) => console.error('Error deleting product:', error)
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
      imageUrl: '',
    };
  }
}
