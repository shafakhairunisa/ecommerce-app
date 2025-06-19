import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Order } from '../../../services/admin.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css'],
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders().subscribe(
      (orders) => (this.orders = orders),
      (error) => console.error('Error loading orders:', error)
    );
  }

  updateOrderStatus(orderId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;

    this.adminService.updateOrderStatus(orderId, newStatus).subscribe(
      (updatedOrder) => {
        const order = this.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = newStatus;
        }
      },
      (error) => console.error('Error updating order status:', error)
    );
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }
}
