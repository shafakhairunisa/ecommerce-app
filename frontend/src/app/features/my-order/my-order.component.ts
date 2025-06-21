import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { ImageService } from '../../core/services/image.service';
import { Order } from '../../core/models/order.model';
import { CustomerHeaderComponent } from '../../shared/components/customer-header/customer-header.component';

@Component({
  selector: 'app-my-order',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomerHeaderComponent
  ],
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private orderService: OrderService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';
    
    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        console.log('Orders received:', data);
        this.orders = this.processOrderData(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.error = 'Failed to load your orders. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Process order data to handle missing fields
  private processOrderData(orders: Order[]): Order[] {
    if (!orders) return [];
    
    return orders.map(order => {
      // Ensure items array exists
      if (!order.items) {
        order.items = [];
      }
      
      // Ensure all required fields exist
      return {
        ...order,
        orderId: order.orderId || 0,
        userId: order.userId || 0,
        orderDate: order.orderDate || new Date(),
        totalAmount: order.totalAmount || 0,
        status: order.status || 'PENDING',
        items: order.items.map(item => {
          // Log the product data for debugging
          console.log('Processing order item product:', item.product);
          
          return {
            ...item,
            productId: item.productId || 0,
            quantity: item.quantity || 0,
            price: item.price || 0,
            product: item.product || { 
              productId: 0, 
              name: 'Unknown', 
              price: 0, 
              category: '', 
              description: '', 
              stockQuantity: 0 
            }
          };
        })
      };
    });
  }

  viewOrderDetails(orderId: number): void {
    if (!orderId) {
      this.error = 'Invalid order ID';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.orderService.getOrderSummary(orderId).subscribe({
      next: (data) => {
        console.log('Order details received:', data);
        
        // Debug log to check product data in items
        if (data && data.items) {
          console.log('Order items:', data.items);
          data.items.forEach((item, index) => {
            console.log(`Item ${index} product:`, item.product);
          });
        }
        
        if (data) {
          // Process the order data to ensure all fields exist
          this.selectedOrder = this.processOrderData([data])[0];
        } else {
          this.error = 'Order details not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
        this.error = 'Failed to load order details. Please try again.';
        this.loading = false;
      }
    });
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  getOrderStatusClass(status: string): string {
    if (!status) return '';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return 'order-status-pending';
      case 'processing':
      case 'confirmed':
        return 'order-status-processing';
      case 'shipped':
        return 'order-status-shipped';
      case 'delivered':
        return 'order-status-delivered';
      case 'cancelled':
      case 'canceled':
        return 'order-status-canceled';
      default:
        return '';
    }
  }

  // Helper function to get product image path
  getProductImagePath(productCategory: string, productName: string, imagePath?: string): string {
    console.log(`Getting image for product: ${productName}, category: ${productCategory}, imagePath: ${imagePath}`);
    
    if (imagePath) {
      console.log(`Using provided imagePath: ${imagePath}`);
      return this.imageService.getSafeUrl(imagePath);
    }
    
    if (!productCategory || !productName) {
      console.log('Missing product category or name, using default image');
      return this.imageService.getDefaultImageUrl();
    }
    
    // Try to get a static asset image based on the product name
    const staticImage = this.imageService.getStaticProductImage(productName);
    if (staticImage) {
      console.log(`Using static image for ${productName}: ${staticImage}`);
      return staticImage;
    }
    
    // Use the product category and name to generate the image URL
    const imageUrl = this.imageService.getSafeProductImageUrl(productCategory, productName);
    console.log(`Generated image URL: ${imageUrl}`);
    return imageUrl;
  }

  // Format date from ISO string
  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid Date';
    }
  }
} 