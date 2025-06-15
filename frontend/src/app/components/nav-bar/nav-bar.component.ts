import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  isScrolled = false;
  cartItemCount = 0;
  searchQuery = '';
  role: string | null = null;

  private navigationSubscription: Subscription;
  private cartSubscription!: Subscription;

  constructor(private cartService: CartService, private router: Router) {
    // Watch for route changes and update role
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.checkRole());
  }

  ngOnInit(): void {
    // Subscribe to cart item count
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });

    this.checkRole();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/product-list'], { queryParams: { q: query } });
      this.searchQuery = '';
    }
  }

  checkRole(): void {
    this.role = localStorage.getItem('role');
  }

  logout(): void {
    localStorage.removeItem('role');
    this.role = null;
    this.cartService.clearCart(); // Clear cart on logout
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
  }
}
