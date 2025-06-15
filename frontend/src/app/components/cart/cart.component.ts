import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Product } from '../../model/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => {
      return sum + (item.price || 0) * item.quantity;
    }, 0);
  }

  updateQuantity(item: Product): void {
    if (item.quantity > 0) {
      // No need to call service for update in frontend-only version
      this.cartService.addToCart(item); // Just re-add will update quantity
    } else {
      this.removeItem(item);
    }
    this.calculateTotal();
  }

  removeItem(item: Product): void {
    this.cartService.removeFromCart(item.id);
    this.calculateTotal();
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    this.router.navigate(['/payment']);
  }

  getTotal(): number {
    return this.total;
  }
}
