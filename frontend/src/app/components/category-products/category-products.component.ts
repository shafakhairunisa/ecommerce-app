import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service';

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
  isLoading = true;

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
    this.isLoading = true;
    this.http.get<any[]>('/api/products').subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = this.products.filter(
          product => product.category?.name?.toLowerCase() === this.category.toLowerCase()
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        // fallback demo data
        this.products = [

            {
              id: 1,
              name: 'Asam Jawa Plus',
              price: 5.50,
              imageUrl: 'assets/Sos/Asam Jawa Plus.jpg',
              quantity: 20,
              category: { id: 1, name: 'SOS' },
              available: true
            },
            {
              id: 2,
              name: 'Cili Giling',
              price: 3.00,
              imageUrl: 'assets/Sos/Cili Giling.jpg',
              quantity: 20,
              category: { id: 1, name: 'SOS' },
              available: false
            },
            {
              id: 3,
              name: 'Kuah Rojak Madu - 400G',
              price: 5.50,
              imageUrl: 'assets/Sos/Kuah Rojak Madu - 400G.jpg',
              quantity: 20,
              category: { id: 1, name: 'SOS' },
              available: true
            },
            {
              id: 4,
              name: 'Sos Cili Burger - 340G',
              price: 3.00,
              imageUrl: 'assets/Sos/Sos Cili Burger - 340G.jpg',
              quantity: 20,
              category: { id: 1, name: 'SOS' },
              available: true
            },
            {
              id: 5,
              name: 'Sos Lada Hitam - 1KG',
              price: 5.50,
              imageUrl: 'assets/Sos/Sos Lada Hitam - 1KG.jpg',
              quantity: 20,
              category: { id: 1, name: 'SOS' },
              available: true
            },
            {
              id: 6,
              name: 'Sos Lada Hitam - 340G',
              price: 3.80,
              imageUrl: 'assets/Sos/Sos Lada Hitam - 340G.jpg',
              quantity: 20,
              category: { id: 1, name: 'SOS' },
              available: true
            },
            {
              id: 7,
              name: 'Sos Tiram - 340G',
              price: 3.80,
              imageUrl: 'assets/Sos/Sos Tiram - 340G.jpg',
              quantity: 20,
              category: { id: 1, name: 'SOS' },
              available: true
            },
            {
              id: 8,
              name: 'Perisa Kari',
              price: 14.00,
              imageUrl: 'assets/Mee/Perisa Kari.jpg',
              quantity: 20,
              category: { id: 2, name: 'MEE' },
              available: true
            },
            {
              id: 9,
              name: 'Perisa Sup',
              price: 14.00,
              imageUrl: 'assets/Mee/Perisa Sup.jpg',
              quantity: 20,
              category: { id: 2, name: 'MEE' },
              available: true
            },
            {
              id: 10,
              name: 'Perisa Tomyam ODEEN',
              price: 14.00,
              imageUrl: 'assets/Mee/Perisa Tomyam ODEEN.jpg',
              quantity: 20,
              category: { id: 2, name: 'MEE' },
              available: true
            },
            {
              id: 11,
              name: 'Khal dengan Herba - 1L',
              price: 95.00,
              imageUrl: 'assets/Rempah/Khal dengan Herba - 1L.jpg',
              quantity: 20,
              category: { id: 3, name: 'REMPAH' },
              available: true
            },
            {
              id: 12,
              name: 'Khal dengan Herba - 500ML',
              price: 60.00,
              imageUrl: 'assets/Rempah/Khal dengan Herba - 500ML.jpg',
              quantity: 20,
              category: { id: 3, name: 'REMPAH' },
              available: true
            },
            {
              id: 13,
              name: 'Khal Tanpa Herba - 500ML',
              price: 40.00,
              imageUrl: 'assets/Rempah/Khal Tanpa Herba - 500ML.jpg',
              quantity: 20,
              category: { id: 3, name: 'REMPAH' },
              available: true
            },
            {
              id: 14,
              name: 'Serbuk Perencah Penyedap Burger',
              price: 5.00,
              imageUrl: 'assets/Rempah/Serbuk Perencah Penyedap Burger.jpg',
              quantity: 20,
              category: { id: 3, name: 'REMPAH' },
              available: true
            },
            {
              id: 15,
              name: 'Kopi Ibnu Sina',
              price: 23.00,
              imageUrl: 'assets/Minuman/Kopi Ibnu Sina.jpg',
              quantity: 20,
              category: { id: 4, name: 'MINUMAN' },
              available: true
            },
            {
              id: 16,
              name: 'Teh Ibnu Sina',
              price: 24.00,
              imageUrl: 'assets/Minuman/Teh Ibnu Sina.jpg',
              quantity: 20,
              category: { id: 4, name: 'MINUMAN' },
              available: true
            },
            {
              id: 17,
              name: 'Li Khamsatun',
              price: 58.00,
              imageUrl: 'assets/Madu/LI KHAMSATUN.jpg',
              quantity: 20,
              category: { id: 5, name: 'MADU' },
              available: true
            },
            {
              id: 18,
              name: 'Madu Minda',
              price: 45.00,
              imageUrl: 'assets/Madu/MADU MINDA.jpg',
              quantity: 20,
              category: { id: 5, name: 'MADU' },
              available: true
            },
            {
              id: 19,
              name: 'Minyak Bidara - 45ML',
              price: 35.00,
              imageUrl: 'assets/LainLain/Minyak%20Bidara%20-%2045ML.jpg',
              quantity: 20,
              category: { id: 6, name: 'LAIN-LAIN' },
              available: true
            },
            {
              id: 20,
              name: 'Minyak Bidara - 120ML',
              price: 55.00,
              imageUrl: 'assets/LainLain/Minyak Bidara - 120ML.jpg',
              quantity: 20,
              category: { id: 6, name: 'LAIN-LAIN' },
              available: true
            },
            {
              id: 21,
              name: 'Saffron Zafaran',
              price: 27.00,
              imageUrl: 'assets/images/Saffron Zafaran.jpg',
              quantity: 20,
              category: { id: 6, name: 'LAIN-LAIN' },
              available: true
            }

      ];

        this.filteredProducts = this.products.filter(
          product => product.category?.name?.toLowerCase() === this.category.toLowerCase()
        );

        this.isLoading = false;
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

  formatCategoryName(category: string): string {
    return category.replace(/\b\w/g, char => char.toUpperCase());
  }

  trackByProductId(index: number, product: any): number {
    return product.id;
  }
}
