import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../services/order.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css'],
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loading = false;
  error = '';
  orderStatuses: string[] = [];
  updateSuccess = false;
  updateMessage = '';

  // For automatic refresh
  refreshInterval = 30000; // 30 seconds
  refreshSubscription?: Subscription;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderStatuses = this.orderService.getOrderStatuses();
    this.loadOrders();
    this.setupAutoRefresh();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  setupAutoRefresh() {
    // Set up periodic refresh
    this.refreshSubscription = interval(this.refreshInterval)
      .pipe(
        switchMap(() => {
          console.log('Auto-refreshing orders data...');
          return this.orderService.getAllOrders();
        })
      )
      .subscribe({
        next: (orders) => {
          console.log('Orders refreshed:', orders);
          this.orders = orders;

          // If we have a selected order, update it as well
          if (this.selectedOrder) {
            const updatedSelectedOrder = orders.find(
              (o) => o.id === this.selectedOrder?.id
            );
            if (updatedSelectedOrder) {
              this.selectedOrder = updatedSelectedOrder;
            }
          }
        },
        error: (err) => {
          console.error('Error during auto-refresh:', err);
        },
      });
  }

  loadOrders() {
    this.loading = true;
    this.error = '';
    this.updateSuccess = false;

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        console.log('Orders loaded:', orders);
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
      },
    });
  }

  updateOrderStatus(orderId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;

    console.log(`Updating order ${orderId} status to ${newStatus}`);
    this.loading = true;

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        console.log('Order updated:', updatedOrder);

        // Show success message
        this.updateSuccess = true;
        this.updateMessage = `Order #${orderId} status updated to ${newStatus}`;

        // Update the order in the table
        const index = this.orders.findIndex((o) => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }

        // If the selected order is the one being updated, update it too
        if (this.selectedOrder && this.selectedOrder.id === orderId) {
          this.selectedOrder = updatedOrder;
        }

        // Refresh all data to ensure we have the latest from the server
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error updating order status:', err);
        this.error = 'Failed to update order status. Please try again.';
        this.loading = false;
      },
    });
  }

  viewOrderDetails(order: Order) {
    console.log('Viewing order details:', order);
    this.loading = true;

    // Always fetch the full order details to ensure we have the latest data
    this.orderService.getOrderById(order.id).subscribe({
      next: (orderDetails) => {
        this.selectedOrder = orderDetails;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading order details:', err);
        this.error = 'Failed to load order details. Please try again.';
        this.loading = false;
      },
    });
  }

  closeDetails() {
    this.selectedOrder = null;
  }

  // Manual refresh button handler
  refreshOrders() {
    this.loadOrders();
  }

  // Clear success message
  clearSuccessMessage() {
    this.updateSuccess = false;
    this.updateMessage = '';
  }

  // Format date for better display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
