import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../model/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Voucher {
  id: number;
  code: string;
  discountPercentage: number;
  minimumPurchaseAmount: number;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartItems: Product[] = [];
  allVouchers: Voucher[] = [
    { id: 1, code: 'DISCOUNT3', discountPercentage: 3, minimumPurchaseAmount: 50 },
    { id: 2, code: 'DISCOUNT5', discountPercentage: 5, minimumPurchaseAmount: 100 },
    { id: 3, code: 'DISCOUNT8', discountPercentage: 8, minimumPurchaseAmount: 200 }
  ];
  userVouchers: Voucher[] = [];

  selectedVoucherId?: number;
  discountPercentage = 0;
  deliveryFee = 5.0;
  total = 0;
  subtotal = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateSubtotalAndVouchers();
    });
  }

  calculateSubtotalAndVouchers(): void {
    this.subtotal = this.cartService.getCartTotal();
    this.userVouchers = this.allVouchers.filter(v => this.subtotal >= v.minimumPurchaseAmount);

    if (this.selectedVoucherId) {
      const stillValid = this.userVouchers.find(v => v.id === this.selectedVoucherId);
      if (!stillValid) {
        this.selectedVoucherId = undefined;
        this.discountPercentage = 0;
      }
    }

    this.calculateTotal();
  }


  onVoucherChange(): void {
    const selected = this.userVouchers.find(v => v.id === this.selectedVoucherId);
    this.discountPercentage = selected?.discountPercentage || 0;
    this.calculateTotal();
  }

  calculateTotal(): void {
    const discount = (this.subtotal * this.discountPercentage) / 100;
    this.total = this.subtotal - discount + this.deliveryFee;
  }

  placeOrder(): void {
    const order = {
      items: this.cartItems,
      total: this.total,
      deliveryFee: this.deliveryFee,
      discountPercentage: this.discountPercentage,
      voucherCode: this.selectedVoucherId
        ? this.userVouchers.find(v => v.id === this.selectedVoucherId)?.code
        : null,
      date: new Date().toISOString()
    };

    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');

    // Add this new order
    existingOrders.push(order);

    // Save back to localStorage
    localStorage.setItem('orderHistory', JSON.stringify(existingOrders));

    // Clear cart
    this.cartService.clearCart();

    alert('Order placed!');
  }

}
