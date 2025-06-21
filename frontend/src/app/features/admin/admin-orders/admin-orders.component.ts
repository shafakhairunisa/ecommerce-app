import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OrderService } from '../../../core/services/order.service';
import { AdminService } from '../../../core/services/admin.service';
import { Order } from '../../../core/models/order.model';
import { TopNavbarComponent } from '../../../shared/components/top-navbar/top-navbar.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { OrderDetailDialogComponent } from '../../../shared/components/order-detail-dialog/order-detail-dialog.component';


@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    TopNavbarComponent,

  ],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  orderStatusFilter: string = '';
  loadingOrders: boolean = false;
  ordersError: string | null = null;
  successMessage: string = '';
  error: string = '';
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  pageIndex = 0;
  totalOrders = 0;

  orderColumns = [
    { key: 'orderId', header: 'Order ID' },
    { key: 'user.username', header: 'Customer' },
    { key: 'totalAmount', header: 'Total' },
    { key: 'status', header: 'Status' },
    { key: 'orderDate', header: 'Date' }
  ];

  orderStatusOptions = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  constructor(
    private orderService: OrderService,
    private adminService: AdminService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loadingOrders = true;
    this.ordersError = null;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map(order => ({
          ...order,
          newStatus: order.status
        }));
        this.filteredOrders = [...this.orders];
        this.totalOrders = this.filteredOrders.length;
        this.updatePaginatedOrders();
        this.loadingOrders = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.ordersError = error.message || 'Failed to load orders';
        this.loadingOrders = false;
        if (this.orders && this.orders.length > 0) {
          this.filteredOrders = [...this.orders];
          this.totalOrders = this.filteredOrders.length;
          this.updatePaginatedOrders();
        }
      }
    });
  }

  applyOrderFilters(): void {
    this.filteredOrders = [...this.orders];
    if (this.orderStatusFilter) {
      this.filteredOrders = this.filteredOrders.filter(order => 
        order.status === this.orderStatusFilter
      );
    }
    this.totalOrders = this.filteredOrders.length;
    this.pageIndex = 0;
    this.updatePaginatedOrders();
  }

  resetOrderFilters(): void {
    this.orderStatusFilter = '';
    this.filteredOrders = [...this.orders];
    this.totalOrders = this.filteredOrders.length;
    this.pageIndex = 0;
    this.updatePaginatedOrders();
  }

  updatePaginatedOrders(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaginatedOrders();
  }

  updateOrderStatus(order: any, newStatus: string) {
    if (!newStatus || order.status === newStatus) {
      console.log('No status change detected');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Are you sure you want to update order #${order.orderId} status from ${order.status} to ${newStatus}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadingOrders = true;
        this.adminService.updateOrderStatus(order.orderId!, newStatus).subscribe({
          next: (updatedOrder) => {
            const index = this.orders.findIndex(o => o.orderId === order.orderId);
            if (index !== -1) {
              this.orders[index] = {
                ...updatedOrder,
                newStatus: updatedOrder.status
              };
            }
            const filteredIndex = this.filteredOrders.findIndex(o => o.orderId === order.orderId);
            if (filteredIndex !== -1) {
              this.filteredOrders[filteredIndex] = {
                ...updatedOrder,
                newStatus: updatedOrder.status
              };
            }
            this.updatePaginatedOrders();
            this.successMessage = `Order #${order.orderId} status updated from ${order.status} to ${newStatus}`;
            this.loadingOrders = false;
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error updating order status:', error);
            this.error = `Failed to update order status: ${error.error || error.message || 'Unknown error'}`;
            this.loadingOrders = false;
            setTimeout(() => this.error = '', 5000);
          }
        });
      }
    });
  }

  viewOrderDetails(order: Order) {
    this.dialog.open(OrderDetailDialogComponent, {
      width: '800px',
      data: { order: order }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
  }

  handleStatusUpdate(order: any): void {
    const newStatus = order.newStatus || order.status;
    this.updateOrderStatus(order, newStatus);
  }
}