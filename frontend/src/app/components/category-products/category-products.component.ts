import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  category: string = '';
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProduct: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';
      this.fetchProducts();
    });
  }

  fetchProducts() {
    this.http.get<any[]>('/api/products').subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = this.products.filter(product => product.category === this.category);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.products = [
          { id: 1, name: 'Cili Giling', price: 4.00, image: 'assets/image/Cili Giling.png', category: 'Seasonings & Spices', available: true},
          { id: 2, name: 'Perencah Penyedap Burger', price: 9.00, image: 'assets/image/Perencah Penyedap Burger.jpg', category: 'Seasonings & Spices', available: true},
          { id: 3, name: 'Asam Jawa', price: 6.00, image: 'assets/image/Asam Jawa.jpg', category: 'Seasonings & Spices', available: true},
          { id: 4, name: 'Sos Tiram', price: 7.00, image: 'assets/image/Sos Tiram.jpg', category: 'Seasonings & Spices', available: true },
          { id: 5, name: 'Sos Lada Hitam', price: 7.00, image: 'assets/image/Sos Lada Hitam.jpg', category: 'Seasonings & Spices', available: true},
          { id: 6, name: 'Kuah Rojak Madu', price: 8.00, image: 'assets/image/Kuah Rojak Madu.jpg', category: 'Food Products', available: true, discount: '' },
          { id: 7, name: 'Madu Asli Li Khamsatun', price: 20.00, image: 'assets/image/Madu Asli Li Khamsatun.jpg', category: 'Health Products', available: true},
          { id: 8, name: 'Mee Saffron Segera', price: 11.00, image: 'assets/image/Mee Safron Segera.jpg', category: 'Food Products', available: true},
          { id: 9, name: 'Mee Tarik Oden', price: 5.00, image: 'assets/image/Mee Tarik Oden.jpg', category: 'Food Products', available: true},
          { id: 10, name: 'Mee Tarik Sup', price: 5.00, image: 'assets/image/Mee Tarik Sup.jpg', category: 'Food Products', available: true},
          { id: 11, name: 'Mee Tarik Kari', price: 5.00, image: 'assets/image/Mee Tarik Kari.jpg', category: 'Food Products', available: true},
          { id: 12, name: 'Mee Tarik Saffron', price: 12.00, image: 'assets/image/Mee Tarik Saffron.jpg', category: 'Food Products', available: true},
          { id: 13, name: 'Kopi Ibnu Sina', price: 10.00, image: 'assets/image/Kopi Ibnu Sina.jpg', category: 'Health Products', available: true},
          { id: 14, name: 'Ibnu Sina', price: 10.00, image: 'assets/image/Ibnu Sina.jpg', category: 'Health Products', available: true},
          { id: 15, name: 'Khal Tamar', price: 14.00, image: 'assets/image/Khal Tamar.jpg', category: 'Health Products', available: true},
          { id: 16, name: 'Minyak Bidara', price: 15.00, image: 'assets/image/Minyak Bidara.jpg', category: 'Health Products', available: true},
          { id: 17, name: 'Bunga Saffron', price: 25.00, image: 'assets/image/Bunga Saffron.jpg', category: 'Health Products', available: true},
        ];
        this.filteredProducts = this.products.filter(product => product.category === this.category);
      }
    });
  }

  showProductDetails(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.closeModal();
  }
}
