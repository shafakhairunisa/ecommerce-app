import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, Cart } from '../../core/services/cart.service';
import { CustomerHeaderComponent } from '../../shared/components/customer-header/customer-header.component';
import { ImageService } from '../../core/services/image.service';
import { VoucherService } from '../../core/services/voucher.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, CustomerHeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private imageService: ImageService,
    private voucherService: VoucherService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load cart details';
        this.loading = false;
      }
    });
  }

  processCheckout(): void {
    if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
      this.error = 'Your cart is empty';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    this.loading = true;
    
    this.cartService.checkout().subscribe({
      next: (response) => {
        this.successMessage = 'Order placed successfully!';
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/customer/order-success'], { 
            queryParams: { orderId: response?.orderId } 
          });
        }, 2000);
      },
      error: (error) => {
        this.error = error.message || 'Failed to process checkout';
        this.loading = false;
      }
    });
  }

  getSubtotal(): number {
    if (!this.cart?.items) return 0;
    return this.cart.items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  }

  getSubtotalString(): string {
    return this.getSubtotal().toFixed(2);
  }

  getDiscountInfo() {
    const subtotal = this.getSubtotal();
    return this.voucherService.calculateDiscount(subtotal);
  }

  getTotal(): string {
    const discountInfo = this.getDiscountInfo();
    return discountInfo.finalAmount.toFixed(2);
  }

  hasDiscount(): boolean {
    return this.getDiscountInfo().percentage > 0;
  }

  getProductImagePath(item: any): string {
    return this.imageService.getSafeProductImageUrl(
      item.product?.category || '',
      item.product?.name || ''
    );
  }

  backToCart(): void {
    this.router.navigate(['/customer/cart']);
  }
}