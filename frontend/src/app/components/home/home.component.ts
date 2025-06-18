import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { HeroComponent } from '../hero/hero.component';
import { Product } from '../../model/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeroComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products = [
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

  filteredProducts = [...this.products];
  featuredProducts = [
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
      available: true
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
      imageUrl: 'assets/LainLain/Minyak Bidara - 45ML.jpg',
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
      imageUrl: 'assets/LainLain/Saffron Zafaran.jpg',
      quantity: 20,
      category: { id: 6, name: 'LAIN-LAIN' },
      available: true
    }
  ]; // You can adjust logic if needed
  categoryOptions = ['SOS', 'MEE', 'REMPAH', 'MINUMAN', 'MADU', 'LAIN-LAIN'];
  selectedCategory: string = '';
  searchTerm: string = '';
  sortOption: string = '';
  wishlistProductIds: number[] = [];

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {
    this.updateFilteredProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} added to cart!`);
  }


  addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
    alert('Product added to wishlist!');
    this.wishlistProductIds.push(product.id);
  }

  onSearchChange(): void {
    this.updateFilteredProducts();
  }

  onFilterChange(): void {
    this.updateFilteredProducts();
  }

  onSortChange(): void {
    this.updateFilteredProducts();
  }

  updateFilteredProducts(): void {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => 
        product.category.name === this.selectedCategory
      );
    }

    // Apply sorting
    if (this.sortOption) {
      switch (this.sortOption) {
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'available':
          filtered.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));
          break;
      }
    }

    this.filteredProducts = filtered;
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.updateFilteredProducts();
    if (this.selectedCategory) {
      this.router.navigate(['/category-products'], { queryParams: { category: this.selectedCategory } });
    }
  }

  goToCategory(category: string) {
    this.router.navigate(['/category-products'], { queryParams: { category } });
  }

  encodeImageUrl(url: string): string {
    // No encoding needed, just return the raw path
    return url;
  }
}
