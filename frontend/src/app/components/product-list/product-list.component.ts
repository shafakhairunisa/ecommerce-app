import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../model/product.model';

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule, NgForOf]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [
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

  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  sortOption: string = 'asc';
  role: string | null = null;

  categories = [
    { id: '', name: 'All' },
    { id: '1', name: 'SOS' },
    { id: '2', name: 'MEE' },
    { id: '3', name: 'REMPAH' },
    { id: '4', name: 'MINUMAN' },
    { id: '5', name: 'MADU' },
    { id: '6', name: 'LAIN-LAIN' }
  ];

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Force component to reload even if the route is the same
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');

    this.route.queryParams.subscribe(params => {
      this.searchQuery = (params['q'] || '').toLowerCase();
      this.selectedCategory = params['category'] || '';
      this.sortOption = params['sort'] || 'asc';
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const queryWords = this.searchQuery.trim().toLowerCase().split(' ');

    this.filteredProducts = this.products.filter(p => {
      const productName = p.name.toLowerCase();
      const matchesQuery = queryWords.every(word => productName.includes(word));
      const matchesCategory = !this.selectedCategory || p.category?.id == this.selectedCategory;
      return matchesQuery && matchesCategory;
    });

    this.sortProducts();
  }



  sortProducts(): void {
    this.filteredProducts.sort((a, b) =>
      this.sortOption === 'asc' ? a.price - b.price : b.price - a.price
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert('Product added to cart!');
  }

  addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
    alert('Added to wishlist!');
  }
}
