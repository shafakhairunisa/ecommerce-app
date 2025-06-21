import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CustomerHeaderComponent } from '../../shared/components/customer-header/customer-header.component';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomerHeaderComponent
  ],
  templateUrl: './order-success.html',
  styleUrls: ['./order-success.css']
})
export class OrderSuccess implements OnInit {
  orderId: string | null = null;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Get the order ID from the query parameters
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      
      // If no order ID is provided, redirect to orders page
      if (!this.orderId) {
        this.router.navigate(['/customer/orders']);
      }
    });
    
    // Reset cart count by getting the (now empty) cart
    this.cartService.getCart().subscribe();
  }

  continueShopping(): void {
    this.router.navigate(['/customer/dashboard']);
  }

  viewOrders(): void {
    this.router.navigate(['/customer/orders']);
  }
}
